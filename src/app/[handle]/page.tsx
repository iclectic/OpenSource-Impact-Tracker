import { SiteShell } from "@/components/layout/SiteShell";
import { PublicProfilePreview } from "@/components/profile/PublicProfilePreview";
import { getPublicProfileByHandle } from "@/lib/profiles/queries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getProfileIfDatabaseIsConfigured(handle);

  if (!profile && handle !== "demo-profile") {
    notFound();
  }

  return (
    <SiteShell>
      <PublicProfilePreview handle={profile?.handle ?? handle} />
    </SiteShell>
  );
}

async function getProfileIfDatabaseIsConfigured(handle: string) {
  try {
    return await getPublicProfileByHandle(handle);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("DATABASE_URL is required")
    ) {
      return null;
    }

    throw error;
  }
}
