import { EmptyStateCard } from "@/components/ui/EmptyStateCard";

type ProfileFormValue = {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  displayName: string;
  githubUsername?: string | null;
  handle: string;
  headline?: string | null;
  location?: string | null;
  primarySkills: string[];
  publicProfileEnabled: boolean;
  websiteUrl?: string | null;
};

export function ProfileForm({
  action,
  profile,
}: {
  action: (formData: FormData) => void | Promise<void>;
  profile?: ProfileFormValue | null;
}) {
  if (!profile) {
    return (
      <EmptyStateCard
        description="Sign in with GitHub to create your developer profile before editing public details."
        title="No profile yet"
      />
    );
  }

  return (
    <form action={action} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <Field
        defaultValue={profile.displayName}
        label="Display name"
        name="displayName"
        required
      />
      <Field defaultValue={profile.handle} label="Handle" name="handle" required />
      <Field
        defaultValue={profile.headline ?? ""}
        label="Headline"
        name="headline"
      />
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Bio
        <textarea
          className="min-h-32 rounded-md border border-slate-300 px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          defaultValue={profile.bio ?? ""}
          name="bio"
        />
      </label>
      <Field
        defaultValue={profile.location ?? ""}
        label="Location"
        name="location"
      />
      <Field
        defaultValue={profile.websiteUrl ?? ""}
        label="Website URL"
        name="websiteUrl"
        type="url"
      />
      <Field
        defaultValue={profile.githubUsername ?? ""}
        label="GitHub username"
        name="githubUsername"
      />
      <Field
        defaultValue={profile.avatarUrl ?? ""}
        label="Avatar URL"
        name="avatarUrl"
        type="url"
      />
      <Field
        defaultValue={profile.bannerUrl ?? ""}
        label="Banner URL"
        name="bannerUrl"
        type="url"
      />
      <Field
        defaultValue={profile.primarySkills.join(", ")}
        label="Skills"
        name="primarySkills"
      />
      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          className="h-4 w-4 rounded border-slate-300"
          defaultChecked={profile.publicProfileEnabled}
          name="publicProfileEnabled"
          type="checkbox"
        />
        Publish public profile
      </label>
      <button
        className="w-fit rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        Save profile
      </button>
    </form>
  );
}

function Field({
  defaultValue,
  label,
  name,
  required,
  type = "text",
}: {
  defaultValue: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        className="h-11 rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}
