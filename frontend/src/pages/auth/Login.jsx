import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../context/AuthContext'

export default function Login(){
  const { login, loading } = useContext(AuthContext)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    try{
      await login(data)
    }catch(_){ }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <label className="block mb-2">Email</label>
        <input {...register('email')} type="email" className="w-full mb-3 p-2 border rounded" required />
        <label className="block mb-2">Password</label>
        <input {...register('password')} type="password" className="w-full mb-4 p-2 border rounded" required />
        <button disabled={loading} className="w-full py-2 rounded bg-primary-500 text-white">{loading ? 'Loading...' : 'Login'}</button>
      </form>
    </div>
  )
}
