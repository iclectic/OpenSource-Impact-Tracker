export type GitHubProfile = {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
};

export type RepositoryContribution = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
  isFork: boolean;
};

export type IssueContribution = {
  id: number;
  title: string;
  htmlUrl: string;
  repositoryUrl: string;
  repositoryName: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  type: "pull_request" | "issue";
};

export type GitHubContributionSummary = {
  profile: GitHubProfile;
  repositories: RepositoryContribution[];
  pullRequests: IssueContribution[];
  issues: IssueContribution[];
  totals: {
    repositories: number;
    sourceRepositories: number;
    forkedRepositories: number;
    pullRequests: number;
    issues: number;
    stars: number;
  };
  limits: string[];
};
