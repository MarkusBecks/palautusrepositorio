const Notification = ({ successMsg, setSuccessMsg, errorMsg, setErrorMsg }) => {
  if (!errorMsg && !successMsg) {
    return null
  }
  if (errorMsg) {
    setTimeout(() => {
      setErrorMsg(null)
    }, 3000)
    return (
      <div className="error">
        {errorMsg}
      </div>
    )
  } if (successMsg) {
    setTimeout(() => {
      setSuccessMsg(null)
    }, 3000)
    return (
      <div className="success">
        {successMsg}
      </div>
    )
  }
}

export default Notification