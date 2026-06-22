import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicProfilePreview } from "./PublicProfilePreview";

describe("PublicProfilePreview", () => {
  it("renders the public profile sections and empty states", () => {
    render(<PublicProfilePreview handle="demo-profile" />);

    expect(
      screen.getByRole("heading", { name: "Developer Impact Profile" }),
    ).toBeInTheDocument();
    expect(screen.getByText("@demo-profile")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Featured impact" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "GitHub repositories" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Articles" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Talks" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Community work" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No GitHub repositories imported yet/i),
    ).toBeInTheDocument();
  });
});
