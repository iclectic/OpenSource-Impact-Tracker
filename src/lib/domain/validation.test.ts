import { describe, expect, it } from "vitest";
import {
  evidenceLinkInputSchema,
  evidenceUrlSchema,
  handleSchema,
  impactItemInputSchema,
} from "./validation";
import { evidenceTypes, verificationStatuses } from "./evidence";
import {
  impactCategories,
  impactStatuses,
  impactVisibilities,
} from "./categories";

describe("domain validation", () => {
  it("accepts every supported impact enum value", () => {
    for (const category of impactCategories) {
      expect(
        impactItemInputSchema.safeParse({
          title: "Impact item",
          slug: `item-${category.replaceAll("_", "-")}`,
          category,
          status: impactStatuses[0],
          visibility: impactVisibilities[0],
        }).success,
      ).toBe(true);
    }
  });

  it("accepts every supported evidence enum value", () => {
    for (const evidenceType of evidenceTypes) {
      for (const verificationStatus of verificationStatuses) {
        expect(
          evidenceLinkInputSchema.safeParse({
            url: "https://example.com/evidence",
            title: "Evidence",
            evidenceType,
            verificationStatus,
          }).success,
        ).toBe(true);
      }
    }
  });

  it("rejects unsupported enum values", () => {
    expect(
      impactItemInputSchema.safeParse({
        title: "Impact item",
        slug: "impact-item",
        category: "score",
        status: "published",
        visibility: "public",
      }).success,
    ).toBe(false);

    expect(
      evidenceLinkInputSchema.safeParse({
        url: "https://example.com/evidence",
        title: "Evidence",
        evidenceType: "unknown",
        verificationStatus: "verified",
      }).success,
    ).toBe(false);
  });

  it("validates handles and rejects reserved or malformed values", () => {
    expect(handleSchema.safeParse("demo-profile").success).toBe(true);
    expect(handleSchema.safeParse("dashboard").success).toBe(false);
    expect(handleSchema.safeParse("Bad Handle").success).toBe(false);
    expect(handleSchema.safeParse("-bad").success).toBe(false);
  });

  it("requires HTTPS evidence URLs", () => {
    expect(evidenceUrlSchema.safeParse("https://example.com").success).toBe(
      true,
    );
    expect(evidenceUrlSchema.safeParse("http://example.com").success).toBe(
      false,
    );
    expect(evidenceUrlSchema.safeParse("not-a-url").success).toBe(false);
  });

  it("rejects date ranges where the end is before the start", () => {
    expect(
      impactItemInputSchema.safeParse({
        title: "Impact item",
        slug: "impact-item",
        category: "talk",
        status: "published",
        visibility: "public",
        startDate: "2026-06-02T00:00:00.000Z",
        endDate: "2026-06-01T00:00:00.000Z",
      }).success,
    ).toBe(false);
  });
});
