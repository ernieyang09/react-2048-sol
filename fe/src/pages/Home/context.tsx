import React, { createContext, useContext, useMemo } from 'react'

const GameContext = React.createContext({})

const GameContextProvider = ({ gameStatus, score, tiles, children }) => {
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
