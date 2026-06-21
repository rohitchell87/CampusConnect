import { Link } from 'react-router-dom';

function Login() {
  return (
    <section className="glass-card mx-auto max-w-2xl rounded-[2rem] border border-white/10 p-8 shadow-glass">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-slate-400">Login to access your CampusConnect dashboard.</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link className="text-sky-400 hover:text-sky-300" to="/register">
          Register
        </Link>
      </p>
    </section>
  );
}

export default Login;
