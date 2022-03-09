import { useState } from 'react'
import { updateMessage } from '../../support/interact'
import { publish } from '../../support/events'

import styles from './message.module.css'

export default function Message({ address }) {
  const [ newMessage, setNewMessage ] = useState("");

  const onUpdatePressed = async (walletAddress, newMessage) => {
    const { status } = await updateMessage(walletAddress, newMessage);
  
    publish('event_update', {
      status,
      address,
    })
  
    setNewMessage('')
  };

  return (
    <div className={styles.message}>
      <p>
        <strong>Tell something to the world 🙂.</strong>
      </p>
      <input
        type="text"
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}
        maxLength="240"
      />

      <br />

      <a id="publish" onClick={() => onUpdatePressed(address, newMessage)}>
        Update
      </a>
    </div>
  )
}
