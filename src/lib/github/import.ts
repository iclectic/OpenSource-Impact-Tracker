import type { PrismaClient, Prisma } from "@prisma/client";
import { fetchGitHubContributionSummary } from "./client";
import type { RepositoryContribution } from "./types";

export function mapRepositoryForImport(
  userId: string,
  repo: RepositoryContribution,
): Prisma.GitHubRepositoryUncheckedCreateInput {
  return {
    userId,
    githubRepoId: BigInt(repo.id),
    name: repo.name,
    fullName: repo.fullName,
    description: repo.description,
    url: repo.htmlUrl,
    homepageUrl: repo.homepageUrl ?? null,
    language: repo.language,
    stars: repo.stars,
    forks: repo.forks,
    watchers: repo.watchers ?? repo.stars,
    openIssues: repo.openIssues,
    isFork: repo.isFork,
    isPrivate: repo.isPrivate ?? false,
    pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : null,
    lastSyncedAt: new Date(),
  };
}

export async function syncGitHubRepositoriesForUser({
  githubUsername,
  prisma,
  userId,
}: {
  githubUsername: string;
  prisma: PrismaClient;
  userId: string;
}) {
  const summary = await fetchGitHubContributionSummary(githubUsername);
  const syncedAt = new Date();

  for (const repo of summary.repositories) {
    const data = {
      ...mapRepositoryForImport(userId, repo),
      lastSyncedAt: syncedAt,
    };

    await prisma.gitHubRepository.upsert({
      where: {
        userId_githubRepoId: {
          userId,
          githubRepoId: data.githubRepoId,
        },
      },
      update: {
        description: data.description,
        forks: data.forks,
        fullName: data.fullName,
        homepageUrl: data.homepageUrl,
        isFork: data.isFork,
        isPrivate: data.isPrivate,
        language: data.language,
        lastSyncedAt: data.lastSyncedAt,
        name: data.name,
        openIssues: data.openIssues,
        pushedAt: data.pushedAt,
        stars: data.stars,
        url: data.url,
        watchers: data.watchers,
      },
      create: data,
    });
  }

  await prisma.connectedAccount.updateMany({
    where: {
      provider: "github",
      userId,
    },
    data: { lastSyncedAt: syncedAt },
  });

  return {
    importedRepositories: summary.repositories.length,
    limits: summary.limits,
    syncedAt,
  };
}
