"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth/session";
import { getPrismaClient } from "@/lib/db";
import { syncGitHubRepositoriesForUser } from "@/lib/github/import";
import { getEditableProfile } from "@/lib/profiles/queries";

type SessionUser = {
  id?: string;
};

export async function syncGitHubAction() {
  const session = await getCurrentSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    throw new Error("Authentication required.");
  }

  const profile = await getEditableProfile(userId);

  if (!profile?.githubUsername) {
    throw new Error("Add a GitHub username to your profile before syncing.");
  }

  const result = await syncGitHubRepositoriesForUser({
    githubUsername: profile.githubUsername,
    prisma: getPrismaClient(),
    userId,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/github");
  revalidatePath(`/${profile.handle}`);

  return result;
}
