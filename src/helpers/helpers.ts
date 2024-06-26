import { ethers } from "ethers";

export const isContract = async (address: string): Promise<boolean> => {
  const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth");
  const code = await provider.getCode(ethers.hexlify(address));
  return code !== "0x";
};

export const getSenderReceiverType = async (
  sender: string,
  receiver: string
): Promise<{ senderIsContract_: boolean; receiverIsContract_: boolean }> => {
  const isContractS = await isContract(sender);
  const isContractR = await isContract(receiver);
  return {
    senderIsContract_: isContractS,
    receiverIsContract_: isContractR,
  };
};
