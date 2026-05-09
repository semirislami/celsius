import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/settings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function AdminSettingsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        titleKey="admin.pages.settings.title"
        subtitleKey="admin.pages.settings.subtitle"
      />
      <ComingSoon />
    </div>
  );
}
