import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { TemplateEditor } from "@/components/template/TemplateEditor";
import { STARTER_TEMPLATES } from "@/lib/templates/starter";

export default async function NewTemplatePage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  return (
    <TemplateEditor
      initialName="Custom Template"
      initialDescription="Customized invoice design layout"
      initialJson={STARTER_TEMPLATES[0].templateJson}
      isNew={true}
    />
  );
}
