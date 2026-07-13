import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "ezzouhir2122@gmail.com";

export default async function AdminProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect(`/${locale}/admin/login`);
  }

  return <>{children}</>;
}
