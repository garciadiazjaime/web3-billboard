import { connectWallet } from '../../support/interact'
import { publish } from '../../support/events'

async function clickHandler() {

  const { address, status } = await connectWallet();

  publish('wallet_connected', {
    address,
    status,
  })
}

export default function Connect() {
  return (
    <button
      type="button"
      onClick={clickHandler}
      >Connect</button>
  )
}
