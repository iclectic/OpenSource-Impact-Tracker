import { auth } from "@/auth";

export async function getCurrentSession() {
  return auth();
}

export async function requireCurrentUser() {
  const session = await getCurrentSession();

  if (!session?.user) {
    throw new Error("Authentication required.");
  }

  return session.user;
}
