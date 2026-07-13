import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

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

  const isAdmin = user?.user_metadata?.role === "admin";

  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  return <>{children}</>;
}
