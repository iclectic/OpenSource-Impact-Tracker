import { NextResponse } from "next/server";
import {
  fetchGitHubContributionSummary,
  GitHubLookupError,
} from "@/lib/github/client";
import { parseGitHubUsername } from "@/lib/github/profile";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileUrl = searchParams.get("profileUrl") ?? "";
  const username = parseGitHubUsername(profileUrl);

  if (!username) {
    return NextResponse.json(
      { message: "Enter a valid GitHub profile URL or username." },
      { status: 400 },
    );
  }

  try {
    const summary = await fetchGitHubContributionSummary(username);
    return NextResponse.json(summary);
  } catch (error) {
    const status = error instanceof GitHubLookupError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "GitHub lookup failed.";

    return NextResponse.json({ message }, { status });
  }
}
