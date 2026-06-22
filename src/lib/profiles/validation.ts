import { z } from "zod";
import { evidenceUrlSchema, handleSchema } from "@/lib/domain/validation";

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  evidenceUrlSchema.optional(),
);

export const profileInputSchema = z.object({
  avatarUrl: optionalUrl,
  bannerUrl: optionalUrl,
  bio: z.string().trim().max(1000).optional(),
  displayName: z.string().trim().min(2).max(80),
  githubUsername: z.string().trim().max(39).optional(),
  handle: handleSchema,
  headline: z.string().trim().max(140).optional(),
  location: z.string().trim().max(120).optional(),
  primarySkills: z.array(z.string().trim().min(1).max(40)).max(20),
  publicProfileEnabled: z.boolean(),
  websiteUrl: optionalUrl,
});

export function parseSkillsInput(input: string) {
  return input
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 20);
}
