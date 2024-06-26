import assert from "assert";
import {
  TestHelpers,
  EventsSummaryEntity,
  Dai_TransferEntity,
} from "generated";
const { MockDb, Dai, Addresses } = TestHelpers;

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";

const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  dai_TransferCount: BigInt(0),
  fiatTokenV2_2_TransferCount: BigInt(0),
  tetherToken_TransferCount: BigInt(0),
};

describe("Dai contract Transfer event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock Dai contract Transfer event
  const mockDaiTransferEvent = Dai.Transfer.createMockEvent({
    src: Addresses.defaultAddress,
    dst: Addresses.defaultAddress,
    wad: 0n,
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = Dai.Transfer.processEventAsync({
    event: mockDaiTransferEvent,
    mockDb: mockDbFinal,
  });

  it("Dai_TransferEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualDaiTransferEntity = mockDbUpdated.entities.Dai_Transfer.get(
      mockDaiTransferEvent.transactionHash +
        mockDaiTransferEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedDaiTransferEntity: Dai_TransferEntity = {
      id:
        mockDaiTransferEvent.transactionHash +
        mockDaiTransferEvent.logIndex.toString(),
      src: mockDaiTransferEvent.params.src,
      dst: mockDaiTransferEvent.params.dst,
      wad: mockDaiTransferEvent.params.wad,
      senderIsContract: false,
      receiverIsContract: false,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualDaiTransferEntity,
      expectedDaiTransferEntity,
      "Actual DaiTransferEntity should be the same as the expectedDaiTransferEntity"
    );
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      dai_TransferCount:
        MOCK_EVENTS_SUMMARY_ENTITY.dai_TransferCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualEventsSummaryEntity,
      expectedEventsSummaryEntity,
      "Actual DaiTransferEntity should be the same as the expectedDaiTransferEntity"
    );
  });
});
