import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

// next-intl's navigation helpers import `next/navigation`, which does not resolve
// cleanly under Vitest's ESM. Mock our navigation module so the component can render.
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

import { LangSwitcher } from "@/components/LangSwitcher";

describe("LangSwitcher", () => {
  it("shows the three locales", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={{}}>
        <LangSwitcher />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("FR")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("ع")).toBeInTheDocument();
  });
});
