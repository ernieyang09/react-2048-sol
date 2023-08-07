import { PropsWithChildren } from 'react'
import { styled } from '@linaria/react'
import { MediaMobile } from '@/style'
import Grid from './Grid'
import Tile, { TileProps } from './Tile'

const SBoard = styled.div`
  position: relative;
  width: 497px;
  height: 497px;
  background: #9a9a95;
  padding: var(--grid-gap);
  margin: 0 auto;

  .container {
    position: relative;
  }

  ${MediaMobile} {
    width: 260px;
    height: 260px;
  }
`

const Board: React.FC<PropsWithChildren> & { Tile: typeof Tile } = ({ children }) => (
  <SBoard>
    <div className="container">
      <Grid />
      {children}
    </div>
  </SBoard>
)

Board.Tile = Tile

export type { TileProps }

export default Board
