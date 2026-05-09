import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminFooter } from "@/components/admin/AdminFooter";

export default function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return (
    <div className="min-h-screen bg-canvas-soft">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <AdminSidebar locale={locale} />
        <div className="flex min-h-screen flex-col">
          <AdminTopbar />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
