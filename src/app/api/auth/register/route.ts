
import connectDb from "@/app/lib/db"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
   
  try {
    console.log("🚀 API HIT")
    await connectDb()
    const { name, email, password } = await req.json()

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check existing user
    const existUser = await User.findOne({ email })
    if (existUser) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // Send safe response
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}