import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("routing", () => {
  it("supports fr, en, ar with fr default", () => {
    expect(routing.locales).toEqual(["fr", "en", "ar"]);
    expect(routing.defaultLocale).toBe("fr");
  });
});
