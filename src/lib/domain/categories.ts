export const impactCategories = [
  "project",
  "article",
  "talk",
  "workshop",
  "meetup",
  "podcast",
  "mentoring",
  "open_source",
  "documentation",
  "research",
  "tutorial",
  "video",
  "community",
  "hackathon",
  "award",
] as const;

export const impactStatuses = ["draft", "published", "archived"] as const;

export const impactVisibilities = ["public", "private", "unlisted"] as const;

export type ImpactCategory = (typeof impactCategories)[number];
export type ImpactStatus = (typeof impactStatuses)[number];
export type ImpactVisibility = (typeof impactVisibilities)[number];
