import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GitHubSyncPanel } from "./GitHubSyncPanel";

describe("GitHubSyncPanel", () => {
  it("renders missing username and empty repository state", () => {
    render(<GitHubSyncPanel repositoryCount={0} syncAction={vi.fn()} />);

    expect(screen.getByText("GitHub username missing")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(
      screen.getByText(/No GitHub repositories imported yet/i),
    ).toBeInTheDocument();
  });

  it("renders sync-ready state when a GitHub username exists", () => {
    render(
      <GitHubSyncPanel
        githubUsername="octocat"
        repositoryCount={3}
        syncAction={vi.fn()}
      />,
    );

    expect(screen.getByText("GitHub connected")).toBeInTheDocument();
    expect(screen.getByText("octocat")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeEnabled();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
