import { Badge } from "@/components/ui/Badge";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { StatCard } from "@/components/ui/StatCard";

const metrics = [
  { label: "Profile completeness", value: "20%" },
  { label: "GitHub repositories", value: 0 },
  { label: "Impact items", value: 0 },
  { label: "Published items", value: 0 },
];

export function DashboardHome() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:px-10">
      <section className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="warning">Profile not published</Badge>
          <Badge>GitHub not synced</Badge>
        </div>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Build your evidence-backed impact profile.
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Complete your profile, import public GitHub repositories, and add
            impact items with evidence links before publishing your profile.
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <EmptyStateCard
          description="No GitHub repositories imported yet. Connect GitHub to import your public work."
          title="GitHub sync"
        />
        <EmptyStateCard
          description="No impact items yet. Add your first project, article, talk, mentoring item, or community contribution."
          title="Impact items"
        />
        <EmptyStateCard
          description="Your public profile is not published yet. Finish the required profile fields before sharing it."
          title="Public profile"
        />
        <EmptyStateCard
          description="Recent profile edits, imports, and publishing changes will appear here."
          title="Recent activity"
        />
      </section>
    </main>
  );
}
