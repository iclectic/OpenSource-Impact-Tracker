import { SiteShell } from "@/components/layout/SiteShell";
import { GitHubSyncPanel } from "@/components/github/GitHubSyncPanel";
import { getCurrentSession } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db";
import { getEditableProfile } from "@/lib/profiles/queries";
import { syncGitHubAction } from "./actions";

type SessionUser = {
  id?: string;
};

export const dynamic = "force-dynamic";

export default async function GitHubSyncPage() {
  const session = await getCurrentSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  const data = userId ? await getGitHubSyncPageData(userId) : null;

  return (
    <SiteShell>
      <main className="mx-auto grid w-full max-w-4xl gap-6 px-5 py-10 sm:px-8 lg:px-10">
        <GitHubSyncPanel
          githubUsername={data?.githubUsername}
          lastSyncedAt={data?.lastSyncedAt}
          repositoryCount={data?.repositoryCount ?? 0}
          syncAction={syncGitHubAction}
        />
      </main>
    </SiteShell>
  );
}

async function getGitHubSyncPageData(userId: string) {
  const prisma = getPrismaClient();
  const [profile, repositoryCount, account] = await Promise.all([
    getEditableProfile(userId),
    prisma.gitHubRepository.count({ where: { userId } }),
    prisma.connectedAccount.findFirst({
      where: {
        provider: "github",
        userId,
      },
      select: { lastSyncedAt: true },
    }),
  ]);

  return {
    githubUsername: profile?.githubUsername,
    lastSyncedAt: account?.lastSyncedAt,
    repositoryCount,
  };
}
