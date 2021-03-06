import Head from 'next/head'
import { useEffect, useState } from 'react'

import styles from '../styles/Home.module.css'
import Alert from '../components/alert/alert'
import Connect from '../components/connect/connect'
import Wallet from '../components/wallet/wallet'
import Message from '../components/message/message'
import { isWeb3Enable, getCurrentWalletConnected } from '../support/interact'
import { subscribe } from '../support/events'

export default function Home() {
  const [ walletAddress, setWallet ] = useState('');
  const [ status, setStatus ] = useState('');
  const [ isOnWeb3, setIsOnWeb3 ] = useState();

  async function fetchWallet() {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address)
    setStatus(status); 
  }

  useEffect(() => {
    const { status } = isWeb3Enable()

    if (status) {
      setStatus(status);
      return null
    }

    setIsOnWeb3(true)

    subscribe('event_update', ({ address, status }) => {
      setWallet(address)
      setStatus(status)
    })

    fetchWallet();

    addWalletListener();
  }, [])


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

      {isOnWeb3 && <Wallet address={walletAddress} hideUpdate />}
      {isOnWeb3 && <Connect address={walletAddress} />}
      <Alert message={status} />
      {isOnWeb3 && <Message address={walletAddress} />}
    </main>
  )
}
