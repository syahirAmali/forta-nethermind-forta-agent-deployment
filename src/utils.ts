const FORTA_CREATE_AGENT_EVENT: string =
  "function createAgent(uint256 agentId, address owner, string calldata metadata, uint256[] calldata chainIds)";

const FORTA_PROXY_ADDRESS: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
const NETHERMIND_DEPLOYER_ADDRESS: string = "0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8";

type provideInputType = {
  proxyAddress: string;
  deployerAddress: string;
  createAgentEvent: string;
};

const BOT_INPUTS: provideInputType = {
  proxyAddress: FORTA_PROXY_ADDRESS,
  deployerAddress: NETHERMIND_DEPLOYER_ADDRESS,
  createAgentEvent: FORTA_CREATE_AGENT_EVENT,
};

export { FORTA_CREATE_AGENT_EVENT, FORTA_PROXY_ADDRESS, NETHERMIND_DEPLOYER_ADDRESS, provideInputType, BOT_INPUTS };
