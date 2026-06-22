import { Badge } from "@/components/ui/Badge";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { StatCard } from "@/components/ui/StatCard";

const skills = ["Open source", "Technical writing", "Developer education"];

export function PublicProfilePreview({ handle }: { handle: string }) {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:px-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-600">
            OS
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info">Preview</Badge>
              <Badge tone="warning">Evidence pending</Badge>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Developer Impact Profile
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">@{handle}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              A public, evidence-backed profile will show GitHub repositories,
              articles, talks, community work, projects, and a timeline of
              developer impact.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Featured impact" value={0} />
        <StatCard label="Repositories" value={0} />
        <StatCard label="Evidence links" value={0} />
        <StatCard label="Timeline items" value={0} />
      </section>

      <ProfileSection title="Featured impact">
        <EmptyStateCard
          description="No featured items yet. Feature your strongest evidence-backed work from the dashboard."
          title="No featured impact yet"
        />
      </ProfileSection>

      <section className="grid gap-6 lg:grid-cols-2">
        <ProfileSection title="GitHub repositories">
          <EmptyStateCard
            description="No GitHub repositories imported yet. Connect GitHub to import public work."
            title="No repositories yet"
          />
        </ProfileSection>
        <ProfileSection title="Articles">
          <EmptyStateCard
            description="No articles yet. Add your first technical article."
            title="No articles yet"
          />
        </ProfileSection>
        <ProfileSection title="Talks">
          <EmptyStateCard
            description="No talks yet. Add a talk, workshop, or podcast appearance."
            title="No talks yet"
          />
        </ProfileSection>
        <ProfileSection title="Community work">
          <EmptyStateCard
            description="No community work yet. Add mentoring, meetup, documentation, or community contributions."
            title="No community work yet"
          />
        </ProfileSection>
      </section>

      <ProfileSection title="Impact timeline">
        <EmptyStateCard
          description="Published impact items and imported GitHub evidence will appear here in date order."
          title="No timeline items yet"
        />
      </ProfileSection>
    </main>
  );
}
