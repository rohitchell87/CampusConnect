function Dashboard() {
  return (
    <section className="glass-card mx-auto max-w-6xl rounded-[2rem] border border-white/10 p-8 shadow-glass">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Student overview</h1>
        </div>
        <div className="rounded-full bg-slate-900/80 px-5 py-3 text-sm text-slate-300">Dark mode enabled</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {['Profile', 'Courses', 'Notifications'].map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20">
            <h2 className="text-xl font-semibold text-white">{item}</h2>
            <p className="mt-3 text-slate-400">Manage your {item.toLowerCase()} and check updates.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
