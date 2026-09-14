"use server";

import { connectDB } from "@/lib/db/mongodb";
import { Organization } from "@/lib/models/Organization";
import { InvoiceTemplate } from "@/lib/models/InvoiceTemplate";
import { requireAuth } from "@/lib/auth/session";
import { templateSchema } from "@/lib/validation";
import { z } from "zod";

type TemplateInput = z.infer<typeof templateSchema>;

async function getOrgForUser(userId: string) {
  await connectDB();
  const org = await Organization.findOne({ ownerId: userId }).lean();
  if (!org) throw new Error("ORGANIZATION_NOT_FOUND");
  return org;
}

export async function getTemplatesAction() {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    const templates = await InvoiceTemplate.find({ organizationId: org._id })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      templates: JSON.parse(JSON.stringify(templates)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch templates";
    return { success: false, error: message };
  }
}

export async function getTemplateByIdAction(id: string) {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    const template = await InvoiceTemplate.findOne({
      _id: id,
      organizationId: org._id,
    }).lean();

    if (!template) return { success: false, error: "Template not found" };

    return {
      success: true,
      template: JSON.parse(JSON.stringify(template)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch template";
    return { success: false, error: message };
  }
}

export async function createTemplateAction(data: TemplateInput) {
  try {
    const session = await requireAuth();
    const validated = templateSchema.parse(data);
    const org = await getOrgForUser(session.userId);

    if (validated.isDefault) {
      await InvoiceTemplate.updateMany(
        { organizationId: org._id },
        { $set: { isDefault: false } }
      );
    }

    const created = await InvoiceTemplate.create({
      organizationId: org._id,
      ...validated,
    });

    if (validated.isDefault) {
      await Organization.updateOne(
        { _id: org._id },
        { $set: { defaultTemplateId: created._id } }
      );
    }

    return {
      success: true,
      template: JSON.parse(JSON.stringify(created)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create template";
    return { success: false, error: message };
  }
}

export async function updateTemplateAction(id: string, data: Partial<TemplateInput>) {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    const template = await InvoiceTemplate.findOne({ _id: id, organizationId: org._id });
    if (!template) return { success: false, error: "Template not found" };

    if (data.isDefault) {
      await InvoiceTemplate.updateMany(
        { organizationId: org._id },
        { $set: { isDefault: false } }
      );
      await Organization.updateOne(
        { _id: org._id },
        { $set: { defaultTemplateId: template._id } }
      );
    }

    Object.assign(template, data);
    await template.save();

    return {
      success: true,
      template: JSON.parse(JSON.stringify(template)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update template";
    return { success: false, error: message };
  }
}

export async function deleteTemplateAction(id: string) {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    const template = await InvoiceTemplate.findOne({ _id: id, organizationId: org._id });
    if (!template) return { success: false, error: "Template not found" };

    if (template.isDefault) {
      return { success: false, error: "Cannot delete the default template." };
    }

    await InvoiceTemplate.deleteOne({ _id: id, organizationId: org._id });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete template";
    return { success: false, error: message };
  }
}

export async function setDefaultTemplateAction(id: string) {
  try {
    const session = await requireAuth();
    const org = await getOrgForUser(session.userId);

    await InvoiceTemplate.updateMany(
      { organizationId: org._id },
      { $set: { isDefault: false } }
    );

    const template = await InvoiceTemplate.findOneAndUpdate(
      { _id: id, organizationId: org._id },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!template) return { success: false, error: "Template not found" };

    await Organization.updateOne(
      { _id: org._id },
      { $set: { defaultTemplateId: template._id } }
    );

    return { success: true, template: JSON.parse(JSON.stringify(template)) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to set default template";
    return { success: false, error: message };
  }
}
