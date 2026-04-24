import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req:NextRequest){
    
    const {pathname}= req.nextUrl
    const publicRoutes=["/login", "/register","/api/auth"]
    if(publicRoutes.some((path)=>pathname.startsWith(path))){
        return NextResponse.next()
    }
const token =await getToken({req,secret:process.env.NEXTAUTH_SECRET})
console.log(token)
if(!token){
    const loginUrl= new URL("/login",req.url)
    console.log(loginUrl)
    loginUrl.searchParams.set("callbackUrl",req.url)
    return  NextResponse.redirect(loginUrl)

}
return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
//req--------middleware-----server
//work as a protector*/