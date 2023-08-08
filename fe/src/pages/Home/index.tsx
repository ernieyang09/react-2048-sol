import { styled } from '@linaria/react'
import { useEffect, useRef } from 'react'
import { useGame } from '@/hooks'
import ConnectButton from '@/components/ConnectButton'
import Board from '@/components/Board'
import GameResult from '@/components/GameResult'
import RecordBlock from '@/components/Record'
import Button from '@/components/Button'
import { MediaMobile } from '@/style'
import { useWrapWeb3ReactContext } from '@/components/Web3ContextProvider'
import GameContextProvider from './context'

const Grid = styled.div`
  width: 527px;

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

const Container = styled.div`
  margin: 0 auto;
  max-width: 1240px;
  padding: 0 20px;
  margin-bottom: 4em;
`

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 4em;
  justify-content: center;
`

const Faucet = styled.a`
  color: #ef476f;
  text-decoration: none;
  display: inline-block;
`

const Home = () => {
  const { tiles, start, score, gameStatus, stop, resume, destory } = useGame()
  const { isCorrectNetwork } = useWrapWeb3ReactContext()
  const rootRef = useRef<HTMLDivElement>(null)
  rootRef.current

  useEffect(() => {
    if (isCorrectNetwork) {
      start()
    } else {
      destory()
    }
  }, [start, destory, isCorrectNetwork])

  return (
    <GameContextProvider gameStatus={gameStatus} score={score} tiles={tiles}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '2rem' }}>
              <Faucet href="https://sepoliafaucet.com/" target="_blank">
                Faucet Link
              </Faucet>
            </div>
            <ConnectButton />
          </div>
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
        <Wrapper>
          <Grid ref={rootRef}>
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
              {isCorrectNetwork && <Button onClick={start}>New Game</Button>}
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
          </Grid>
          <Grid>
            <RecordBlock rootRef={rootRef} stop={stop} resume={resume} />
          </Grid>
        </Wrapper>
      </Container>
    </GameContextProvider>
  )
}

export default Home
