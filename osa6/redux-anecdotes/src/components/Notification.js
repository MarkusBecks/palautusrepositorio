import { useSelector, useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const { message, display } = useSelector(state => state.notification)

  if (display) {
    dispatch(showNotification)
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: display ? 'block' : 'none'
  }
  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification