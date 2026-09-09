import singleOnionPhoto from '../assets/images/single_onion_bulb_1788853186255.jpg';
import onionBatchPhoto from '../assets/images/onion_batch_tray_1788854639704.jpg';
import onionDefectPhoto from '../assets/images/onion_defective_lot_1788854663427.jpg';

export interface SampleLot {
  id: string;
  title: string;
  description: string;
  originMandi: string;
  expectedGrade: "Grade Extra Class" | "Grade I" | "Grade II" | "Sub-Standard / Rejected";
  expectedFaq: "FAQ Compliant" | "Marginal FAQ" | "Non-Compliant / Rejected";
  badgeColor: string;
  bulbCount: number;
  avgDiameter: string;
  imageUrl: string;
  defectSummary: string;
  sampleTypeKey: string;
  farmer: {
    name: string;
    kisanId: string;
    village: string;
    vehicleNo: string;
    weightQuintals: number;
  };
}

// Generate high fidelity realistic SVG mock images for onion batches
function createSampleOnionSvg(type: 'extra_class' | 'grade_1' | 'sprouted' | 'mold_reject' | 'doubles'): string {
  const width = 800;
  const height = 500;

  if (type === 'extra_class') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="%23f8fafc"/>
          <stop offset="100%" stop-color="%23e2e8f0"/>
        </radialGradient>
        <radialGradient id="onionGrad1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="%23f472b6"/>
          <stop offset="35%" stop-color="%23be185d"/>
          <stop offset="70%" stop-color="%23831843"/>
          <stop offset="100%" stop-color="%23500724"/>
        </radialGradient>
        <radialGradient id="onionGrad2" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stop-color="%23fb7185"/>
          <stop offset="40%" stop-color="%23e11d48"/>
          <stop offset="75%" stop-color="%239f1239"/>
          <stop offset="100%" stop-color="%234c0519"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="%230f172a" flood-opacity="0.18"/>
        </filter>
        <pattern id="calibGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23cbd5e1" stroke-width="0.75"/>
        </pattern>
      </defs>
      
      <!-- Tray background with calibration grid -->
      <rect width="100%" height="100%" fill="url(%23bg)"/>
      <rect x="30" y="30" width="740" height="440" rx="12" fill="%23ffffff" stroke="%2394a3b8" stroke-width="2"/>
      <rect x="30" y="30" width="740" height="440" rx="12" fill="url(%23calibGrid)" opacity="0.6"/>
      
      <!-- 50mm calibration reference marker -->
      <g transform="translate(60, 50)">
        <rect width="140" height="36" rx="6" fill="%230f172a" opacity="0.85"/>
        <line x1="12" y1="18" x2="62" y2="18" stroke="%2338bdf8" stroke-width="2.5"/>
        <line x1="12" y1="12" x2="12" y2="24" stroke="%2338bdf8" stroke-width="2.5"/>
        <line x1="62" y1="12" x2="62" y2="24" stroke="%2338bdf8" stroke-width="2.5"/>
        <text x="72" y="22" fill="%23ffffff" font-family="sans-serif" font-size="11" font-weight="bold">50mm CALIB</text>
      </g>
      
      <!-- Premium Uniform Onions - Extra Class -->
      <!-- Bulb 1 -->
      <g filter="url(%23shadow)" transform="translate(140, 160)">
        <ellipse cx="60" cy="60" rx="58" ry="54" fill="url(%23onionGrad1)"/>
        <!-- Neck -->
        <path d="M 52 8 Q 60 -10 68 8 Z" fill="%23854d0e"/>
        <!-- Texture scales -->
        <path d="M 30 35 Q 60 115 90 35" fill="none" stroke="%23fda4af" stroke-width="1.5" opacity="0.45"/>
        <path d="M 20 55 Q 60 120 100 55" fill="none" stroke="%23fda4af" stroke-width="1.2" opacity="0.35"/>
        <circle cx="45" cy="40" r="14" fill="%23ffffff" opacity="0.18"/>
      </g>
      
      <!-- Bulb 2 -->
      <g filter="url(%23shadow)" transform="translate(320, 150)">
        <ellipse cx="62" cy="62" rx="59" ry="56" fill="url(%23onionGrad2)"/>
        <path d="M 55 8 Q 62 -12 70 8 Z" fill="%23854d0e"/>
        <path d="M 32 35 Q 62 120 92 35" fill="none" stroke="%23fecdd3" stroke-width="1.5" opacity="0.45"/>
        <circle cx="48" cy="42" r="15" fill="%23ffffff" opacity="0.2"/>
      </g>
      
      <!-- Bulb 3 -->
      <g filter="url(%23shadow)" transform="translate(500, 165)">
        <ellipse cx="58" cy="58" rx="56" ry="53" fill="url(%23onionGrad1)"/>
        <path d="M 50 8 Q 58 -8 66 8 Z" fill="%23854d0e"/>
        <path d="M 28 32 Q 58 112 88 32" fill="none" stroke="%23fda4af" stroke-width="1.5" opacity="0.45"/>
        <circle cx="42" cy="38" r="13" fill="%23ffffff" opacity="0.18"/>
      </g>
      
      <!-- Bulb 4 -->
      <g filter="url(%23shadow)" transform="translate(220, 290)">
        <ellipse cx="61" cy="61" rx="58" ry="55" fill="url(%23onionGrad2)"/>
        <path d="M 54 8 Q 61 -10 69 8 Z" fill="%23854d0e"/>
        <path d="M 31 35 Q 61 118 91 35" fill="none" stroke="%23fecdd3" stroke-width="1.5" opacity="0.4"/>
        <circle cx="46" cy="42" r="14" fill="%23ffffff" opacity="0.2"/>
      </g>

      <!-- Bulb 5 -->
      <g filter="url(%23shadow)" transform="translate(420, 295)">
        <ellipse cx="59" cy="59" rx="57" ry="54" fill="url(%23onionGrad1)"/>
        <path d="M 51 8 Q 59 -10 67 8 Z" fill="%23854d0e"/>
        <path d="M 29 33 Q 59 115 89 33" fill="none" stroke="%23fda4af" stroke-width="1.5" opacity="0.4"/>
        <circle cx="44" cy="40" r="14" fill="%23ffffff" opacity="0.2"/>
      </g>
      
      <!-- Watermark & Stamp -->
      <g transform="translate(540, 410)">
        <rect width="210" height="42" rx="8" fill="%2310b981" opacity="0.15" stroke="%2310b981" stroke-width="1.5"/>
        <text x="105" y="26" fill="%23065f46" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">AGMARK EXTRA CLASS</text>
      </g>
    </svg>`;
  }

  if (type === 'sprouted') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="bgS" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="%23f8fafc"/>
          <stop offset="100%" stop-color="%23e2e8f0"/>
        </radialGradient>
        <radialGradient id="onionGradS1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="%23f472b6"/>
          <stop offset="40%" stop-color="%239d174d"/>
          <stop offset="80%" stop-color="%234c0519"/>
        </radialGradient>
        <filter id="shadowS" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="%230f172a" flood-opacity="0.16"/>
        </filter>
        <pattern id="calibGridS" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23cbd5e1" stroke-width="0.75"/>
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(%23bgS)"/>
      <rect x="30" y="30" width="740" height="440" rx="12" fill="%23ffffff" stroke="%2394a3b8" stroke-width="2"/>
      <rect x="30" y="30" width="740" height="440" rx="12" fill="url(%23calibGridS)" opacity="0.6"/>
      
      <!-- Bulb with Prominent Green Sprout -->
      <g filter="url(%23shadowS)" transform="translate(180, 160)">
        <ellipse cx="60" cy="70" rx="55" ry="50" fill="url(%23onionGradS1)"/>
        <!-- Thick Neck -->
        <path d="M 46 22 L 48 -5 L 72 -5 L 74 22 Z" fill="%23a16207"/>
        <!-- Long Green Sprout -->
        <path d="M 52 -5 Q 40 -45 25 -70 Q 45 -48 60 -5 Z" fill="%2322c55e" stroke="%2315803d" stroke-width="1.5"/>
        <path d="M 62 -5 Q 68 -50 85 -75 Q 72 -45 68 -5 Z" fill="%234ade80" stroke="%2316a34a" stroke-width="1.5"/>
      </g>
      
      <!-- Bulb with Secondary Sprout -->
      <g filter="url(%23shadowS)" transform="translate(420, 150)">
        <ellipse cx="60" cy="70" rx="53" ry="48" fill="url(%23onionGradS1)"/>
        <path d="M 48 24 L 50 2 L 70 2 L 72 24 Z" fill="%23a16207"/>
        <path d="M 56 2 Q 52 -30 42 -52 Q 62 -30 66 2 Z" fill="%2322c55e" stroke="%2315803d" stroke-width="1.5"/>
      </g>

      <!-- Mechanical Damage bulb -->
      <g filter="url(%23shadowS)" transform="translate(300, 280)">
        <ellipse cx="60" cy="60" rx="54" ry="49" fill="url(%23onionGradS1)"/>
        <!-- Cut bruise -->
        <path d="M 35 45 Q 65 65 75 40" fill="none" stroke="%23ea580c" stroke-width="4" stroke-linecap="round"/>
        <path d="M 38 48 L 72 43" fill="%23f97316" opacity="0.3"/>
      </g>

      <g transform="translate(520, 410)">
        <rect width="230" height="42" rx="8" fill="%23f59e0b" opacity="0.15" stroke="%23f59e0b" stroke-width="1.5"/>
        <text x="115" y="26" fill="%23b45309" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">SPROUTED LOT - GRADE II</text>
      </g>
    </svg>`;
  }

  if (type === 'mold_reject') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="bgM" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="%23f8fafc"/>
          <stop offset="100%" stop-color="%23e2e8f0"/>
        </radialGradient>
        <radialGradient id="onionGradM" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="%23fb7185"/>
          <stop offset="40%" stop-color="%23881337"/>
          <stop offset="100%" stop-color="%232a030e"/>
        </radialGradient>
        <filter id="shadowM" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="%230f172a" flood-opacity="0.18"/>
        </filter>
        <pattern id="calibGridM" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23cbd5e1" stroke-width="0.75"/>
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(%23bgM)"/>
      <rect x="30" y="30" width="740" height="440" rx="12" fill="%23ffffff" stroke="%2394a3b8" stroke-width="2"/>
      <rect x="30" y="30" width="740" height="440" rx="12" fill="url(%23calibGridM)" opacity="0.6"/>
      
      <!-- Bulb with Black Mold (Aspergillus niger) -->
      <g filter="url(%23shadowM)" transform="translate(180, 170)">
        <ellipse cx="60" cy="60" rx="55" ry="50" fill="url(%23onionGradM)"/>
        <!-- Heavy Black mold patches -->
        <circle cx="50" cy="45" r="16" fill="%2309090b" opacity="0.9"/>
        <circle cx="68" cy="58" r="14" fill="%2318181b" opacity="0.85"/>
        <circle cx="38" cy="65" r="11" fill="%23000000" opacity="0.95"/>
        <path d="M 30 35 Q 50 40 70 30" stroke="%2318181b" stroke-width="8" opacity="0.8"/>
        <!-- Soft rot seepage -->
        <ellipse cx="55" cy="85" rx="35" ry="14" fill="%23713f12" opacity="0.65"/>
      </g>
      
      <!-- Second severely infected bulb -->
      <g filter="url(%23shadowM)" transform="translate(400, 160)">
        <ellipse cx="60" cy="60" rx="52" ry="48" fill="url(%23onionGradM)"/>
        <circle cx="45" cy="55" r="18" fill="%23020617" opacity="0.92"/>
        <circle cx="65" cy="45" r="15" fill="%230f172a" opacity="0.88"/>
      </g>
      
      <!-- Tiny under-sized bulb (<26mm) -->
      <g filter="url(%23shadowM)" transform="translate(320, 310)">
        <ellipse cx="30" cy="30" rx="25" ry="24" fill="url(%23onionGradM)"/>
        <text x="30" y="55" fill="%23ef4444" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">&lt;26mm</text>
      </g>

      <g transform="translate(510, 410)">
        <rect width="240" height="42" rx="8" fill="%23ef4444" opacity="0.15" stroke="%23ef4444" stroke-width="1.5"/>
        <text x="120" y="26" fill="%23991b1b" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">REJECTED (ASPERGILLUS)</text>
      </g>
    </svg>`;
  }

  // Default: Standard FAQ Grade 1
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="bgG" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="%23f8fafc"/>
        <stop offset="100%" stop-color="%23e2e8f0"/>
      </radialGradient>
      <radialGradient id="onionGradG1" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="%23fb7185"/>
        <stop offset="40%" stop-color="%23be123c"/>
        <stop offset="100%" stop-color="%234c0519"/>
      </radialGradient>
      <radialGradient id="onionGradG2" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="%23f472b6"/>
        <stop offset="40%" stop-color="%23a21caf"/>
        <stop offset="100%" stop-color="%234a044e"/>
      </radialGradient>
      <filter id="shadowG" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="%230f172a" flood-opacity="0.15"/>
      </filter>
      <pattern id="calibGridG" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23cbd5e1" stroke-width="0.75"/>
      </pattern>
    </defs>
    
    <rect width="100%" height="100%" fill="url(%23bgG)"/>
    <rect x="30" y="30" width="740" height="440" rx="12" fill="%23ffffff" stroke="%2394a3b8" stroke-width="2"/>
    <rect x="30" y="30" width="740" height="440" rx="12" fill="url(%23calibGridG)" opacity="0.6"/>

    <g transform="translate(60, 50)">
      <rect width="140" height="36" rx="6" fill="%230f172a" opacity="0.85"/>
      <line x1="12" y1="18" x2="62" y2="18" stroke="%2338bdf8" stroke-width="2.5"/>
      <line x1="12" y1="12" x2="12" y2="24" stroke="%2338bdf8" stroke-width="2.5"/>
      <line x1="62" y1="12" x2="62" y2="24" stroke="%2338bdf8" stroke-width="2.5"/>
      <text x="72" y="22" fill="%23ffffff" font-family="sans-serif" font-size="11" font-weight="bold">50mm CALIB</text>
    </g>

    <!-- Standard FAQ Onions -->
    <g filter="url(%23shadowG)" transform="translate(150, 160)">
      <ellipse cx="58" cy="58" rx="55" ry="52" fill="url(%23onionGradG1)"/>
      <path d="M 50 8 Q 58 -8 66 8 Z" fill="%23854d0e"/>
      <path d="M 28 35 Q 58 115 88 35" fill="none" stroke="%23fda4af" stroke-width="1.2" opacity="0.35"/>
    </g>
    
    <g filter="url(%23shadowG)" transform="translate(320, 150)">
      <ellipse cx="60" cy="60" rx="57" ry="54" fill="url(%23onionGradG2)"/>
      <path d="M 52 8 Q 60 -10 68 8 Z" fill="%23854d0e"/>
      <circle cx="45" cy="40" r="14" fill="%23ffffff" opacity="0.18"/>
    </g>

    <g filter="url(%23shadowG)" transform="translate(490, 165)">
      <ellipse cx="55" cy="55" rx="52" ry="49" fill="url(%23onionGradG1)"/>
      <path d="M 48 8 Q 55 -8 62 8 Z" fill="%23854d0e"/>
    </g>

    <g filter="url(%23shadowG)" transform="translate(240, 290)">
      <ellipse cx="56" cy="56" rx="54" ry="51" fill="url(%23onionGradG2)"/>
      <path d="M 49 8 Q 56 -9 63 8 Z" fill="%23854d0e"/>
    </g>

    <g filter="url(%23shadowG)" transform="translate(410, 285)">
      <ellipse cx="58" cy="58" rx="56" ry="53" fill="url(%23onionGradG1)"/>
      <path d="M 51 8 Q 58 -9 65 8 Z" fill="%23854d0e"/>
    </g>

    <g transform="translate(540, 410)">
      <rect width="210" height="42" rx="8" fill="%232563eb" opacity="0.15" stroke="%232563eb" stroke-width="1.5"/>
      <text x="105" y="26" fill="%231d4ed8" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">AGMARK GRADE I (FAQ)</text>
    </g>
  </svg>`;
}

