import { Link } from 'react-router-dom';

function Register() {
  return (
    <section className="glass-card mx-auto max-w-2xl rounded-[2rem] border border-white/10 p-8 shadow-glass">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Create an account</h1>
        <p className="mt-2 text-slate-400">Join CampusConnect and manage your campus profile.</p>
      </div>

      <form className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
            <span className="text-slate-400">Full name</span>
            <input
              name="fullName"
              type="text"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Jane Doe"
            />
          </label>
          <label className="block text-sm text-slate-300">
            <span className="text-slate-400">Email</span>
            <input
              name="email"
              type="email"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
            <span className="text-slate-400">Password</span>
            <input
              name="password"
              type="password"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Enter a password"
            />
          </label>
          <label className="block text-sm text-slate-300">
            <span className="text-slate-400">Branch</span>
            <input
              name="branch"
              type="text"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Computer Science"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-slate-300">
            <span className="text-slate-400">Year</span>
            <input
              name="year"
              type="number"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="3"
            />
          </label>
          <label className="block text-sm text-slate-300">
            <span className="text-slate-400">Gender</span>
            <input
              name="gender"
              type="text"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Female"
            />
          </label>
          <label className="block text-sm text-slate-300">
            <span className="text-slate-400">Profile photo URL</span>
            <input
              name="profilePhoto"
              type="text"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="https://..."
            />
          </label>
        </div>

        <label className="block text-sm text-slate-300">
          <span className="text-slate-400">Bio</span>
          <textarea
            name="bio"
            rows="4"
            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Tell us a little about yourself"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link className="text-sky-400 hover:text-sky-300" to="/login">
          Login
        </Link>
      </p>
    </section>
  );
}

export default Register;
