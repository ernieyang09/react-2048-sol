import { styled } from '@linaria/react'

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--grid-gap);
`
const GridCell = styled.div`
  background: #f8ffe5;
  width: var(--grid-size);
  height: var(--grid-size);
`

// export default Grid

const Grid: React.FC = () => {
  const grids = () => {
    const arr = []
    for (let i = 0; i < 4 * 4; i++) {
      arr.push(<GridCell key={i}></GridCell>)
    }
    return arr
  }
  return <GridWrapper>{grids()}</GridWrapper>
}

export default Grid
