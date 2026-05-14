export default function KPISection({ kpis = [] }) {
  const items = Array.isArray(kpis) ? kpis : [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">KPI Mapping</h2>
          <p className="mt-1 text-sm text-slate-600">AI-identified KPIs with reasons and evidence — adjust and validate based on your assessment.</p>
        </div>
        <div className="text-sm text-slate-600">{items.length.toLocaleString()} items</div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          No KPIs detected yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((kpi, idx) => (
            <article
              key={idx}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-slate-900">{kpi.name}</h3>
              {kpi.reason && (
                <p className="mt-2 text-sm text-slate-700">{kpi.reason}</p>
              )}

              <div className="mt-3">
                <h4 className="text-xs font-medium text-slate-800">Supporting evidence</h4>
                {kpi.evidence ? (
                  Array.isArray(kpi.evidence) ? (
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {kpi.evidence.map((ev, i) => (
                        <li key={i} className="wrap-break-word">“{ev}”</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 wrap-break-word text-sm text-slate-700">“{kpi.evidence}”</p>
                  )
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No supporting evidence provided.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
