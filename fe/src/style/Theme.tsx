import { styled } from '@linaria/react'
import { MediaMobile, style } from './index'

export default styled.div`
  font-size: 16px;
  --font-color: red;
  --grid-size: ${() => `${style.desktop.grid}px`};
  --grid-gap: ${() => `${style.desktop.gridGap}px`};

  ${MediaMobile} {
    font-size: 14px;
    --grid-size: ${() => `${style.mobile.grid}px`};
    --grid-gap: ${() => `${style.mobile.gridGap}px`};
  }
`
