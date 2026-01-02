import { keccak256 } from "js-sha3";
import { z } from "zod";

export type CredentialStatus = "active" | "revoked";

export const templateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  issuer: z.string().min(1),
  program: z.string().min(1),
  badgeImageUrl: z.string().url(),
  fields: z.array(
    z.object({
      key: z.string().min(1),
      label: z.string().min(1),
      type: z.enum(["string", "number", "date"])
    })
  )
});

export const issuanceMetadataSchema = z.object({
  credentialId: z.string().uuid(),
  templateId: z.string().uuid(),
  recipientWallet: z.string().min(1),
  issuedAt: z.string(),
  fields: z.record(z.string(), z.string())
});

export type TemplateInput = z.infer<typeof templateSchema>;
export type IssuanceMetadata = z.infer<typeof issuanceMetadataSchema>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (isObject(value)) {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = canonicalize(value[key]);
        return acc;
      }, {});
  }
  return value;
};

export const canonicalizeJson = (value: unknown): string => {
  return JSON.stringify(canonicalize(value));
};

export const hashMetadata = (value: unknown): string => {
  const canonical = canonicalizeJson(value);
  return `0x${keccak256(canonical)}`;
};

export const verifyHash = (value: unknown, expectedHash: string): boolean => {
  return hashMetadata(value).toLowerCase() === expectedHash.toLowerCase();
};
