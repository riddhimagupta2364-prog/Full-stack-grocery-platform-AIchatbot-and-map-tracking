'use client'

import React, { useState } from 'react'
import {ArrowLeft,EyeIcon,EyeOff,Leaf,Lock,Mail,User,LogIn} from "lucide-react"
import { motion } from "framer-motion"
import axios from 'axios'
import Image from 'next/image'
import googleImage from "@/assets/google.jpg"
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
//import connectDb from "@/app/lib/db";
type propType = {
  previousStep: (s: number) => void
}
function RegisterForm({ previousStep }: propType) {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router=useRouter()
  //const { data: session, status } = useSession()
  const handleRegister = async () => {
  try {
    setLoading(true)

    const res = await axios.post("/api/auth/register", {
      name,email,password
    })
    router.push("/login")
    console.log(res.data)

  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false) 
    
  }
}

  const formValid = name && email && password
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white'>

      {/* Back */}
      <div
        className='absolute top-6 left-6 flex items-center gap-2 cursor-pointer'
        onClick={() => previousStep(1)}
      >
        <ArrowLeft />
        <span>Back</span>
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mb-2"
      >
        Create Account
      </motion.h1>

      <p className='mb-6 flex items-center gap-1'>
        Join Snapcart <Leaf />
      </p>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleRegister()
        }}
        className="flex flex-col gap-4 w-full max-w-sm"
      >

        {/* Name */}
        <div className='relative'>
          <User className='absolute left-2 top-3' />
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 pl-8"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className='relative'>
          <Mail className='absolute left-2 top-3' />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 pl-8"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className='relative'>
          <Lock className='absolute left-2 top-3' />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 pl-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {
            showPassword
              ? <EyeOff className='absolute right-2 top-3 cursor-pointer' onClick={() => setShowPassword(false)} />
              : <EyeIcon className='absolute right-2 top-3 cursor-pointer' onClick={() => setShowPassword(true)} />
          }
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={!formValid}
          className={`p-2 ${formValid ? "bg-green-500 text-white" : "bg-gray-300"}`}
        >
          Register
        </button>

        {/* Google */}
        <div className="border p-2 flex gap-2 justify-center" onClick={()=>signIn("google")}>
          <Image src={googleImage} alt="google" width={20} height={20} />
           Continue with Google
        </div>

      </form>

      <p className="mt-4 flex gap-1" onClick={()=>router.push("/login")}>
        Already have account <LogIn className='w-4 h-4'/><span className='text-green-600'>Sign in</span>
      </p>

    </div>
  )
}
export default RegisterForm
