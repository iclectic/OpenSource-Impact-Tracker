import { SiteShell } from "@/components/layout/SiteShell";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";

export default function SettingsPage() {
  return (
    <SiteShell>
      <main className="mx-auto grid w-full max-w-3xl gap-6 px-5 py-10 sm:px-8 lg:px-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Settings
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage profile visibility, account preferences, and future GitHub
            disconnect controls.
          </p>
        </div>
        <EmptyStateCard
          description="Settings controls will expand as authentication, profile publishing, and GitHub connection management stabilize."
          title="Settings foundation"
        />
      </main>
    </SiteShell>
  );
}
