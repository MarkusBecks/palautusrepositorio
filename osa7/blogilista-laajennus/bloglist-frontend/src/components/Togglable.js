import React, { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { FormButton, Wrapper } from './LoginForm'

const Togglable = forwardRef(({ openLabel, closeLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <Wrapper>
      <div style={hideWhenVisible}>
        <FormButton onClick={toggleVisibility}>{openLabel}</FormButton>
      </div>
      <div style={showWhenVisible}>
        {children}
        <FormButton onClick={toggleVisibility}>{closeLabel}</FormButton>
      </div>
    </Wrapper>
  )
})

Togglable.propTypes = {
  openLabel: PropTypes.string.isRequired,
  closeLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
