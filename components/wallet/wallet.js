export default function Wallet({ address }) {
  if (!address) {
    return null
  }

  return (
    <div>{address}</div>
  )
}
