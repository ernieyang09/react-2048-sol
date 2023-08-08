import dayjs from 'dayjs'
import { styled } from '@linaria/react'
import { css } from '@linaria/core'
import { useEffect, useRef, useState } from 'react'
import { GameStatus } from '@/constants'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import Board from '@/components/Board'
import useContract from '@/hooks/useContract'
import { useWrapWeb3ReactContext } from '@/components/Web3ContextProvider'
import { GAME2048 } from '@/types/contracts'
import { Board as TBoard } from '@/types/Tile'

const SModal = css`
  top: 15%;
  max-width: 580px;
`

const statusDisplay: { [key in GameStatus.SUCCESS | GameStatus.FAIL]: string } = {
  [GameStatus.SUCCESS]: 'Success',
  [GameStatus.FAIL]: 'Fail',
}

const HeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
`

const SRecord = styled.div`
  border: 1px solid #555;
  color: #555;
  padding: 0.5rem;
  cursor: pointer;
  .first-line {
    display: flex;
    margin-bottom: 0.25rem;
    justify-content: space-between;
    gap: 10px;
  }
  .addr {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .time {
    flex: 0;
    white-space: nowrap;
  }
  .record {
    display: flex;
    justify-content: space-between;
  }

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

interface RecordBlockProps {
  rootRef: React.RefObject<HTMLDivElement>
  stop: () => void
  resume: () => void
}

interface IRecord {
  gamerAddr: string
  gameTime: number
  score: number
  lastBoardState: TBoard
  gameStatus: GameStatus
}

const transformEventToObj = ({
  gameStatus,
  gameTime,
  gamerAddr,
  score,
  lastBoardState,
}: GAME2048.GameStructOutput): IRecord => ({
  gameStatus,
  gameTime: gameTime.toNumber(),
  gamerAddr,
  lastBoardState: JSON.parse(lastBoardState),
  score: score.toNumber(),
})

const Record = ({
  gamerAddr,
  gameTime,
  score,
  gameStatus,
  handleClick,
}: IRecord & { handleClick: () => void }) => {
  return (
    <SRecord onClick={handleClick}>
      <div className="first-line">
        <div className="addr">{gamerAddr}</div>
        <div className="time">{dayjs(gameTime).format('YYYY/MM/DD hh:mm A')}</div>
      </div>
      <div className="record">
        <div>{`Score: ${score}`}</div>
        <div>{`Status: ${statusDisplay[gameStatus as GameStatus.SUCCESS | GameStatus.FAIL]}`}</div>
      </div>
    </SRecord>
  )
}

const LeaderBoardRecord = ({ contract, provider, setSelect }) => {
  const [leaderBoardRecords, setLeaderBoardRecords] = useState<IRecord[]>([])

  useEffect(() => {
    if (!contract) {
      return
    }
    const fetchLeaderBoard = async () => {
      try {
        const res = await contract.getLeaderBoard()
        const boardRecords = res.map(transformEventToObj)
        setLeaderBoardRecords(boardRecords)
      } catch (e) {
        console.log(e)
      }
    }

    fetchLeaderBoard()

    provider?.once('block', () => {
      contract.on('leaderBoardUpdate', fetchLeaderBoard)
    })
  }, [provider, contract])

  return (
    <div>
      {leaderBoardRecords.map((h) => (
        <Record
          key={h.gameTime}
          {...h}
          handleClick={() => {
            setSelect(h.lastBoardState)
          }}
        />
      ))}
    </div>
  )
}

const HistoryRecord = ({ account, contract, setSelect }) => {
  const initRef = useRef(false)
  const [histories, setHistories] = useState<IRecord[]>([])

  useEffect(() => {
    let timeout
    if (!contract) {
      return
    }

    const fetchGamerHistory = async () => {
      const filter = contract.filters.gameUpload()

      const events = await contract.queryFilter(filter, 0, account)
      const records = events
        .map((e) => {
          const r = contract.interface.decodeEventLog('gameUpload', e.data)
          return r[1]
        })
        .map(transformEventToObj)

      setHistories(records)
      initRef.current = true
    }

    const handleEvent = (eventAddr: string, record: GAME2048.GameStructOutput) => {
      if (!initRef.current) {
        return
      }
      if (eventAddr !== account) {
        return
      }
      setHistories((his) => [transformEventToObj(record), ...his])
    }

    contract.on('gameUpload', handleEvent)

    timeout = setTimeout(() => {
      fetchGamerHistory()
    }, 500)

    return () => {
      contract.off('gameUpload', handleEvent)
      clearTimeout(timeout)
    }
  }, [account, contract])
  return (
    <div>
      {histories.map((h) => (
        <Record
          key={h.gameTime}
          {...h}
          handleClick={() => {
            setSelect(h.lastBoardState)
          }}
        />
      ))}
    </div>
  )
}

const RecordBlock: React.FC<RecordBlockProps> = ({ rootRef, stop, resume }) => {
  const [select, setSelect] = useState<undefined | TBoard>(undefined)
  const { provider, account, isCorrectNetwork } = useWrapWeb3ReactContext()
  const contract = useContract({ needSigner: false })

  useEffect(() => {
    if (select === undefined) {
      resume()
    } else {
      stop()
    }
  }, [select, resume, stop])

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <HeaderWrap>
            <div style={{ fontSize: '1.5em', fontWeight: 500 }}>LeaderBoard</div>
          </HeaderWrap>
        </div>
        <div>
          {isCorrectNetwork && (
            <LeaderBoardRecord contract={contract} provider={provider} setSelect={setSelect} />
          )}
        </div>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <HeaderWrap>
          <div style={{ fontSize: '1.5em', fontWeight: 500 }}>Your Record</div>
        </HeaderWrap>
      </div>
      <div>
        {isCorrectNetwork && (
          <HistoryRecord account={account} contract={contract} setSelect={setSelect} />
        )}
      </div>
      <Modal
        open={select !== undefined}
        onClose={() => setSelect(undefined)}
        classNames={{
          modal: SModal,
        }}
        container={rootRef.current}>
        <h2>Last Screenshot</h2>

        <Board>
          {select &&
            Object.entries(select).map(([key, tile]) => (
              <Board.Tile
                key={key}
                number={tile.value}
                X={tile.x}
                Y={tile.y}
                update={tile.update}
              />
            ))}
        </Board>
      </Modal>
    </div>
  )
}

export default RecordBlock
