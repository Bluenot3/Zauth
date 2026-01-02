import { verifyHash } from "@zauth/shared";

export type VerificationResult = {
  hashMatches: boolean;
  chainMatches: boolean;
  status: "valid" | "invalid" | "revoked";
};

export const evaluateVerification = (params: {
  metadata: unknown;
  metadataHash: string;
  chainHash?: string | null;
  status: "active" | "revoked";
  chainStatus?: "active" | "revoked" | "unknown";
}): VerificationResult => {
  const hashMatches = verifyHash(params.metadata, params.metadataHash);
  const chainMatches = params.chainHash
    ? params.chainHash.toLowerCase() === params.metadataHash.toLowerCase()
    : false;

  if (params.status === "revoked" || params.chainStatus === "revoked") {
    return { status: "revoked", hashMatches, chainMatches };
  }

  if (!hashMatches || !chainMatches) {
    return { status: "invalid", hashMatches, chainMatches };
  }

  return { status: "valid", hashMatches, chainMatches };
};
