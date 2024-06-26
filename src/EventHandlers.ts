/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  DaiContract,
  Dai_TransferEntity,
  FiatTokenV2_2Contract,
  FiatTokenV2_2_TransferEntity,
  TetherTokenContract,
  TetherToken_TransferEntity,
  EventsSummaryEntity,
} from "generated";
import { getSenderReceiverType } from "./helpers/helpers";

export const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  dai_TransferCount: BigInt(0),
  fiatTokenV2_2_TransferCount: BigInt(0),
  tetherToken_TransferCount: BigInt(0),
};

DaiContract.Transfer.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

DaiContract.Transfer.handlerAsync(async ({ event, context }) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    dai_TransferCount: currentSummaryEntity.dai_TransferCount + BigInt(1),
  };

  const { senderIsContract_, receiverIsContract_ } =
    await getSenderReceiverType(event.params.src, event.params.dst);

  const dai_TransferEntity: Dai_TransferEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    src: event.params.src,
    dst: event.params.dst,
    wad: event.params.wad,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    senderIsContract: senderIsContract_,
    receiverIsContract: receiverIsContract_,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.Dai_Transfer.set(dai_TransferEntity);
});
FiatTokenV2_2Contract.Transfer.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

FiatTokenV2_2Contract.Transfer.handlerAsync(async ({ event, context }) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    fiatTokenV2_2_TransferCount:
      currentSummaryEntity.fiatTokenV2_2_TransferCount + BigInt(1),
  };

  const { senderIsContract_, receiverIsContract_ } =
    await getSenderReceiverType(event.params.from, event.params.to);

  const fiatTokenV2_2_TransferEntity: FiatTokenV2_2_TransferEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    senderIsContract: senderIsContract_,
    receiverIsContract: receiverIsContract_,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.FiatTokenV2_2_Transfer.set(fiatTokenV2_2_TransferEntity);
});

TetherTokenContract.Transfer.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

TetherTokenContract.Transfer.handlerAsync(async ({ event, context }) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    tetherToken_TransferCount:
      currentSummaryEntity.tetherToken_TransferCount + BigInt(1),
  };

  const { senderIsContract_, receiverIsContract_ } =
    await getSenderReceiverType(event.params.from, event.params.to);

  const tetherToken_TransferEntity: TetherToken_TransferEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    senderIsContract: senderIsContract_,
    receiverIsContract: receiverIsContract_,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.TetherToken_Transfer.set(tetherToken_TransferEntity);
});
