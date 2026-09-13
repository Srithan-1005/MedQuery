// Types for extracted medical bill/report data

export interface ExtractedBillData {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  rawText: string;
  patientName: string;
  hospitalName: string;
  doctorName: string;
  date: string;
  medicines: string[];
  tests: string[];
  totalAmount: number | null;
  diagnosis: string;
  advice: string;
  // Additional metadata
  extractionConfidence: number; // 0-100
  status: "processed" | "pending" | "failed";
}

export const EMPTY_BILL: ExtractedBillData = {
  id: "",
  fileName: "",
  uploadDate: "",
  fileSize: "",
  fileType: "",
  rawText: "",
  patientName: "",
  hospitalName: "",
  doctorName: "",
  date: "",
  medicines: [],
  tests: [],
  totalAmount: null,
  diagnosis: "",
  advice: "",
  extractionConfidence: 0,
  status: "pending",
};

// localStorage key for bills vault
export const BILLS_STORAGE_KEY = "medquery-bills-vault";

// Helper to save bills to localStorage
export function saveBillToStorage(bill: ExtractedBillData): ExtractedBillData[] {
  if (typeof window === "undefined") return [];
  const existing = getBillsFromStorage();
  const updated = [bill, ...existing];
  localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Helper to get bills from localStorage
export function getBillsFromStorage(): ExtractedBillData[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(BILLS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

// Helper to delete a bill from localStorage
export function deleteBillFromStorage(id: string): ExtractedBillData[] {
  if (typeof window === "undefined") return [];
  const existing = getBillsFromStorage();
  const updated = existing.filter((b) => b.id !== id);
  localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
