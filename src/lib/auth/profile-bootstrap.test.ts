import { describe, expect, it } from "vitest";
import { parseGitHubIdentity, toHandleCandidate } from "./profile-bootstrap";

describe("GitHub profile bootstrap helpers", () => {
  it("parses a GitHub OAuth profile identity", () => {
    expect(
      parseGitHubIdentity({
        id: 123,
        login: "OctoCat",
        name: "The Octocat",
        email: "octocat@example.com",
        avatar_url: "https://github.com/images/error/octocat_happy.gif",
      }),
    ).toEqual({
      avatarUrl: "https://github.com/images/error/octocat_happy.gif",
      email: "octocat@example.com",
      name: "The Octocat",
      providerUserId: "123",
      username: "OctoCat",
    });
  });

  it("rejects profiles without a stable provider id or login", () => {
    expect(parseGitHubIdentity({ id: 123 })).toBeNull();
    expect(parseGitHubIdentity({ login: "octocat" })).toBeNull();
  });

  it("normalizes GitHub logins into public profile handles", () => {
    expect(toHandleCandidate("OctoCat")).toBe("octocat");
    expect(toHandleCandidate("open_source.dev")).toBe("open-source-dev");
    expect(toHandleCandidate("--bad--")).toBe("bad");
    expect(toHandleCandidate("!")).toBe("developer");
  });
});
