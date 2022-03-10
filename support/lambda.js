export async function getMessage() {
  const response = await fetch('./.netlify/functions/message')
  const { message } = await response.json()
  
  return message
}
