import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders a link when href is provided", () => {
    render(<Button href="/contact">Contact</Button>);
    const el = screen.getByRole("link", { name: "Contact" });
    expect(el).toHaveAttribute("href", "/contact");
  });

  it("renders a button element otherwise", () => {
    render(<Button>Envoyer</Button>);
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });
});
