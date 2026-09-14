"use server";

import { connectDB } from "@/lib/db/mongodb";
import { Organization } from "@/lib/models/Organization";
import { TaxProfile } from "@/lib/models/TaxProfile";
import { requireAuth } from "@/lib/auth/session";
import { taxProfileSchema } from "@/lib/validation";
import { z } from "zod";

type TaxInput = z.infer<typeof taxProfileSchema>;

async function getOrgForUser(userId: string) {
  await connectDB();
  const org = await Organization.findOne({ ownerId: userId }).lean();
  if (!org) throw new Error("ORGANIZATION_NOT_FOUND");
  return org;
}

export async function getTaxProfilesAction() {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    const profiles = await TaxProfile.find({ organizationId: org._id }).sort({ rate: 1 }).lean();
    return {
      success: true,
      taxProfiles: JSON.parse(JSON.stringify(profiles)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch tax profiles";
    return { success: false, error: message };
  }
}

export async function createTaxProfileAction(data: TaxInput) {
  try {
    const session = await requireAuth();
    const validated = taxProfileSchema.parse(data);
    const org = await getOrgForUser(session.userId);

    const created = await TaxProfile.create({
      organizationId: org._id,
      ...validated,
    });

    return {
      success: true,
      taxProfile: JSON.parse(JSON.stringify(created)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create tax profile";
    return { success: false, error: message };
  }
}

export async function updateTaxProfileAction(id: string, data: Partial<TaxInput>) {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    const profile = await TaxProfile.findOne({ _id: id, organizationId: org._id });
    if (!profile) return { success: false, error: "Tax profile not found" };

    Object.assign(profile, data);
    await profile.save();

    return {
      success: true,
      taxProfile: JSON.parse(JSON.stringify(profile)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update tax profile";
    return { success: false, error: message };
  }
}

export async function deleteTaxProfileAction(id: string) {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    await TaxProfile.deleteOne({ _id: id, organizationId: org._id });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete tax profile";
    return { success: false, error: message };
  }
}
