"use server";

import { connectDB } from "@/lib/db/mongodb";
import { Organization } from "@/lib/models/Organization";
import { TaxProfile } from "@/lib/models/TaxProfile";
import { InvoiceTemplate } from "@/lib/models/InvoiceTemplate";
import { requireAuth, setAuthCookie } from "@/lib/auth/session";
import { organizationSchema } from "@/lib/validation";
import { STARTER_TAX_PROFILES, STARTER_TEMPLATES } from "@/lib/templates/starter";
import { z } from "zod";

type OrganizationInput = z.infer<typeof organizationSchema>;

export async function createOrganizationAction(data: OrganizationInput) {
  try {
    const session = await requireAuth();
    const validated = organizationSchema.parse(data);
    await connectDB();

    const existingOrg = await Organization.findOne({ ownerId: session.userId });
    if (existingOrg) {
      return { success: false, error: "An organization already exists for this account." };
    }

    const org = await Organization.create({
      ownerId: session.userId,
      ...validated,
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

    // Update cookie with organizationId
    await setAuthCookie({
      ...session,
      organizationId: org._id.toString(),
    });

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
    await connectDB();

    const org = await Organization.findOne({ ownerId: session.userId });
    if (!org) {
      return { success: false, error: "Organization not found" };
    }

    Object.assign(org, data);
    await org.save();

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
    await connectDB();

    const org = await Organization.findOne({ ownerId: session.userId }).lean();
    if (!org) {
      return { success: false, organization: null };
    }

    return {
      success: true,
      organization: JSON.parse(JSON.stringify(org)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch organization";
    return { success: false, error: message };
  }
}
