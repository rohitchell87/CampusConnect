import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../context/AuthContext'

export default function Register(){
  const { register: reg, handleSubmit } = useForm()
  const { register: doRegister, loading } = useContext(AuthContext)

  const onSubmit = async (data) => {
  console.log("FORM DATA:", data);

  try {
    await doRegister(data);
  } catch (e) {
    console.log("REGISTER ERROR:", e.response?.data);
  }
};

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <label className="block mb-2">Full Name</label>
        <input {...reg('fullName')} className="w-full mb-3 p-2 border rounded" required />
        <label className="block mb-2">Email</label>
        <input {...reg('email')} type="email" className="w-full mb-3 p-2 border rounded" required />
        <label className="block mb-2">Password</label>
        <input {...reg('password')} type="password" className="w-full mb-4 p-2 border rounded" required />
        <button disabled={loading} className="w-full py-2 rounded bg-primary-500 text-white">{loading ? 'Loading...' : 'Register'}</button>
      </form>
    </div>
  )
}
