"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import type { GitHubContributionSummary } from "@/lib/github/types";

type LookupState =
  | { status: "idle"; data?: undefined; error?: undefined }
  | { status: "loading"; data?: GitHubContributionSummary; error?: undefined }
  | { status: "success"; data: GitHubContributionSummary; error?: undefined }
  | { status: "error"; data?: undefined; error: string };

export function ImpactDashboard() {
  const [profileUrl, setProfileUrl] = useState("");
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLookup((current) => ({
      status: "loading",
      data: current.data,
    }));

    try {
      const response = await fetch(
        `/api/contributions?profileUrl=${encodeURIComponent(profileUrl)}`,
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message ?? "GitHub lookup failed.");
      }

      setLookup({ status: "success", data: payload });
    } catch (error) {
      setLookup({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Unable to load GitHub contributions.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 lg:px-10">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              OpenSource Impact Tracker
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Search a GitHub user&apos;s open-source contributions.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Enter a GitHub profile URL or username to pull public
              repositories, authored pull requests, and authored issues into a
              contribution summary.
            </p>
          </div>

          <form
            className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm sm:grid-cols-[1fr_auto]"
            onSubmit={handleSubmit}
          >
            <label className="space-y-1">
              <span className="text-sm font-medium text-slate-700">
                GitHub profile URL
              </span>
              <input
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                onChange={(event) => setProfileUrl(event.target.value)}
                placeholder="https://github.com/octocat"
                type="text"
                value={profileUrl}
              />
            </label>
            <button
              className="h-12 self-end rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={lookup.status === "loading"}
              type="submit"
            >
              {lookup.status === "loading" ? "Searching..." : "Search"}
            </button>
          </form>

          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            This uses public GitHub data only. It does not require tokens or
            secrets, so private contributions and some historical activity may
            not appear.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 lg:px-10">
        {lookup.status === "idle" ? <EmptyState /> : null}
        {lookup.status === "error" ? <ErrorState message={lookup.error} /> : null}
        {lookup.data ? <ContributionResults summary={lookup.data} /> : null}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-2xl font-semibold text-slate-950">
        Start with a GitHub profile
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        The tracker will summarize public repositories, pull requests, and
        issues authored by that user. Try a URL like
        <span className="font-medium text-slate-950">
          {" "}
          https://github.com/octocat
        </span>
        .
      </p>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section
      className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800"
      role="alert"
    >
      {message}
    </section>
  );
}

function ContributionResults({
  summary,
}: {
  summary: GitHubContributionSummary;
}) {
  return (
    <>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Image
            alt={`${summary.profile.login} avatar`}
            className="h-20 w-20 rounded-full border border-slate-200"
            height={80}
            src={summary.profile.avatarUrl}
            width={80}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              GitHub user
            </p>
            <h2 className="text-2xl font-semibold text-slate-950">
              {summary.profile.name ?? summary.profile.login}
            </h2>
            <a
              className="mt-1 inline-flex text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
              href={summary.profile.htmlUrl}
              rel="noreferrer"
              target="_blank"
            >
              @{summary.profile.login}
            </a>
            {summary.profile.bio ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {summary.profile.bio}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <SummaryGrid summary={summary} />

      {summary.limits.length > 0 ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-semibold text-amber-950">
            Public data limits
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-900">
            {summary.limits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <RepositorySection summary={summary} />
      <IssueSection
        emptyMessage="No public authored pull requests found in the first search page."
        items={summary.pullRequests}
        title="Authored pull requests"
      />
      <IssueSection
        emptyMessage="No public authored issues found in the first search page."
        items={summary.issues}
        title="Authored issues"
      />
    </>
  );
}

function SummaryGrid({ summary }: { summary: GitHubContributionSummary }) {
  const cards = [
    { label: "Public repositories", value: summary.totals.repositories },
    { label: "Source repositories", value: summary.totals.sourceRepositories },
    { label: "Forks", value: summary.totals.forkedRepositories },
    { label: "Authored pull requests", value: summary.totals.pullRequests },
    { label: "Authored issues", value: summary.totals.issues },
    { label: "Stars on public repos", value: summary.totals.stars },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          key={card.label}
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}

function RepositorySection({
  summary,
}: {
  summary: GitHubContributionSummary;
}) {
  return (
    <section aria-labelledby="repositories" className="space-y-4">
      <h2 id="repositories" className="text-2xl font-semibold text-slate-950">
        Public repositories
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {summary.repositories.map((repo) => (
          <article
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            key={repo.id}
          >
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                {repo.isFork ? "Fork" : "Source"}
              </span>
              {repo.language ? <span>{repo.language}</span> : null}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-950">
              <a
                className="underline-offset-4 hover:underline"
                href={repo.htmlUrl}
                rel="noreferrer"
                target="_blank"
              >
                {repo.fullName}
              </a>
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {repo.description ?? "No repository description provided."}
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <Metric label="Stars" value={repo.stars} />
              <Metric label="Forks" value={repo.forks} />
              <Metric label="Open issues" value={repo.openIssues} />
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function IssueSection({
  emptyMessage,
  items,
  title,
}: {
  emptyMessage: string;
  items: GitHubContributionSummary["pullRequests"];
  title: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      {items.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={item.id}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
                  {item.state}
                </span>
                <span>{item.repositoryName}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-7 text-slate-950">
                <a
                  className="underline-offset-4 hover:underline"
                  href={item.htmlUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                Updated {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-base font-semibold text-slate-950">{value}</dd>
    </div>
  );
}
