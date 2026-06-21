import { Link } from 'react-router-dom';

function Landing() {
  return (
    <section className="glass-card mx-auto max-w-5xl rounded-[2rem] border border-white/10 px-8 py-16 shadow-glass">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-sm uppercase tracking-[0.35em] text-sky-300">CampusConnect</span>
          <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Your campus, connected.</h1>
          <p className="mt-6 text-slate-300 sm:text-lg">
            Explore student profiles, manage your campus community, and stay connected with a modern, secure portal built for colleges.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-300"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 p-8 shadow-glass">
          <div className="grid gap-6">
            <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-200 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Future-ready</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Student-first dashboard</h2>
              <p className="mt-4 text-slate-400">Quick access to academic tools, profiles, and campus events all in one secure interface.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-200 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Modern UI</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Glassmorphism design</h2>
              <p className="mt-4 text-slate-400">A polished, contemporary visual experience optimized for dark mode.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
