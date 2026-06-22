import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImpactDashboard } from "./ImpactDashboard";
import type { GitHubContributionSummary } from "@/lib/github/types";

const mockSummary: GitHubContributionSummary = {
  profile: {
    login: "octocat",
    name: "The Octocat",
    avatarUrl: "https://github.com/images/error/octocat_happy.gif",
    htmlUrl: "https://github.com/octocat",
    bio: "GitHub mascot",
    publicRepos: 8,
    followers: 100,
    following: 9,
  },
  repositories: [
    {
      id: 1,
      name: "Hello-World",
      fullName: "octocat/Hello-World",
      description: "My first repository",
      htmlUrl: "https://github.com/octocat/Hello-World",
      language: "Ruby",
      stars: 80,
      forks: 9,
      openIssues: 1,
      updatedAt: "2026-06-01T00:00:00Z",
      isFork: false,
    },
  ],
  pullRequests: [
    {
      id: 2,
      title: "Improve docs",
      htmlUrl: "https://github.com/example/project/pull/1",
      repositoryUrl: "https://api.github.com/repos/example/project",
      repositoryName: "example/project",
      state: "open",
      createdAt: "2026-06-01T00:00:00Z",
      updatedAt: "2026-06-02T00:00:00Z",
      type: "pull_request",
    },
  ],
  issues: [
    {
      id: 3,
      title: "Bug report",
      htmlUrl: "https://github.com/example/project/issues/2",
      repositoryUrl: "https://api.github.com/repos/example/project",
      repositoryName: "example/project",
      state: "closed",
      createdAt: "2026-06-03T00:00:00Z",
      updatedAt: "2026-06-04T00:00:00Z",
      type: "issue",
    },
  ],
  totals: {
    repositories: 1,
    sourceRepositories: 1,
    forkedRepositories: 0,
    pullRequests: 1,
    issues: 1,
    stars: 80,
  },
  limits: ["Public unauthenticated lookup only."],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ImpactDashboard", () => {
  it("renders the GitHub profile search form", () => {
    render(<ImpactDashboard />);

    expect(
      screen.getByRole("heading", {
        name: /search a github user's open-source contributions/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("GitHub profile URL")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText(/public GitHub data only/i)).toBeInTheDocument();
  });

  it("submits the profile URL and renders contribution results", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockSummary,
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ImpactDashboard />);

    await user.type(
      screen.getByLabelText("GitHub profile URL"),
      "https://github.com/octocat",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contributions?profileUrl=https%3A%2F%2Fgithub.com%2Foctocat",
    );
    expect(
      await screen.findByRole("heading", { name: "The Octocat" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Public repositories" }),
    ).toBeInTheDocument();
    expect(screen.getByText("octocat/Hello-World")).toBeInTheDocument();
    expect(screen.getByText("Improve docs")).toBeInTheDocument();
    expect(screen.getByText("Bug report")).toBeInTheDocument();
    expect(screen.getByText("Public unauthenticated lookup only.")).toBeInTheDocument();
  });

  it("shows an error when lookup fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "GitHub user not found." }),
      }),
    );

    render(<ImpactDashboard />);

    await user.type(screen.getByLabelText("GitHub profile URL"), "missing-user");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "GitHub user not found.",
    );
  });
});
