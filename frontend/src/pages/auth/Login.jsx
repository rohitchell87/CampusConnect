import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Login() {
  const { login, loading, requestPasswordReset, loginWithGoogle } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetStatus, setResetStatus] = useState('')

  const onSubmit = async (data) => {
    try {
      await login(data)
    } catch (_) {}
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
    } catch (_) {}
  }

  const handleResetSubmit = async (event) => {
    event.preventDefault()
    setResetStatus('')
    try {
      await requestPasswordReset(resetEmail)
      setResetStatus('If that email exists, we sent reset instructions.')
    } catch (_) {
      setResetStatus('Unable to send reset instructions. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#090B14] text-white">
      {/* Background art */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050509] via-[#060612] to-[#050509]" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(124,92,255,0.08), transparent 28%), radial-gradient(circle at 80% 70%, rgba(155,109,255,0.06), transparent 34%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(12,8,24,0.6))]" />
      </div>

      <div className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 items-center min-h-[calc(100vh-96px)]">
            {/* LEFT HERO */}
            <aside className="hidden lg:flex flex-col justify-center gap-8 pl-6">
              <div>
                <div className="h-16 w-16 rounded-[24px] bg-[rgba(255,255,255,0.03)] border border-white/6 flex items-center justify-center mb-6" style={{ boxShadow: '0 18px 40px rgba(124,92,255,0.06)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 L12 3 Z" /><path d="M12 13 L12 21" /><path d="M7 17 C9 18.5 15 18.5 17 17" /></svg>
                </div>
                <h1 className="text-5xl font-bold leading-tight">
                  Find your<br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C5CFF] to-[#9B6DFF]">Campus Match</span>.
                </h1>
                <p className="mt-4 text-lg text-[#A8A8B8] max-w-xl">Swipe, chat and connect with verified students from your college.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-md">
                <div className="flex items-start gap-4 bg-[rgba(20,20,30,0.6)] border border-[rgba(255,255,255,0.06)] rounded-[24px] p-4">
                  <div className="text-2xl">❤️</div>
                  <div>
                    <h4 className="font-semibold">Meaningful Matches</h4>
                    <p className="text-sm text-[#A8A8B8]">Connect with students sharing your interests.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-[rgba(20,20,30,0.6)] border border-[rgba(255,255,255,0.06)] rounded-[24px] p-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h4 className="font-semibold">Instant Chat</h4>
                    <p className="text-sm text-[#A8A8B8]">Start conversations with your matches.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-[rgba(20,20,30,0.6)] border border-[rgba(255,255,255,0.06)] rounded-[24px] p-4">
                  <div className="text-2xl">🎓</div>
                  <div>
                    <h4 className="font-semibold">Verified Campus</h4>
                    <p className="text-sm text-[#A8A8B8]">Only verified college students.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-[#A8A8B8] flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span>Your data is secure.</span>
              </div>
            </aside>

            {/* RIGHT - FORM */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-[24px] bg-[rgba(20,20,30,0.65)] border border-[rgba(255,255,255,0.08)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
                <div className="flex flex-col items-center text-center gap-3 mb-6">
                  <div className="h-16 w-16 rounded-[16px] bg-[rgba(255,255,255,0.03)] flex items-center justify-center" style={{ boxShadow: '0 12px 30px rgba(124,92,255,0.08)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 L12 3 Z" /><path d="M12 13 L12 21" /><path d="M7 17 C9 18.5 15 18.5 17 17" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
                  <p className="text-sm text-[#A8A8B8]">Sign in to continue your campus connections.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-xs text-[#A8A8B8] mb-2 block">Email</label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                      type="email"
                      placeholder="you@campus.edu"
                      className="w-full px-4 py-3 rounded-[16px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-white placeholder-[#666] outline-none focus:shadow-[0_0_20px_rgba(124,92,255,0.12)] transition"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[#A8A8B8] mb-2 block">Password</label>
                    <div className="relative">
                      <input
                        {...register('password', { required: 'Password is required' })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-[16px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-white placeholder-[#666] outline-none focus:shadow-[0_0_20px_rgba(124,92,255,0.12)] transition"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#8B5CF6]">{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-[#A8A8B8]">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-[#9B6DFF] hover:brightness-110">Forgot?</button>
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-3 rounded-[14px] bg-gradient-to-r from-[#7C5CFF] to-[#9B6DFF] font-semibold text-white shadow-[0_12px_40px_rgba(124,92,255,0.18)] hover:scale-[1.02] transition disabled:opacity-60">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
                    <div className="text-xs text-[#A8A8B8]">OR</div>
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
                  </div>

                  <button type="button" onClick={handleGoogle} className="w-full py-3 rounded-[14px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-white hover:brightness-105 transition flex items-center justify-center gap-3">
                    <span className="text-lg">🔵</span>
                    Continue with Google
                  </button>

                  <div className="text-center text-sm text-[#A8A8B8] pt-2">
                    Don't have an account? <Link to="/register" className="text-[#9B6DFF] font-semibold">Sign Up</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setForgotOpen(false)} />
          <div className="relative w-full max-w-md rounded-[20px] bg-[rgba(20,20,30,0.75)] border border-[rgba(255,255,255,0.06)] p-6 shadow-lg">
            <button type="button" onClick={() => setForgotOpen(false)} className="absolute right-4 top-4 text-2xl">×</button>
            <h3 className="text-xl font-semibold mb-2">Reset your password</h3>
            <p className="text-sm text-[#A8A8B8] mb-4">Enter your campus email and we'll send a secure reset link.</p>
            <form onSubmit={handleResetSubmit} className="space-y-3">
              <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} type="email" placeholder="you@campus.edu" className="w-full px-4 py-3 rounded-[12px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-white" />
              {resetStatus && <div className="text-sm text-[#A8A8B8] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-[12px] p-3">{resetStatus}</div>}
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-[12px] bg-gradient-to-r from-[#7C5CFF] to-[#9B6DFF]">{loading ? 'Sending...' : 'Send'}</button>
                <button type="button" onClick={() => setForgotOpen(false)} className="flex-1 py-3 rounded-[12px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
