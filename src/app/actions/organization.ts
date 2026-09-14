"use server";

import { connectDB } from "@/lib/db/mongodb";
import { Organization, IOrganization } from "@/lib/models/Organization";
import { User } from "@/lib/models/User";
import { TaxProfile } from "@/lib/models/TaxProfile";
import { InvoiceTemplate } from "@/lib/models/InvoiceTemplate";
import {
  requireAuth,
  setAuthCookie,
  setActiveOrgCookie,
  getActiveOrgCookie,
} from "@/lib/auth/session";
import { organizationSchema } from "@/lib/validation";
import { STARTER_TAX_PROFILES, STARTER_TEMPLATES } from "@/lib/templates/starter";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type OrganizationInput = z.infer<typeof organizationSchema>;

/**
 * Ensures legacy organization documents have members array initialized with OWNER
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureOrgMembersInitialized(orgDoc: any) {
  if (!orgDoc) return;
  await connectDB();
  const ownerUser = await User.findById(orgDoc.ownerId).lean();
  const ownerEmail = ownerUser?.email?.toLowerCase();

  const membersArr = orgDoc.members || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasOwner = membersArr.some((m: any) =>
    m && (m.role === "OWNER" || (ownerEmail && m.email?.toLowerCase() === ownerEmail))
  );

  if (!hasOwner && ownerEmail) {
    await Organization.updateOne(
      { _id: orgDoc._id },
      {
        $push: {
          members: {
            $each: [
              {
                userId: orgDoc.ownerId,
                email: ownerEmail,
                role: "OWNER",
                addedAt: orgDoc.createdAt || new Date(),
              },
            ],
            $position: 0,
          },
        },
      }
    );
  }
}

/**
 * Helper to fetch the currently active organization for the authenticated user
 */
export async function getActiveOrgForUser(userId: string): Promise<IOrganization> {
  await connectDB();
  const user = await User.findById(userId).lean();
  const userEmail = user?.email?.toLowerCase();
  const activeOrgId = await getActiveOrgCookie();

  if (activeOrgId) {
    const org = await Organization.findOne({
      _id: activeOrgId,
      $or: [
        { ownerId: userId },
        { "members.userId": userId },
        { "members.email": userEmail },
      ],
    });
    if (org) {
      await ensureOrgMembersInitialized(org);
      const reloaded = await Organization.findById(org._id);
      return reloaded || org;
    }
  }

  // Fallback to first org where user is owner or member
  const fallbackOrg = await Organization.findOne({
    $or: [
      { ownerId: userId },
      { "members.userId": userId },
      { "members.email": userEmail },
    ],
  });

  if (!fallbackOrg) {
    throw new Error("ORGANIZATION_NOT_FOUND");
  }

  await ensureOrgMembersInitialized(fallbackOrg);
  const reloadedFallback = await Organization.findById(fallbackOrg._id);
  const finalOrg = reloadedFallback || fallbackOrg;

  await setActiveOrgCookie(finalOrg._id.toString());
  return finalOrg;
}

