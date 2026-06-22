import type {
  GitHubContributionSummary,
  GitHubProfile,
  IssueContribution,
  RepositoryContribution,
} from "./types";

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

type GitHubUserResponse = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

type GitHubRepoResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  fork: boolean;
};

type GitHubSearchIssueResponse = {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  pull_request?: unknown;
};

type GitHubSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubSearchIssueResponse[];
};

export class GitHubLookupError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message);
  }
}

export async function fetchGitHubContributionSummary(
  username: string,
): Promise<GitHubContributionSummary> {
  const [profile, repositories, pullRequestSearch, issueSearch] =
    await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubRepositories(username),
      searchGitHubIssues(`author:${username} type:pr`, "updated"),
      searchGitHubIssues(`author:${username} type:issue`, "updated"),
    ]);

  const pullRequests = pullRequestSearch.items.map((item) =>
    mapIssueContribution(item, "pull_request"),
  );
  const issues = issueSearch.items
    .filter((item) => !item.pull_request)
    .map((item) => mapIssueContribution(item, "issue"));

  return {
    profile,
    repositories,
    pullRequests,
    issues,
    totals: {
      repositories: repositories.length,
      sourceRepositories: repositories.filter((repo) => !repo.isFork).length,
      forkedRepositories: repositories.filter((repo) => repo.isFork).length,
      pullRequests: pullRequestSearch.total_count,
      issues: issueSearch.total_count,
      stars: repositories.reduce((total, repo) => total + repo.stars, 0),
    },
    limits: buildLimitNotes({
      repositoriesReturned: repositories.length,
      pullRequestSearch,
      issueSearch,
    }),
  };
}

async function fetchGitHubUser(username: string): Promise<GitHubProfile> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: githubHeaders,
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    throw new GitHubLookupError("GitHub user not found.", 404);
  }

  await assertGitHubResponse(response);

  const user = (await response.json()) as GitHubUserResponse;

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    htmlUrl: user.html_url,
    bio: user.bio,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
  };
}

async function fetchGitHubRepositories(
  username: string,
): Promise<RepositoryContribution[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?type=all&sort=updated&per_page=100`,
    {
      headers: githubHeaders,
      next: { revalidate: 60 },
    },
  );

  await assertGitHubResponse(response);

  const repositories = (await response.json()) as GitHubRepoResponse[];

  return repositories.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    updatedAt: repo.updated_at,
    isFork: repo.fork,
  }));
}

async function searchGitHubIssues(query: string, sort: "created" | "updated") {
  const params = new URLSearchParams({
    q: query,
    sort,
    order: "desc",
    per_page: "100",
  });
  const response = await fetch(`https://api.github.com/search/issues?${params}`, {
    headers: githubHeaders,
    next: { revalidate: 60 },
  });

  await assertGitHubResponse(response);

  return (await response.json()) as GitHubSearchResponse;
}

async function assertGitHubResponse(response: Response) {
  if (response.ok) {
    return;
  }

  if (response.status === 403) {
    throw new GitHubLookupError(
      "GitHub API rate limit reached. Try again later.",
      403,
    );
  }

  throw new GitHubLookupError("GitHub lookup failed. Try again later.", 502);
}

function mapIssueContribution(
  item: GitHubSearchIssueResponse,
  type: IssueContribution["type"],
): IssueContribution {
  return {
    id: item.id,
    title: item.title,
    htmlUrl: item.html_url,
    repositoryUrl: item.repository_url,
    repositoryName: item.repository_url.replace(
      "https://api.github.com/repos/",
      "",
    ),
    state: item.state,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    type,
  };
}

function buildLimitNotes({
  repositoriesReturned,
  pullRequestSearch,
  issueSearch,
}: {
  repositoriesReturned: number;
  pullRequestSearch: GitHubSearchResponse;
  issueSearch: GitHubSearchResponse;
}) {
  const notes = [
    "Public unauthenticated lookup only. Private contributions and organization-private work are not included.",
    "GitHub search returns at most 1,000 results per search and this app displays the first 100 most recently updated pull requests and issues.",
  ];

  if (repositoriesReturned === 100) {
    notes.push(
      "Repository list is capped at the first 100 public repositories returned by GitHub.",
    );
  }

  if (pullRequestSearch.incomplete_results || issueSearch.incomplete_results) {
    notes.push("GitHub marked one or more search result sets as incomplete.");
  }

  return notes;
}
