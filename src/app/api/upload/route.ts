import { NextRequest, NextResponse } from "next/server";

// Dynamic import for pdf-parse to avoid SSR issues
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as any).default || pdfParseModule;
    
    // Use pdfParse as a function if it's the default export, otherwise use it directly
    let result;
    if (typeof pdfParse === 'function') {
      result = await pdfParse(buffer);
    } else if (pdfParse && typeof pdfParse === 'object') {
      result = await pdfParse(buffer);
    } else {
      throw new Error("Invalid pdf-parse module format");
    }
    
    const extractedText = result.text || "";
    
    if (extractedText.trim().length === 0) {
      console.warn("PDF parsing returned empty text");
      return "";
    }
    
    return extractedText;
  } catch (err) {
    console.error("PDF parse error:", err);
    // Return empty string so extractText can handle the fallback
    return "";
  }
}

// Extract plain text from common file types
async function extractText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop() || "";

  if (ext === "pdf") {
    const pdfText = await parsePDF(buffer);
    // If PDF parsing succeeded, return the text
    if (pdfText.trim().length > 0) {
      return pdfText;
    }
    // If PDF parsing failed, try fallback text extraction
    const fallbackText = buffer.toString("utf-8", 0, Math.min(buffer.length, 100000));
    if (fallbackText.trim().length > 5) {
      return fallbackText;
    }
    // Return placeholder if all extraction methods fail
    return "[PDF file detected — text extraction failed. Please ensure the file is a valid, text-based PDF.]";
  }

  // For text-based files (.txt, .csv, etc.)
  if (["txt", "csv", "text", "log"].includes(ext)) {
    return buffer.toString("utf-8");
  }

  // For images, we return a placeholder (real OCR would need Tesseract/Google Vision)
  if (["png", "jpg", "jpeg", "webp", "bmp", "tiff"].includes(ext)) {
    return "[Image file detected — OCR extraction would be applied in production using Tesseract or Google Vision API. For demo purposes, please upload a PDF or text file for full extraction.]";
  }

  // For DOCX files, basic extraction
  if (ext === "docx") {
    // Very basic DOCX text extraction (real implementation would use mammoth)
    const text = buffer.toString("utf-8");
    // Strip XML tags for basic readability
    return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  return buffer.toString("utf-8");
}

