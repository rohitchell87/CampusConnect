function Profile() {
  return (
    <section className="glass-card mx-auto max-w-4xl rounded-[2rem] border border-white/10 p-8 shadow-glass">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">My profile</h1>
        <p className="mt-2 text-slate-400">View and manage your account details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Student details</p>
          <div className="mt-6 space-y-4 text-slate-300">
            <div>
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-1 text-lg font-medium text-white">Jane Doe</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-1 text-lg font-medium text-white">jane.doe@example.com</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Branch</p>
              <p className="mt-1 text-lg font-medium text-white">Computer Science</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Status</p>
          <div className="mt-6 space-y-4 text-slate-300">
            <div>
              <p className="text-sm text-slate-400">Year</p>
              <p className="mt-1 text-lg font-medium text-white">3</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Email verified</p>
              <p className="mt-1 text-lg font-medium text-white">Yes</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Account</p>
              <p className="mt-1 text-lg font-medium text-white">Active</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
