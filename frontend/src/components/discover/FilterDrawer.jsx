import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import FilterSection from './FilterSection'
import FilterChip from './FilterChip'

const collegeOptions = ['IIIT Delhi', 'IIT Delhi', 'DTU', 'NSIT', 'JNU', 'BITS Pilani']
const branchOptions = ['Computer Science', 'Electronics', 'Mechanical', 'Design', 'Business', 'Physics']
const yearOptions = ['1', '2', '3', '4', '5']
const genderOptions = ['Any', 'Male', 'Female', 'Non-binary']
const lookingForOptions = ['Dating', 'Friendship', 'Study partner', 'Hackathon team', 'Gym buddy']
const interestOptions = ['Anime', 'Gaming', 'Music', 'Travel', 'Coding', 'Fitness', 'Photography', 'Books']

export default function FilterDrawer({ open, onClose, onApply, initialFilters = {}, activeCount = 0 }) {
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters, open])

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const toggleInterest = (interest) => {
    setFilters((prev) => {
      const current = prev.interests || []
      return {
        ...prev,
        interests: current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]
      }
    })
  }

  const resetFilters = () => {
    setFilters({
      college: '',
      branch: '',
      year: '',
      ageRange: [18, 30],
      gender: 'Any',
      lookingFor: '',
      interests: [],
      onlyVerified: false,
      onlineNow: false
    })
  }

  const apply = () => {
    onApply?.(filters)
    onClose?.()
  }

  const renderValue = (value) => value || 'Any'
  const activeChips = useMemo(() => {
    const chips = []
    if (filters.college) chips.push(`College: ${filters.college}`)
    if (filters.branch) chips.push(`Branch: ${filters.branch}`)
    if (filters.year) chips.push(`Year ${filters.year}`)
    if (filters.gender && filters.gender !== 'Any') chips.push(`Gender: ${filters.gender}`)
    if (filters.lookingFor) chips.push(`Looking for: ${filters.lookingFor}`)
    if (filters.interests?.length) chips.push(`Interests: ${filters.interests.join(', ')}`)
    if (filters.onlyVerified) chips.push('Verified only')
    if (filters.onlineNow) chips.push('Online now')
    return chips
  }, [filters])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[45] bg-[#02040b]/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-[420px] flex-col border-l border-white/10 bg-[#060814]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-white">Filters</h2>
                <p className="mt-1 text-sm text-[#94A3B8]">Find people that match your preferences.</p>
              </div>
              <button type="button" onClick={(event) => { event.stopPropagation(); onClose?.() }} className="relative z-[70] rounded-full border border-white/10 bg-white/5 p-2 text-[#D8D4FF] transition hover:bg-white/10 pointer-events-auto">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {activeChips.length > 0 ? activeChips.map((chip) => <FilterChip key={chip} label={chip} onRemove={() => {}} />) : <span className="text-sm text-[#94A3B8]">No filters applied yet.</span>}
            </div>

            <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
              <FilterSection title="College" subtitle="Filter by institution">
                <select value={filters.college || ''} onChange={(event) => updateFilter('college', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0E1324] px-3 py-2.5 text-sm text-white outline-none">
                  <option value="">Any college</option>
                  {collegeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="Branch" subtitle="Filter by specialization">
                <select value={filters.branch || ''} onChange={(event) => updateFilter('branch', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0E1324] px-3 py-2.5 text-sm text-white outline-none">
                  <option value="">Any branch</option>
                  {branchOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="Year" subtitle="Filter by academic year">
                <select value={filters.year || ''} onChange={(event) => updateFilter('year', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0E1324] px-3 py-2.5 text-sm text-white outline-none">
                  <option value="">Any year</option>
                  {yearOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="Age Range" subtitle="Narrow by age">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-[#D8D4FF]">
                    <span>{filters.ageRange?.[0] ?? 18}</span>
                    <span>{filters.ageRange?.[1] ?? 30}</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="35"
                    value={filters.ageRange?.[0] ?? 18}
                    onChange={(event) => updateFilter('ageRange', [Number(event.target.value), filters.ageRange?.[1] ?? 30])}
                    className="w-full accent-[#7C5CFF]"
                  />
                  <input
                    type="range"
                    min="18"
                    max="35"
                    value={filters.ageRange?.[1] ?? 30}
                    onChange={(event) => updateFilter('ageRange', [filters.ageRange?.[0] ?? 18, Number(event.target.value)])}
                    className="w-full accent-[#7C5CFF]"
                  />
                </div>
              </FilterSection>

              <FilterSection title="Gender" subtitle="Filter by gender">
                <select value={filters.gender || 'Any'} onChange={(event) => updateFilter('gender', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0E1324] px-3 py-2.5 text-sm text-white outline-none">
                  {genderOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="Looking For" subtitle="Match by relationship style">
                <select value={filters.lookingFor || ''} onChange={(event) => updateFilter('lookingFor', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0E1324] px-3 py-2.5 text-sm text-white outline-none">
                  <option value="">Any</option>
                  {lookingForOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </FilterSection>

              <FilterSection title="Interests" subtitle="Pick one or more interests">
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const active = filters.interests?.includes(interest)
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? 'border-[#7C5CFF] bg-[#7C5CFF]/15 text-white' : 'border-white/10 bg-white/5 text-[#D8D4FF] hover:border-[#7C5CFF]/40'}`}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>
              </FilterSection>

              <FilterSection title="Visibility" subtitle="Refine by account status">
                <div className="space-y-3">
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-[#D8D4FF]">
                    <span>Only Verified Profiles</span>
                    <input type="checkbox" checked={!!filters.onlyVerified} onChange={() => updateFilter('onlyVerified', !filters.onlyVerified)} className="h-4 w-4 accent-[#7C5CFF]" />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-[#D8D4FF]">
                    <span>Online Now</span>
                    <input type="checkbox" checked={!!filters.onlineNow} onChange={() => updateFilter('onlineNow', !filters.onlineNow)} className="h-4 w-4 accent-[#7C5CFF]" />
                  </label>
                </div>
              </FilterSection>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
              <button type="button" onClick={resetFilters} className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#D8D4FF] transition hover:bg-white/10">
                Reset Filters
              </button>
              <button type="button" onClick={apply} className="flex-1 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#9F7AEA] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,92,255,0.25)] transition hover:brightness-110">
                Apply Filters
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
