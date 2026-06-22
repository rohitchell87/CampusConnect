import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import profileService from '../../services/profileService'
import { AuthContext } from '../../context/AuthContext'
import ProfileCompletionCard from '../../components/ui/ProfileCompletionCard'
import toast from 'react-hot-toast'

export default function CompleteProfile(){
  const navigate = useNavigate()
  const { user, setUser, isProfileComplete } = useContext(AuthContext)
  const { register, handleSubmit, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [interests, setInterests] = useState([])
  const [selectedInterests, setSelectedInterests] = useState([])

  useEffect(()=>{
    const load = async () => {
      try{
        const data = await profileService.getInterests()
        setInterests(data)
        if(user?.interests){
          setSelectedInterests(user.interests.map(i=>i.id))
        }
        setValue('fullName', user?.fullName || '')
      }catch(err){
        toast.error('Failed to load interests')
      }
    }
    load()
  }, [user, setValue])

  const onToggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try{
      const profilePayload = {
        
        fullName: data.fullName,
        college: data.college,
        hometown: data.hometown,
        bio: data.bio,
        height: data.height ? Number(data.height) : null,
        gender: data.gender || null,
        branch: data.branch || null,
        year: data.year ? Number(data.year) : null,
        interestedIn: data.interestedIn || null,
        relationshipIntent: data.relationshipIntent || null,
        workoutHabit: data.workoutHabit || null,
        smokingHabit: data.smokingHabit || null,
        drinkingHabit: data.drinkingHabit || null,
        personalityType: data.personalityType || null,
        lookingFor: data.lookingFor || null
      };
      console.log("PROFILE PAYLOAD:", profilePayload);
      const profile = await profileService.updateProfile(profilePayload)
      const interestsResponse = await profileService.updateInterests({ interestIds: selectedInterests })
      const updatedProfile = { ...profile, interests: interestsResponse }
      setUser(updatedProfile)
      toast.success('Profile updated')
      if(isProfileComplete(updatedProfile)){
        navigate('/discover')
      }
    }catch(err){
      const msg = err?.response?.data?.message || 'Profile save failed'
      toast.error(msg)
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <ProfileCompletionCard profile={user} />
      <div className="bg-white dark:bg-slate-900 shadow rounded p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Complete your profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Finish setup to start discovering profiles.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2">Full Name</label>
              <input {...register('fullName')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" required />
            </div>
            <div>
              <label className="block mb-2">College</label>
              <input {...register('college')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
            </div>
            <div>
              <label className="block mb-2">Hometown</label>
              <input {...register('hometown')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
            </div>
            <div>
              <label className="block mb-2">Age</label>
              <input type="number" {...register('age')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2">Branch</label>
              <input {...register('branch')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
            </div>
            <div>
              <label className="block mb-2">Year</label>
              <input type="number" {...register('year')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
            </div>
            <div>
              <label className="block mb-2">Height (cm)</label>
              <input type="number" {...register('height')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
            </div>
          </div>

          <div>
            <label className="block mb-2">Bio</label>
            <textarea {...register('bio')} rows={4} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2">Gender</label>
              <select {...register("gender")}>
    <option value="">Select</option>
    <option value="MALE">Male</option>
    <option value="FEMALE">Female</option>
    <option value="NON_BINARY">Non Binary</option>
</select>
            </div>
            <div>
              <label className="block mb-2">Interested In</label>
              <select {...register("interestedIn")}>
    <option value="">Select</option>
    <option value="MEN">Men</option>
    <option value="WOMEN">Women</option>
    <option value="EVERYONE">Everyone</option>
</select>
            </div>
            <div>
              <label className="block mb-2">Relationship Intent</label>
              <select {...register('relationshipIntent')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                <option value="">Select</option>
                <option value="LONG_TERM">Long term</option>
                <option value="SHORT_TERM">Short term</option>
                <option value="CASUAL">Casual</option>
                <option value="FRIENDSHIP">Friendship</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2">Workout Habit</label>
              <select {...register('workoutHabit')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                <option value="">Select</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="OCCASIONALLY">Occasionally</option>
                <option value="NEVER">Never</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Smoking Habit</label>
              <select {...register('smokingHabit')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                <option value="">Select</option>
                <option value="NO">No</option>
                <option value="OCCASIONALLY">Occasionally</option>
                <option value="YES">Yes</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Drinking Habit</label>
              <select {...register('drinkingHabit')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                <option value="">Select</option>
                <option value="NO">No</option>
                <option value="SOCIALLY">Socially</option>
                <option value="YES">Yes</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2">Personality</label>
              <select {...register('personalityType')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                <option value="">Select</option>
                <option value="INTROVERT">Introvert</option>
                <option value="AMBIVERT">Ambivert</option>
                <option value="EXTROVERT">Extrovert</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Looking For</label>
              <select {...register('lookingFor')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                <option value="">Select</option>
                <option value="DATING">Dating</option>
                <option value="FRIENDSHIP">Friendship</option>
                <option value="STUDY_PARTNER">Study partner</option>
                <option value="HACKATHON_TEAM">Hackathon team</option>
                <option value="GYM_BUDDY">Gym buddy</option>
                <option value="GAMING_PARTNER">Gaming partner</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Choose your interests</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {interests.map((interest) => (
                <button
                  type="button"
                  key={interest.id}
                  onClick={() => onToggleInterest(interest.id)}
                  className={`rounded-lg border px-4 py-3 text-left transition ${selectedInterests.includes(interest.id) ? 'border-primary-500 bg-primary-100 dark:bg-slate-800' : 'border-slate-300 bg-white dark:bg-slate-950'}`}>
                  <div className="text-2xl mb-2">{interest.icon}</div>
                  <div className="font-medium">{interest.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="submit" disabled={loading} className="px-5 py-2 rounded bg-primary-500 text-white">
              {loading ? 'Saving...' : 'Save and continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
