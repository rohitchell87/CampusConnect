import React, { useState } from 'react'
import { Mail, Lock, Bell, Moon, Eye, LogOut, Shield, Download, Trash2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailNotifications: true,
    showOnlineStatus: false,
  })

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-all flex-shrink-0 ${
        enabled ? '' : ''
      }`}
      style={{
        backgroundColor: enabled ? 'var(--accent-secondary)' : 'var(--border-primary)',
      }}
    >
      <div
        className={`absolute top-0.5 h-5 w-5 rounded-full transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
        style={{ backgroundColor: 'var(--card-bg)' }}
      />
    </button>
  )

  const SettingsRow = ({ icon: Icon, title, description, control }) => (
    <div className="flex items-center justify-between gap-6 py-4 px-6 transition-colors cursor-pointer min-h-[72px]"
      style={{ backgroundColor: 'transparent', borderBottom: '1px solid var(--border-primary)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-bg)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div className="flex items-start gap-4 flex-1">
        <div className="flex-shrink-0 mt-1" style={{ color: 'var(--accent-secondary)' }}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {control}
      </div>
    </div>
  )

  const SettingsButton = ({ icon: Icon, title, description, isDestructive = false }) => (
    <button
      className={`w-full flex items-center justify-between gap-6 py-4 px-6 transition-colors min-h-[72px] group last:border-b-0`}
      style={{ backgroundColor: 'transparent', borderBottom: '1px solid var(--border-primary)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-bg)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div className="flex items-start gap-4 flex-1">
        <div className={`flex-shrink-0 mt-1 ${isDestructive ? 'text-red-500' : ''}`} style={{ color: isDestructive ? 'var(--danger)' : 'var(--accent-secondary)' }}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-left flex-1">
          <h3 className="text-sm font-medium" style={{ color: isDestructive ? 'var(--danger)' : 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </div>
      </div>
      <span className="flex-shrink-0 text-lg transition-colors"
        style={{ color: isDestructive ? 'var(--danger)' : 'var(--text-secondary)' }}
        onMouseEnter={(e) => { if (!isDestructive) e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { if (!isDestructive) e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        →
      </span>
    </button>
  )

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] mb-2" style={{ color: 'var(--accent-secondary)' }}>
          Account
        </p>
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
      </div>

      {/* Preferences Card */}
      <div className="rounded-3xl border shadow-[0_30px_60px_rgba(0,0,0,0.3)]" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--card-bg)' }}>
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Preferences
          </h2>
        </div>

        <div>
          <SettingsRow
            icon={Moon}
            title="Dark Mode"
            description="Use the dark appearance"
            control={
              <ToggleSwitch
                enabled={theme === 'dark'}
                onChange={toggleTheme}
              />
            }
          />

          <SettingsRow
            icon={Bell}
            title="Push Notifications"
            description="Receive match and message notifications"
            control={
              <ToggleSwitch
                enabled={preferences.pushNotifications}
                onChange={() => togglePreference('pushNotifications')}
              />
            }
          />

          <SettingsRow
            icon={Mail}
            title="Email Notifications"
            description="Receive updates by email"
            control={
              <ToggleSwitch
                enabled={preferences.emailNotifications}
                onChange={() => togglePreference('emailNotifications')}
              />
            }
          />

          <SettingsRow
            icon={Eye}
            title="Show Online Status"
            description="Let others know when you're online"
            control={
              <ToggleSwitch
                enabled={preferences.showOnlineStatus}
                onChange={() => togglePreference('showOnlineStatus')}
              />
            }
          />
        </div>
      </div>

      {/* Security & Account Card */}
      <div className="rounded-3xl border shadow-[0_30px_60px_rgba(0,0,0,0.3)]" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--card-bg)' }}>
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Security & Account
          </h2>
        </div>

        <div>
          <SettingsButton
            icon={Lock}
            title="Change Password"
            description="Update your account password"
          />

          <SettingsButton
            icon={Shield}
            title="Privacy Settings"
            description="Control who can contact you"
          />

          <SettingsButton
            icon={Eye}
            title="Blocked Users"
            description="Manage blocked users"
          />

          <div className="border-t" style={{ borderColor: 'var(--border-primary)' }} />

          <SettingsButton
            icon={Download}
            title="Download My Data"
            description="Download a copy of your data"
          />

          <SettingsButton
            icon={Trash2}
            title="Delete Account"
            description="Permanently delete your account"
            isDestructive={true}
          />
        </div>
      </div>
    </div>
  )
}