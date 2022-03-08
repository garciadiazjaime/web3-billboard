import Head from 'next/head'
import { useEffect, useState } from 'react'

import styles from '../styles/Home.module.css'
import Alert from '../components/alert/alert'
import Connect from '../components/connect/connect'
import Wallet from '../components/wallet/wallet'
import Billboard from '../components/billboard/billboard'
import { helloWorldContract, getCurrentWalletConnected, loadCurrentMessage } from '../support/interact'
import { subscribe } from '../support/events'

export default function Home() {
  const [ walletAddress, setWallet ] = useState('');
  const [ status, setStatus ] = useState('');
  const [message, setMessage] = useState('');

  async function fetchMessage() {
    const message = await loadCurrentMessage();
    setMessage(message);
  }

  async function fetchWallet() {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address)
    setStatus(status); 
  }

  subscribe('wallet_connected', ({ address, status }) => {
    console.log('wallet_connected')
    setWallet(address)
    setStatus(status)
  })

  useEffect(() => { 
    fetchMessage();
    fetchWallet();

    addSmartContractListener();
    addWalletListener();
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
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  }

  return (
    <main className={styles.container}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Alert message={status} />
      <Connect address={walletAddress} />
      <Wallet address={walletAddress} />
      <Billboard message={message} />
    </main>
  )
}
