import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileForm } from "./ProfileForm";

describe("ProfileForm", () => {
  it("renders editable profile fields", () => {
    render(
      <ProfileForm
        action={vi.fn()}
        profile={{
          displayName: "Demo Developer",
          handle: "demo-profile",
          headline: "Open-source maintainer",
          primarySkills: ["TypeScript", "Community"],
          publicProfileEnabled: true,
        }}
      />,
    );

    expect(screen.getByLabelText("Display name")).toHaveValue("Demo Developer");
    expect(screen.getByLabelText("Handle")).toHaveValue("demo-profile");
    expect(screen.getByLabelText("Headline")).toHaveValue(
      "Open-source maintainer",
    );
    expect(screen.getByLabelText("Skills")).toHaveValue("TypeScript, Community");
    expect(screen.getByLabelText("Publish public profile")).toBeChecked();
  });

  it("renders an empty state when no profile exists", () => {
    render(<ProfileForm action={vi.fn()} profile={null} />);

    expect(screen.getByText("No profile yet")).toBeInTheDocument();
    expect(screen.getByText(/Sign in with GitHub/i)).toBeInTheDocument();
  });
});
