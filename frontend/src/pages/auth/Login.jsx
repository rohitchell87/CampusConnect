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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Background art */}
      <div className="fixed inset-0 -z-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(var(--accent-rgb), 0.08), transparent 28%), radial-gradient(circle at 80% 70%, rgba(var(--accent-secondary-rgb), 0.06), transparent 34%)' }} />
      </div>

      <div className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 items-center min-h-[calc(100vh-96px)]">
            {/* LEFT HERO */}
            <aside className="hidden lg:flex flex-col justify-center gap-8 pl-6">
              <div>
                <div className="h-16 w-16 rounded-[24px] flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', boxShadow: '0 18px 40px rgba(var(--accent-rgb), 0.06)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 L12 3 Z" /><path d="M12 13 L12 21" /><path d="M7 17 C9 18.5 15 18.5 17 17" /></svg>
                </div>
                <h1 className="text-5xl font-bold leading-tight">
                  Find your<br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))' }}>Campus Match</span>.
                </h1>
                <p className="mt-4 text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>Swipe, chat and connect with verified students from your college.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-md">
                <div className="flex items-start gap-4 rounded-[24px] p-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <div className="text-2xl">❤️</div>
                  <div>
                    <h4 className="font-semibold">Meaningful Matches</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Connect with students sharing your interests.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-[24px] p-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <div className="text-2xl">💬</div>
                  <div>
                    <h4 className="font-semibold">Instant Chat</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Start conversations with your matches.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-[24px] p-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <div className="text-2xl">🎓</div>
                  <div>
                    <h4 className="font-semibold">Verified Campus</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Only verified college students.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-lg">🔒</span>
                <span>Your data is secure.</span>
              </div>
            </aside>

            {/* RIGHT - FORM */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-[24px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                <div className="flex flex-col items-center text-center gap-3 mb-6">
                  <div className="h-16 w-16 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: 'var(--surface-bg)', boxShadow: '0 12px 30px rgba(var(--accent-rgb), 0.08)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 L12 3 Z" /><path d="M12 13 L12 21" /><path d="M7 17 C9 18.5 15 18.5 17 17" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to continue your campus connections.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                      type="email"
                      placeholder="you@campus.edu"
                      className="w-full px-4 py-3 rounded-[16px] outline-none focus:shadow-[0_0_20px_rgba(var(--accent-secondary-rgb),0.12)] transition auth-placeholder"
                      style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                    />
                    {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs mb-2 block" style={{ color: 'var(--text-secondary)' }}>Password</label>
                    <div className="relative">
                      <input
                        {...register('password', { required: 'Password is required' })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-[16px] outline-none focus:shadow-[0_0_20px_rgba(var(--accent-secondary-rgb),0.12)] transition auth-placeholder"
                        style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--accent-secondary)' }}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setForgotOpen(true)} className="text-sm hover:brightness-110" style={{ color: 'var(--accent-secondary)' }}>Forgot?</button>
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-3 rounded-[14px] font-semibold text-white hover:scale-[1.02] transition disabled:opacity-60" style={{ backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))', boxShadow: '0 12px 40px rgba(var(--accent-secondary-rgb), 0.18)' }}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-primary)' }} />
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>OR</div>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-primary)' }} />
                  </div>

                  <button type="button" onClick={handleGoogle} className="w-full py-3 rounded-[14px] hover:brightness-105 transition flex items-center justify-center gap-3" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}>
                    <span className="text-lg">🔵</span>
                    Continue with Google
                  </button>

                  <div className="text-center text-sm pt-2" style={{ color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>Sign Up</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }} onClick={() => setForgotOpen(false)} />
          <div className="relative w-full max-w-md rounded-[20px] p-6 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <button type="button" onClick={() => setForgotOpen(false)} className="absolute right-4 top-4 text-2xl">×</button>
            <h3 className="text-xl font-semibold mb-2">Reset your password</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Enter your campus email and we'll send a secure reset link.</p>
            <form onSubmit={handleResetSubmit} className="space-y-3">
              <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} type="email" placeholder="you@campus.edu" className="w-full px-4 py-3 rounded-[12px] outline-none auth-placeholder" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
              {resetStatus && <div className="text-sm rounded-[12px] p-3" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)' }}>{resetStatus}</div>}
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-[12px] text-white" style={{ backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))' }}>{loading ? 'Sending...' : 'Send'}</button>
                <button type="button" onClick={() => setForgotOpen(false)} className="flex-1 py-3 rounded-[12px]" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
