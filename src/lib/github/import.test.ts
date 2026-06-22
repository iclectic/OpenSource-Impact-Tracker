import { describe, expect, it } from "vitest";
import { mapRepositoryForImport } from "./import";
import type { RepositoryContribution } from "./types";

describe("GitHub import mapping", () => {
  it("maps public repository data into persisted repository fields", () => {
    const repo: RepositoryContribution = {
      id: 123,
      name: "impact-tracker",
      fullName: "demo/impact-tracker",
      description: "Evidence-first profile app",
      htmlUrl: "https://github.com/demo/impact-tracker",
      homepageUrl: "https://impact.example.com",
      language: "TypeScript",
      stars: 10,
      forks: 2,
      watchers: 11,
      openIssues: 1,
      updatedAt: "2026-06-01T00:00:00.000Z",
      pushedAt: "2026-06-02T00:00:00.000Z",
      isFork: false,
      isPrivate: false,
    };

    const mapped = mapRepositoryForImport("user-1", repo);

    expect(mapped).toMatchObject({
      description: "Evidence-first profile app",
      forks: 2,
      fullName: "demo/impact-tracker",
      githubRepoId: BigInt(123),
      homepageUrl: "https://impact.example.com",
      isFork: false,
      isPrivate: false,
      language: "TypeScript",
      name: "impact-tracker",
      openIssues: 1,
      stars: 10,
      url: "https://github.com/demo/impact-tracker",
      userId: "user-1",
      watchers: 11,
    });
    expect(mapped.pushedAt).toEqual(new Date("2026-06-02T00:00:00.000Z"));
  });
});
