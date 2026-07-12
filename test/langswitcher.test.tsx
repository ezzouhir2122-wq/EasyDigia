import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

// next-intl's navigation helpers import `next/navigation`, which does not resolve
// cleanly under Vitest's ESM. Mock our navigation module so the component can render.
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

import { LangSwitcher } from "@/components/LangSwitcher";

function renderSwitcher() {
  return render(
    <NextIntlClientProvider locale="fr" messages={{}}>
      <LangSwitcher />
    </NextIntlClientProvider>
  );
}

describe("LangSwitcher", () => {
  it("shows the current locale on the trigger", () => {
    renderSwitcher();
    expect(screen.getByRole("button", { name: "Changer de langue" })).toHaveTextContent("FR");
  });

  it("opens a menu with the three locales when clicked", async () => {
    renderSwitcher();
    // Menu is closed by default.
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Changer de langue" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("العربية")).toBeInTheDocument();
  });
});
