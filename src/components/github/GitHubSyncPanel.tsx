import { Badge } from "@/components/ui/Badge";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { StatCard } from "@/components/ui/StatCard";

type GitHubSyncPanelProps = {
  githubUsername?: string | null;
  lastSyncedAt?: Date | null;
  repositoryCount: number;
  syncAction: () => Promise<unknown>;
};

export function GitHubSyncPanel({
  githubUsername,
  lastSyncedAt,
  repositoryCount,
  syncAction,
}: GitHubSyncPanelProps) {
  return (
    <section className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={githubUsername ? "success" : "warning"}>
            {githubUsername ? "GitHub connected" : "GitHub username missing"}
          </Badge>
          <Badge>{lastSyncedAt ? "Synced" : "Never synced"}</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          GitHub repository sync
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Import public GitHub repositories as verified evidence for your
          developer impact profile. Private repositories and organization-private
          work stay out of the MVP.
        </p>
        <form action={syncAction} className="mt-5">
          <button
            className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={!githubUsername}
            type="submit"
          >
            Sync GitHub repositories
          </button>
        </form>
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <StatCard label="GitHub username" value={githubUsername ?? "Not set"} />
        <StatCard label="Repositories imported" value={repositoryCount} />
      </section>

      {repositoryCount === 0 ? (
        <EmptyStateCard
          description="No GitHub repositories imported yet. Connect GitHub to import your public work."
          title="No repositories yet"
        />
      ) : null}
    </section>
  );
}
