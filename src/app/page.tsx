
import React from 'react'
import connectDb from '@/app/lib/db'
import { auth } from '@/auth'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import EditRoleMobile from '@/components/EditRoleMobile'


async function Home() {
  await connectDb()
  const session=await auth()
const user=await User.findById(session?.user?.id)
if(!user){
  redirect("/login")
}
const incomplete=!user.mobile || !user.role ||(!user.mobile && user.role=="user")
if(incomplete){
 return  <EditRoleMobile/>
}
  return (
    <>
      <Nav/>
    </>
  )
}

export default Home
