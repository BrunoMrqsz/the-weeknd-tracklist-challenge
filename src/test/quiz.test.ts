import { describe, expect, it } from "vitest";
import { matches, pointsFor } from "@/lib/quiz";

describe("answer matching", () => {
  it("ignores case, spaces and punctuation", () => {
    expect(matches("  cant feel   MY face ", { title: "Can't Feel My Face" })).toBe(true);
  });
  it("ignores accents", () => {
    expect(matches("sao paulo", { title: "São Paulo (feat. Anitta)" })).toBe(true);
  });
  it("does not require featured artists", () => {
    expect(matches("starboy", { title: "Starboy (feat. Daft Punk)" })).toBe(true);
  });
  it("rejects wrong answers", () => {
    expect(matches("blinding light", { title: "Blinding Lights" })).toBe(false);
  });
  it("caps streak bonus at +50", () => {
    expect(pointsFor(1)).toBe(100);
    expect(pointsFor(20)).toBe(150);
  });
});
