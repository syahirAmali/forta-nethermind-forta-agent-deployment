# Nethermind Forta Bot Deployment

## Description

This bot detects when a forta bot is deployed through the Nethermind address

## Supported Chains

- Polygon

## Alerts

- NETH-BOT-DEPLOYED-1
  - Fired when the Nethermind Deployment address at : "0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8", deploys a Forta Agent
  - Severity is always set to "info" 
  - Type is always set to "info" 
  - Metadata fields
    - `agentId`: agentId of the deployed agent
    - `metadata`: ipfs of the metadata of the agent
    - `chainIds`: list of supported chains

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x7b3a2acef6aa72c80eaf036357e11f2ee5931f2eea8b546421e5ea18b299b4ee (CreateAgent Function)
