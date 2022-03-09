import styles from './connect.module.css'

import { connectWallet } from '../../support/interact'
import { publish } from '../../support/events'

async function clickHandler(event) {
  event.preventDefault()

  const { address, status } = await connectWallet();

  publish('event_update', {
    address,
    status,
  })
}

export default function Connect({ address }) {
  if (address) {
    return null
  }

  return (
    <a
      className={styles.connect}
      type="button"
      onClick={clickHandler}
      >Connect</a>
  )
}
