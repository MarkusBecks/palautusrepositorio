import { NavLink } from 'react-router-dom'
import { useUserValue } from '../UserContext'
import styled from 'styled-components'

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background-color: black;
  color: white;
`
const Menu = styled.ul`
  display: flex;
  list-style: none;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`
const NavLinkStyled = styled(NavLink)`
  padding: 5px;
  margin: 0 10px;
  text-decoration: none;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;

  &.active,
  &:hover {
    color: #00d4ff;
  }
`
export const ButtonStyled = styled.button`
  border-radius: 10px;
  border: none;
  display: inline-block;
  padding: 10px 25px;
  text-decoration: none;
  margin: 5px;
  transition: all 0.15s;
  background: #00d4ff;
  color: black;
  font-size: 16px;

  &:hover,
  &:focus {
    cursor: pointer;
    transform: scale(1.05);
  }
`

const SpanStyled = styled.span`
  padding: 5px;
  display: flex;
  color: #e8e8e8;
  font-size: 14px;
`

const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Navigation = ({ handleLogout }) => {
  const { user } = useUserValue()

  return (
    <NavContainer>
      <Menu>
        <NavLinkStyled
          to="/"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'active' : ''
          }
        >
          home
        </NavLinkStyled>
        <NavLinkStyled
          to="/blogs"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'active' : ''
          }
        >
          blogs
        </NavLinkStyled>
        <NavLinkStyled
          to="/users"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'active' : ''
          }
        >
          users
        </NavLinkStyled>
      </Menu>
      <FlexEnd>
        <SpanStyled>logged in as {user.username}</SpanStyled>
        <ButtonStyled onClick={() => handleLogout(user)}>logout</ButtonStyled>
      </FlexEnd>
    </NavContainer>
  )
}

export default Navigation
