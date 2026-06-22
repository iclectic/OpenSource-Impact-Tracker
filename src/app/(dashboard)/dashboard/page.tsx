import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { SiteShell } from "@/components/layout/SiteShell";

export default function DashboardPage() {
  return (
    <SiteShell>
      <DashboardHome />
    </SiteShell>
  );
}
