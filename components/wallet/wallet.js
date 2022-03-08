import styles from './wallet.module.css'

export default function Wallet({ address }) {
  if (!address) {
    return null
  }

  const mask = `${address.slice(0,5)}...${address.slice(-4)}`

  return (
    <div className={styles.wallet}>Account: {mask}</div>
  )
}
