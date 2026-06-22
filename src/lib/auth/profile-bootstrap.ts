import type { PrismaClient } from "@prisma/client";

type GitHubProfileInput = {
  avatar_url?: unknown;
  email?: unknown;
  id?: unknown;
  login?: unknown;
  name?: unknown;
};

type BootstrapInput = {
  accountScope?: string | null;
  profile: GitHubProfileInput;
};

export type GitHubIdentity = {
  avatarUrl: string | null;
  email: string | null;
  name: string | null;
  providerUserId: string;
  username: string;
};

export function parseGitHubIdentity(
  profile: GitHubProfileInput,
): GitHubIdentity | null {
  const providerUserId =
    typeof profile.id === "number" || typeof profile.id === "string"
      ? String(profile.id)
      : null;
  const username = typeof profile.login === "string" ? profile.login : null;

  if (!providerUserId || !username) {
    return null;
  }

  return {
    avatarUrl:
      typeof profile.avatar_url === "string" ? profile.avatar_url : null,
    email: typeof profile.email === "string" ? profile.email : null,
    name: typeof profile.name === "string" ? profile.name : null,
    providerUserId,
    username,
  };
}

export function toHandleCandidate(input: string) {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 39);

  if (/^[a-z0-9](?:[a-z0-9-]{1,37}[a-z0-9])?$/.test(normalized)) {
    return normalized;
  }

  return "developer";
}

export async function bootstrapGitHubUserProfile(
  prisma: PrismaClient,
  input: BootstrapInput,
) {
  const identity = parseGitHubIdentity(input.profile);

  if (!identity) {
    throw new Error("GitHub profile did not include a stable id and login.");
  }

  const existingAccount = await prisma.connectedAccount.findUnique({
    where: {
      provider_providerUserId: {
        provider: "github",
        providerUserId: identity.providerUserId,
      },
    },
    include: { user: { include: { developerProfile: true } } },
  });

  if (existingAccount) {
    return prisma.user.update({
      where: { id: existingAccount.userId },
      data: {
        avatarUrl: identity.avatarUrl,
        lastLoginAt: new Date(),
        name: identity.name ?? existingAccount.user.name,
      },
      include: { developerProfile: true },
    });
  }

  const handle = await findAvailableHandle(prisma, identity.username);

  return prisma.user.create({
    data: {
      avatarUrl: identity.avatarUrl,
      email: identity.email,
      lastLoginAt: new Date(),
      name: identity.name ?? identity.username,
      username: handle,
      connectedAccounts: {
        create: {
          provider: "github",
          providerUserId: identity.providerUserId,
          scope: input.accountScope,
        },
      },
      developerProfile: {
        create: {
          avatarUrl: identity.avatarUrl,
          displayName: identity.name ?? identity.username,
          githubUsername: identity.username,
          handle,
          primarySkills: [],
        },
      },
    },
    include: { developerProfile: true },
  });
}

async function findAvailableHandle(prisma: PrismaClient, username: string) {
  const baseHandle = toHandleCandidate(username);

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? baseHandle : `${baseHandle}-${suffix}`;
    const existingProfile = await prisma.developerProfile.findUnique({
      where: { handle: candidate },
      select: { id: true },
    });
    const existingUser = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });

    if (!existingProfile && !existingUser) {
      return candidate;
    }
  }

  return `${baseHandle}-${Date.now()}`;
}
