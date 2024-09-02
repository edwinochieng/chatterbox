import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/client";

const saltRounds = 10;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log("User data", name, email);

    if (
      !name ||
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 6
    ) {
      return Response.json({
        message: "Validation Error",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return Response.json({
        message: "User already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        fullName: name,
        email,
        password: bcrypt.hashSync(password, saltRounds),
      },
    });

    return Response.json({
      message: "User created!",
      newUser,
    });
  } catch (err) {
    return Response.json({ message: "Server error" });
  }
}
