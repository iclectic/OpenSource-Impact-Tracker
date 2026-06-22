export function parseGitHubUsername(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return null;
  }

  const withoutTrailingSlash = trimmedInput.replace(/\/+$/, "");

  try {
    const parsedUrl = new URL(withoutTrailingSlash);
    const isGitHubUrl =
      parsedUrl.hostname === "github.com" ||
      parsedUrl.hostname === "www.github.com";

    if (!isGitHubUrl) {
      return null;
    }

    const [username] = parsedUrl.pathname.split("/").filter(Boolean);
    return normalizeUsername(username);
  } catch {
    return normalizeUsername(withoutTrailingSlash);
  }
}

function normalizeUsername(username: string | undefined) {
  if (!username) {
    return null;
  }

  return /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)
    ? username
    : null;
}
