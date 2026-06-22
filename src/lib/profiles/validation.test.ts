import { describe, expect, it } from "vitest";
import { parseSkillsInput, profileInputSchema } from "./validation";

describe("profile validation", () => {
  it("accepts a valid public profile input", () => {
    expect(
      profileInputSchema.safeParse({
        displayName: "Demo Developer",
        handle: "demo-developer",
        headline: "Open-source maintainer",
        primarySkills: ["TypeScript", "Open source"],
        publicProfileEnabled: true,
        websiteUrl: "https://example.com",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid handles and unsafe URLs", () => {
    expect(
      profileInputSchema.safeParse({
        displayName: "Demo Developer",
        handle: "Bad Handle",
        primarySkills: [],
        publicProfileEnabled: false,
      }).success,
    ).toBe(false);

    expect(
      profileInputSchema.safeParse({
        displayName: "Demo Developer",
        handle: "demo-developer",
        primarySkills: [],
        publicProfileEnabled: false,
        websiteUrl: "http://example.com",
      }).success,
    ).toBe(false);
  });

  it("parses comma-separated skills into trimmed tags", () => {
    expect(parseSkillsInput("TypeScript, Open source, , Community ")).toEqual([
      "TypeScript",
      "Open source",
      "Community",
    ]);
  });
});
