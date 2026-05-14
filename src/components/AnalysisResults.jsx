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
    <div className="space-y-8">
      <DraftDisclaimer />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <EvidenceSection evidence={evidence} />
          <KPISection kpis={kpis} />
          <FollowUpSection followUpQuestions={followUpQuestions} />
        </div>

        <aside className="space-y-8">
          <ScoreSection score={score} justification={justification} />
          <GapSection gaps={gaps} />
        </aside>
      </section>
    </div>
  );
}
