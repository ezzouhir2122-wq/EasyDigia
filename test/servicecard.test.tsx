import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "@/components/ServiceCard";

describe("ServiceCard", () => {
  it("renders title and description", () => {
    render(<ServiceCard title="Agents IA" description="Assistants intelligents." />);
    expect(screen.getByRole("heading", { name: "Agents IA" })).toBeInTheDocument();
    expect(screen.getByText("Assistants intelligents.")).toBeInTheDocument();
  });
});
