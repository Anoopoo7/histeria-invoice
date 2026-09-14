import React from "react";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { getTemplateByIdAction } from "@/app/actions/template";
import { AppLayout } from "@/components/layout/AppLayout";
import { TemplateEditor } from "@/components/template/TemplateEditor";

export default async function EditTemplatePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  const res = await getTemplateByIdAction(id);
  if (!res.success || !res.template) {
    notFound();
  }

  const tmpl = res.template;

  return (
    <AppLayout>
      <TemplateEditor
        templateId={tmpl._id}
        initialName={tmpl.name}
        initialDescription={tmpl.description}
        initialJson={tmpl.templateJson}
        isDefault={tmpl.isDefault}
        isNew={false}
      />
    </AppLayout>
  );
}
