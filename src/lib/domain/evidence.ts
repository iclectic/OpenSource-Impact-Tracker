export const evidenceTypes = [
  "github",
  "pull_request",
  "issue",
  "article",
  "video",
  "slides",
  "event_page",
  "podcast",
  "screenshot",
  "website",
  "social_post",
  "certificate",
  "document",
  "research_paper",
] as const;

export const verificationStatuses = [
  "verified",
  "evidence_provided",
  "self_reported",
  "pending",
  "rejected",
] as const;

export type EvidenceType = (typeof evidenceTypes)[number];
export type VerificationStatus = (typeof verificationStatuses)[number];
