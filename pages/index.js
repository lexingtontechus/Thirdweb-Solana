import { useLogin, useUser, useLogout } from "@thirdweb-dev/react/solana";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useWallet } from "@solana/wallet-adapter-react";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const validateUser = async () => {
  try {
    const response = await fetch("/api/validate", {
      method: "POST",
    });

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.log(error);
  }
};

const Home = () => {
  const { publicKey } = useWallet();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, isLoggedIn } = useUser();
  const [secret, setSecret] = useState();

  const getSecret = async () => {
    const res = await fetch("/api/secret");
    const data = await res.json();
    setSecret(data.message);
  };

  return (
    <div className={styles.container}>
      <WalletMultiButtonDynamic />

      {isLoggedIn ? (
        <button onClick={() => logout()}>Logout</button>
      ) : (
        <button onClick={() => login()}>Login</button>
      )}

      <button onClick={getSecret}>Get Secret</button>

      <pre>Connected Wallet: {publicKey?.toBase58()}</pre>
      <pre>Signed in User: {JSON.stringify(user, undefined, 2)}</pre>
      <pre>Secret: {secret || "N/A"}</pre>
      <div>
        {publicKey ? (
          <button onClick={() => login()}>Sign in with Solana</button>
        ) : (
          <WalletMultiButtonDynamic />
        )}
      </div>
      <div>
        {user ? (
          <div className={styles.container}>
            <p>You are signed in as {user.address}</p>
            <button onClick={validateUser}>Validate user</button>
          </div>
        ) : (
          <div className={styles.container}>Please Sign in.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
