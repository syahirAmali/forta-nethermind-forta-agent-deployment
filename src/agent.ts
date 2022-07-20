import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";

import { BOT_INPUTS, provideInputType } from "./utils";

export function provideHandleTransaction(botHandlerInputs: provideInputType): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];
    if (txEvent.from != botHandlerInputs.deployerAddress.toLocaleLowerCase()) return findings;
    if (txEvent.to != botHandlerInputs.proxyAddress.toLocaleLowerCase()) return findings;

    const filteredCreateAgentCalls = txEvent.filterFunction(
      botHandlerInputs.createAgentEvent,
      botHandlerInputs.proxyAddress
    );

    filteredCreateAgentCalls.forEach((createAgentFunction) => {
      const { agentId, metadata, chainIds } = createAgentFunction.args;

      findings.push(
        Finding.fromObject({
          name: "Nethermind Forta Bot Deployment Detection",
          description: `Forta Bot with ${agentId} deployed by Nethermind deployer address.`,
          alertId: "NETH-BOT-DEPLOYED-1",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          protocol: "nethermind-forta",
          metadata: {
            agentId: agentId.toString(),
            metadata,
            chainIds: chainIds.toString(),
          },
        })
      );
    });
    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(BOT_INPUTS),
};
