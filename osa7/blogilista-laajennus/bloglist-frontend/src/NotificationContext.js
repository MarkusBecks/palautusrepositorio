import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    case 'ERROR':
      return { type: 'error', message: action.payload }
    case 'SUCCESS':
      return { type: 'success', message: action.payload }
    default:
      return state
  }
}

export const NotificationContextProvider = props => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  const showNotification = (message, type) => {
    console.log('showing notification')
    notificationDispatch({ type: 'SET', payload: { message, type } })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () =>
  useContext(NotificationContext).notification

export const useNotificationDispatch = () =>
  useContext(NotificationContext).showNotification
