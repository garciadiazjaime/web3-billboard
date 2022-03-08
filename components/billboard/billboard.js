import styles from './billboard.module.css'

export default function Message({ message }) {
  return (
    <div>
      <div className={styles.billboard} id="billboard">
        {message}
      </div>
    </div>
  )
}
