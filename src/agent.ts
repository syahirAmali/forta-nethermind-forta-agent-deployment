import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

export const FORTA_CREATE_AGENT_EVENT: string = "function createAgent(uint256 agentId, address owner, string calldata metadata, uint256[] calldata chainIds)";
export const FORTA_PROXY_ADDRESS: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
export const NETHERMIND_DEPLOYER_ADDRESS: string = "0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8";

const handleTransaction: HandleTransaction = async (
    txEvent: TransactionEvent
  ): Promise<Finding[]> => {
  
  const findings: Finding[] = [];

  const fortaCreateAgentFunction = txEvent.filterFunction(
    FORTA_CREATE_AGENT_EVENT,
    FORTA_PROXY_ADDRESS
  );

  if(txEvent.from != NETHERMIND_DEPLOYER_ADDRESS) return findings;

  fortaCreateAgentFunction.forEach((createAgentFunction) => {
    let { agentId, owner, metadata, chainIds } = createAgentFunction.args;

    findings.push(
      Finding.fromObject({
        name: "Nethermind Forta Bot Deployment Detection",
        description: `Nethermind Forta Bot Deployed with data: ${metadata} `,
        alertId: "NETH-BOT-DEPLOYED-1",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        protocol: "nethermind-forta",
        metadata: {
          agentId: agentId.toString(),
          owner,
          metadata,
          chainIds: chainIds.toString()
        },
      })
    );

  });

  return findings;
};

export default {
  handleTransaction,
};
