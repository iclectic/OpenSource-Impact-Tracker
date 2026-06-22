import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo Developer",
      username: "demo",
      avatarUrl: "https://github.com/github.png",
      developerProfile: {
        create: {
          handle: "demo-profile",
          displayName: "Demo Developer",
          headline: "Open-source maintainer and technical educator",
          bio: "A sample profile showing how evidence-backed impact will appear.",
          location: "Remote",
          websiteUrl: "https://example.com",
          githubUsername: "github",
          avatarUrl: "https://github.com/github.png",
          primarySkills: ["Open source", "Technical writing", "Community"],
          publicProfileEnabled: true,
        },
      },
    },
    include: { developerProfile: true },
  });

  if (!user.developerProfile) {
    throw new Error("Seed profile was not created.");
  }

  await prisma.gitHubRepository.upsert({
    where: {
      userId_githubRepoId: {
        userId: user.id,
        githubRepoId: 1,
      },
    },
    update: {},
    create: {
      userId: user.id,
      githubRepoId: 1,
      name: "evidence-impact-profile",
      fullName: "demo/evidence-impact-profile",
      description: "A sample imported GitHub repository.",
      url: "https://github.com/demo/evidence-impact-profile",
      language: "TypeScript",
      stars: 42,
      forks: 7,
      watchers: 42,
      openIssues: 2,
      lastSyncedAt: new Date(),
    },
  });

  await prisma.impactItem.upsert({
    where: {
      profileId_slug: {
        profileId: user.developerProfile.id,
        slug: "developer-impact-talk",
      },
    },
    update: {},
    create: {
      userId: user.id,
      profileId: user.developerProfile.id,
      title: "Developer impact talk",
      slug: "developer-impact-talk",
      description: "A sample talk with evidence attached.",
      category: "talk",
      status: "published",
      visibility: "public",
      impactDate: new Date("2026-06-01T00:00:00.000Z"),
      featured: true,
      tags: ["talk", "community"],
      evidenceLinks: {
        create: {
          url: "https://example.com/talk",
          title: "Event page",
          description: "Public event listing for the sample talk.",
          evidenceType: "event_page",
          verificationStatus: "evidence_provided",
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
