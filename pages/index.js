import Head from 'next/head'
import { useEffect, useState } from 'react'

import styles from '../styles/Home.module.css'
import Alert from '../components/alert/alert'
import Connect from '../components/connect/connect'
import Wallet from '../components/wallet/wallet'
import { helloWorldContract, updateMessage, getCurrentWalletConnected, loadCurrentMessage } from '../support/interact'
import { subscribe } from '../support/events'

export default function Home() {
  const [ walletAddress, setWallet ] = useState('');
  const [ status, setStatus ] = useState('');
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState("");

  useEffect(async () => {
    async function fetchMessage() {
      const message = await loadCurrentMessage();
      setMessage(message);
    }
    await fetchMessage();
    addSmartContractListener();

    async function fetchWallet() {
      const { address, status } = await getCurrentWalletConnected();

      setWallet(address)
      setStatus(status); 
    }

    subscribe('wallet_connected', ({ address, status }) => {
      setWallet(address)
      setStatus(status)
    })

    await fetchWallet();
    await addWalletListener();
  }, [])

  function addSmartContractListener() {
    helloWorldContract.events.UpdatedMessages({}, (error, data) => {
      if (error) {
        setStatus(`😥 ${error.message}`);
      } else {
        setMessage(data.returnValues[1]);
      }
    });
  }

  function addWalletListener() {
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log('accountsChanged', accounts)
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  }

  const onUpdatePressed = async () => {
    console.log({newMessage})
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
    setNewMessage('')
  };

  return (
    <div className={styles.container}>
      <Alert message={status} />
      <Connect />
      <Wallet address={walletAddress} />
      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
    </div>
  )
}
