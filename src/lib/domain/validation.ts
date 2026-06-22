import { z } from "zod";
import {
  impactCategories,
  impactStatuses,
  impactVisibilities,
} from "./categories";
import { evidenceTypes, verificationStatuses } from "./evidence";

const reservedHandles = new Set(["admin", "api", "dashboard", "settings"]);

export const handleSchema = z
  .string()
  .trim()
  .min(3, "Handle must be at least 3 characters.")
  .max(39, "Handle must be at most 39 characters.")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]{1,37}[a-z0-9])$/,
    "Use lowercase letters, numbers, and hyphens.",
  )
  .refine((handle) => !reservedHandles.has(handle), {
    message: "This handle is reserved.",
  });

export const evidenceUrlSchema = z
  .url("Enter a valid URL.")
  .refine((value) => value.startsWith("https://"), {
    message: "Evidence URLs must use HTTPS.",
  });

export const impactItemInputSchema = z
  .object({
    title: z.string().trim().min(2).max(120),
    slug: handleSchema,
    description: z.string().trim().max(2000).optional(),
    category: z.enum(impactCategories),
    status: z.enum(impactStatuses),
    visibility: z.enum(impactVisibilities),
    url: evidenceUrlSchema.optional(),
    imageUrl: evidenceUrlSchema.optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),
  })
  .refine(
    (item) =>
      !item.startDate ||
      !item.endDate ||
      new Date(item.endDate) >= new Date(item.startDate),
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    },
  );

export const evidenceLinkInputSchema = z.object({
  url: evidenceUrlSchema,
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().max(500).optional(),
  evidenceType: z.enum(evidenceTypes),
  verificationStatus: z.enum(verificationStatuses),
});
