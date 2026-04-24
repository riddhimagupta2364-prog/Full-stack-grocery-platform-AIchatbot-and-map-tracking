import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "@/app/lib/db";
import bcrypt from "bcryptjs"
import User from "@/models/user.model"
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDb()

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const email = credentials.email as string // ✅ fixed
        const password = credentials.password as string

        const user = await User.findOne({ email })

        if (!user) {
          throw new Error("Invalid credentials")
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        }
      },
    }),
    Google({
      clientId:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SERVER
    })
  ],

  callbacks: {
    //token ke andr user ka data put kr deta h
    async signIn({user, account}){
      if(account?.provider=="google"){
        await connectDb()
        let dbUser=await User.findOne({email:user.email})
        if(!dbUser){
          dbUser=await User.create({
            name:user.name,
            email:user.email,
          })
        }
        user.id=dbUser._id.toString()
        user.role=dbUser.role
      }
      return true
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role as string
      }
      return token
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // ✅ fixed
  },

  secret: process.env.AUTH_SECRET,
})