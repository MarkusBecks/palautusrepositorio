import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  message: '',
  display: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      const { message, duration } = action.payload
      state.message = message
      state.duration = duration
      state.display = true
    },
    hideNotification: (state) => {
      state.display = false
    }
  }
})

export const { setNotification, hideNotification } = notificationSlice.actions

let timerId = null;

export const showNotification = (message, duration) => {
  return async (dispatch) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    dispatch(setNotification({ message, duration }));

    timerId = setTimeout(() => {
      dispatch(hideNotification());
      timerId = null;
    }, duration * 1000);
  };
};


export default notificationSlice.reducer