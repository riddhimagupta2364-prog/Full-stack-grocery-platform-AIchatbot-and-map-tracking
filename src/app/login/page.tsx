'use client'
import React, { FormEvent, useState } from 'react'
import {ArrowLeft,EyeIcon,EyeOff,Leaf,Lock,Mail,User,LogIn} from "lucide-react"
import { motion } from "framer-motion"
import axios from 'axios'
import Image from 'next/image'
import googleImage from "@/assets/google.jpg"
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
//import connectDb from "@/app/lib/db";
function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router= useRouter()
  
  const { data: session, status } = useSession()
  console.log(session)
  const handleLogin = async (e: FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    })

    if (res?.ok) {
      router.push("/")
    } else {
      alert("Invalid email or password")
    }

  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}
  const formValid = email && password
 return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white'>
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mb-2"
      >
        Welcome Back
      </motion.h1>

      <p className='mb-6 flex items-center gap-1'>
        Login To Snapcart <Leaf />
      </p>

      {/* Form */}
      <form
      onSubmit={handleLogin}
       className="flex flex-col gap-4 w-full max-w-sm"
      >
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
          Login
        </button>

        {/* Google */}
        <div className="border p-2 flex gap-2 justify-center" onClick={()=>signIn("google",{callbackUrl:"/"})}>
          <Image src={googleImage} alt="google" width={20} height={20} />
          Continue with Google
        </div>

      </form>

      <p className="mt-4 flex gap-1" onClick ={()=>router.push("/register")}>
        Want To ceate an account <LogIn className='w-4 h-4'/><span className='text-green-600'>Sign Up</span>
      </p>

    </div>
  )
}
export default Login

 