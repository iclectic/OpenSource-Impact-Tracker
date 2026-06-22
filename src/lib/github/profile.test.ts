import { describe, expect, it } from "vitest";
import { parseGitHubUsername } from "./profile";

describe("parseGitHubUsername", () => {
  it("extracts usernames from GitHub profile URLs", () => {
    expect(parseGitHubUsername("https://github.com/octocat")).toBe("octocat");
    expect(parseGitHubUsername("https://www.github.com/octocat/")).toBe(
      "octocat",
    );
  });

  it("accepts a bare username", () => {
    expect(parseGitHubUsername("gaearon")).toBe("gaearon");
  });

  it("rejects invalid or non-GitHub input", () => {
    expect(parseGitHubUsername("https://example.com/octocat")).toBeNull();
    expect(parseGitHubUsername("not a user")).toBeNull();
    expect(parseGitHubUsername("")).toBeNull();
  });
});
