const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${style}`}>
      {message}
    </div>
  )
}

export default Notification
