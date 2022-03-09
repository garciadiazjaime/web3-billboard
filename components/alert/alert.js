import styles from './alert.module.css'

export default function Alert({ message }) {
  if (!message) {
    return null
  }

  return (
    <div className={styles.alert} dangerouslySetInnerHTML={{__html:message}}/>
  )
}
