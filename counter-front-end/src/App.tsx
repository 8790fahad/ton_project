import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hook/useMainContract";
import { fromNano } from "ton-core";
import { useTonConnect } from "./hook/useTonConnect";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
  } = useMainContract();
  const { sendIncrement } = useMainContract();
  const { connected } = useTonConnect();
  return (
    <div>
      {JSON.stringify({
        contract_address,
        counter_value,
        recent_sender,
        owner_address,
        contract_balance,
      })}
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          {contract_balance ? (
            <div className="Hint">{fromNano(contract_balance)}</div>
          ) : (
            0
          )}
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
        {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </a>
        )}
      </div>
    </div>
  );
}
export default App;