export async function getUserOrganizationsAction() {
  try {
    const session = await requireAuth();
    await connectDB();
    const user = await User.findById(session.userId).lean();
    const userEmail = user?.email?.toLowerCase();

    const orgs = await Organization.find({
      $or: [
        { ownerId: session.userId },
        { "members.userId": session.userId },
        { "members.email": userEmail },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    for (const o of orgs) {
      await ensureOrgMembersInitialized(o);
    }

    const reloadedOrgs = await Organization.find({
      $or: [
        { ownerId: session.userId },
        { "members.userId": session.userId },
        { "members.email": userEmail },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const activeOrgId = await getActiveOrgCookie();

    return {
      success: true,
      organizations: JSON.parse(JSON.stringify(reloadedOrgs)),
      activeOrgId: activeOrgId || (reloadedOrgs[0] ? reloadedOrgs[0]._id.toString() : null),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch organizations";
    return { success: false, error: message };
  }
}

export async function switchOrganizationAction(orgId: string) {
  try {
    const session = await requireAuth();
    await connectDB();
    const user = await User.findById(session.userId).lean();
    const userEmail = user?.email?.toLowerCase();

    const org = await Organization.findOne({
      _id: orgId,
      $or: [
        { ownerId: session.userId },
        { "members.userId": session.userId },
        { "members.email": userEmail },
      ],
    });

    if (!org) {
      return { success: false, error: "Organization not found or unauthorized access" };
    }

    await setActiveOrgCookie(org._id.toString());
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to switch organization";
    return { success: false, error: message };
  }
}

export async function createOrganizationAction(data: OrganizationInput) {
  try {
    const session = await requireAuth();
    const validated = organizationSchema.parse(data);
    await connectDB();

    const user = await User.findById(session.userId).lean();
    if (!user) return { success: false, error: "User not found" };

    const org = await Organization.create({
      ownerId: session.userId,
      ...validated,
      members: [
        {
          userId: session.userId,
          email: user.email.toLowerCase(),
          role: "OWNER",
          addedAt: new Date(),
        },
      ],
    });

    // Seed Starter Tax Profiles
    const taxDocs = await TaxProfile.insertMany(
      STARTER_TAX_PROFILES.map((tp) => ({
        organizationId: org._id,
        ...tp,
      }))
    );

    // Seed Starter Templates
    const templateDocs = await InvoiceTemplate.insertMany(
      STARTER_TEMPLATES.map((tmpl) => ({
        organizationId: org._id,
        name: tmpl.name,
        description: tmpl.description,
        templateJson: tmpl.templateJson,
        isDefault: tmpl.isDefault,
      }))
    );

    const defaultTax = taxDocs.find((t: { rate: number }) => t.rate === 18) || taxDocs[0];
    const defaultTmpl = templateDocs.find((t: { isDefault: boolean }) => t.isDefault) || templateDocs[0];

    org.defaultTaxProfileId = defaultTax ? defaultTax._id : undefined;
    org.defaultTemplateId = defaultTmpl ? defaultTmpl._id : undefined;
    await org.save();

    await setActiveOrgCookie(org._id.toString());
    await setAuthCookie({
      ...session,
      organizationId: org._id.toString(),
    });

    revalidatePath("/", "layout");
    return {
      success: true,
      organization: JSON.parse(JSON.stringify(org)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create organization";
    return { success: false, error: message };
  }
}

export async function updateOrganizationAction(data: Partial<OrganizationInput>) {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);

    Object.assign(org, data);
    await org.save();

    revalidatePath("/", "layout");
    return {
      success: true,
      organization: JSON.parse(JSON.stringify(org)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update organization";
    return { success: false, error: message };
  }
}

export async function getOrganizationAction() {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);

    return {
      success: true,
      organization: JSON.parse(JSON.stringify(org)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch organization";
    return { success: false, error: message };
  }
}

export async function addStaffMemberAction(email: string, role: "ADMIN" | "MEMBER") {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);
    const targetEmail = email.trim().toLowerCase();

    await connectDB();
    await ensureOrgMembersInitialized(org);

    const currentOrgDoc = await Organization.findById(org._id).lean();
    if (!currentOrgDoc) return { success: false, error: "Organization not found" };

    const membersArr = currentOrgDoc.members || [];
    const exists = membersArr.some(
      (m: { email?: string; role?: string }) => m && m.email && m.email.toLowerCase() === targetEmail
    );

    if (exists) {
      return { success: false, error: "This email is already added as a staff member in this business." };
    }

    const existingUser = await User.findOne({ email: targetEmail }).lean();

    // Atomic $push into Organization members array
    await Organization.updateOne(
      { _id: currentOrgDoc._id },
      {
        $push: {
          members: {
            userId: existingUser ? existingUser._id : undefined,
            email: targetEmail,
            role,
            addedAt: new Date(),
          },
        },
      }
    );

    const updatedOrg = await Organization.findById(currentOrgDoc._id).lean();
    revalidatePath("/organization");
    revalidatePath("/organization/members");

    return { success: true, organization: JSON.parse(JSON.stringify(updatedOrg)) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add staff member";
    return { success: false, error: message };
  }
}

export async function removeStaffMemberAction(memberEmail: string) {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);
    const targetEmail = memberEmail.trim().toLowerCase();

    await connectDB();

    if (org.ownerId.toString() === session.userId) {
      // Owner removing member using atomic $pull
      await Organization.updateOne(
        { _id: org._id },
        {
          $pull: {
            members: { email: targetEmail },
          },
        }
      );

      revalidatePath("/organization");
      revalidatePath("/organization/members");
      return { success: true };
    } else {
      return { success: false, error: "Only the business owner can remove staff members." };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove staff member";
    return { success: false, error: message };
  }
}
