export interface AbnormalValue {
  marker: string;
  value: string;
  range: string;
  status: 'high' | 'low' | 'warning';
  notes: string;
}

export interface DocumentChunk {
  id: string;
  header: string;
  text: string;
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'lab' | 'cardiology' | 'mri' | 'metabolic';
  date: string;
  doctor: string;
  clinic: string;
  patientName: string;
  rawText: string;
  summary: string;
  findings: string[];
  abnormalValues: AbnormalValue[];
  suggestedQuestions: string[];
  chunks: DocumentChunk[];
}

export const MOCK_REPORTS: MedicalDocument[] = [
  {
    id: "patient-form-scanned-1",
    title: "Scanned Patient Information Form & History",
    type: "metabolic",
    date: "2026-08-10",
    doctor: "Dr. Evelyn Vance, MD",
    clinic: "Clinivault Intake Health Center",
    patientName: "John Doe",
    rawText: `PATIENT INFORMATION FORM
Name: John Doe | Date: 2026-08-10
When did your problem start?: 3 weeks ago | Describe Problem: Gradual onset lower back discomfort, shortness of breath on exertion, fatigue, and mild digestive discomfort.
Cause of Current Problem: [X] Gradual onset
Did this Problem require Surgery: [X] Yes | Date of Surgery: 2022-03-15

PAST MEDICAL HISTORY (Checked Conditions):
[X] Breathing Problems (Asthma/Exertional Dyspnea)
[X] Heart Problems (Hypertension / Borderline RVSP)
[X] Diabetes (Type 2 Diabetes / Impaired Glucose)
[X] Headaches
[X] Anxiety attacks

SURGERIES / HOSPITALIZATIONS:
1. Appendectomy | Year: 2018 | Complications: None
2. Lumbar Discectomy | Year: 2022 | Complications: Residual stiffness

MEDICATIONS TAKEN:
1. Metformin | Dose: 500mg BD | Reason: Type 2 Diabetes / Glucose Control
2. Lisinopril | Dose: 10mg OD | Reason: Blood Pressure Management
3. Salbutamol Inhaler | Dose: 100mcg PRN | Reason: Asthma / Breathing Support

ALLERGIES:
- Latex: [X] Yes
- Iodine: [ ] No
- Bromine: [ ] No
- Other: Penicillin (Skin Rash)

Religious/cultural views affecting treatment: [ ] No
Additional comment (Reading or Memory Problem): Occasional memory fog when tired.`,
    summary: "Scanned Patient Information Form indicates an established clinical history of Type 2 Diabetes (managed with Metformin 500mg), Hypertension (managed with Lisinopril 10mg), and Asthma (managed with Salbutamol Inhaler). Patient has a history of Lumbar Discectomy (2022) and Appendectomy (2018). Important safety alert: Confirmed positive allergies to Latex and Penicillin.",
    findings: [
      "Active chronic conditions identified: Type 2 Diabetes, Hypertension, Asthma/Breathing Problems, Headaches, and Anxiety.",
      "Confirmed Drug & Contact Allergies: Positive for Latex and Penicillin (causes skin rash). Must avoid latex gloves and penicillin-class antibiotics.",
      "Current Daily Medications: Metformin 500mg twice daily, Lisinopril 10mg once daily, and Salbutamol inhaler as needed for wheezing.",
      "Surgical History: Lumbar Discectomy (2022) with residual stiffness; Appendectomy (2018) without complications.",
      "Chief Complaint: 3-week history of gradual onset lower back pain, exertional shortness of breath, and fatigue."
    ],
    abnormalValues: [
      {
        marker: "Known Allergen Alert - Penicillin",
        value: "Positive (Skin Rash)",
        range: "Negative",
        status: "high",
        notes: "Strict contraindication: Penicillin, Amoxicillin, Ampicillin, and related beta-lactam antibiotics must be avoided."
      },
      {
        marker: "Known Allergen Alert - Latex",
        value: "Positive Reaction",
        range: "Negative",
        status: "high",
        notes: "Medical procedure safety: Use non-latex synthetic gloves, catheters, and medical supplies."
      },
      {
        marker: "Fasting Glycemic Control (Diabetes)",
        value: "Metformin 500mg BD",
        range: "< 100 mg/dL",
        status: "warning",
        notes: "Active oral hypoglycemic regimen. Recommend low-glycemic dietary planning and HbA1c tracking."
      },
      {
        marker: "Blood Pressure Regulation",
        value: "Lisinopril 10mg OD",
        range: "< 120/80 mmHg",
        status: "warning",
        notes: "ACE-inhibitor therapy for hypertension. Monitor renal function (BUN/Creatinine) and potassium levels."
      }
    ],
    suggestedQuestions: [
      "What non-penicillin antibiotics are safe for me if I get an infection?",
      "How can I manage my lower back stiffness safely after my 2022 lumbar discectomy?",
      "What low-glycemic diet changes work best alongside Metformin?",
      "Could my exertional shortness of breath be linked to my asthma or heart history?"
    ],
    chunks: [
      {
        id: "form-chunk-1",
        header: "Patient Demographics & Chief Complaints",
        text: "PATIENT INFORMATION FORM. Patient: John Doe. Date: 2026-08-10. Problem onset: 3 weeks ago (Gradual onset). Chief Symptoms: Lower back discomfort, exertional dyspnea (shortness of breath), fatigue, and mild digestive discomfort."
      },
      {
        id: "form-chunk-2",
        header: "Past Medical History & Checked Conditions",
        text: "Past Medical History confirmed conditions: Breathing Problems (Asthma), Heart Problems (Hypertension), Type 2 Diabetes, Headaches, and Anxiety. Surgeries: Appendectomy (2018), Lumbar Discectomy (2022)."
      },
      {
        id: "form-chunk-3",
        header: "Current Medications & Active Prescriptions",
        text: "Active Medications: Metformin 500mg BD for Type 2 Diabetes / Glucose Control; Lisinopril 10mg OD for Blood Pressure Management; Salbutamol Inhaler 100mcg PRN for Asthma and breathing support."
      },
      {
        id: "form-chunk-4",
        header: "Critical Allergies & Safety Precautions",
        text: "ALLERGIES: Latex Allergies (YES - use non-latex products). Penicillin Allergy (YES - skin rash reaction). Iodine: No. Bromine: No. Additional Note: Occasional memory fog when tired."
      }
    ]
  },
  {
    id: "cbc-report-1",
    title: "Complete Blood Count (CBC) Panel",
    type: "lab",
    date: "2026-05-10",
    doctor: "Dr. Evelyn Vance, MD",
    clinic: "Metro General Diagnostics",
    patientName: "John Doe",
    rawText: `METRO GENERAL DIAGNOSTICS - CLINICAL LABS
PATIENT: JOHN DOE | DOB: 11/12/1984 | SEX: M
DATE OF COLLECTION: 2026-05-10 | REQUESTING PHYSICIAN: DR. EVELYN VANCE
TEST PANEL: COMPLETE BLOOD COUNT WITH AUTOMATED DIFFERENTIAL

HEMATOLOGY STUDY:
White Blood Cell Count (WBC)......... 12.4 x10^3/uL   [4.5 - 11.0]   HIGH
Red Blood Cell Count (RBC)........... 4.10 x10^6/uL   [4.30 - 5.90]  LOW
Hemoglobin (Hgb)..................... 11.8 g/dL       [13.5 - 17.5]  LOW
Hematocrit (Hct)..................... 35.8 %          [41.0 - 50.0]  LOW
Mean Corpuscular Volume (MCV)........ 87.3 fL         [80.0 - 100.0] NORMAL
Platelet Count (PLT)................. 325 x10^3/uL    [150 - 450]    NORMAL
Segmented Neutrophils................ 76.0 %          [40.0 - 70.0]  HIGH
Lymphocytes.......................... 16.0 %          [20.0 - 45.0]  LOW

CLINICAL IMPRESSION:
Moderate leukocytosis characterized by segmented neutrophilia. Findings are suggestive of an acute bacterial inflammatory response or tissue infection. 
Concurrent mild normocytic anemia noted, as evidenced by slightly depleted erythrocytic parameters (RBC, Hgb, Hct). Recommend correlation with iron studies and active clinical symptoms (fever, localized discomfort).`,
    summary: "This report indicates your body is actively fighting off a mild to moderate bacterial infection or inflammation. This is shown by a high White Blood Cell count (leukocytosis) and an increase in neutrophils, which are your body's primary defense cells. Additionally, you show a minor decrease in Red Blood Cells and Hemoglobin, which suggests a mild case of anemia. This can occasionally cause slight tiredness or fatigue.",
    findings: [
      "White Blood Cell (WBC) count is elevated at 12.4 x10^3/uL, which is above the standard range of 4.5 to 11.0.",
      "Neutrophils are elevated at 76.0% (standard 40.0% - 70.0%), pointing to an active defense response against bacterial triggers or tissue stress.",
      "Red Blood Cell (RBC), Hemoglobin, and Hematocrit counts are slightly below standard ranges, representing a mild normocytic anemia.",
      "Platelet counts and corpuscular volumes are entirely stable, indicating standard blood clotting potentials."
    ],
    abnormalValues: [
      {
        marker: "White Blood Cell Count (WBC)",
        value: "12.4 x10^3/uL",
        range: "4.5 - 11.0 x10^3/uL",
        status: "high",
        notes: "Indicates active immune activation, typically in response to a bacterial infection, tissue strain, or inflammation."
      },
      {
        marker: "Segmented Neutrophils",
        value: "76.0%",
        range: "40.0% - 70.0%",
        status: "high",
        notes: "Neutrophils are specialized infection fighters; an elevated percentage points strongly towards acute bacterial or inflammatory defense."
      },
      {
        marker: "Hemoglobin (Hgb)",
        value: "11.8 g/dL",
        range: "13.5 - 17.5 g/dL",
        status: "low",
        notes: "Hemoglobin carries oxygen throughout your body. Mild depletion suggests light normocytic anemia, which can trigger feelings of fatigue."
      },
      {
        marker: "Red Blood Cell Count (RBC)",
        value: "4.10 x10^6/uL",
        range: "4.30 - 5.90 x10^6/uL",
        status: "low",
        notes: "Erythrocyte count is slightly low, aligning with the observed mild anemia markers."
      }
    ],
    suggestedQuestions: [
      "What might be causing my high white blood cell count?",
      "Are there specific symptoms of anemia I should monitor closely?",
      "Should I ask my doctor for an iron panel test?",
      "What is the difference between leukocytosis and anemia?"
    ],
    chunks: [
      {
        id: "cbc-chunk-1",
        header: "Patient Metadata & General Information",
        text: "METRO GENERAL DIAGNOSTICS - CLINICAL LABS. Patient: John Doe. Date of collection: 2026-05-10. Requesting Physician: Dr. Evelyn Vance. Test Panel: Complete Blood Count (CBC) with Automated Differential."
      },
      {
        id: "cbc-chunk-2",
        header: "Hematology Lab Values & Out-of-Range Flags",
        text: "White Blood Cell Count (WBC) is elevated at 12.4 x10^3/uL (standard range: 4.5 - 11.0). Segmented Neutrophils are high at 76.0% (standard range: 40.0% - 70.0%). Red Blood Cell Count (RBC) is low at 4.10 x10^6/uL (standard: 4.30 - 5.90). Hemoglobin (Hgb) is low at 11.8 g/dL (standard: 13.5 - 17.5). Hematocrit (Hct) is low at 35.8% (standard: 41.0 - 50.0). Platelets and MCV are in normal range."
      },
      {
        id: "cbc-chunk-3",
        header: "Clinical Impression & Pathology Suggestions",
        text: "Clinical Impression indicates moderate leukocytosis characterized by segmented neutrophilia. Findings are suggestive of an acute bacterial inflammatory response or infection. Concurrent mild normocytic anemia is noted, as evidenced by slightly depleted erythrocytic parameters. Recommends correlating with iron panels and active clinical symptoms like fever."
      }
    ]
  },
  {
    id: "cardio-report-1",
    title: "Transthoracic Echocardiogram Study",
    type: "cardiology",
    date: "2026-05-02",
    doctor: "Dr. Marcus Vance, MD",
    clinic: "Vanguard Cardiovascular Institute",
    patientName: "Jane Smith",
    rawText: `VANGUARD CARDIOVASCULAR INSTITUTE
PATIENT: JANE SMITH | DOB: 05/20/1971 | SEX: F
STUDY DATE: 2026-05-02 | ATTENDING CARDIOLOGIST: DR. MARCUS VANCE

PROCEDURE: COMPLETE TWO-DIMENSIONAL TRANSTHORACIC ECHOCARDIOGRAM

MEASUREMENTS:
Left Ventricular Ejection Fraction (LVEF). 58 %            [55 - 70]      NORMAL
Left Ventricular Internal Dimension (LVIDd) 4.8 cm         [3.8 - 5.2]    NORMAL
Right Ventricular Systolic Pressure (RVSP). 31 mmHg        [< 30]         SLIGHTLY HIGH
Left Atrial Volume Index (LAVI).......... 36 mL/m^2      [< 34]         HIGH

VALVULAR ASSESSMENT:
Mitral Valve: Structurally intact leaflets with mild trace regurgitation (MR). E/A ratio is 0.85, suggestive of impaired relaxation (Grade 1 Diastolic Dysfunction).
Aortic Valve: Tricuspid configuration, no significant stenosis or regurgitation. Ejection velocities are standard.
Tricuspid Valve: Trivial regurgitation present, sufficient to estimate RVSP at 31 mmHg.

INTERPRETATION:
1. Preserved Left Ventricular Systolic Function (LVEF 58%).
2. Mild Left Atrial Enlargement as indicated by LAVI of 36 mL/m^2.
3. Grade 1 diastolic dysfunction (impaired active relaxation pattern) with standard filling pressures at rest.
4. Borderline right ventricular systolic pressure (31 mmHg), suggesting very mild, preclinical pulmonary venous hypertension. Correlate with physical symptoms of dyspnea on exertion.`,
    summary: "Your heart scan shows that your heart is pumping blood beautifully, with a healthy ejection fraction of 58% (normal is above 55%). However, it shows two minor changes: first, your heart muscle relaxes a little slowly between beats (Grade 1 Diastolic Dysfunction), which is quite common as we age. Second, your left atrium (the upper-left chamber of the heart) is slightly enlarged. This can sometimes happen due to borderline blood pressure or stress on the heart.",
    findings: [
      "Heart pumping strength (LVEF) is strong and healthy at 58% (standard is 55% - 70%).",
      "Left Atrial Volume Index (LAVI) is slightly high at 36 mL/m^2, indicating mild left atrial enlargement.",
      "The mitral valve shows trace backflow (regurgitation), which is extremely common and usually harmless.",
      "Grade 1 Diastolic Dysfunction is present, representing a minor stiffening or slow relaxation of the heart muscle between beats.",
      "Right Ventricular Systolic Pressure is borderline elevated at 31 mmHg, indicating a very mild pressure increase in the pulmonary blood flow."
    ],
    abnormalValues: [
      {
        marker: "Left Atrial Volume Index (LAVI)",
        value: "36 mL/m^2",
        range: "< 34 mL/m^2",
        status: "high",
        notes: "Suggests a mild enlargement of the left upper heart chamber. Can be secondary to chronic hypertension or physical exertion."
      },
      {
        marker: "Right Ventricular Systolic Pressure (RVSP)",
        value: "31 mmHg",
        range: "< 30 mmHg",
        status: "warning",
        notes: "Borderline elevation that can represent very mild preclinical pulmonary venous pressures. Worth monitoring if short of breath."
      },
      {
        marker: "Mitral Valve E/A Relaxation Ratio",
        value: "0.85",
        range: "> 1.0",
        status: "low",
        notes: "Points to Grade 1 Diastolic Dysfunction. This means the heart walls relax slightly slower between contractions, often related to age or blood pressure."
      }
    ],
    suggestedQuestions: [
      "What is Grade 1 Diastolic Dysfunction and is it dangerous?",
      "Why is my Left Atrial Volume Index slightly high?",
      "Does the trace regurgitation in my mitral valve require surgery?",
      "What steps can I take to improve my heart's relaxation rate?"
    ],
    chunks: [
      {
        id: "cardio-chunk-1",
        header: "Echocardiogram Procedure & Global Dimensions",
        text: "VANGUARD CARDIOVASCULAR INSTITUTE. Patient: Jane Smith. Procedure: Complete Two-Dimensional Transthoracic Echocardiogram. Left Ventricular Ejection Fraction (LVEF) is 58% (normal: 55-70%). Left Ventricular Internal Dimension is normal at 4.8 cm."
      },
      {
        id: "cardio-chunk-2",
        header: "Valve Status & Atrial Enlargement Markers",
        text: "Mitral Valve leaflets show trace regurgitation. Left Atrial Volume Index (LAVI) is high at 36 mL/m^2 (standard threshold: < 34). Mitral valve E/A ratio is 0.85, representing Grade 1 Diastolic Dysfunction (impaired active relaxation pattern)."
      },
      {
        id: "cardio-chunk-3",
        header: "Pulmonary Pressures & Diagnostic Impression",
        text: "Right Ventricular Systolic Pressure (RVSP) is borderline high at 31 mmHg. Conclusion notes preserved systolic pumping function, Grade 1 diastolic dysfunction, mild left atrial enlargement, and borderline pulmonary venous pressures. Advises correlating with symptoms of exertional dyspnea (shortness of breath)."
      }
    ]
  },
  {
    id: "mri-report-1",
    title: "Magnetic Resonance Imaging (MRI) of Left Knee",
    type: "mri",
    date: "2026-04-18",
    doctor: "Dr. Gregory House, MD",
    clinic: "Vanguard Medical Imaging Center",
    patientName: "Robert Miller",
    rawText: `VANGUARD IMAGING - MRI DEPARTMENT
PATIENT: ROBERT MILLER | DOB: 02/05/1990 | SEX: M
DATE OF SCAN: 2026-04-18 | REFERRING CLINICIAN: DR. GREGORY HOUSE

CLINICAL HISTORY:
Left knee pain and joint instability following an acute pivoting injury during athletic activity. Patient reports a popping sensation and subsequent weight-bearing distress.

EXAMINATION:
Multiplanar, multisequence magnetic resonance imaging of the left knee was performed in the absence of intravenous contrast.

FINDINGS:
Menisci: The medial meniscus shows a high-signal linear intensity extending to the inferior articular surface in the posterior horn, consistent with a Grade 2 tear. The lateral meniscus is structurally intact, showing normal shape and intensity.
Ligaments: The Anterior Cruciate Ligament (ACL) is intact but shows minor interstitial edema, suggestive of a low-grade sprain. The Posterior Cruciate Ligament (PCL) is normal in caliber and course. Collateral ligaments (MCL and LCL) are fully preserved.
Osteochondral Structure: Normal cartilage thicknesses in the patellofemoral joint. No focal osteochondral defects.
Joint Fluid: There is a moderate amount of intra-articular joint fluid (moderate joint effusion) expanding the suprapatellar recess.

IMPRESSION:
1. Grade 2 linear tear of the posterior horn of the medial meniscus.
2. Low-grade (Grade 1) sprain of the anterior cruciate ligament (ACL) with no macro-instability or complete rupture.
3. Moderate joint effusion (fluid in the knee joint) secondary to trauma.`,
    summary: "Your knee MRI indicates a tear in the cartilage padding on the inner side of your knee joint (specifically, a Grade 2 medial meniscus tear in the posterior horn). There is also a mild sprain of the anterior cruciate ligament (ACL), although the ligament remains fully intact with no complete rupture. These injuries have caused a moderate buildup of fluid in your knee joint (moderate joint effusion), which is causing swelling and stiffness.",
    findings: [
      "The medial meniscus (the shock-absorbing cartilage on the inside of the knee) shows a Grade 2 tear in its posterior horn.",
      "The ACL shows a minor sprain with slight swelling (interstitial edema) but is fully structurally intact.",
      "There is moderate fluid buildup ('joint effusion') in the suprapatellar recess, explaining knee swelling.",
      "The cartilage thicknesses and lateral meniscus are fully intact with no other severe bone bruising or focal defects."
    ],
    abnormalValues: [
      {
        marker: "Medial Meniscus Cartilage",
        value: "Grade 2 Tear (Posterior Horn)",
        range: "Intact",
        status: "high",
        notes: "Grade 2 represents a partial or moderate tear of the meniscus tissue. Can cause catching, locking, or sharp pain on twist."
      },
      {
        marker: "Anterior Cruciate Ligament (ACL)",
        value: "Grade 1 Sprain (Mild)",
        range: "Intact",
        status: "warning",
        notes: "The ligament is swollen (edematous) but has not suffered a complete rupture or tear. Conservative recovery often yields strong outcomes."
      },
      {
        marker: "Intra-articular Fluid Level",
        value: "Moderate Joint Effusion",
        range: "Minimal/Normal Fluid",
        status: "high",
        notes: "Refers to a significant accumulation of inflammatory fluid inside the knee joint, common after sudden twists or trauma."
      }
    ],
    suggestedQuestions: [
      "Does a Grade 2 meniscus tear require arthroscopic surgery?",
      "Can a Grade 1 ACL sprain heal on its own with physical therapy?",
      "What is the best way to drain or reduce the moderate joint fluid swelling?",
      "Are there specific exercises I should strictly avoid during recovery?"
    ],
    chunks: [
      {
        id: "mri-chunk-1",
        header: "Clinical Referral & Procedure Metadata",
        text: "VANGUARD IMAGING - MRI DEPARTMENT. Patient: Robert Miller. Scan Date: 2026-04-18. History: Left knee pain and instability after an athletic pivoting injury with a 'popping' sensation."
      },
      {
        id: "mri-chunk-2",
        header: "Meniscal & Ligament Assessment",
        text: "The medial meniscus posterior horn shows high-signal intensity reaching the inferior surface, confirming a Grade 2 tear. Lateral meniscus is normal. The Anterior Cruciate Ligament (ACL) exhibits edema indicating a low-grade sprain, but remains intact."
      },
      {
        id: "mri-chunk-3",
        header: "Effusion Levels & Structural Summary",
        text: "A moderate amount of intra-articular fluid (joint effusion) is present in the suprapatellar recess. Diagnostic impression summarizes a Grade 2 medial meniscus posterior horn tear, Grade 1 ACL sprain, and moderate joint fluid secondary to trauma."
      }
    ]
  },
  {
    id: "cmp-report-1",
    title: "Comprehensive Metabolic Panel (CMP)",
    type: "metabolic",
    date: "2026-05-14",
    doctor: "Dr. Sarah Lin, MD",
    clinic: "Vanguard Family Care Center",
    patientName: "Alice Cooper",
    rawText: `FAMILY CARE CENTER - COMPREHENSIVE LABS
PATIENT: ALICE COOPER | DOB: 09/30/1965 | SEX: F
COLLECTION DATE: 2026-05-14 | PHYSICIAN: DR. SARAH LIN

TEST RESULTS: COMPREHENSIVE METABOLIC PANEL (CMP)

SERUM GLUCOSE....................... 118 mg/dL       [70 - 99]      HIGH (Fasting)
Blood Urea Nitrogen (BUN)........... 18 mg/dL        [7 - 20]       NORMAL
Creatinine.......................... 0.85 mg/dL      [0.60 - 1.10]  NORMAL
Sodium.............................. 139 mEq/L       [135 - 145]    NORMAL
Potassium........................... 3.4 mEq/L        [3.5 - 5.2]    LOW
Chloride............................ 101 mEq/L       [96 - 106]     NORMAL
Calcium............................. 9.4 mg/dL        [8.5 - 10.2]   NORMAL
Total Protein....................... 6.8 g/dL        [6.0 - 8.3]    NORMAL
Albumin............................. 4.1 g/dL        [3.5 - 5.0]    NORMAL
Alanine Aminotransferase (ALT)...... 48 U/L          [7 - 56]       NORMAL
Aspartate Aminotransferase (AST).... 52 U/L          [10 - 40]      HIGH

DIAGNOSTIC SUMMARY:
1. Impaired fasting glucose (fasting serum blood sugar of 118 mg/dL). This is consistent with prediabetic metabolic states. Recommend dietary counseling and correlation with a Hemoglobin A1c (HbA1c) test.
2. Borderline hypokalemia (Potassium at 3.4 mEq/L). Recommend potassium-rich dietary adjustments or hydration balance checks.
3. Mildly elevated AST transaminase (52 U/L). This points to mild hepatocellular stress. Since ALT is standard, this could be secondary to recent strenuous exercise or alcohol/acetaminophen exposure. Recommend periodic re-evaluation.`,
    summary: "Your metabolic panel indicates a slightly high fasting blood sugar (Glucose at 118 mg/dL), which falls into the 'prediabetic' range (normal is under 100). This suggests your body is having a minor struggle processing glucose efficiently. Your potassium level is also slightly below standard ranges, which can sometimes cause muscle cramps. Additionally, you show a minor elevation in a liver enzyme called AST, suggesting mild liver cell stress.",
    findings: [
      "Fasting serum Glucose is elevated at 118 mg/dL, suggesting prediabetic or impaired fasting glucose levels.",
      "Serum Potassium is borderline low at 3.4 mEq/L (standard range: 3.5 - 5.2 mEq/L).",
      "The liver enzyme AST is slightly high at 52 U/L, whereas ALT remains stable in range, pointing to minor stress in muscle or liver cells.",
      "Kidney markers (BUN, Creatinine), sodium, calcium, and proteins are entirely healthy, showing strong renal clearance."
    ],
    abnormalValues: [
      {
        marker: "Serum Glucose (Fasting)",
        value: "118 mg/dL",
        range: "70 - 99 mg/dL",
        status: "high",
        notes: "Suggestive of impaired fasting glucose, which is a prediabetic threshold. It is highly advised to check an HbA1c panel."
      },
      {
        marker: "Serum Potassium",
        value: "3.4 mEq/L",
        range: "3.5 - 5.2 mEq/L",
        status: "low",
        notes: "Borderline low (hypokalemia). Can be due to dehydration, sweating, or low dietary intake. Can trigger light muscle cramping."
      },
      {
        marker: "Aspartate Aminotransferase (AST)",
        value: "52 U/L",
        range: "10 - 40 U/L",
        status: "high",
        notes: "Liver/muscle enzyme that is slightly high, suggesting minor cellular stress. Often clears after resting from exercise or adjusting medications."
      }
    ],
    suggestedQuestions: [
      "What is the difference between high glucose and a high HbA1c test?",
      "Does a low potassium value explain muscle twitching or cramps?",
      "Are there specific medications or exercises that elevate AST?",
      "What dietary changes can help lower my fasting glucose back to normal?"
    ],
    chunks: [
      {
        id: "cmp-chunk-1",
        header: "CMP Overview & Metabolic Rates",
        text: "FAMILY CARE CENTER - COMPREHENSIVE LABS. Patient: Alice Cooper. Test Results: Comprehensive Metabolic Panel (CMP). Fasting serum glucose is high at 118 mg/dL (standard reference range: 70 - 99)."
      },
      {
        id: "cmp-chunk-2",
        header: "Electrolyte Levels & Kidney Function",
        text: "BUN, Creatinine, Sodium, Calcium, and Chloride are fully within standard reference intervals. Serum Potassium is slightly low at 3.4 mEq/L (standard reference range: 3.5 - 5.2)."
      },
      {
        id: "cmp-chunk-3",
        header: "Hepatic Enzymes & Clinical Impression",
        text: "Alanine Aminotransferase (ALT) is standard at 48 U/L. Aspartate Aminotransferase (AST) is slightly elevated at 52 U/L (standard range: 10 - 40). Diagnostic summary notes impaired fasting glucose (prediabetic state), borderline hypokalemia, and mild AST hepatocyte stress."
      }
    ]
  }
];
