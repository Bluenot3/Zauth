// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ZENAuth {
    enum Status {
        None,
        Active,
        Revoked
    }

    struct Credential {
        address owner;
        bytes32 metadataHash;
        Status status;
        uint256 issuedAt;
        uint256 revokedAt;
    }

    address public admin;
    mapping(bytes32 => Credential) private credentials;

    event CredentialIssued(bytes32 indexed credentialId, address indexed owner, bytes32 metadataHash, uint256 issuedAt);
    event CredentialRevoked(bytes32 indexed credentialId, uint256 revokedAt);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCredential(bytes32 credentialId, address owner, bytes32 metadataHash) external onlyAdmin {
        require(credentials[credentialId].status == Status.None, "Already issued");
        credentials[credentialId] = Credential({
            owner: owner,
            metadataHash: metadataHash,
            status: Status.Active,
            issuedAt: block.timestamp,
            revokedAt: 0
        });
        emit CredentialIssued(credentialId, owner, metadataHash, block.timestamp);
    }

    function revokeCredential(bytes32 credentialId) external onlyAdmin {
        Credential storage cred = credentials[credentialId];
        require(cred.status == Status.Active, "Not active");
        cred.status = Status.Revoked;
        cred.revokedAt = block.timestamp;
        emit CredentialRevoked(credentialId, block.timestamp);
    }

    function getCredential(bytes32 credentialId) external view returns (Credential memory) {
        return credentials[credentialId];
    }
}
