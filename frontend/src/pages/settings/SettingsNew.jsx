import React, { useState, useEffect } from 'react'
import { Mail, Lock, Bell, Moon, Eye, Shield, Download, Trash2, BadgeCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import VerificationModal from '../../components/verification/VerificationModal'
import { subscribeToVerificationChanges, getVerificationStatus } from '../../components/verification/VerificationService'
import settingsService from '../../services/settingsService'
import toast from 'react-hot-toast'

export default function SettingsNew() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailNotifications: true,
    showOnlineStatus: false,
  })
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState('Verification Pending')

  useEffect(() => {
    const sync = () => setVerificationStatus(getVerificationStatus('self'))
    sync()
    return subscribeToVerificationChanges(sync)
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getSettings()
        setPreferences((prev) => ({
          ...prev,
          pushNotifications: settings.pushNotifications ?? prev.pushNotifications,
          emailNotifications: settings.emailNotifications ?? prev.emailNotifications,
          showOnlineStatus: settings.showOnlineStatus ?? prev.showOnlineStatus,
        }))
      } catch (error) {
        toast.error('Unable to load settings')
      } finally {
        setLoadingSettings(false)
      }
    }

    loadSettings()
  }, [])

  const togglePreference = async (key) => {
    // Dark mode is handled by ThemeContext, not here
    if (key === 'darkMode') return

    const nextValue = !preferences[key]
    setPreferences((prev) => ({ ...prev, [key]: nextValue }))

    try {
      await settingsService.updateSettings({ [key]: nextValue })
      toast.success('Preference updated')
    } catch (error) {
      setPreferences((prev) => ({ ...prev, [key]: !nextValue }))
      toast.error('Unable to update preference')
    }
  }

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-all flex-shrink-0`}
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
    <button className={`w-full flex items-center justify-between gap-6 py-4 px-6 transition-colors min-h-[72px] group border-b last:border-b-0`}
      style={{ backgroundColor: 'transparent', borderColor: 'var(--border-primary)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-bg)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div className="flex items-start gap-4 flex-1">
        <div className={`flex-shrink-0 mt-1`} style={{ color: isDestructive ? 'var(--danger)' : 'var(--accent-secondary)' }}>
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
      <span className="flex-shrink-0 text-lg transition-colors" style={{ color: isDestructive ? 'var(--danger)' : 'var(--text-secondary)' }}
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
                onChange={() => {
                  if (loadingSettings) return
                  toggleTheme()
                }}
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
                onChange={() => !loadingSettings && togglePreference('pushNotifications')}
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
                onChange={() => !loadingSettings && togglePreference('emailNotifications')}
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
                onChange={() => !loadingSettings && togglePreference('showOnlineStatus')}
              />
            }
          />
        </div>
      </div>

      <div className="rounded-3xl border shadow-[0_30px_60px_rgba(0,0,0,0.3)]" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--card-bg)' }}>
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Student verification</h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Show campus authenticity with a mock student verification badge.</p>
            </div>
            <button type="button" onClick={() => setVerificationOpen(true)} className="inline-flex items-center gap-2 rounded-full border transition" style={{ borderColor: 'var(--accent-secondary)/30', backgroundColor: 'var(--accent-secondary)/12', color: 'var(--accent-secondary)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '600' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-secondary)/20')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-secondary)/12')}
            >
              <BadgeCheck className="h-4 w-4" />
              {verificationStatus}
            </button>
          </div>
        </div>

        <div>
          <button type="button" onClick={() => setVerificationOpen(true)} className="w-full flex items-center justify-between gap-6 py-4 px-6 transition-colors min-h-[72px] group border-b last:border-b-0" style={{ backgroundColor: 'transparent', borderColor: 'var(--border-primary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1" style={{ color: 'var(--accent-secondary)' }}>
                <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-left flex-1">
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Student Verification</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Open the multip-step verification flow and preview your badge.</p>
              </div>
            </div>
            <span className="flex-shrink-0 text-lg transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >→</span>
          </button>
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

          <button
            type="button"
            onClick={() => navigate('/settings/blocked-users')}
            className="w-full flex items-center justify-between gap-6 py-4 px-6 transition-colors min-h-[72px] group border-b last:border-b-0"
            style={{ backgroundColor: 'transparent', borderColor: 'var(--border-primary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1" style={{ color: 'var(--accent-secondary)' }}>
                <Eye className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-left flex-1">
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Blocked Users</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Manage blocked users</p>
              </div>
            </div>
            <span className="flex-shrink-0 text-lg transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >→</span>
          </button>

          <div style={{ borderTop: '1px solid var(--border-primary)' }} />

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

      <VerificationModal open={verificationOpen} onClose={() => setVerificationOpen(false)} user="self" onStatusChange={setVerificationStatus} />
    </div>
  )
}
