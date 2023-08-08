import { styled } from '@linaria/react'
import { useEffect, useRef } from 'react'
import { useGame } from '@/hooks'
import ConnectButton from '@/components/ConnectButton'
import Board from '@/components/Board'
import GameResult from '@/components/GameResult'
import RecordBlock from '@/components/Record'
import Button from '@/components/Button'
import { MediaMobile } from '@/style'
import { useWeb3React } from '@web3-react/core'
import GameContextProvider from './context'

const Wrapper = styled.div`
  width: 527px;
  margin: 0 auto;

  ${MediaMobile} {
    width: 320px;
  }
`

const Score = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  line-height: 1;
  color: #555;

  .number {
    margin-left: 1em;
    font-size: 1.5em;
  }
`

const Home = () => {
  const { tiles, start, score, gameStatus, stop, resume } = useGame()
  const { isActive } = useWeb3React()
  const rootRef = useRef<HTMLDivElement>(null)
  rootRef.current

  useEffect(() => {
    if (isActive) {
      start()
    }
  }, [start, isActive])

  return (
    <GameContextProvider gameStatus={gameStatus} score={score} tiles={tiles}>
      <Wrapper ref={rootRef}>
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '2rem' }}>
          <ConnectButton />
        </div>
        <div
          style={{
            fontSize: '3em',
            display: 'flex',
            marginBottom: '2rem',
          }}>
          React
          <div style={{ marginLeft: '8px', letterSpacing: '2px' }}>
            <span style={{ color: '#FFC43D' }}>2</span>
            <span style={{ color: '#EF476F' }}>0</span>
            <span style={{ color: '#1B9AAA' }}>4</span>
            <span style={{ color: '#06D6A0' }}>8</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            height: '3rem',
            alignItems: 'center',
          }}>
          <Score>
            score: <span className="number">{score}</span>
          </Score>
          {isActive && <Button onClick={start}>New Game</Button>}
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <Board>
            {Object.entries(tiles).map(([key, tile]) => (
              <Board.Tile
                key={key}
                number={tile.value}
                X={tile.x}
                Y={tile.y}
                update={tile.update}
              />
            ))}
            <GameResult start={start} />
          </Board>
        </div>
        <RecordBlock rootRef={rootRef} stop={stop} resume={resume} />
      </Wrapper>
    </GameContextProvider>
  )
}

export default Home
