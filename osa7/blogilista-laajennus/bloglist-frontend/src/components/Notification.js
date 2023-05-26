import { useNotificationValue } from '../NotificationContext'
import styled from 'styled-components'

const NotificationContainer = styled.div`
  font-size: 16px;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 10px 100px;
  margin: 15px;

  &.error {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }
  &.success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }
`

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

  return (
    <NotificationContainer className={notificationClass}>
      {notification.message}
    </NotificationContainer>
  )
}

export default Notification
