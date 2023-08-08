import { createContext, useContext, useMemo, PropsWithChildren } from 'react'
import { GameStatus } from '@/constants'
import { Board } from '@/types/Tile'

interface IGameContext {
  gameStatus: GameStatus
  score: number
  tiles: Board
}

const GameContext = createContext({} as IGameContext)

const GameContextProvider: React.FC<PropsWithChildren & IGameContext> = ({
  gameStatus,
  score,
  tiles,
  children,
}) => {
  const value = useMemo(
    () => ({
      gameStatus,
      score,
      tiles,
    }),
    [gameStatus, score, tiles],
  )
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGameContext = () => useContext(GameContext)

export default GameContextProvider
