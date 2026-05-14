function Header() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-40">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Trinethra Supervisor Feedback Analyzer
          </h1>
          <p className="mt-2 text-sm text-slate-600">Professional feedback analysis tool</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Psychology Tool
        </div>
      </div>
    </header>
  );
}

export default Header;
