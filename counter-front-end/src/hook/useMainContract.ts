import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
    contract_balance: number;
  }>();

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQCS7PUYXVFI-4uvP1_vZsMVqLDmzwuimhEPtsyQKIcdeNPu") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));
  useEffect(() => {
    async function getValue() {
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const bal = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
        contract_balance: bal.balance,
      });
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    ...contractData,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);
    },
  };
}
