import { lighten, darken } from 'polished'
import { styled } from '@linaria/react'
import { useEffect, useState } from 'react'
import { MediaMobile, style } from '@/style'

type NUM2048 = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048

export interface TileProps {
  number: NUM2048
  X: number
  Y: number
  update?: 'value' | 'delete'
}

const STile = styled.div<TileProps & { changed: boolean }>`
  background: #f8ffe5;
  width: var(--grid-size);
  height: var(--grid-size);

  color: white;
  font-size: 1.8em;
  display: flex;
  place-items: center;
  place-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ update }) => (update === 'value' ? 3 : 2)};
  transition-property: transform;
  transition-duration: 125ms;
  animation-timing-function: ease-in-out;
  font-weight: bold;

  transform: ${({ X, Y, changed }) =>
    `translate(${Y * style.desktop.grid + Y * style.desktop.gridGap}px, ${
      X * style.desktop.grid + X * style.desktop.gridGap
    }px) scale(${changed ? '1.1' : '1.0'})`};

  background: ${({ number }) =>
    ({
      2: '#FFC43D',
      4: '#EF476F',
      8: '#1B9AAA',
      16: '#06D6A0',
      32: `${lighten(0.1, '#EF476F')}`,
      64: `${lighten(0.1, '#1B9AAA')}`,
      128: `${lighten(0.1, '#06D6A0')}`,
      256: `${lighten(0.1, '#FFC43D')}`,
      512: `${darken(0.1, '#EF476F')}`,
      1024: `${darken(0.1, '#1B9AAA')}`,
      2048: `${darken(0.1, '#06D6A0')}`,
    })[number] || 'red'};

  ${MediaMobile} {
    transform: ${({ X, Y, changed }) =>
      `translate(${Y * style.mobile.grid + Y * style.mobile.gridGap}px, ${
        X * style.mobile.grid + X * style.mobile.gridGap
      }px) scale(${changed ? '1.1' : '1.0'})`};
  }
`

const Tile: React.FC<TileProps> = ({ number, X, Y, update }) => {
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    setChanged(true)
    setTimeout(() => {
      setChanged(false)
    }, 125)
  }, [number])

  return (
    <STile update={update} number={number} X={X} Y={Y} changed={changed}>
      {number}
    </STile>
  )
}

export default Tile
