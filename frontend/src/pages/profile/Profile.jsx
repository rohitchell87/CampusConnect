import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import profileService from '../../services/profileService'
import toast from 'react-hot-toast'

export default function Profile(){
  const { register, handleSubmit, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [profileUploadProgress, setProfileUploadProgress] = useState(0)

  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverUploadProgress, setCoverUploadProgress] = useState(0)

  useEffect(()=>{
    loadProfile()
    return ()=>{
      if(profilePreview) URL.revokeObjectURL(profilePreview)
      if(coverPreview) URL.revokeObjectURL(coverPreview)
    }
  }, [])

  const loadProfile = async ()=>{
    setLoading(true)
    try{
      const data = await profileService.getMyProfile()
      setProfile(data)
      const fields = ['fullName','age','branch','year','college','bio','height','personalityType','relationshipIntent','workoutHabit','smokingHabit','drinkingHabit','lookingFor']
      fields.forEach(f => setValue(f, data[f]))
    }catch(err){
      toast.error('Failed to load profile')
    }finally{ setLoading(false) }
  }

  const onSave = async (vals)=>{
    setLoading(true)
    try{
      const updated = await profileService.updateProfile(vals)
      setProfile(updated)
      toast.success('Profile updated')
    }catch(err){
      const msg = err?.response?.data?.message || 'Update failed'
      toast.error(msg)
    }finally{ setLoading(false) }
  }

  const onSelectProfile = (e)=>{
    const f = e.target.files?.[0]
    if(!f) return
    setProfileFile(f)
    setProfilePreview(URL.createObjectURL(f))
  }

  const onSelectCover = (e)=>{
    const f = e.target.files?.[0]
    if(!f) return
    setCoverFile(f)
    setCoverPreview(URL.createObjectURL(f))
  }

  const uploadProfile = async ()=>{
    if(!profileFile){ toast('No profile image selected'); return }
    try{
      setProfileUploadProgress(0)
      const res = await profileService.uploadProfilePhoto(profileFile, setProfileUploadProgress)
      toast.success('Profile photo uploaded')
      setProfile(prev=> ({...prev, profilePhoto: res.profilePhoto || res}))
      setProfileFile(null)
      setProfilePreview(null)
    }catch(err){ toast.error('Upload failed') }
  }

  const uploadCover = async ()=>{
    if(!coverFile){ toast('No cover image selected'); return }
    try{
      setCoverUploadProgress(0)
      const res = await profileService.uploadCoverPhoto(coverFile, setCoverUploadProgress)
      toast.success('Cover photo uploaded')
      setProfile(prev=> ({...prev, coverPhoto: res.coverPhoto || res}))
      setCoverFile(null)
      setCoverPreview(null)
    }catch(err){ toast.error('Upload failed') }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 shadow rounded overflow-hidden mb-6">
        <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          {coverPreview ? (
            <img src={coverPreview} alt="cover preview" className="object-cover h-full w-full" />
          ) : profile?.coverPhoto ? (
            <img src={profile.coverPhoto} alt="cover" className="object-cover h-full w-full" />
          ) : (
            <div className="text-slate-400">No cover photo</div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {profilePreview ? (
              <img src={profilePreview} alt="profile preview" className="object-cover w-full h-full" />
            ) : profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="profile" className="object-cover w-full h-full" />
            ) : (
              <div className="text-slate-400">No Photo</div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{profile?.fullName || 'Your name'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.college || 'Add your college to introduce yourself'}</p>
          </div>
        </div>
      </div>

      {loading && !profile ? (
        <div className="space-y-4">
          <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-80 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 shadow rounded p-4">
              <h3 className="font-semibold mb-3">Profile Photo</h3>
              <input type="file" accept="image/*" onChange={onSelectProfile} />
              {profilePreview && <div className="mt-2"><button onClick={uploadProfile} className="px-3 py-1 bg-primary-500 text-white rounded">Upload</button></div>}
              {profileUploadProgress>0 && <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden"><div style={{width: profileUploadProgress+'%'}} className="h-2 bg-primary-500"></div></div>}
            </div>

            <div className="bg-white dark:bg-slate-900 shadow rounded p-4">
              <h3 className="font-semibold mb-3">Cover Photo</h3>
              <input type="file" accept="image/*" onChange={onSelectCover} />
              {coverPreview && <div className="mt-2"><button onClick={uploadCover} className="px-3 py-1 bg-primary-500 text-white rounded">Upload</button></div>}
              {coverUploadProgress>0 && <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden"><div style={{width: coverUploadProgress+'%'}} className="h-2 bg-primary-500"></div></div>}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSave)} className="bg-white dark:bg-slate-900 shadow rounded p-6 mt-6">
            <h3 className="font-semibold mb-4">Profile Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Full name</label>
                <input {...register('fullName')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
              </div>
              <div>
                <label className="block mb-1">Age</label>
                <input type="number" {...register('age')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
              </div>
              <div>
                <label className="block mb-1">Branch</label>
                <input {...register('branch')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
              </div>
              <div>
                <label className="block mb-1">Year</label>
                <input type="number" {...register('year')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
              </div>
              <div>
                <label className="block mb-1">College</label>
                <input {...register('college')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
              </div>
              <div>
                <label className="block mb-1">Height (cm)</label>
                <input type="number" {...register('height')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-1">Bio</label>
              <textarea {...register('bio')} className="w-full p-2 border rounded bg-white dark:bg-slate-950" rows={4}></textarea>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block mb-1">Personality</label>
                <select {...register('personalityType')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                  <option value="">Select</option>
                  <option value="INTROVERT">INTROVERT</option>
                  <option value="AMBIVERT">AMBIVERT</option>
                  <option value="EXTROVERT">EXTROVERT</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Relationship Intent</label>
                <select {...register('relationshipIntent')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                  <option value="">Select</option>
                  <option value="LONG_TERM">LONG_TERM</option>
                  <option value="SHORT_TERM">SHORT_TERM</option>
                  <option value="CASUAL">CASUAL</option>
                  <option value="FRIENDSHIP">FRIENDSHIP</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Workout</label>
                <select {...register('workoutHabit')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                  <option value="">Select</option>
                  <option value="DAILY">DAILY</option>
                  <option value="WEEKLY">WEEKLY</option>
                  <option value="OCCASIONALLY">OCCASIONALLY</option>
                  <option value="NEVER">NEVER</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Smoking</label>
                <select {...register('smokingHabit')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                  <option value="">Select</option>
                  <option value="NO">NO</option>
                  <option value="OCCASIONALLY">OCCASIONALLY</option>
                  <option value="YES">YES</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Drinking</label>
                <select {...register('drinkingHabit')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                  <option value="">Select</option>
                  <option value="NO">NO</option>
                  <option value="SOCIALLY">SOCIALLY</option>
                  <option value="YES">YES</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Looking For</label>
                <select {...register('lookingFor')} className="w-full p-2 border rounded bg-white dark:bg-slate-950">
                  <option value="">Select</option>
                  <option value="DATING">DATING</option>
                  <option value="FRIENDSHIP">FRIENDSHIP</option>
                  <option value="STUDY_PARTNER">STUDY_PARTNER</option>
                  <option value="HACKATHON_TEAM">HACKATHON_TEAM</option>
                  <option value="GYM_BUDDY">GYM_BUDDY</option>
                  <option value="GAMING_PARTNER">GAMING_PARTNER</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded">{loading ? 'Saving...' : 'Save Profile'}</button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
