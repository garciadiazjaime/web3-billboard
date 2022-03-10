import Head from 'next/head'
import { useEffect, useState } from 'react'

import styles from '../styles/Home.module.css'
import Alert from '../components/alert/alert'
import Connect from '../components/connect/connect'
import Wallet from '../components/wallet/wallet'
import Billboard from '../components/billboard/billboard'
import { isWeb3Enable, helloWorldContract, getCurrentWalletConnected, loadCurrentMessage } from '../support/interact'
import { subscribe } from '../support/events'
import { getMessage } from '../support/lambda'

export default function Home() {
  const [ walletAddress, setWallet ] = useState('');
  const [ status, setStatus ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ isOnWeb3, setIsOnWeb3 ] = useState();

  async function fetchMessage() {
    const message = await loadCurrentMessage();
    setMessage(message);
  }

  async function fetchWallet() {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address)
    setStatus(status);
  }

  useEffect(() => {
    if (isOnWeb3) {
      return null
    }
    
    getMessage().then(message => {
      setMessage(message)
    })
  })

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
          {isOnWeb3 && <Connect address={walletAddress} />}
          {isOnWeb3 && <Wallet address={walletAddress} section="homepage" />}
          <Billboard message={message} />
    </main>
  )
}
