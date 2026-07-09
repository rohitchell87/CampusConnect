import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Register() {
  const { register: reg, handleSubmit, formState: { errors } } = useForm()
  const { register: doRegister, loading } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      await doRegister(data)
    } catch (e) {
      console.error('Register error:', e.response?.data)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="fixed inset-0 -z-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(var(--accent-rgb), 0.08), transparent 28%), radial-gradient(circle at 80% 70%, rgba(var(--accent-secondary-rgb), 0.06), transparent 34%)' }} />
      </div>

      <div className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] gap-6 items-center min-h-[calc(100vh-64px)]">
            <motion.aside initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="hidden lg:flex flex-col justify-center gap-6 pl-6 relative overflow-hidden">
              <div className="pointer-events-none absolute -left-10 top-16 h-24 w-24 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.08)' }} />
              <div className="pointer-events-none absolute right-6 top-32 h-14 w-14 rounded-full border" style={{ borderColor: 'rgba(var(--accent-secondary-rgb), 0.15)' }} />
              <div className="pointer-events-none absolute left-20 bottom-14 text-[24px] opacity-10" style={{ color: 'var(--accent-secondary)' }}>♡</div>
              <div>
                <div className="h-14 w-14 rounded-[20px] flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', boxShadow: '0 18px 40px rgba(var(--accent-rgb), 0.06)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 L12 3 Z" /><path d="M12 13 L12 21" /><path d="M7 17 C9 18.5 15 18.5 17 17" /></svg>
                </div>
                <h1 className="text-4xl font-bold leading-tight">
                  Join the<br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))' }}>Campus Community</span>.
                </h1>
                <p className="mt-3 text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>Start meeting verified students from your college.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 max-w-md">
                <div className="flex items-start gap-3 rounded-[20px] p-3" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <div className="text-xl">⚡</div>
                  <div>
                    <h4 className="font-semibold text-sm">Quick Start</h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sign up in under 60 seconds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[20px] p-3" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <div className="text-xl">🔒</div>
                  <div>
                    <h4 className="font-semibold text-sm">Campus Verified</h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Only verified college students can join.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[20px] p-3" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <div className="text-xl">❤️</div>
                  <div>
                    <h4 className="font-semibold text-sm">Real Connections</h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Meet people who genuinely match your vibe.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-[20px] p-4 text-center" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', boxShadow: '0 20px 60px rgba(var(--accent-secondary-rgb), 0.18)' }}>
                <div className="mb-3 h-0.5 w-20 mx-auto" style={{ backgroundColor: 'var(--border-primary)' }} />
                <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-secondary)' }}>Already trusted by students</p>
                <div className="flex items-center justify-center gap-1 text-base mb-2" style={{ color: 'var(--text-primary)' }}>★★★★★</div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Join thousands of verified students finding meaningful campus connections.</p>
                <div className="mt-3 h-0.5 w-20 mx-auto" style={{ backgroundColor: 'var(--border-primary)' }} />
              </div>
            </motion.aside>

            <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-[24px] p-6 backdrop-blur-md overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-primary)', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)' }}>
                <div className="pointer-events-none absolute -left-10 top-10 h-24 w-24 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.08)' }} />
                <div className="pointer-events-none absolute right-6 top-24 h-16 w-16 rounded-full border" style={{ borderColor: 'rgba(var(--accent-secondary-rgb), 0.15)' }} />
                <div className="pointer-events-none absolute left-10 bottom-16 text-[24px] opacity-10" style={{ color: 'var(--accent-secondary)' }}>✦</div>

                <div className="mb-4 flex items-center justify-between">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm transition" style={{ color: 'var(--accent-secondary)' }}>
                    <span className="text-lg">←</span>
                    Back
                  </Link>
                  <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--accent-secondary)' }}>Campus verified</span>
                </div>

                <div className="flex flex-col items-center text-center gap-2 mb-4">
                  <div className="h-12 w-12 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: 'var(--surface-bg)', boxShadow: '0 12px 30px rgba(var(--accent-rgb), 0.08)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L2 8 L12 13 L22 8 L12 3 Z" /><path d="M12 13 L12 21" /><path d="M7 17 C9 18.5 15 18.5 17 17" /></svg>
                  </div>
                  <h2 className="text-xl font-bold">Create Account</h2>
                  <p className="text-xs max-w-[20rem]" style={{ color: 'var(--text-secondary)' }}>Secure your campus access and connect with verified students across your college.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Full name</label>
                    <input {...reg('fullName', { required: 'Full name is required' })} type="text" placeholder="Your full name" className="w-full px-3 py-2.5 rounded-[10px] outline-none auth-placeholder" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                    {errors.fullName && <p className="text-xs mt-0.5" style={{ color: 'var(--danger)' }}>{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Campus email</label>
                    <input {...reg('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i, message: 'Invalid email' } })} type="email" placeholder="you@campus.edu" className="w-full px-3 py-2.5 rounded-[10px] text-white placeholder-[#666] outline-none" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)' }} />
                    {errors.email && <p className="text-xs mt-0.5" style={{ color: 'var(--danger)' }}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Password</label>
                    <div className="relative">
                      <input {...reg('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full px-3 py-2.5 rounded-[10px] outline-none auth-placeholder" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--accent-secondary)' }}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    {errors.password && <p className="text-xs mt-0.5" style={{ color: 'var(--danger)' }}>{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Confirm password</label>
                    <div className="relative">
                      <input {...reg('confirmPassword', { required: 'Please confirm your password' })} type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full px-3 py-2.5 rounded-[10px] outline-none auth-placeholder" style={{ backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--accent-secondary)' }}>{showConfirmPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs mt-0.5" style={{ color: 'var(--danger)' }}>{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input type="checkbox" id="terms" {...reg('terms', { required: 'You must agree to the terms' })} className="mt-0.5 w-3.5 h-3.5 rounded cursor-pointer" />
                    <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer" style={{ color: 'var(--text-secondary)' }}>I agree to the <Link to="/terms" className="hover:underline" style={{ color: 'var(--accent-secondary)' }}>Terms of Service</Link> and <Link to="/privacy" className="hover:underline" style={{ color: 'var(--accent-secondary)' }}>Privacy Policy</Link>.</label>
                  </div>
{errors.terms && <p className="text-xs mt-0.5" style={{ color: 'var(--danger)' }}>{errors.terms.message}</p>}

                  <button type="submit" disabled={loading} className="w-full py-2.5 rounded-[10px] text-white font-semibold text-sm" style={{ backgroundImage: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))' }}>{loading ? 'Creating account...' : 'Create Account'}</button>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="h-px w-16" style={{ backgroundColor: 'var(--border-primary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>OR</span>
                    <div className="h-px w-16" style={{ backgroundColor: 'var(--border-primary)' }} />
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>Already have an account?</p>
                    <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold transition hover:underline underline-offset-3" style={{ color: 'var(--accent-secondary)' }}>Sign In →</Link>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
