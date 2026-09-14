"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/models/User";
import { Organization } from "@/lib/models/Organization";
import { setAuthCookie, removeAuthCookie, getSession, setActiveOrgCookie } from "@/lib/auth/session";
import { loginSchema, registerSchema } from "@/lib/validation";
import { getActiveOrgForUser } from "./organization";

export async function registerUser(formData: { name: string; email: string; password: string }) {
  try {
    const validated = registerSchema.parse(formData);
    await connectDB();

    const emailLower = validated.email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const user = await User.create({
      name: validated.name,
      email: emailLower,
      passwordHash,
    });

    // Link newly registered user to any existing staff invitations
    await Organization.updateMany(
      { "members.email": emailLower },
      { $set: { "members.$[elem].userId": user._id } },
      { arrayFilters: [{ "elem.email": emailLower }] }
    );

    const org = await Organization.findOne({
      $or: [
        { ownerId: user._id },
        { "members.userId": user._id },
        { "members.email": emailLower },
      ],
    });

    if (org) {
      await setActiveOrgCookie(org._id.toString());
    }

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
    const message = err instanceof Error ? err.message : "Registration failed";
    return { success: false, error: message };
  }
}

export async function loginUser(formData: { email: string; password: string }) {
  try {
    const validated = loginSchema.parse(formData);
    await connectDB();

    const emailLower = validated.email.toLowerCase();
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password." };
    }

    // Link user ID to any organization staff records matching email
    await Organization.updateMany(
      { "members.email": emailLower },
      { $set: { "members.$[elem].userId": user._id } },
      { arrayFilters: [{ "elem.email": emailLower }] }
    );

    // Find any organization where user is owner or staff member
    const org = await Organization.findOne({
      $or: [
        { ownerId: user._id },
        { "members.userId": user._id },
        { "members.email": emailLower },
      ],
    });

    if (org) {
      await setActiveOrgCookie(org._id.toString());
    }

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

  let org = null;
  try {
    const activeOrg = await getActiveOrgForUser(session.userId);
    org = JSON.parse(JSON.stringify(activeOrg));
  } catch {
    org = null;
  }

  return {
    user: JSON.parse(JSON.stringify(user)),
    organization: org,
  };
}
