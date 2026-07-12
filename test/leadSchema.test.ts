import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/leadSchema";

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    const r = leadSchema.safeParse({
      name: "Ali",
      email: "ali@test.com",
      message: "Bonjour",
      locale: "fr",
    });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const r = leadSchema.safeParse({
      name: "Ali",
      email: "not-an-email",
      message: "Bonjour",
      locale: "fr",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const r = leadSchema.safeParse({
      name: "Ali",
      email: "ali@test.com",
      message: "",
      locale: "fr",
    });
    expect(r.success).toBe(false);
  });
});
