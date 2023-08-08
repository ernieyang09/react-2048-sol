import cls from 'classnames'
import { styled } from '@linaria/react'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import { GameStatus } from '@/constants'
import { useGameContext } from '@/pages/Home/context'
import { useWrapWeb3ReactContext } from '@/components/Web3ContextProvider'
import useContract from '@/hooks/useContract'
import { ethers, BigNumber } from 'ethers'

const SGameState = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  place-self: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(85, 85, 85, 0.9);
  z-index: 50;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.5s;

  .text {
    color: white;
    font-size: 2em;
  }
`

const UploadButton = () => {
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const { provider } = useWrapWeb3ReactContext()
  const contract = useContract({ needSigner: true })
  const { gameStatus, tiles, score } = useGameContext()

  const hanndleUpload = async () => {
    setLoading(true)
    try {
      const address = await provider?.getSigner().getAddress()

      if (!address) {
        return
      }

      const payload = {
        gamerAddr: address,
        gameTime: BigNumber.from(new Date().getTime()),
        score: BigNumber.from(score),
        lastBoardState: JSON.stringify(tiles),
        gameStatus,
      }

      const estimatedGas = await contract.estimateGas.uploadRecord(payload)

      const tx = await contract.uploadRecord(
        {
          gamerAddr: address,
          gameTime: ethers.BigNumber.from(new Date().getTime()),
          score: ethers.BigNumber.from(score),
          lastBoardState: JSON.stringify(tiles),
          gameStatus,
        },
        {
          gasLimit: estimatedGas.mul(BigNumber.from(15000)).div(BigNumber.from(10000)), // * 1.5
        },
      )
      await tx.wait()
      setUploaded(true)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  return (
    <Button className={cls({ disabled: loading || uploaded })} onClick={hanndleUpload}>
      {uploaded ? 'Uploaded!' : 'Upload'}
    </Button>
  )
}

const GameOver: React.FC<{ start: () => void }> = ({ start }) => (
  <>
    <div style={{ marginTop: '-4em', marginBottom: '1.5em' }}>
      <div className="text">Game over!</div>
    </div>
    <div>
      <div style={{ marginBottom: '1em' }}>
        <Button onClick={start}>Try again</Button>
      </div>
      <UploadButton />
    </div>
  </>
)

const Congratulation: React.FC<{ start: () => void }> = ({ start }) => (
  <>
    <div style={{ marginTop: '-4em', marginBottom: '1.5em' }}>
      <div className="text">Congratulation!!</div>
    </div>
    <div>
      <Button onClick={start}>Play again</Button>
      <UploadButton />
    </div>
  </>
)

const GameResult: React.FC<{ start: () => void }> = ({ start }) => {
  const [show, setShow] = useState(false)
  const { gameStatus } = useGameContext()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (gameStatus === GameStatus.PENDING) {
      setShow(false)
      return
    }

    // eslint-disable-next-line prefer-const
    timer = setTimeout(() => {
      setShow(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [gameStatus])

  return (
    <SGameState show={show}>
      {gameStatus === GameStatus.SUCCESS && <Congratulation start={start} />}
      {gameStatus === GameStatus.FAIL && <GameOver start={start} />}
    </SGameState>
  )
}

export default GameResult
