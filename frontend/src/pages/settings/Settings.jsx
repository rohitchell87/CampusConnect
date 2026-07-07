import React, { useState } from 'react'
import { Mail, Lock, Bell, Moon, Eye, LogOut, Shield, Download, Trash2 } from 'lucide-react'

export default function Settings() {
  const [preferences, setPreferences] = useState({
    darkMode: true,
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
        enabled ? 'bg-[#9B6DFF]' : 'bg-white/10'
      }`}
    >
      <div
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )

  const SettingsRow = ({ icon: Icon, title, description, control }) => (
    <div className="flex items-center justify-between gap-6 py-4 px-6 hover:bg-white/[0.03] transition-colors cursor-pointer min-h-[72px]">
      <div className="flex items-start gap-4 flex-1">
        <div className="flex-shrink-0 text-[#9B6DFF] mt-1">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-sm font-medium text-white">
            {title}
          </h3>
          <p className="text-xs text-[#8B8B9F]">
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
    <button className={`w-full flex items-center justify-between gap-6 py-4 px-6 hover:bg-white/[0.03] transition-colors min-h-[72px] group border-b border-white/5 last:border-b-0`}>
      <div className="flex items-start gap-4 flex-1">
        <div className={`flex-shrink-0 mt-1 ${isDestructive ? 'text-red-500' : 'text-[#9B6DFF]'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-left flex-1">
          <h3 className={`text-sm font-medium ${isDestructive ? 'text-red-500' : 'text-white'}`}>
            {title}
          </h3>
          <p className="text-xs text-[#8B8B9F]">
            {description}
          </p>
        </div>
      </div>
      <span className={`flex-shrink-0 text-lg ${isDestructive ? 'text-red-500 group-hover:text-red-400' : 'text-[#8B8B9F] group-hover:text-white'} transition-colors`}>
        →
      </span>
    </button>
  )

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#8B5CF6] mb-2">
          Account
        </p>
        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>
      </div>

      {/* Preferences Card */}
      <div className="rounded-3xl border border-white/10 bg-[#141414] shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
        <div className="px-8 py-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">
            Preferences
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          <SettingsRow
            icon={Moon}
            title="Dark Mode"
            description="Use the dark appearance"
            control={
              <ToggleSwitch
                enabled={preferences.darkMode}
                onChange={() => togglePreference('darkMode')}
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
      <div className="rounded-3xl border border-white/10 bg-[#141414] shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
        <div className="px-8 py-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">
            Security & Account
          </h2>
        </div>

        <div className="divide-y divide-white/5">
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

          <div className="border-t border-white/10" />

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