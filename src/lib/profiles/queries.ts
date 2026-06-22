import { getPrismaClient } from "@/lib/db";

export async function getEditableProfile(userId: string) {
  const prisma = getPrismaClient();

  return prisma.developerProfile.findUnique({
    where: { userId },
  });
}

export async function getPublicProfileByHandle(handle: string) {
  const prisma = getPrismaClient();

  return prisma.developerProfile.findFirst({
    where: {
      handle,
      publicProfileEnabled: true,
    },
    include: {
      impactItems: {
        where: {
          status: "published",
          visibility: "public",
        },
        include: { evidenceLinks: true },
        orderBy: [{ featured: "desc" }, { impactDate: "desc" }],
      },
      user: {
        include: {
          githubRepositories: {
            where: { isPrivate: false },
            orderBy: [{ pushedAt: "desc" }, { updatedAt: "desc" }],
            take: 12,
          },
        },
      },
    },
  });
}
