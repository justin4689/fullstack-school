"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession } from "./auth";
import prisma from "./prisma";

type LoginState = { error: string | null };

export async function loginAction(
  _: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  let userId: string | null = null;
  let role: "admin" | "teacher" | "student" | "parent" | null = null;
  let hashedPassword: string | null = null;

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (admin) {
    userId = admin.id;
    role = "admin";
    hashedPassword = admin.password;
  }

  if (!userId) {
    const teacher = await prisma.teacher.findUnique({ where: { username } });
    if (teacher) {
      userId = teacher.id;
      role = "teacher";
      hashedPassword = teacher.password;
    }
  }

  if (!userId) {
    const student = await prisma.student.findUnique({ where: { username } });
    if (student) {
      userId = student.id;
      role = "student";
      hashedPassword = student.password;
    }
  }

  if (!userId) {
    const parent = await prisma.parent.findUnique({ where: { username } });
    if (parent) {
      userId = parent.id;
      role = "parent";
      hashedPassword = parent.password;
    }
  }

  if (!userId || !hashedPassword) {
    return { error: "Invalid username or password" };
  }

  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    return { error: "Invalid username or password" };
  }

  const token = await signSession({ id: userId, role: role! });

  cookies().set("__session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(`/${role}`);
}

export async function logoutAction() {
  cookies().delete("__session");
  redirect("/sign-in");
}
