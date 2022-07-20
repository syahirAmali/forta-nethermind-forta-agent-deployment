import { FindingType, FindingSeverity, Finding, HandleTransaction, TransactionEvent, ethers } from "forta-agent";
import { BOT_INPUTS, provideInputType } from "./utils";
import { TestTransactionEvent, createAddress } from "forta-agent-tools/lib/tests";
import { provideHandleTransaction } from "./agent";

const MOCK_FORTA_DISABLE_AGENT: string = "function disableAgent(uint256 agentId, uint8 permission)";
const MOCK_FUNCTION_ABI: string[] = [BOT_INPUTS.createAgentEvent, MOCK_FORTA_DISABLE_AGENT];

const botInputs: provideInputType = {
  proxyAddress: BOT_INPUTS.proxyAddress,
  createAgentEvent: BOT_INPUTS.createAgentEvent,
  deployerAddress: BOT_INPUTS.deployerAddress,
};

const createFinding = (): Finding => {
  return Finding.fromObject({
    name: "Nethermind Forta Bot Deployment Detection",
    description: `Forta Bot with 1234 deployed by Nethermind deployer address.`,
    alertId: "NETH-BOT-DEPLOYED-1",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "nethermind-forta",
    metadata: {
      agentId: "1234",
      metadata: "Metadata",
      chainIds: "1,1234",
    },
  });
};

describe("forta agent deployment", () => {
  let fortaProxy = new ethers.utils.Interface(MOCK_FUNCTION_ABI);

  let handleTransaction: HandleTransaction;
  let txEvent: TransactionEvent;
  let findings: Finding[];

  beforeAll(() => {
    handleTransaction = provideHandleTransaction(botInputs);
  });

  it("returns empty findings if there are no agents created from the deployer address to the proxy address", async () => {
    txEvent = new TestTransactionEvent()
      .setTo(botInputs.proxyAddress)
      .setFrom(botInputs.deployerAddress)
      .addTraces({
        to: botInputs.proxyAddress,
        input: fortaProxy.encodeFunctionData("disableAgent", [1234, 1]),
      });
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("returns findings if there are agents created from the deployer address to the proxy address", async () => {
    txEvent = new TestTransactionEvent()
      .setTo(botInputs.proxyAddress)
      .setFrom(botInputs.deployerAddress)
      .addTraces({
        to: botInputs.proxyAddress,
        input: fortaProxy.encodeFunctionData("createAgent", [1234, createAddress("0x1234"), "Metadata", [1, 1234]]),
      });
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([createFinding()]);
  });

  it("should not return findings if deployed from a different address that is not the deployer", async () => {
    txEvent = new TestTransactionEvent()
      .setTo(botInputs.proxyAddress)
      .setFrom(createAddress("0xa1"))
      .addTraces({
        to: botInputs.proxyAddress,
        input: fortaProxy.encodeFunctionData("createAgent", [1234, createAddress("0x1234"), "Metadata", [1, 1234]]),
      });
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("should not return findings if function is called from an address which is not the forta proxy address", async () => {
    txEvent = new TestTransactionEvent()
      .setTo(createAddress("0xb2"))
      .setFrom(botInputs.deployerAddress)
      .addTraces({
        to: botInputs.proxyAddress,
        input: fortaProxy.encodeFunctionData("createAgent", [1234, createAddress("0x1234"), "Metadata", [1, 1234]]),
      });
    findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });
});
