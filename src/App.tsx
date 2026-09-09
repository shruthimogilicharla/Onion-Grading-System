/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { GradingTerminal } from './components/GradingTerminal';
import { DisputeResolution } from './components/DisputeResolution';
import { CenterStandardization } from './components/CenterStandardization';
import { LotRegistry } from './components/LotRegistry';
import { CertificateModal } from './components/CertificateModal';
import { HackathonPitchModal } from './components/HackathonPitchModal';
import { AgmarkChatbot } from './components/AgmarkChatbot';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PROCUREMENT_CENTERS, ProcurementCenter } from './data/procurementCenters';
import { OnionAssessmentResult, generateDeterministicGrading } from './services/onionGradingEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'disputes' | 'calibration' | 'registry' | 'analytics'>('terminal');
  const [selectedCenter, setSelectedCenter] = useState<ProcurementCenter>(PROCUREMENT_CENTERS[0]);
  
  // Hackathon presentation modal
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [requestedLotId, setRequestedLotId] = useState<string | null>(null);

  // Certificate view modal state
  const [certificateResult, setCertificateResult] = useState<OnionAssessmentResult | null>(null);

  // Dispute filing bridge
  const [disputePrefill, setDisputePrefill] = useState<OnionAssessmentResult | null>(null);

  const handleOpenCertificate = (result: OnionAssessmentResult) => {
    setCertificateResult(result);
  };

  const handleFileDispute = (result: OnionAssessmentResult) => {
    setDisputePrefill(result);
    setActiveTab('disputes');
  };

  const handleLaunchDemoScenario = (scenarioKey: 'single_bulb' | 'batch_tray' | 'sprouted_lot' | 'rejected_mold') => {
    let targetLotId = 'LOT-SPEC-58MM';
    if (scenarioKey === 'batch_tray') targetLotId = 'LOT-MH-2026-4421';
    else if (scenarioKey === 'sprouted_lot') targetLotId = 'LOT-MH-2026-7832';
    else if (scenarioKey === 'rejected_mold') targetLotId = 'LOT-MH-2026-1193';

    setRequestedLotId(targetLotId);
    setActiveTab('terminal');
    setShowHackathonModal(false);
  };

  const handleSelectLotFromRegistry = (lot: any) => {
    // Generate full certificate data for registry item
    const fullResult = generateDeterministicGrading({
      lotId: lot.lotId,
      procurementCenter: lot.procurementCenter,
      farmerName: lot.farmerName,
      kisanId: lot.kisanId,
      lotWeightQuintals: lot.weightQuintals,
      sampleType: lot.grade.includes('Extra')
        ? 'extra_class'
        : lot.grade.includes('Grade II')
        ? 'sprouted_lot'
        : lot.grade.includes('Rejected')
        ? 'black_mold_reject'
        : 'faq_grade1',
    });
    setCertificateResult(fullResult);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative">
      {/* Universal Ministry Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCenter={selectedCenter}
        onSelectCenter={setSelectedCenter}
        onOpenHackathonModal={() => setShowHackathonModal(true)}
      />

      {/* Main Workspace View */}
      <main className="flex-1 pb-16">
        {activeTab === 'terminal' && (
          <GradingTerminal
            selectedCenter={selectedCenter}
            onOpenCertificate={handleOpenCertificate}
            onFileDispute={handleFileDispute}
            requestedLotId={requestedLotId}
            onClearRequestedLotId={() => setRequestedLotId(null)}
            onOpenHackathonModal={() => setShowHackathonModal(true)}
          />
        )}

        {activeTab === 'disputes' && (
          <DisputeResolution
            prefillFromAssessment={disputePrefill}
            onClearPrefill={() => setDisputePrefill(null)}
          />
        )}

        {activeTab === 'calibration' && <CenterStandardization />}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'registry' && (
          <LotRegistry onSelectLotToView={handleSelectLotFromRegistry} />
        )}
      </main>

      {/* Official AGMARK Quality Certificate Modal */}
      {certificateResult && (
        <CertificateModal
          result={certificateResult}
          onClose={() => setCertificateResult(null)}
        />
      )}

      {/* Smart India Hackathon Pitch & Evaluation Modal */}
      {showHackathonModal && (
        <HackathonPitchModal
          onClose={() => setShowHackathonModal(false)}
          onLaunchDemoScenario={handleLaunchDemoScenario}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setShowHackathonModal(false);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-800">
              Onion AI • Automated Quality Assessment & Grading System
            </p>
            <p className="text-slate-400 mt-0.5">
              Ministry of Consumer Affairs, Food & Public Distribution • Standardized Onion Quality Assessment
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>AGMARK Rules 2004</span>
            <span>•</span>
            <span>BIS IS 1619:1989</span>
            <span>•</span>
            <span>NAFED / NCCF Buffer Sourcing</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Widget */}
      <AgmarkChatbot />
    </div>
  );
}
