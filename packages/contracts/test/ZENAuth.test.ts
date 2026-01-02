import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZENAuth", () => {
  it("issues and revokes credential", async () => {
    const [admin, recipient] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("ZENAuth");
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const credentialId = ethers.keccak256(ethers.toUtf8Bytes("cred-1"));
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("meta"));

    await expect(contract.issueCredential(credentialId, recipient.address, metadataHash))
      .to.emit(contract, "CredentialIssued");

    const stored = await contract.getCredential(credentialId);
    expect(stored.owner).to.equal(recipient.address);
    expect(stored.metadataHash).to.equal(metadataHash);
    expect(stored.status).to.equal(1n);

    await expect(contract.revokeCredential(credentialId)).to.emit(contract, "CredentialRevoked");
    const revoked = await contract.getCredential(credentialId);
    expect(revoked.status).to.equal(2n);
  });
});
