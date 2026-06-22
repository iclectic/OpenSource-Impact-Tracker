import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-16">
            <div className="max-w-3xl space-y-6">
              <Badge tone="success">Evidence-first developer profiles</Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Show the full impact behind your developer work.
                </h1>
                <p className="text-lg leading-8 text-slate-600">
                  Connect GitHub, add talks, articles, mentoring, community
                  work, tutorials, podcasts, research, and projects, then
                  publish a clean proof-of-work profile backed by evidence.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="/dashboard"
                >
                  Open dashboard
                </Link>
                <Link
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                  href="/demo-profile"
                >
                  View profile preview
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard label="GitHub verified work" value="Repos" />
              <StatCard label="Evidence links" value="URLs" />
              <StatCard label="Manual impact items" value="Talks + articles" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
          <ValueCard
            description="Every major claim should connect to a repository, pull request, issue, article, video, event page, slide deck, certificate, or other proof URL."
            title="Evidence over scores"
          />
          <ValueCard
            description="GitHub repositories matter, but so do talks, mentoring, technical writing, community work, tutorials, research, and open-source maintenance."
            title="Beyond GitHub stats"
          />
          <ValueCard
            description="Profiles should be polished enough to share with recruiters, maintainers, founders, grant reviewers, and visa assessors."
            title="Built to share"
          />
        </section>
      </main>
    </SiteShell>
  );
}

function ValueCard({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
