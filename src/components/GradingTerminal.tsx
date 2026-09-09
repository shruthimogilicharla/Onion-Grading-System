import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Maximize2,
  FileText,
  Printer,
  ChevronRight,
  RefreshCw,
  Scale,
  Eye,
  Sliders,
  AlertOctagon,
  ArrowUpRight,
  Image as ImageIcon,
  Check,
  Zap,
  Volume2,
  VolumeX,
  Trophy,
  Play,
  Smartphone,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { SAMPLE_ONION_LOTS, SampleLot } from '../data/sampleLots';
import { ProcurementCenter } from '../data/procurementCenters';
import { OnionAssessmentResult } from '../services/onionGradingEngine';
import { calculateLotShelfLife, StorageCondition, LotShelfLife } from '../services/shelfLifeEngine';
import singleOnionSamplePhoto from '../assets/images/single_onion_bulb_1788853186255.jpg';
import { SmsSimulator } from './SmsSimulator';

interface GradingTerminalProps {
  selectedCenter: ProcurementCenter;
  onOpenCertificate: (result: OnionAssessmentResult) => void;
  onFileDispute: (result: OnionAssessmentResult) => void;
  requestedLotId?: string | null;
  onClearRequestedLotId?: () => void;
  onOpenHackathonModal?: () => void;
}

