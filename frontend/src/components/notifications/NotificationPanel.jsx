import React from 'react'
import { BellRing } from 'lucide-react'
import NotificationItem from './NotificationItem'
import IllustratedEmptyState from '../common/IllustratedEmptyState'
import { motion } from 'framer-motion'

export default function NotificationPanel({ notifications = [], onClose, setNotifications }){
  const markAllRead = () => {
    if(setNotifications) setNotifications(prev => prev.map(n=> ({ ...n, unread: false })))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
      className="w-[400px] max-w-[92vw] rounded-[24px] bg-[rgba(11,13,23,0.8)] border border-white/6 shadow-[0_20px_60px_rgba(11,13,23,0.6)] p-4"
    >
      <div className="flex items-start justify-between gap-4 px-2 pb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <p className="text-sm text-[#94A3B8]">Stay updated with your activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={markAllRead} className="text-sm text-[#B9BBCC]">Mark all as read</button>
          <button onClick={onClose} className="text-sm text-[#B9BBCC]">Close</button>
        </div>
      </div>

      <div className="mt-2 max-h-[60vh] overflow-auto space-y-3 px-2 py-1">
        {notifications.length === 0 ? (
          <IllustratedEmptyState
            icon={BellRing}
            title="You're all caught up"
            subtitle="We'll notify you when something exciting happens."
            className="border-none bg-transparent p-0 shadow-none"
          />
        ) : (
          notifications.map(n => (
            <NotificationItem key={n.id} notification={n} />
          ))
        )}
      </div>
    </motion.div>
  )
}
