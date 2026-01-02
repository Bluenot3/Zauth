import { describe, expect, it } from "vitest";
import { hashMetadata, verifyHash } from "./index";

describe("hashing", () => {
  it("canonicalizes and hashes deterministically", () => {
    const a = { b: 2, a: 1 };
    const b = { a: 1, b: 2 };
    expect(hashMetadata(a)).toBe(hashMetadata(b));
  });

  it("verifies expected hash", () => {
    const payload = { alpha: "beta" };
    const hash = hashMetadata(payload);
    expect(verifyHash(payload, hash)).toBe(true);
  });
});
