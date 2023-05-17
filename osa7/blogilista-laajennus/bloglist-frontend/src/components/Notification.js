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
