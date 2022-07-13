import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
} from "forta-agent";
import agent, {
  FORTA_CREATE_AGENT_EVENT,
  FORTA_PROXY_ADDRESS,
  NETHERMIND_DEPLOYER_ADDRESS,
} from "./agent";

describe("forta agent deployment", () => {
  let handleTransaction: HandleTransaction;
  const mockTxEvent = createTransactionEvent({ transaction: { from: NETHERMIND_DEPLOYER_ADDRESS, to: FORTA_PROXY_ADDRESS }} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("handleTransaction", () => {
    it("returns empty findings if there are no agents created", async () => {
      mockTxEvent.filterFunction = jest.fn().mockReturnValue([]);
      
      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledWith(FORTA_CREATE_AGENT_EVENT, FORTA_PROXY_ADDRESS);
    });

    it("returns a finding if there is a an agent created", async () => {
      const mockDeployAgent = {
        from: NETHERMIND_DEPLOYER_ADDRESS,
        args: {
          agentId: "12345",
          owner: "0x0000000000000000000000000000000000000000",
          metadata: "",
          chainIds: [
            1, 137
          ]
        },
        address: FORTA_PROXY_ADDRESS
      };

      mockTxEvent.filterFunction = jest.fn().mockReturnValue([mockDeployAgent]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Nethermind Forta Bot Deployment Detection",
          description: `Nethermind Forta Bot Deployed with data:  `,
          alertId: "NETH-BOT-DEPLOYED-1",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          protocol: "nethermind-forta",
          metadata: {
            agentId: "12345",
            owner: "0x0000000000000000000000000000000000000000",
            metadata: "",
            chainIds: "1,137"
          },
        })
      ]);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledWith(FORTA_CREATE_AGENT_EVENT, FORTA_PROXY_ADDRESS);
    });
  });
});
