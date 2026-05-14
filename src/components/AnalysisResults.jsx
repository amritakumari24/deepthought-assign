import DraftDisclaimer from './DraftDisclaimer.jsx';
import EvidenceSection from './EvidenceSection.jsx';
import ScoreSection from './ScoreSection.jsx';
import KPISection from './KPISection.jsx';
import GapSection from './GapSection.jsx';
import FollowUpSection from './FollowUpSection.jsx';

export default function AnalysisResults({ analysisData = {} }) {
  const {
    evidence = [],
    score = null,
    justification = '',
    kpis = [],
    gaps = [],
    followUpQuestions = []
  } = analysisData || {};

  return (
    <div className="space-y-6">
      <DraftDisclaimer />

      <EvidenceSection evidence={evidence} />
      <ScoreSection score={score} justification={justification} />
      <KPISection kpis={kpis} />
      <GapSection gaps={gaps} />
      <FollowUpSection followUpQuestions={followUpQuestions} />
    </div>
  );
}