export const GradingTerminal: React.FC<GradingTerminalProps> = ({
  selectedCenter,
  onOpenCertificate,
  onFileDispute,
  requestedLotId,
  onClearRequestedLotId,
  onOpenHackathonModal,
}) => {
  // Wizard Step
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Input mode
  const [inputMode, setInputMode] = useState<'sample' | 'upload' | 'camera'>('sample');
  const [uploadSimMode, setUploadSimMode] = useState<'good' | 'bad'>('good');
  const [selectedSample, setSelectedSample] = useState<SampleLot>(SAMPLE_ONION_LOTS[0]);

  // Storage Simulation
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('ambient');
  const [lotShelfLife, setLotShelfLife] = useState<LotShelfLife | null>(null);

  // Audio Announcer State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSmsSimulator, setShowSmsSimulator] = useState(false);

  // Uploaded or captured image state
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customImageMime, setCustomImageMime] = useState<string>('image/jpeg');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Optical viewport measurements for pixel-perfect bounding box alignment
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Calibration Scale
  const [referenceScale, setReferenceScale] = useState<'grid50' | 'coin10' | 'trayStandard'>('grid50');

  // Lot Details
  const [lotId, setLotId] = useState('LOT-2026-9104');
  const [farmerName, setFarmerName] = useState('Vishnu Tukaram Shinde');
  const [kisanId, setKisanId] = useState('MH-NSK-2026-10492');
  const [vehicleNo, setVehicleNo] = useState('MH-15-AK-2930');
  const [lotWeight, setLotWeight] = useState<number>(52.5);

  // Overlay visualization toggles
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showDefectTags, setShowDefectTags] = useState(true);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);

  // Loading & Assessment Results
  const [isGrading, setIsGrading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<OnionAssessmentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync lot form when sample changes
  const handleSelectSample = (sample: SampleLot) => {
    setSelectedSample(sample);
    setCustomImageBase64(null);
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setLotId(sample.id);
    setFarmerName(sample.farmer.name);
    setKisanId(sample.farmer.kisanId);
    setVehicleNo(sample.farmer.vehicleNo);
    setLotWeight(sample.farmer.weightQuintals);
    runGrading(sample.sampleTypeKey, null, null, sample);
  };

  // Launch pre-configured 1-click hackathon evaluation scenario
  const handleLaunchScenario = (scenarioKey: 'single_bulb' | 'batch_tray' | 'sprouted_lot' | 'rejected_mold') => {
    let targetId = 'LOT-SPEC-58MM';
    if (scenarioKey === 'batch_tray') targetId = 'LOT-MH-2026-4421';
    else if (scenarioKey === 'sprouted_lot') targetId = 'LOT-MH-2026-7832';
    else if (scenarioKey === 'rejected_mold') targetId = 'LOT-MH-2026-1193';

    const sample = SAMPLE_ONION_LOTS.find((l) => l.id === targetId) || SAMPLE_ONION_LOTS[0];
    setInputMode('sample');
    stopCamera();
    handleSelectSample(sample);
  };

  // Listen for programmatic scenario requests from external components (e.g. Pitch Modal)
  useEffect(() => {
    if (requestedLotId) {
      const sample = SAMPLE_ONION_LOTS.find((l) => l.id === requestedLotId);
      if (sample) {
        setInputMode('sample');
        stopCamera();
        handleSelectSample(sample);
      }
      if (onClearRequestedLotId) {
        onClearRequestedLotId();
      }
    }
  }, [requestedLotId, onClearRequestedLotId]);

  // Mandi Audio / PA Announcement in Hindi, Marathi, or English
  const playMandiAudio = (lang: 'hi' | 'mr' | 'en' = 'hi') => {
    if (!('speechSynthesis' in window) || !assessmentResult) return;
    window.speechSynthesis.cancel();

    let text = '';
    if (lang === 'hi') {
      const statusHindi =
        assessmentResult.faqStatus === 'FAQ Compliant'
          ? 'केंद्रीय बफर खरीद के लिए पूर्ण स्वीकृत।'
          : assessmentResult.faqStatus === 'Marginal FAQ'
          ? 'सफाई और छंटाई कटौती के साथ स्वीकृत।'
          : 'मानक से बाहर, लॉट अस्वीकृत।';
      text = `लॉट क्रमांक ${assessmentResult.lotId}। किसान: ${farmerName}। एगमार्क प्रमाणित ग्रेड: ${assessmentResult.overallGrade}। गुणवत्ता सूचकांक: ${assessmentResult.qualityScore} प्रतिशत। देय एमएसपी भाव: ${assessmentResult.pricing.netPayableRate} रुपये प्रति क्विंटल। ${statusHindi}`;
    } else if (lang === 'mr') {
      text = `लॉट क्रमांक ${assessmentResult.lotId}। शेतकरी: ${farmerName}। गुणवत्ता प्रत: ${assessmentResult.overallGrade}। गुणवत्ता गुण: ${assessmentResult.qualityScore} टक्के। निव्वळ देय भाव: ${assessmentResult.pricing.netPayableRate} रुपये प्रति क्विंटल. नाफेड खरेदीसाठी तपासणी पूर्ण झाली.`;
    } else {
      text = `Consignment Lot ID ${assessmentResult.lotId}. Farmer: ${farmerName}. AGMARK Certified Grade: ${assessmentResult.overallGrade}. Quality score: ${assessmentResult.qualityScore} percent. Net payable MSP rate: ${assessmentResult.pricing.netPayableRate} rupees per quintal. Status: ${assessmentResult.faqStatus}.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Process any File (from input, drag-and-drop, or paste)
  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image (JPG, PNG, or WEBP).');
      return;
    }
    setErrorMsg(null);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64 = resultStr.split(',')[1];
      setCustomImageBase64(base64);
      setCustomImageMime(file.type || 'image/jpeg');
      setInputMode('upload');
      runGrading(`upload_${uploadSimMode}`, base64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  }, [uploadSimMode]);

  // Window paste listener for easy clipboard photo testing (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processImageFile]);

  // Load single onion sample photo directly
  const handleLoadSingleOnionPhoto = async () => {
    try {
      setIsGrading(true);
      setErrorMsg(null);
      setUploadedFileName('single_onion_specimen_58mm.jpg');
      setUploadedFileSize('665.4 KB');

      const response = await fetch(singleOnionSamplePhoto);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        const base64 = resultStr.split(',')[1];
        setCustomImageBase64(base64);
        setCustomImageMime('image/jpeg');
        setInputMode('upload');
        runGrading('single_onion_specimen', base64, 'image/jpeg');
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error('Failed to load sample photo:', err);
      setIsGrading(false);
    }
  };

  // Start / stop camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      setCameraError('Unable to access camera. Please check camera permissions in browser settings.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const base64Data = dataUrl.split(',')[1];
      setCustomImageBase64(base64Data);
      setCustomImageMime('image/jpeg');
      setUploadedFileName(`camera_capture_${Date.now()}.jpg`);
      setUploadedFileSize('Live Frame');
      stopCamera();
      setInputMode('upload');
      runGrading(`upload_${uploadSimMode}`, base64Data, 'image/jpeg');
    }
  };

  // Handle file input change
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  // Execute Assessment
  const runGrading = async (
    sampleTypeKey?: string,
    imgBase64?: string | null,
    mime?: string | null,
    sampleObj?: SampleLot
  ) => {
    setIsGrading(true);
    setErrorMsg(null);
    setSelectedDetectionId(null);

    const activeSample = sampleObj || selectedSample;
    const payload = {
      imageBase64: imgBase64 || customImageBase64,
      mimeType: mime || customImageMime,
      sampleType: sampleTypeKey || (inputMode === 'sample' ? activeSample.sampleTypeKey : 'upload'),
      metadata: {
        lotId: lotId || activeSample.id,
        procurementCenter: selectedCenter.name,
        farmerName: farmerName || activeSample.farmer.name,
        kisanId: kisanId || activeSample.farmer.kisanId,
        vehicleNumber: vehicleNo || activeSample.farmer.vehicleNo,
        lotWeightQuintals: Number(lotWeight) || activeSample.farmer.weightQuintals,
        referenceScale:
          referenceScale === 'grid50'
            ? 'Standard APMC 50mm Calibration Grid'
            : referenceScale === 'coin10'
            ? 'Standard 10-Rupee Coin (27mm Reference)'
            : 'Standard Inspection Optical Tray',
      },
    };

    try {
      const response = await fetch('/api/grade-onion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Grading server returned status ${response.status}`);
      }

      const data: OnionAssessmentResult = await response.json();
      setAssessmentResult(data);
    } catch (err: any) {
      console.warn('Network call failed, applying client heuristic:', err);
      // Fallback in case of server offline
      const { generateDeterministicGrading } = await import('../services/onionGradingEngine');
      const fallbackResult = generateDeterministicGrading({
        lotId: payload.metadata.lotId,
        procurementCenter: payload.metadata.procurementCenter,
        farmerName: payload.metadata.farmerName,
        kisanId: payload.metadata.kisanId,
        vehicleNumber: payload.metadata.vehicleNumber,
        lotWeightQuintals: payload.metadata.lotWeightQuintals,
        sampleType: payload.sampleType,
      });
      setAssessmentResult(fallbackResult);
    } finally {
      setIsGrading(false);
    }
  };

  // Initial load
  useEffect(() => {
    runGrading(selectedSample.sampleTypeKey, null, null, selectedSample);
  }, [selectedCenter]);

  // Shelf life calculation
  useEffect(() => {
    if (assessmentResult) {
      setLotShelfLife(
        calculateLotShelfLife(
          assessmentResult.detections,
          assessmentResult.defectMetrics.rottingOrMoldPercent,
          storageCondition
        )
      );
    } else {
      setLotShelfLife(null);
    }
  }, [assessmentResult, storageCondition]);

  // Current display image source
  const currentImageSource =
    customImageBase64
      ? `data:${customImageMime};base64,${customImageBase64}`
      : selectedSample.imageUrl;

  const getGradeBadgeClasses = (grade?: string) => {
    switch (grade) {
      case 'Grade Extra Class':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400';
      case 'Grade I':
        return 'bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-400';
      case 'Grade II':
        return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400';
      case 'Sub-Standard / Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Wizard Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
          
          {[
            { step: 1, label: 'Intake' },
            { step: 2, label: 'Inspection' },
            { step: 3, label: 'Quality Report' },
            { step: 4, label: 'Pricing' }
          ].map((s) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(s.step as any)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= s.step ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-50' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${currentStep >= s.step ? 'text-emerald-700' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center Overview & Standard Calibration Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-xs">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {selectedCenter.name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {selectedCenter.agency} Buffer Station
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrated to Central Quality Standard Hash:{' '}
              <code className="text-slate-700 font-mono bg-slate-100 px-1 py-0.5 rounded">
                {selectedCenter.calibrationHash}
              </code>{' '}
              | Inter-center variance: <span className="font-bold text-emerald-600">0.94%</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
              Base MSP Benchmark
            </span>
            <span className="font-bold text-slate-900 text-sm">₹2,400 / Quintal</span>
          </div>

          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
              Daily Graded
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {selectedCenter.dailyProcurementQuintals.toLocaleString()} Quintals
            </span>
          </div>

          <button
            id="re-calibrate-btn"
            onClick={() => runGrading()}
            disabled={isGrading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGrading ? 'animate-spin' : ''}`} />
            <span>Re-Calibrate Optical Sensors</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - Wizard Steps */}
      <div className="flex flex-col gap-6">
        
        {/* STEP 1: CONSIGNMENT INTAKE */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600"/> Step 1: Consignment Intake
            </h3>
            <p className="text-sm text-slate-500">Enter the farmer and lot details before optical inspection.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Lot ID</label>
                <input type="text" value={lotId} onChange={(e) => setLotId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Farmer Name</label>
                <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Kisan ID / Aadhaar</label>
                <input type="text" value={kisanId} onChange={(e) => setKisanId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Net Weight (Quintals)</label>
                <input type="number" step="0.5" value={lotWeight} onChange={(e) => setLotWeight(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button onClick={() => setCurrentStep(2)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
                Proceed to Optical Inspection <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OPTICAL INSPECTION */}
        {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Camera className="w-5 h-5 text-emerald-600"/> Step 2: Optical Inspection Stage</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentStep(1)} className="text-sm font-semibold text-slate-500 hover:text-slate-800">Back</button>
              <button onClick={() => setCurrentStep(3)} disabled={!assessmentResult || isGrading} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-sm disabled:opacity-50 flex items-center gap-2 transition-colors">View Quality Report <ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
          {/* Capture / Select Mode Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                id="mode-sample-btn"
                onClick={() => {
                  stopCamera();
                  setInputMode('sample');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  inputMode === 'sample'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-rose-600" />
                <span>Sample Batches (5)</span>
              </button>

              <button
                id="mode-upload-btn"
                onClick={() => {
                  stopCamera();
                  setInputMode('upload');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  inputMode === 'upload'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Lot Photo</span>
              </button>

              <button
                id="mode-camera-btn"
                onClick={() => {
                  setInputMode('camera');
                  startCamera();
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  inputMode === 'camera'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Camera</span>
              </button>
            </div>

            {/* Reference Calibration scale */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Ref Scale:</span>
              <select
                id="ref-scale-select"
                value={referenceScale}
                onChange={(e) => setReferenceScale(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-medium text-xs focus:outline-none"
              >
                <option value="grid50">50mm APMC Grid</option>
                <option value="coin10">10-Rupee Coin (27mm)</option>
                <option value="trayStandard">Standard Sorting Tray</option>
              </select>
            </div>

            {/* Storage Simulation scale */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Storage:</span>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value as StorageCondition)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-medium text-xs focus:outline-none"
              >
                <option value="ambient">Ambient Mandi Shed (1x)</option>
                <option value="ventilated">Ventilated Chawl (1.4x)</option>
                <option value="cold_storage">Cold Storage 0-2°C (3.2x)</option>
              </select>
            </div>
          </div>

          {/* Sample Batches Quick Ribbon (Visible in sample mode) */}
          {inputMode === 'sample' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {SAMPLE_ONION_LOTS.map((lot) => (
                <button
                  key={lot.id}
                  id={`sample-lot-${lot.id}`}
                  onClick={() => handleSelectSample(lot)}
                  className={`text-left p-2.5 rounded-xl border transition-all ${
                    selectedSample.id === lot.id
                      ? 'border-rose-500 bg-rose-50/40 shadow-xs ring-1 ring-rose-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 truncate">
                      {lot.originMandi.split(' ')[0]}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        lot.expectedGrade.includes('Extra')
                          ? 'bg-emerald-100 text-emerald-800'
                          : lot.expectedGrade.includes('Grade I')
                          ? 'bg-blue-100 text-blue-800'
                          : lot.expectedGrade.includes('Grade II')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {lot.expectedGrade.replace('Grade ', '')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{lot.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {lot.avgDiameter} • {lot.bulbCount} bulbs
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Upload Input & Active Image Banner (Visible in upload mode) */}
          {inputMode === 'upload' && (
            <div className="space-y-3">
              {customImageBase64 ? (
                /* Compact Active Uploaded Image Bar */
                <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 border border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0 flex items-center justify-center">
                      <img
                        src={`data:${customImageMime};base64,${customImageBase64}`}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Photo Active in Vision Stage
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {uploadedFileSize || 'Custom Image'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 truncate mt-0.5">
                        {uploadedFileName || 'Uploaded Onion Inspection Photo'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="file-upload-replace"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 border border-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <span>Upload Another Photo</span>
                      <input
                        id="file-upload-replace"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => runGrading(undefined, customImageBase64, customImageMime)}
                      disabled={isGrading}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-60 shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGrading ? 'animate-spin' : ''}`} />
                      <span>{isGrading ? 'Grading...' : 'Re-Analyze'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* AI Upload Simulation Toggle */}
                  <div className="flex justify-end mb-2">
                    <div className="inline-flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button
                        onClick={() => setUploadSimMode('good')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          uploadSimMode === 'good'
                            ? 'bg-white shadow-xs text-emerald-600'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Simulate Good Quality
                      </button>
                      <button
                        onClick={() => setUploadSimMode('bad')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          uploadSimMode === 'bad'
                            ? 'bg-white shadow-xs text-rose-600'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Simulate Sprouted/Mold
                      </button>
                    </div>
                  </div>
                
                /* Primary Drag & Drop Zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      processImageFile(files[0]);
                    }
                  }}
                  className={`bg-white rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                    isDraggingOver
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Upload Picture of Onion or Onions
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Drag and drop your photo here, or click to choose from your device. Supports single bulb close-ups or lot inspection trays. You can also paste directly with{' '}
                    <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[10px]">
                      Ctrl + V
                    </kbd>
                    .
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <label
                      htmlFor="file-upload-input"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Onion Photo</span>
                      <input
                        id="file-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={handleLoadSingleOnionPhoto}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-rose-600" />
                      <span>Try Single Onion Photo (58mm)</span>
                    </button>
                  </div>
                </div>
                </>
              )}

              {/* Quick Preset Selector for Easy Testing */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Quick Test Profiles:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleLoadSingleOnionPhoto}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <span>Single Bulb (58mm)</span>
                  </button>
                  <button
                    onClick={() => handleSelectSample(SAMPLE_ONION_LOTS[0])}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <span>Tray of 14 Bulbs (FAQ)</span>
                  </button>
                  <button
                    onClick={() => handleSelectSample(SAMPLE_ONION_LOTS[2])}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <span>Sprouted Lot</span>
                  </button>
                  <button
                    onClick={() => handleSelectSample(SAMPLE_ONION_LOTS[3])}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <span>Black Mold Lot</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Camera Stage (Visible in camera mode) */}
          {inputMode === 'camera' && (
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative aspect-4/3 flex items-center justify-center">
              {cameraError ? (
                <div className="p-6 text-center text-rose-400 text-xs">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
                  <p>{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold"
                  >
                    Retry Camera
                  </button>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {/* Optical Crosshair Alignment Guide */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/20 m-6 rounded-lg flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-emerald-400/60 flex items-center justify-center text-[10px] text-emerald-300 font-mono">
                      APMC FOCUS RING
                    </div>
                  </div>

                  {/* Camera Control Bar */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-3">
                    <button
                      id="capture-photo-btn"
                      onClick={capturePhoto}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture & Grade Lot</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-full text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Main Inspection Optical Stage (for sample and uploaded images) */}
          {inputMode !== 'camera' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Stage Header toolbar */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-600" />
                    Optical Computer Vision Stage
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    {assessmentResult?.countDetected === 1
                      ? '1 Onion Bulb Detected'
                      : `${assessmentResult?.countDetected || selectedSample.bulbCount} Onions Detected`}
                  </span>
                  {customImageBase64 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      User Uploaded
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="toggle-bounding-boxes"
                    onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      showBoundingBoxes
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>Boxes ({showBoundingBoxes ? 'ON' : 'OFF'})</span>
                  </button>

                  <button
                    id="toggle-defect-tags"
                    onClick={() => setShowDefectTags(!showDefectTags)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      showDefectTags
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>Defects ({showDefectTags ? 'ON' : 'OFF'})</span>
                  </button>
                </div>
              </div>

              {/* Stage Viewport with Drag-and-Drop capability */}
              <div
                ref={containerRef}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    processImageFile(files[0]);
                  }
                }}
                className="relative min-h-[360px] max-h-[580px] w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none p-3"
              >
                {/* Visual Drag-over Overlay */}
                {isDraggingOver && (
                  <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs border-4 border-dashed border-emerald-400 z-50 flex flex-col items-center justify-center text-white p-6 text-center">
                    <Upload className="w-12 h-12 text-emerald-400 animate-bounce mb-2" />
                    <h3 className="text-lg font-bold">Drop Onion Photo Here</h3>
                    <p className="text-xs text-emerald-200 mt-1">
                      Release to instantly analyze with computer vision grading
                    </p>
                  </div>
                )}

                {/* The Image Stage Wrapper: shrink-wrapped precisely to visible image bounds */}
                <div className="relative inline-block max-w-full max-h-full">
                  {/* Inspected Image */}
                  <img
                    ref={imgRef}
                    src={currentImageSource}
                    alt="Onion Lot Inspection"
                    className="max-h-[520px] max-w-full w-auto h-auto block mx-auto object-contain pointer-events-none rounded shadow-md"
                  />

                  {/* High-Tech Animated Laser Scan Line during grading */}
                  {isGrading && (
                    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded">
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-pulse"></div>
                      <div className="w-full h-full bg-cyan-950/20 backdrop-brightness-110"></div>
                    </div>
                  )}

                  {/* AI Bounding Box Overlays (Mathematically positioned directly on the visible image coordinates) */}
                  {assessmentResult && showBoundingBoxes && (
                    <div className="absolute inset-0 pointer-events-auto">
                      {assessmentResult.detections.map((det, index) => {
                        const [ymin, xmin, ymax, xmax] = det.box2d;
                        // Handles normalized 0-1000 scale as well as 0-1 float coordinates
                        const topVal = ymin > 1 ? ymin / 10 : ymin * 100;
                        const leftVal = xmin > 1 ? xmin / 10 : xmin * 100;
                        const heightVal = ymax > 1 ? (ymax - ymin) / 10 : (ymax - ymin) * 100;
                        const widthVal = xmax > 1 ? (xmax - xmin) / 10 : (xmax - xmin) * 100;

                        const top = `${Math.max(0, Math.min(100, topVal))}%`;
                        const left = `${Math.max(0, Math.min(100, leftVal))}%`;
                        const height = `${Math.max(2, Math.min(100, heightVal))}%`;
                        const width = `${Math.max(2, Math.min(100, widthVal))}%`;

                        const isSelected = selectedDetectionId === det.id;
                        const bulbLife = lotShelfLife?.bulbMetrics[index];

                        let borderColor = 'border-blue-400 bg-blue-500/10 text-blue-300';
                        let badgeBg = 'bg-blue-600 text-white';

                        if (bulbLife) {
                          if (bulbLife.remainingDays <= 7) {
                            borderColor = 'border-rose-500 bg-rose-600/20 text-rose-300';
                            badgeBg = 'bg-rose-700 text-white';
                          } else if (bulbLife.remainingDays <= 21) {
                            borderColor = 'border-amber-500 bg-amber-600/20 text-amber-300';
                            badgeBg = 'bg-amber-600 text-white';
                          } else {
                            borderColor = 'border-emerald-500 bg-emerald-600/20 text-emerald-300';
                            badgeBg = 'bg-emerald-600 text-white';
                          }
                        } else {
                          if (det.type === 'sprout') {
                            borderColor = 'border-emerald-400 bg-emerald-500/15 text-emerald-300';
                            badgeBg = 'bg-emerald-600 text-white';
                          } else if (det.type === 'mold') {
                            borderColor = 'border-rose-500 bg-rose-600/20 text-rose-300';
                            badgeBg = 'bg-rose-700 text-white';
                          } else if (det.type === 'mechanical') {
                            borderColor = 'border-amber-400 bg-amber-500/15 text-amber-300';
                            badgeBg = 'bg-amber-600 text-white';
                          } else if (det.type === 'double' || det.type === 'thick_neck') {
                            borderColor = 'border-purple-400 bg-purple-500/15 text-purple-300';
                            badgeBg = 'bg-purple-600 text-white';
                          } else if (det.type === 'under_size') {
                            borderColor = 'border-red-500 bg-red-500/20 text-red-300';
                            badgeBg = 'bg-red-600 text-white';
                          }
                        }

                        return (
                          <div
                            key={det.id}
                            onClick={() => setSelectedDetectionId(isSelected ? null : det.id)}
                            style={{ top, left, width, height }}
                            className={`absolute border-[3px] rounded-[50%] cursor-pointer transition-all ${borderColor} ${
                              isSelected ? 'ring-4 ring-amber-400 z-30 scale-[1.02]' : 'hover:scale-[1.01]'
                            }`}
                          >
                            {/* Label tag */}
                            {showDefectTags && (
                              <div
                                className={`absolute -top-6 left-0 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 flex items-center gap-1 ${badgeBg}`}
                              >
                                <span>{det.label}</span>
                                {det.estimatedDiameterMm && (
                                  <span className="opacity-90">({det.estimatedDiameterMm}mm)</span>
                                )}
                                {bulbLife && (
                                  <span className="opacity-90">| RSL: {bulbLife.remainingDays}d | Exp: {bulbLife.endDate}</span>
                                )}
                              </div>
                            )}

                            {/* Selected popup preview */}
                            {isSelected && (
                              <div className="absolute top-full left-0 mt-1 z-40 bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs w-52 pointer-events-none border border-slate-700">
                                <p className="font-bold text-amber-300">{det.label}</p>
                                <p className="text-[11px] text-slate-300 mt-0.5">
                                  Diam: {det.estimatedDiameterMm} mm • Conf: {Math.round(det.confidence * 100)}%
                                </p>
                                {det.note && (
                                  <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                                    {det.note}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Grading In Progress Overlay */}
                {isGrading && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white z-40 p-4 text-center">
                    <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
                    <h3 className="text-base font-bold text-white">
                      Autonomous Quality Grading in Progress...
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-sm">
                      Executing computer vision diameter segmentation, neck curing analysis, and AGMARK
                      defects audit for {selectedCenter.name}.
                    </p>
                  </div>
                )}
              </div>

              {/* Stage Footer: Selected Detection Details */}
              {selectedDetectionId && assessmentResult && (
                <div className="p-3 bg-amber-50/70 border-t border-amber-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-slate-800">
                      Bulb Inspector: {assessmentResult.detections.find((d) => d.id === selectedDetectionId)?.label}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">
                      {assessmentResult.detections.find((d) => d.id === selectedDetectionId)?.note}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDetectionId(null)}
                    className="text-amber-800 font-semibold hover:underline"
                  >
                    Clear Focus
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Proceed to Step 3 */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setCurrentStep(3)}
              disabled={isGrading || !assessmentResult}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              Proceed to Quality Report
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
        )}

        {/* STEP 3: QUALITY REPORT */}
        {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-600"/> Step 3: Quality & AGMARK Report</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentStep(2)} className="text-sm font-semibold text-slate-500 hover:text-slate-800">Back</button>
              <button onClick={() => setCurrentStep(4)} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-sm flex items-center gap-2 transition-colors">Pricing & Settlement <ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
          
          {assessmentResult ? (
            <>
              {/* Primary AGMARK Grade Verdict Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Standardized Quality Verdict
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                      {assessmentResult.overallGrade}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getGradeBadgeClasses(
                        assessmentResult.overallGrade
                      )}`}
                    >
                      {assessmentResult.faqStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Score: {assessmentResult.qualityScore}/100
                    </span>
                  </div>
                </div>

                {/* Score Progress Gauge */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Quality Index</span>
                    <span className="font-bold text-slate-900">{assessmentResult.qualityScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${assessmentResult.qualityScore}%` }}
                      className={`h-full transition-all duration-700 ${
                        assessmentResult.qualityScore >= 90
                          ? 'bg-emerald-600'
                          : assessmentResult.qualityScore >= 80
                          ? 'bg-blue-600'
                          : assessmentResult.qualityScore >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Quick Physical Summary Badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Avg Diameter</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      {assessmentResult.avgDiameterMm} mm
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Defects</span>
                    <span
                      className={`font-bold text-xs sm:text-sm ${
                        assessmentResult.defectMetrics.totalDefectPercent <= 2
                          ? 'text-emerald-700'
                          : assessmentResult.defectMetrics.totalDefectPercent <= 5
                          ? 'text-blue-700'
                          : assessmentResult.defectMetrics.totalDefectPercent <= 10
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {assessmentResult.defectMetrics.totalDefectPercent}%
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Uniformity</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      {assessmentResult.sizeDistribution.uniformityScore}%
                    </span>
                  </div>
                </div>

                {/* Mandi PA Audio Announcer (किसान ऑडियो उद्घोषणा) */}
                <div className="mt-4 p-3 bg-slate-900 rounded-xl text-white flex flex-wrap items-center justify-between gap-3 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                      <Volume2 className={`w-4 h-4 text-amber-400 ${isSpeaking ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-amber-300">Mandi Audio PA Announcer</span>
                        {isSpeaking && (
                          <span className="text-[9px] bg-rose-600 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                            SPEAKING...
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Voice broadcast of grading verdict & MSP payout in farmer's local language
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id="btn-voice-hindi"
                      onClick={() => playMandiAudio('hi')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Play Hindi Announcement"
                    >
                      <Play className="w-3 h-3 text-amber-400" />
                      <span>🇮🇳 हिन्दी</span>
                    </button>
                    <button
                      id="btn-voice-marathi"
                      onClick={() => playMandiAudio('mr')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Play Marathi Announcement"
                    >
                      <Play className="w-3 h-3 text-amber-400" />
                      <span>मराठी</span>
                    </button>
                    <button
                      id="btn-voice-english"
                      onClick={() => playMandiAudio('en')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Play English Announcement"
                    >
                      <Play className="w-3 h-3 text-amber-400" />
                      <span>English</span>
                    </button>
                    {isSpeaking && (
                      <button
                        id="btn-voice-stop"
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            setIsSpeaking(false);
                          }
                        }}
                        className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded border border-rose-800 transition-colors cursor-pointer"
                        title="Stop audio"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Single Bulb Specimen Deep-Dive Card (Visible when 1 onion is detected) */}
              {assessmentResult.countDetected === 1 && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Single Bulb Specimen Assessment
                    </span>
                    <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Ø {assessmentResult.avgDiameterMm} mm
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-emerald-200/60">
                    <div>
                      <span className="text-slate-500 block">AGMARK Size Class:</span>
                      <span className="font-semibold text-slate-800">
                        {assessmentResult.avgDiameterMm >= 60
                          ? 'Extra Large (> 60mm)'
                          : assessmentResult.avgDiameterMm >= 50
                          ? 'Large (50 - 60mm)'
                          : assessmentResult.avgDiameterMm >= 40
                          ? 'Medium (40 - 50mm)'
                          : 'Small (30 - 40mm)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Neck Curing:</span>
                      <span className="font-semibold text-slate-800">Tight & Dry Sealed</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Outer Skin Tunic:</span>
                      <span className="font-semibold text-slate-800">
                        {assessmentResult.defectMetrics.mechanicalDamagePercent > 0
                          ? `${assessmentResult.defectMetrics.mechanicalDamagePercent}% Minor Cracking`
                          : 'Intact Papery Scale'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Biological Defect:</span>
                      <span className="font-semibold text-emerald-700">
                        {assessmentResult.defectMetrics.rotAndMoldPercent === 0 &&
                        assessmentResult.defectMetrics.sproutedPercent === 0
                          ? 'Clear (0% Sprout / Mold)'
                          : 'Defect Flagged'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Size Distribution Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Equatorial Size Distribution</span>
                  <span className="text-[10px] text-slate-400 font-normal">AGMARK Size Classes</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Extra Large (&gt; 60mm)</span>
                      <span className="font-bold text-slate-900">{assessmentResult.sizeDistribution.extraLarge}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${assessmentResult.sizeDistribution.extraLarge}%` }}
                        className="h-full bg-emerald-500"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Large (50 - 60mm)</span>
                      <span className="font-bold text-slate-900">{assessmentResult.sizeDistribution.large}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${assessmentResult.sizeDistribution.large}%` }}
                        className="h-full bg-blue-500"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Medium (40 - 50mm)</span>
                      <span className="font-bold text-slate-900">{assessmentResult.sizeDistribution.medium}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${assessmentResult.sizeDistribution.medium}%` }}
                        className="h-full bg-indigo-500"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Small (30 - 40mm)</span>
                      <span className="font-bold text-slate-900">{assessmentResult.sizeDistribution.small}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${assessmentResult.sizeDistribution.small}%` }}
                        className="h-full bg-amber-500"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span className="text-rose-600 font-medium">Under-sized (&lt; 30mm)</span>
                      <span className="font-bold text-rose-600">{assessmentResult.sizeDistribution.underSized}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${assessmentResult.sizeDistribution.underSized}%` }}
                        className="h-full bg-rose-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Defect Tolerance Audit Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Defect Density vs AGMARK Ceilings</span>
                  <span className="text-[10px] text-slate-400 font-normal">Statutory Tolerance</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                        <th className="py-1.5 font-medium">Defect Type</th>
                        <th className="py-1.5 font-medium text-right">Detected</th>
                        <th className="py-1.5 font-medium text-right">Tolerance</th>
                        <th className="py-1.5 font-medium text-right">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-1.5 text-slate-800 font-medium">Sprouting (Vegetative)</td>
                        <td className="py-1.5 text-right font-semibold">
                          {assessmentResult.defectMetrics.sproutingPercent}%
                        </td>
                        <td className="py-1.5 text-right text-slate-500">&le; 2.0%</td>
                        <td className="py-1.5 text-right">
                          {assessmentResult.defectMetrics.sproutingPercent <= 2.0 ? (
                            <span className="text-emerald-600 font-bold">Pass</span>
                          ) : assessmentResult.defectMetrics.sproutingPercent <= 10.0 ? (
                            <span className="text-amber-600 font-bold">Grade II</span>
                          ) : (
                            <span className="text-rose-600 font-bold">Breached</span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-1.5 text-slate-800 font-medium">Black Mold & Rot</td>
                        <td className="py-1.5 text-right font-semibold">
                          {assessmentResult.defectMetrics.rottingOrMoldPercent}%
                        </td>
                        <td className="py-1.5 text-right text-slate-500">&le; 1.0%</td>
                        <td className="py-1.5 text-right">
                          {assessmentResult.defectMetrics.rottingOrMoldPercent <= 1.0 ? (
                            <span className="text-emerald-600 font-bold">Pass</span>
                          ) : (
                            <span className="text-rose-600 font-bold">Rejected</span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-1.5 text-slate-800 font-medium">Doubles / Split Bulbs</td>
                        <td className="py-1.5 text-right font-semibold">
                          {assessmentResult.defectMetrics.doublesOrMalformedPercent}%
                        </td>
                        <td className="py-1.5 text-right text-slate-500">&le; 5.0%</td>
                        <td className="py-1.5 text-right">
                          {assessmentResult.defectMetrics.doublesOrMalformedPercent <= 5.0 ? (
                            <span className="text-emerald-600 font-bold">Pass</span>
                          ) : (
                            <span className="text-amber-600 font-bold">Deduct</span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-1.5 text-slate-800 font-medium">Mechanical Damage / Cuts</td>
                        <td className="py-1.5 text-right font-semibold">
                          {assessmentResult.defectMetrics.mechanicalDamagePercent}%
                        </td>
                        <td className="py-1.5 text-right text-slate-500">&le; 3.0%</td>
                        <td className="py-1.5 text-right">
                          {assessmentResult.defectMetrics.mechanicalDamagePercent <= 3.0 ? (
                            <span className="text-emerald-600 font-bold">Pass</span>
                          ) : (
                            <span className="text-amber-600 font-bold">Tolerated</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Proceed to Step 4 */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  Proceed to Pricing & Settlement
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <Sparkles className="w-8 h-8 mb-3 opacity-50" />
              <p>No assessment result generated yet.</p>
            </div>
          )}
        </div>
        )}

        {/* STEP 4: PRICING & SETTLEMENT */}
        {currentStep === 4 && (
          assessmentResult ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm">
            <h3 className="font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-amber-400"/> Step 4: Pricing & Settlement</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentStep(3)} className="text-sm font-semibold text-slate-400 hover:text-white">Back</button>
              <button onClick={() => setCurrentStep(1)} className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-900 rounded font-bold text-sm flex items-center gap-2 transition-colors">Start New Intake <RefreshCw className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Transparent Price Settlement Card */}
              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Procurement Rate Settlement
                    </span>
                    <h4 className="text-sm font-bold text-white">Objective Payment Calculation</h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                    Zero Discretion
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Base MSP Rate (Benchmark):</span>
                    <span className="font-mono font-bold">₹{assessmentResult.pricing.baseMspRate} / Qtl</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Grade Differential:</span>
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                        assessmentResult.pricing.gradePremiumOrPenalty > 0
                          ? 'text-emerald-400 bg-emerald-950/60'
                          : assessmentResult.pricing.gradePremiumOrPenalty < 0
                          ? 'text-amber-400 bg-amber-950/60'
                          : 'text-slate-400'
                      }`}
                    >
                      {assessmentResult.pricing.gradePremiumOrPenalty > 0
                        ? `+₹${assessmentResult.pricing.gradePremiumOrPenalty}`
                        : assessmentResult.pricing.gradePremiumOrPenalty < 0
                        ? `-₹${Math.abs(assessmentResult.pricing.gradePremiumOrPenalty)}`
                        : '₹0 (Standard)'}{' '}
                      / Qtl
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Lot Net Weight:</span>
                    <span className="font-mono font-bold">{assessmentResult.lotWeightQuintals} Quintals</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Final Procurement Rate</span>
                      <span className="text-base sm:text-lg font-bold text-white font-mono">
                        ₹{assessmentResult.pricing.netPayableRate}
                        <span className="text-xs text-slate-400 font-normal"> / Qtl</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-amber-300 block font-medium">Total Net Payable</span>
                      <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                        ₹{assessmentResult.pricing.estimatedTotalPayout.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Lot Expiry Info */}
                  {lotShelfLife && (
                    <div className="mt-4 p-3 bg-emerald-950/40 rounded border border-emerald-900/50 flex flex-col sm:flex-row justify-between items-center gap-2">
                      <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Recommended Buffer Safe Till:</span>
                      <span className="text-white font-mono font-bold text-sm bg-emerald-900/60 px-2 py-1 rounded">
                        {lotShelfLife.lotExpiryDate} ({lotShelfLife.lotSafeStorageDays} days)
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800">
                  <button
                    id="open-cert-btn"
                    onClick={() => onOpenCertificate(assessmentResult)}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Issue Certificate</span>
                  </button>

                  <button
                    onClick={() => setShowSmsSimulator(true)}
                    className="w-full py-2.5 px-3 bg-[#075e54] hover:bg-[#128c7e] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Send E-Receipt</span>
                  </button>

                  <button
                    id="raise-dispute-btn"
                    onClick={() => onFileDispute(assessmentResult)}
                    className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dispute Grade</span>
                  </button>
                </div>
              </div>

              {/* Explainable AI Observations */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Explainable AGMARK Compliance Notes
                </h4>
                <ul className="space-y-1.5 text-slate-600">
                  {assessmentResult.explainableObservations.map((obs, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-mono text-[10px] mt-0.5">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>
        </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <CreditCard className="w-8 h-8 mb-3 opacity-50" />
              <p>Complete grading to view pricing.</p>
            </div>
          )
        )}
      </div>

      {showSmsSimulator && assessmentResult && (
        <SmsSimulator
          result={assessmentResult}
          farmerName={farmerName}
          onClose={() => setShowSmsSimulator(false)}
        />
      )}
    </div>
  );
};
