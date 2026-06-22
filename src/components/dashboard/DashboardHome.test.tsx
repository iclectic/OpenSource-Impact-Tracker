import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardHome } from "./DashboardHome";

describe("DashboardHome", () => {
  it("renders dashboard metrics and onboarding empty states", () => {
    render(<DashboardHome />);

    expect(
      screen.getByRole("heading", {
        name: "Build your evidence-backed impact profile.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Profile completeness")).toBeInTheDocument();
    expect(screen.getByText("GitHub repositories")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Impact items" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No GitHub repositories imported yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your public profile is not published yet/i),
    ).toBeInTheDocument();
  });
});