// AI-powered structured extraction using regex patterns as fallback
function extractStructuredData(rawText: string): Record<string, unknown> {
  const text = rawText.toUpperCase();
  const originalText = rawText;

  // Patient Name extraction
  let patientName = "";
  const patientPatterns = [
    /PATIENT\s*(?:NAME)?\s*[:\-]?\s*([A-Z][A-Za-z\s.]+?)(?:\n|,|\||DOB|AGE|SEX|MR#)/i,
    /NAME\s*[:\-]?\s*([A-Z][A-Za-z\s.]+?)(?:\n|,|\||DOB|AGE)/i,
    /Mr\.\s*([A-Za-z\s]+)|Mrs\.\s*([A-Za-z\s]+)|Ms\.\s*([A-Za-z\s]+)/i,
  ];
  for (const pattern of patientPatterns) {
    const match = originalText.match(pattern);
    if (match) {
      patientName = (match[1] || match[2] || match[3] || "").trim();
      break;
    }
  }

  // Doctor Name extraction
  let doctorName = "";
  const doctorPatterns = [
    /(?:DR\.?|DOCTOR)\s*([A-Z][A-Za-z\s.]+?)(?:\n|,|\||MD|MBBS|MS|SPECIALIST)/i,
    /(?:PHYSICIAN|REFERRING|REQUESTING|ATTENDING)\s*(?:PHYSICIAN|DOCTOR|CLINICIAN)?\s*[:\-]?\s*(?:DR\.?\s*)?([A-Z][A-Za-z\s.]+?)(?:\n|,|\|)/i,
    /DR\.?\s+([A-Z][A-Za-z\s]+)/i,
  ];
  for (const pattern of doctorPatterns) {
    const match = originalText.match(pattern);
    if (match) {
      doctorName = ("Dr. " + (match[1] || "").trim()).replace(/Dr\.\s*Dr\./, "Dr.");
      break;
    }
  }

  // Hospital Name extraction
  let hospitalName = "";
  const hospitalPatterns = [
    /([A-Z][A-Za-z\s]+(?:HOSPITAL|CLINIC|MEDICAL CENTER|DIAGNOSTICS|LABS|LABORATORY|INSTITUTE|HEALTHCARE|CENTRE|IMAGING))/i,
    /(?:FACILITY|HOSPITAL|CLINIC|LAB)\s*[:\-]?\s*([A-Za-z\s]+?)(?:\n|,|\|)/i,
  ];
  for (const pattern of hospitalPatterns) {
    const match = originalText.match(pattern);
    if (match) {
      hospitalName = (match[1] || "").trim();
      break;
    }
  }

  // Date extraction
  let date = "";
  const datePatterns = [
    /(\d{4}[-/]\d{2}[-/]\d{2})/,
    /(\d{2}[-/]\d{2}[-/]\d{4})/,
    /(?:DATE|DATED?)\s*[:\-]?\s*(\d{1,2}[\s/-]\w+[\s/-]\d{2,4})/i,
    /(\w+\s+\d{1,2},?\s+\d{4})/i,
  ];
  for (const pattern of datePatterns) {
    const match = originalText.match(pattern);
    if (match) {
      date = match[1].trim();
      break;
    }
  }

  // Medicine extraction
  const medicines: string[] = [];
  const medicinePatterns = [
    /(?:MEDICINE|MEDICATION|DRUG|PRESCRIPTION|TAB|CAP|SYR|INJ)\s*[:\-]?\s*([A-Za-z\s,]+)/gi,
    /(?:Paracetamol|Amoxicillin|Metformin|Aspirin|Ibuprofen|Omeprazole|Cetirizine|Azithromycin|Doxycycline|Pantoprazole|Atorvastatin|Amlodipine|Losartan|Metoprolol|Ciprofloxacin|Ranitidine|Domperidone|Diclofenac|Tramadol|Clopidogrel)/gi,
  ];
  for (const pattern of medicinePatterns) {
    let match;
    while ((match = pattern.exec(originalText)) !== null) {
      const med = match[1] || match[0];
      const cleaned = med.trim();
      if (cleaned && !medicines.includes(cleaned) && cleaned.length > 2) {
        medicines.push(cleaned);
      }
    }
  }

  // Test extraction
  const tests: string[] = [];
  const testPatterns = [
    /(?:CBC|COMPLETE BLOOD COUNT|BLOOD SUGAR|HBA1C|HEMOGLOBIN|LIPID PROFILE|THYROID|TSH|T3|T4|CREATININE|BUN|URIC ACID|ESR|CRP|LIVER FUNCTION|KIDNEY FUNCTION|URINE|ECG|X-RAY|MRI|CT SCAN|ULTRASOUND|ECHOCARDIOGRAM|WBC|RBC|PLATELET|ALT|AST)/gi,
  ];
  for (const pattern of testPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const testName = match[0].trim();
      if (!tests.includes(testName)) {
        tests.push(testName);
      }
    }
  }

  // Amount extraction
  let totalAmount: number | null = null;
  const amountPatterns = [
    /(?:TOTAL|AMOUNT|BILL|FEE|CHARGE|COST|PRICE|PAYABLE|NET)\s*(?:AMOUNT|DUE|PAYABLE)?\s*[:\-]?\s*(?:Rs\.?|₹|INR|USD|\$)?\s*([\d,]+\.?\d*)/i,
    /(?:Rs\.?|₹|INR)\s*([\d,]+\.?\d*)/i,
    /\$\s*([\d,]+\.?\d*)/i,
  ];
  for (const pattern of amountPatterns) {
    const match = originalText.match(pattern);
    if (match) {
      totalAmount = parseFloat(match[1].replace(/,/g, ""));
      break;
    }
  }

  // Diagnosis extraction
  let diagnosis = "";
  const diagnosisPatterns = [
    /(?:DIAGNOSIS|IMPRESSION|CLINICAL IMPRESSION|FINDINGS?)\s*[:\-]?\s*([\s\S]+?)(?:\n\n|\n[A-Z]{2,}|$)/i,
    /(?:DIAGNOSED? WITH|SUFFERING FROM|CONDITION)\s*[:\-]?\s*([\s\S]+?)(?:\n|\.)/i,
  ];
  for (const pattern of diagnosisPatterns) {
    const match = originalText.match(pattern);
    if (match) {
      diagnosis = match[1].trim().substring(0, 300);
      break;
    }
  }

  // Advice extraction
  let advice = "";
  const advicePatterns = [
    /(?:ADVICE|RECOMMENDATION|SUGGEST|FOLLOW[\s-]?UP|INSTRUCTION)\s*[:\-]?\s*([\s\S]+?)(?:\n\n|\n[A-Z]{2,}|$)/i,
    /(?:RECOMMEND|ADVISE|ADVISED TO)\s*[:\-]?\s*([\s\S]+?)(?:\n|\.)/i,
  ];
  for (const pattern of advicePatterns) {
    const match = originalText.match(pattern);
    if (match) {
      advice = match[1].trim().substring(0, 300);
      break;
    }
  }

  // Confidence calculation based on how many fields were extracted
  let fieldsFound = 0;
  if (patientName) fieldsFound++;
  if (doctorName) fieldsFound++;
  if (hospitalName) fieldsFound++;
  if (date) fieldsFound++;
  if (medicines.length > 0) fieldsFound++;
  if (tests.length > 0) fieldsFound++;
  if (totalAmount !== null) fieldsFound++;
  if (diagnosis) fieldsFound++;
  if (advice) fieldsFound++;
  const extractionConfidence = Math.round((fieldsFound / 9) * 100);

  return {
    patientName,
    hospitalName,
    doctorName,
    date,
    medicines,
    tests,
    totalAmount,
    diagnosis,
    advice,
    extractionConfidence,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("document") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const validExtensions = ["pdf", "txt", "csv", "text", "log", "docx", "png", "jpg", "jpeg", "webp", "bmp", "tiff"];
    const fileExt = fileName.split(".").pop() || "";
    
    if (!validExtensions.includes(fileExt)) {
      return NextResponse.json(
        {
          error: `Unsupported file type (.${fileExt}). Please upload PDF, text, or image files.`,
        },
        { status: 422 }
      );
    }

    // Read the file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file size (max 50MB)
    if (buffer.length > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 413 }
      );
    }

    // Extract raw text from the file
    const rawText = await extractText(buffer, file.name);

    // More lenient check - require at least some text, but not necessarily 10 characters
    // This allows for image placeholders and fallback messages
    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Could not extract any text from this file. Try uploading a valid PDF or text file.",
          rawText: rawText || "",
        },
        { status: 422 }
      );
    }

    // Check if the extraction looks valid (not just a placeholder message)
    const isImagePlaceholder = rawText.includes("Image file detected");
    const isPdfPlaceholder = rawText.includes("PDF file detected — text extraction failed");
    
    if (isPdfPlaceholder) {
      return NextResponse.json(
        {
          error: "The PDF appears to be empty or unreadable. Please try with a different PDF file.",
          rawText: rawText,
        },
        { status: 422 }
      );
    }

    // Extract structured data using regex patterns
    const structured = extractStructuredData(rawText);

    return NextResponse.json({
      success: true,
      rawText,
      extracted: structured,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || file.name.split(".").pop() || "unknown",
    });
  } catch (error: unknown) {
    console.error("Upload processing error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process document: " + message },
      { status: 500 }
    );
  }
}
