import { MedicalDocument, MOCK_REPORTS } from "./mockData";

export const REPORTS_STORAGE_KEY = "medquery-documents";

export function loadReportsFromStorage(): MedicalDocument[] {
  if (typeof window === "undefined") return MOCK_REPORTS;

  try {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!stored) return MOCK_REPORTS;

    const parsed = JSON.parse(stored) as MedicalDocument[];
    if (!Array.isArray(parsed) || parsed.length === 0) return MOCK_REPORTS;

    // Ensure the scanned Patient Information Form is present
    const hasScannedForm = parsed.some((doc) => doc.id === "patient-form-scanned-1");
    if (!hasScannedForm) {
      const scannedDoc = MOCK_REPORTS.find((doc) => doc.id === "patient-form-scanned-1");
      if (scannedDoc) {
        return [scannedDoc, ...parsed];
      }
    }

    return parsed;
  } catch {
    return MOCK_REPORTS;
  }
}

export function saveReportsToStorage(reports: MedicalDocument[]): MedicalDocument[] {
  if (typeof window === "undefined") return reports;

  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  return reports;
}

export function upsertReportToStorage(report: MedicalDocument): MedicalDocument[] {
  const existing = loadReportsFromStorage();
  const filtered = existing.filter((item) => item.id !== report.id);
  const updated = [report, ...filtered];
  return saveReportsToStorage(updated);
}

export function buildSuggestedQuestions(extracted?: Record<string, unknown>): string[] {
  const questions: string[] = [];

  if (extracted?.diagnosis) {
    questions.push(`Can you explain the diagnosis of ${String(extracted.diagnosis)}?`);
  }

  if (Array.isArray(extracted?.medicines) && extracted.medicines.length > 0) {
    questions.push(`What should I know about ${String(extracted.medicines[0])}?`);
  }

  if (Array.isArray(extracted?.tests) && extracted.tests.length > 0) {
    questions.push(`Do I need any follow-up tests for ${String(extracted.tests[0])}?`);
  }

  if (extracted?.doctorName) {
    questions.push(`What questions should I ask ${String(extracted.doctorName)}?`);
  }

  if (questions.length === 0) {
    return [
      "Can you explain this report in simple terms?",
      "What should I watch for after reading this report?",
      "What follow-up questions should I ask my doctor?"
    ];
  }

  return questions.slice(0, 4);
}
