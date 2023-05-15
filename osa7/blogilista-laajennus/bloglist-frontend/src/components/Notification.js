/* const Notification = ({ successMsg, setSuccessMsg, errorMsg, setErrorMsg }) => {
  if (!errorMsg && !successMsg) {
    return null
  }
  if (errorMsg) {
    setTimeout(() => {
      setErrorMsg(null)
    }, 3000)
    return <div className="error">{errorMsg}</div>
  }
  if (successMsg) {
    setTimeout(() => {
      setSuccessMsg(null)
    }, 3000)
    return <div className="success">{successMsg}</div>
  }
}

export default Notification
 */

import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  let notificationClass = ''
  if (notification.type === 'error') {
    notificationClass = 'error'
  } else if (notification.type === 'success') {
    notificationClass = 'success'
  }

  return <div className={notificationClass}>{notification.message}</div>
}

export default Notification