export const SAMPLE_ONION_LOTS: SampleLot[] = [
  {
    id: "LOT-SPEC-58MM",
    title: "Single Specimen Bulb - Large Grade",
    description: "High-resolution optical assessment of single bulb (58.2mm). Sound neck seal (<8mm), intact pink-red scale, zero mold mycelium.",
    originMandi: "Lasalgaon APMC, Nashik",
    expectedGrade: "Grade Extra Class",
    expectedFaq: "FAQ Compliant",
    badgeColor: "emerald",
    bulbCount: 1,
    avgDiameter: "58.2 mm",
    imageUrl: singleOnionPhoto,
    defectSummary: "0.0% defects detected. 100% adherence to AGMARK Large Class (50-60mm) standards.",
    sampleTypeKey: "single_onion_specimen",
    farmer: {
      name: "Ramesh Baban Patil",
      kisanId: "MH-NSK-2026-88412",
      village: "Niphad, Nashik District",
      vehicleNo: "MH-15-EG-4912",
      weightQuintals: 48.0,
    },
  },
  {
    id: "LOT-MH-2026-4421",
    title: "Standard Buffer Sorting Tray (FAQ Lot)",
    description: "Inspection sorting tray of Indian red onions for central buffer stock. Uniform 52.8mm diameter, dry papery skins.",
    originMandi: "Pimpalgaon Baswant APMC",
    expectedGrade: "Grade I",
    expectedFaq: "FAQ Compliant",
    badgeColor: "blue",
    bulbCount: 5,
    avgDiameter: "52.8 mm",
    imageUrl: onionBatchPhoto,
    defectSummary: "3.8% cumulative defects (well within 5% Grade I threshold). 0.5% sprout trace, clean basal roots.",
    sampleTypeKey: "faq_grade1",
    farmer: {
      name: "Sopan Narhari Kute",
      kisanId: "MH-NSK-2026-62184",
      village: "Ozar, Dindori Taluka, Nashik",
      vehicleNo: "MH-15-DX-6719",
      weightQuintals: 46.0,
    },
  },
  {
    id: "LOT-MH-2026-7832",
    title: "Sprouted & Weather-Damaged Lot",
    description: "Post-monsoon harvest showing green sprout shoots in neck cavity and implement harvest cuts.",
    originMandi: "Solapur APMC Center",
    expectedGrade: "Grade II",
    expectedFaq: "Marginal FAQ",
    badgeColor: "amber",
    bulbCount: 3,
    avgDiameter: "48.2 mm",
    imageUrl: onionDefectPhoto,
    defectSummary: "8.6% cumulative defects. 6.8% sprouting, 1.5% cuts. Requires -₹180/q cleaning & aeration deduction.",
    sampleTypeKey: "sprouted_lot",
    farmer: {
      name: "Kailas Bhikaji Gite",
      kisanId: "MH-NSK-2026-44391",
      village: "Madha, Solapur District",
      vehicleNo: "MH-15-CV-8104",
      weightQuintals: 38.0,
    },
  },
  {
    id: "LOT-MH-2026-1193",
    title: "Black Mold Contaminated (Aspergillus niger)",
    description: "High relative humidity storage breakdown showing heavy black fungal colonies, neck rot softening, and under-sized bulbs.",
    originMandi: "Alwar Krishi Upaj Mandi",
    expectedGrade: "Sub-Standard / Rejected",
    expectedFaq: "Non-Compliant / Rejected",
    badgeColor: "rose",
    bulbCount: 3,
    avgDiameter: "44.1 mm",
    imageUrl: createSampleOnionSvg('mold_reject'),
    defectSummary: "18.2% defects. 12.4% rot/black mold (statutory limit 1%). Non-procured to protect central buffer stock.",
    sampleTypeKey: "black_mold_reject",
    farmer: {
      name: "Bhausaheb Dattatraya Jadhav",
      kisanId: "MH-NSK-2026-99214",
      village: "Tijara, Alwar District",
      vehicleNo: "MH-15-EE-1928",
      weightQuintals: 41.5,
    },
  },
  {
    id: "LOT-MH-2026-9104",
    title: "Premium Nashik Red - Export Grade",
    description: "Uniform equatorial diameter (56.4mm), deep anthocyanin pink skin, firm tight neck (<10mm), free from sprouts and pathogens.",
    originMandi: "Lasalgaon APMC, Nashik",
    expectedGrade: "Grade Extra Class",
    expectedFaq: "FAQ Compliant",
    badgeColor: "emerald",
    bulbCount: 5,
    avgDiameter: "56.4 mm",
    imageUrl: createSampleOnionSvg('extra_class'),
    defectSummary: "1.5% cumulative defects (below 2% AGMARK limit). Zero sprouting, 0.2% minor surface mold.",
    sampleTypeKey: "extra_class",
    farmer: {
      name: "Vishnu Tukaram Shinde",
      kisanId: "MH-NSK-2026-10492",
      village: "Vinchur, Niphad Taluka, Nashik",
      vehicleNo: "MH-15-AK-2930",
      weightQuintals: 52.5,
    },
  },
];
