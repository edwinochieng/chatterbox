import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/client";

const saltRounds = 10;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

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
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return Response.json({
        message: "User already exists",
      });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, saltRounds),
      },
    });

    return Response.json({
      message: "User created!",
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    return Response.json({ message: "Server error" });
  }
}
