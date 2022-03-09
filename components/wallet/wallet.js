import Link from 'next/link'

import styles from './wallet.module.css'

export default function Wallet({ address, section }) {
  if (!address) {
    return null
  }

  const mask = `${address.slice(0,5)}...${address.slice(-4)}`

  return (
    <div className={styles.wallet}>
      <p>Account: {mask}</p>
      <p>
      {
        section === 'homepage'?
          <Link href="/message">Update Message</Link> :
          <Link href="/">Homepage</Link>
      }
    </p>
    </div>
  )
}
