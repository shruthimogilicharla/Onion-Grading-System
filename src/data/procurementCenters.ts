export interface ProcurementCenter {
  id: string;
  name: string;
  state: string;
  agency: "NAFED" | "NCCF" | "State APMC";
  dailyProcurementQuintals: number;
  aiGradedPercentage: number;
  varianceBeforeAi: number; // % dispute rate before AI (e.g. 26.5%)
  varianceAfterAi: number;  // % dispute rate after AI (e.g. 1.2%)
  status: "Calibrated - Active" | "Syncing" | "Calibrated";
  calibrationHash: string;
  leadOfficer: string;
  coordinates: { lat: number; lng: number };
}

export interface DisputeRecord {
  disputeId: string;
  lotId: string;
  procurementCenter: string;
  farmerName: string;
  kisanId: string;
  lotWeightQuintals: number;
  submissionDate: string;
  inspectorSubjectiveGrade: "Grade Extra Class" | "Grade I" | "Grade II" | "Sub-Standard / Rejected";
  farmerClaimedGrade: "Grade Extra Class" | "Grade I" | "Grade II";
  disputeReason: string;
  aiAuditedGrade: "Grade Extra Class" | "Grade I" | "Grade II" | "Sub-Standard / Rejected";
  verdict: "REVISED_UPWARD" | "REVISED_DOWNWARD" | "ORIGINAL_UPHELD";
  status: "Resolved - Closed" | "Under AI Appellate Audit";
  payoutAdjustmentInr: number;
  explanation: string;
  imageUrl?: string;
  pixelEvidenceCoordinates?: string;
}

export const PROCUREMENT_CENTERS: ProcurementCenter[] = [
  {
    id: "CTR-MH-01",
    name: "Lasalgaon APMC (Nashik)",
    state: "Maharashtra",
    agency: "NAFED",
    dailyProcurementQuintals: 3450,
    aiGradedPercentage: 99.4,
    varianceBeforeAi: 28.6,
    varianceAfterAi: 0.9,
    status: "Calibrated - Active",
    calibrationHash: "SHA-LSG-2026-v42",
    leadOfficer: "Dr. Sandeep Deshmukh (NAFED Regional Dir)",
    coordinates: { lat: 20.1447, lng: 74.2272 },
  },
  {
    id: "CTR-MH-02",
    name: "Pimpalgaon Baswant APMC",
    state: "Maharashtra",
    agency: "NAFED",
    dailyProcurementQuintals: 2890,
    aiGradedPercentage: 98.8,
    varianceBeforeAi: 24.2,
    varianceAfterAi: 1.1,
    status: "Calibrated - Active",
    calibrationHash: "SHA-PMP-2026-v42",
    leadOfficer: "Anil S. More (Chief Quality Insp)",
    coordinates: { lat: 20.1711, lng: 73.9859 },
  },
  {
    id: "CTR-MH-03",
    name: "Solapur Central Mandi",
    state: "Maharashtra",
    agency: "NCCF",
    dailyProcurementQuintals: 1650,
    aiGradedPercentage: 97.5,
    varianceBeforeAi: 31.4,
    varianceAfterAi: 1.4,
    status: "Calibrated - Active",
    calibrationHash: "SHA-SLP-2026-v42",
    leadOfficer: "Prashant K. Rao (NCCF Nodal)",
    coordinates: { lat: 17.6599, lng: 75.9064 },
  },
  {
    id: "CTR-RJ-01",
    name: "Alwar Krishi Upaj Mandi",
    state: "Rajasthan",
    agency: "NCCF",
    dailyProcurementQuintals: 1420,
    aiGradedPercentage: 96.9,
    varianceBeforeAi: 29.8,
    varianceAfterAi: 1.3,
    status: "Calibrated - Active",
    calibrationHash: "SHA-ALW-2026-v42",
    leadOfficer: "Mahaveer Singh (NCCF Inspecting Auth)",
    coordinates: { lat: 27.5530, lng: 76.6346 },
  },
  {
    id: "CTR-MP-01",
    name: "Indore Mandi Complex (Choithram)",
    state: "Madhya Pradesh",
    agency: "NAFED",
    dailyProcurementQuintals: 2100,
    aiGradedPercentage: 98.2,
    varianceBeforeAi: 25.7,
    varianceAfterAi: 1.0,
    status: "Calibrated - Active",
    calibrationHash: "SHA-IND-2026-v42",
    leadOfficer: "Rajeshwar Tiwari (NAFED Insp)",
    coordinates: { lat: 22.7196, lng: 75.8577 },
  },
  {
    id: "CTR-KA-01",
    name: "Hubli APMC Yard (Amargol)",
    state: "Karnataka",
    agency: "NCCF",
    dailyProcurementQuintals: 1180,
    aiGradedPercentage: 95.8,
    varianceBeforeAi: 33.1,
    varianceAfterAi: 1.6,
    status: "Calibrated - Active",
    calibrationHash: "SHA-HBL-2026-v42",
    leadOfficer: "Basavaraj Patil (NCCF Inspector)",
    coordinates: { lat: 15.3647, lng: 75.1240 },
  },
  {
    id: "CTR-GJ-01",
    name: "Bhavnagar Mahuva Mandi",
    state: "Gujarat",
    agency: "NAFED",
    dailyProcurementQuintals: 2340,
    aiGradedPercentage: 99.1,
    varianceBeforeAi: 27.3,
    varianceAfterAi: 0.8,
    status: "Calibrated - Active",
    calibrationHash: "SHA-BHV-2026-v42",
    leadOfficer: "Harishbhai Patel (Senior Quality Grader)",
    coordinates: { lat: 21.0914, lng: 71.7644 },
  },
  {
    id: "CTR-AP-01",
    name: "Kurnool Agricultural Market Yard",
    state: "Andhra Pradesh",
    agency: "NCCF",
    dailyProcurementQuintals: 980,
    aiGradedPercentage: 94.6,
    varianceBeforeAi: 30.5,
    varianceAfterAi: 1.5,
    status: "Calibrated - Active",
    calibrationHash: "SHA-KRN-2026-v42",
    leadOfficer: "K. Venkataswamy (Mandi Secretary)",
    coordinates: { lat: 15.8281, lng: 78.0373 },
  },
];

