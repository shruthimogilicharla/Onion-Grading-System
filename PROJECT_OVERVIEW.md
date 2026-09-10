# Onion AI — Quality Assessment & Grading System
**Ministry of Consumer Affairs, Food & Public Distribution • Standardized APMC Procurement**

---

## 1. Executive Summary
**Onion AI** is an automated, AI-powered computer vision platform designed for agricultural procurement centers (APMC Mandis) operated by **NAFED** and **NCCF**. It eliminates human bias and grading disputes in onion procurement by instantly analyzing onion images, identifying physical defects, calculating fair MSP payouts according to statutory **AGMARK Rules 2004**, and issuing tamper-evident digital certificates.

---

## 2. The Core Problem It Solves
* **Subjective Eyeball Grading:** Mandi inspectors traditionally inspect lots in 3–5 seconds by hand, resulting in inaccurate grading, price deductions, and farmer grievances.
* **Inter-Center Inconsistency:** A farmer's lot graded as Grade I in Lasalgaon might get downgraded to Grade II in another mandi due to varying human standards (inter-mandi variance historically ~28%).
* **Post-Harvest Spoilage in Buffer Stock:** Undetected fungal mold (*Aspergillus niger*) or sprouting causes entire warehouse silos to rot during buffer storage, wasting public funds and causing retail price spikes.

---

## 3. How the System Works (4-Step Workflow)

```
 [1. Image Intake]       --> [2. AI Vision Engine]       --> [3. AGMARK Grading]      --> [4. Settlement & Cert]
 Camera / Upload / Tray      Detects bulbs & defects          Applies 2004 Gazette         MSP calculation, SHA-256
 High-res photo & scale      Measures diameter in mm          Extra / Grade I / II / Rej   QR Certificate & Audio
```

1. **Image Acquisition:** An inspector or farmer places a sample tray (or single bulb) under a standard camera with a calibration scale.
2. **AI Vision Analysis:**
   - Detects all onion bulbs with bounding boxes.
   - Measures equatorial diameter (mm) to determine size distribution (Extra Large >60mm, Large 50-60mm, Medium 40-50mm, Small 30-40mm, Under-sized <30mm).
   - Identifies biological and physical defects: **vegetative sprouting**, **black mold (*Aspergillus niger*)**, **mechanical cuts**, **double/twin bulbs**, **thick open neck**, and **loose papery skin**.
3. **Deterministic AGMARK Grading:**
   - **Grade Extra Class:** Defects < 2%, uniform size (>90%), tight neck, 0% rot/sprout (+₹150/q premium).
   - **Grade I (FAQ Compliant):** Standard Fair Average Quality, defects < 5%, sound neck (Base MSP ₹2,400/q).
   - **Grade II (Marginal FAQ):** Defects 5–10%, minor curing/sprout issues (-₹180/q cleaning deduction).
   - **Sub-Standard / Rejected:** Defects > 10% or mold > 3% (Rejected to protect central buffer stock).
4. **Transparent Farmer Settlement:**
   - Instantly calculates net payable rate and total lot payout.
   - Generates an official AGMARK certificate with a verifiable SHA-256 cryptographic QR code.
   - Plays a multilingual audio announcement (Hindi, Marathi, English) for accessibility.

---

## 4. Key Application Modules
| Module | Purpose |
| :--- | :--- |
| **Grading Terminal** | Live camera and image grading workspace. Overlays bounding boxes, displays diameter histograms, defect breakdown %, and instant MSP payout sheet. |
| **Dispute Resolution Portal** | Digital appellate tribunal for farmers to contest grading. Compares human inspector notes against AI pixel evidence to resolve disputes transparently without physical paperwork. |
| **Center Standardization** | Calibration dashboard monitoring inter-center variance across national procurement hubs (Lasalgaon, Pimpalgaon, Solapur, Alwar, Indore, Hubli, etc.), bringing dispute rates down to <1.2%. |
| **Lot Registry** | Central searchable ledger of all assessed batches with Kisan IDs, vehicle numbers, weight in quintals, quality scores, and exportable certificates. |
| **Certificate Modal** | Official printable AGMARK Inspection Certificate with cryptographic verification hash. |
| **Hackathon Pitch Deck** | SIH evaluator modal featuring 1-click live demo scenarios (Single Bulb, Multi-Bulb FAQ Tray, Sprouted Lot, and Black Mold Rejection). |

---

## 5. Technology Stack & Statutory Standards
* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
* **AI & Vision:** Google Gemini Vision (`@google/genai`) with structured JSON schema output + high-precision heuristic fallback engine.
* **Backend:** Node.js, Express, tsx.
* **Standards Enforced:**
  - *AGMARK Rules 2004* (Agricultural Produce Grading & Marking Act, 1937)
  - *BIS IS 1619:1989* (Bureau of Indian Standards for Table Onions)
  - *NAFED / NCCF Buffer Procurement Protocols* (Price Stabilization Fund)

---

## 6. How to Run Locally
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure API Key:**
   Add your Gemini API key in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Access the application:** Open `http://localhost:3000` in your web browser.
