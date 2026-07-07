import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-grid">
          {/* LEFT SIDE */}
          <div className="auth-left hidden lg:block">
            <div className="animate-fade-in space-y-8">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary mb-8 animate-float">
                  <span className="text-2xl font-bold">CC</span>
                </div>
                <h1 className="heading-1">Meet amazing people on your campus.</h1>
                <p className="subtitle mt-4">
                  Discover real connections with college students who share your interests. Swipe through verified profiles, chat instantly, and find meaningful matches.
                </p>
              </div>

              {/* CALL TO ACTION */}
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/register" className="btn-gradient px-8 py-4 text-center">
                  Create Account
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-4 text-center">
                  Sign In
                </Link>
              </div>

              {/* FEATURE SHOWCASE */}
              <div className="grid gap-4">
                <div className="feature-card">
                  <div className="icon">❤️</div>
                  <div className="title">Meaningful Matches</div>
                  <div className="description">Connected based on shared interests and campus life</div>
                </div>
                <div className="feature-card">
                  <div className="icon">💬</div>
                  <div className="title">Instant Chat</div>
                  <div className="description">Start conversations with compatible matches</div>
                </div>
                <div className="feature-card">
                  <div className="icon">🎓</div>
                  <div className="title">Campus Verified</div>
                  <div className="description">Real students from your college, verified and authentic</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - HERO */}
          <div className="auth-right animate-slide-in text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary mb-6 animate-float">
                <span className="text-4xl font-bold">CC</span>
              </div>
              <h2 className="heading-2">CampusConnect</h2>
              <p className="subtitle mt-2">Modern dating for college students</p>
            </div>

            {/* MOBILE CTA */}
            <div className="space-y-3 lg:hidden mb-8">
              <Link to="/register" className="btn-gradient px-6 py-3">
                Create Account
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3">
                Sign In
              </Link>
            </div>

            {/* ILLUSTRATION PLACEHOLDER */}
            <div className="space-y-4">
              <div className="glass-card min-h-[120px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-2">💕</p>
                  <p className="text-sm text-[#A1A1AA]">Find your match</p>
                </div>
              </div>
              <div className="glass-card min-h-[120px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="text-sm text-[#A1A1AA]">Start chatting</p>
                </div>
              </div>
              <div className="glass-card min-h-[120px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-2">🌟</p>
                  <p className="text-sm text-[#A1A1AA]">Build connections</p>
                </div>
              </div>
            </div>

            {/* TESTIMONIAL */}
            <div className="glass-card mt-8 text-left">
              <p className="text-sm italic text-[#A1A1AA] mb-3">
                "CampusConnect helped me find real connections with people I actually vibe with. It's like Hinge but for college."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary" />
                <div>
                  <p className="text-sm font-semibold">Alex M.</p>
                  <p className="text-xs text-[#A1A1AA]">UC Berkeley</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
