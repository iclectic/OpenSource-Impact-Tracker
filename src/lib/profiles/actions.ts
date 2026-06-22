"use server";

import { revalidatePath } from "next/cache";
import { getPrismaClient } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { parseSkillsInput, profileInputSchema } from "./validation";

type SessionUser = {
  id?: string;
};

export async function updateProfileAction(formData: FormData) {
  const session = await getCurrentSession();
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    throw new Error("Authentication required.");
  }

  const parsed = profileInputSchema.parse({
    avatarUrl: formData.get("avatarUrl")?.toString() ?? "",
    bannerUrl: formData.get("bannerUrl")?.toString() ?? "",
    bio: formData.get("bio")?.toString() ?? "",
    displayName: formData.get("displayName")?.toString() ?? "",
    githubUsername: formData.get("githubUsername")?.toString() ?? "",
    handle: formData.get("handle")?.toString() ?? "",
    headline: formData.get("headline")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    primarySkills: parseSkillsInput(
      formData.get("primarySkills")?.toString() ?? "",
    ),
    publicProfileEnabled: formData.get("publicProfileEnabled") === "on",
    websiteUrl: formData.get("websiteUrl")?.toString() ?? "",
  });

  const prisma = getPrismaClient();

  await prisma.developerProfile.update({
    where: { userId },
    data: parsed,
  });

  revalidatePath("/dashboard/profile");
  revalidatePath(`/${parsed.handle}`);
}
