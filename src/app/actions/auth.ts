"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/models/User";
import { Organization } from "@/lib/models/Organization";
import { setAuthCookie, removeAuthCookie, getSession } from "@/lib/auth/session";
import { loginSchema, registerSchema } from "@/lib/validation";

export async function registerUser(formData: { name: string; email: string; password: string }) {
  try {
    const validated = registerSchema.parse(formData);
    await connectDB();

    const existingUser = await User.findOne({ email: validated.email.toLowerCase() });
    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const user = await User.create({
      name: validated.name,
      email: validated.email.toLowerCase(),
      passwordHash,
    });

    await setAuthCookie({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return { success: true, user: { id: user._id.toString(), name: user.name, email: user.email } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return { success: false, error: message };
  }
}

export async function loginUser(formData: { email: string; password: string }) {
  try {
    const validated = loginSchema.parse(formData);
    await connectDB();

    const user = await User.findOne({ email: validated.email.toLowerCase() });
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password." };
    }

    // Find organization if exists
    const org = await Organization.findOne({ ownerId: user._id });

    await setAuthCookie({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      organizationId: org ? org._id.toString() : undefined,
    });

    return {
      success: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
      hasOrganization: !!org,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return { success: false, error: message };
  }
}

export async function logoutUser() {
  await removeAuthCookie();
  return { success: true };
}

export async function getCurrentUserAndOrg() {
  const session = await getSession();
  if (!session) return { user: null, organization: null };

  await connectDB();
  const user = await User.findById(session.userId).select("-passwordHash").lean();
  if (!user) return { user: null, organization: null };

  const org = await Organization.findOne({ ownerId: session.userId }).lean();

  return {
    user: JSON.parse(JSON.stringify(user)),
    organization: org ? JSON.parse(JSON.stringify(org)) : null,
  };
}
