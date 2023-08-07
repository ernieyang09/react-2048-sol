import { styled } from '@linaria/react'

const Button = styled.div`
  font-family: inherit;
  font-size: 1em;
  border: none;
  background: #1b9aaa;
  letter-spacing: 1px;
  color: white;
  font-weight: 300;
  padding: 0.75em 1.2em;
  border-radius: 3px;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: center;

  &.disabled {
    color: grey;
    background: #f5f5f5;
    pointer-events: none;
  }
`

export default Button