export const INITIAL_DISPUTES: DisputeRecord[] = [
  {
    disputeId: "DISP-2026-1084",
    lotId: "LOT-MH-2026-4421",
    procurementCenter: "Pimpalgaon Baswant APMC",
    farmerName: "Sopan Narhari Kute",
    kisanId: "MH-NSK-2026-62184",
    lotWeightQuintals: 46.0,
    submissionDate: "2026-09-07T14:30:00Z",
    inspectorSubjectiveGrade: "Grade II",
    farmerClaimedGrade: "Grade I",
    disputeReason: "Human inspector downgraded lot to Grade II claiming excessive neck thickness and applying ₹180/q penalty deduction. Farmer claims lot is properly cured FAQ Grade I.",
    aiAuditedGrade: "Grade I",
    verdict: "REVISED_UPWARD",
    status: "Resolved - Closed",
    payoutAdjustmentInr: 8280, // +₹180/q * 46 quintals
    explanation: "Optical cross-section computed neck diameter at 11.4mm (threshold for Grade I tight-neck is <12mm). Cumulative defects total 3.8%, strictly within the 5% Grade I threshold. Inspector subjectivity overturned; farmer compensated in full.",
    pixelEvidenceCoordinates: "Box [140, 450, 430, 710]: Neck thickness calibrated at 11.4mm vs 12mm limit.",
  },
  {
    disputeId: "DISP-2026-1085",
    lotId: "LOT-MH-2026-7832",
    procurementCenter: "Solapur Central Mandi",
    farmerName: "Kailas Bhikaji Gite",
    kisanId: "MH-NSK-2026-44391",
    lotWeightQuintals: 38.0,
    submissionDate: "2026-09-07T16:15:00Z",
    inspectorSubjectiveGrade: "Grade II",
    farmerClaimedGrade: "Grade Extra Class",
    disputeReason: "Farmer contested the ₹180/q deduction, claiming the crop is Grade Extra Class and demands ₹150/q premium instead.",
    aiAuditedGrade: "Grade II",
    verdict: "ORIGINAL_UPHELD",
    status: "Resolved - Closed",
    payoutAdjustmentInr: 0,
    explanation: "Automated vision analysis detected vegetative sprout shoots in 6.8% of sampled bulbs and unsealed thick necks in 5.2%. While acceptable under Grade II (ceiling 10%), it is legally disqualified from Extra Class (ceiling 2%). Grade II with cleaning deduction upheld with photographic evidence trail.",
    pixelEvidenceCoordinates: "Sprout detection boxes: Det-1 [130, 150] (12mm shoot), Det-4 [480, 130] (8mm shoot).",
  },
  {
    disputeId: "DISP-2026-1086",
    lotId: "LOT-RJ-2026-3091",
    procurementCenter: "Alwar Krishi Upaj Mandi",
    farmerName: "Bhairon Singh Gurjar",
    kisanId: "RJ-ALW-2026-55219",
    lotWeightQuintals: 55.0,
    submissionDate: "2026-09-08T08:20:00Z",
    inspectorSubjectiveGrade: "Sub-Standard / Rejected",
    farmerClaimedGrade: "Grade II",
    disputeReason: "Center inspector issued outright rejection claiming black mold contamination. Farmer asserts mold is only on dry outer papery scales that shed during standard sorting.",
    aiAuditedGrade: "Grade II",
    verdict: "REVISED_UPWARD",
    status: "Resolved - Closed",
    payoutAdjustmentInr: 122100, // Reinstated procurement at Grade II (₹2,220/q * 55q)
    explanation: "Multi-spectral outer scale depth analysis confirmed Aspergillus spores were restricted to loose dry tunic scales (<1.4% surface area), with completely sound, fleshy internal scales and firm basal plate. Upgraded to Grade II FAQ with standard desiccation cleaning condition.",
    pixelEvidenceCoordinates: "Dry scale boundary confirmed: Basal plate intact with 0% soft rot decay.",
  },
];
