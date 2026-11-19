import { describe, expect, it } from "vitest";
import { waLink, waMessage, waNumber } from "../lib/whatsapp";

describe("whatsapp", () => {
  it("normalise les mobiles marocains", () => {
    expect(waNumber("06 61 29 96 08")).toBe("212661299608");
    expect(waNumber("+212 7 72 28 82 82")).toBe("212772288282");
    expect(waNumber("00212661299608")).toBe("212661299608");
  });
  it("refuse les fixes et formats inconnus", () => {
    expect(waNumber("05 22 98 17 91")).toBeNull();
    expect(waNumber("")).toBeNull();
    expect(waNumber(null)).toBeNull();
  });
  it("adapte le message au secteur", () => {
    expect(waMessage({ company: "Signature immobilier", sector: "Immobilier" })).toContain("agences immobilières");
    expect(waMessage({ name: "X", sector: "Opticien" })).toContain("entreprises marocaines");
    expect(waLink({ phone: "05 22 00 00 00" })).toBeNull();
    expect(waLink({ phone: "0661299608", company: "A&B" })).toMatch(/^https:\/\/wa\.me\/212661299608\?text=.*A%26B/);
  });
});
