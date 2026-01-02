import { describe, expect, it } from "vitest";
import { evaluateVerification } from "./verification";
import { hashMetadata } from "@zauth/shared";

describe("evaluateVerification", () => {
  it("returns valid when hashes match and active", () => {
    const metadata = { foo: "bar" };
    const hash = hashMetadata(metadata);
    const result = evaluateVerification({
      metadata,
      metadataHash: hash,
      chainHash: hash,
      status: "active",
      chainStatus: "active"
    });
    expect(result.status).toBe("valid");
  });

  it("returns revoked when status revoked", () => {
    const metadata = { foo: "bar" };
    const hash = hashMetadata(metadata);
    const result = evaluateVerification({
      metadata,
      metadataHash: hash,
      chainHash: hash,
      status: "revoked",
      chainStatus: "active"
    });
    expect(result.status).toBe("revoked");
  });
});
