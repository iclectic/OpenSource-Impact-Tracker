import { SiteShell } from "@/components/layout/SiteShell";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getCurrentSession } from "@/lib/auth/session";
import { updateProfileAction } from "@/lib/profiles/actions";
import { getEditableProfile } from "@/lib/profiles/queries";

type SessionUser = {
  id?: string;
};

export default async function EditProfilePage() {
  const session = await getCurrentSession();
  const userId = (session?.user as SessionUser | undefined)?.id;
  const profile = userId ? await getEditableProfile(userId) : null;

  return (
    <SiteShell>
      <main className="mx-auto grid w-full max-w-3xl gap-6 px-5 py-10 sm:px-8 lg:px-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Edit profile
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Control the public identity, skills, links, and publishing state for
            your developer impact profile.
          </p>
        </div>
        <ProfileForm action={updateProfileAction} profile={profile} />
      </main>
    </SiteShell>
  );
}
