// import { throttle } from 'lodash'
import { useEffect, useReducer, useCallback, useRef, useState } from 'react'
import { reducer, initState } from './reducer'
import { GameStatus } from '@/constants'
import { checkBoard, updateBoard } from '@/utils/Board'
import { Tile } from '@/types/Tile'

type TileArr = (0 | 1 | Tile)[]
type GetRowOrColumnFn = (arr: TileArr, i: number) => TileArr
type CheckFreeSlotFn = (
  fixRowOrCol: number,
  dynamicRowOrCol: number,
  rowArr: (0 | 1 | Tile)[],
) => number[]

const useGame = () => {
  const recorded = useRef(false)
  const [state, dispatch] = useReducer(reducer, initState)
  const [suspend, setSuspend] = useState(false)
  const { tiles, stateChanging } = state
  const [score, setScore] = useState(0)
  const boardRef = useRef(tiles)

  // const score = Object.values(tiles).reduce((s, c) => s + c.value, 0)
  const gameStatus = stateChanging ? GameStatus.RUNNING : checkBoard(tiles)

  useEffect(() => {
    boardRef.current = tiles
  }, [tiles])

  const move = useCallback(
    (getRowOrColumn: GetRowOrColumnFn, checkFreeSlot: CheckFreeSlotFn) => {
      dispatch({ type: 'START_MOVE' })
      const updated = updateBoard(tiles)
      const tileArr = Array(16).fill(0)
      for (const tile of Object.values(updated)) {
        const { x, y } = tile
        tileArr[x * 4 + y] = tile
      }

      let currentScore = score

      for (let i = 0; i < 4; i++) {
        let prevTile
        const rowArr = getRowOrColumn(tileArr, i)
        for (let j = 0; j < 4; j++) {
          const currentTile = rowArr[j]
          if (currentTile == 0 || currentTile == 1) {
            continue
          }
          if (prevTile && prevTile.update !== 'delete' && prevTile.value === currentTile.value) {
            currentTile.x = prevTile.x
            currentTile.y = prevTile.y
            prevTile.update = 'value'
            currentTile.update = 'delete'

            updated[currentTile.id] = currentTile
            updated[prevTile.id] = prevTile
            rowArr[j] = 0
            currentScore += prevTile.value * 2
          }

          if (currentTile.update !== 'delete') {
            const position = checkFreeSlot(i, j, rowArr)

            if (position[0] != currentTile.x || position[1] != currentTile.y) {
              currentTile.x = position[0]
              currentTile.y = position[1]
              updated[currentTile.id] = currentTile
            }
          }

          prevTile = currentTile
        }
      }

      setScore(currentScore)

      if (Object.keys(updated).length) {
        dispatch({ type: 'MOVE_TILE', payload: updated })

        setTimeout(() => {
          dispatch({ type: 'UPDATE_TILE' })
          dispatch({ type: 'END_MOVE' })
        }, 125)
      } else {
        dispatch({ type: 'END_MOVE' })
      }
    },
    [tiles, score],
  )

  const moveUp = useCallback(() => {
    const checkFreeSlot: CheckFreeSlotFn = (y, x, rowArr) => {
      let newX = x
      for (let i = 0; i < x; i++) {
        if (rowArr[i] == 0) {
          newX = i
          rowArr[i] = 1
          rowArr[x] = 0
          break
        }
      }
      return [newX, y]
    }

    const getRowOrColumn: GetRowOrColumnFn = (tileArr, i) => {
      const rowArr: TileArr = []
      for (let j = 0; j < 4; j++) {
        rowArr.push(tileArr[i + j * 4])
      }
      return rowArr
    }

    move(getRowOrColumn, checkFreeSlot)
  }, [move])

  const moveDown = useCallback(() => {
    const checkFreeSlot: CheckFreeSlotFn = (y, x, rowArr) => {
      let newX = 3 - x

      for (let i = 0; i < x; i++) {
        if (rowArr[i] == 0) {
          newX = 3 - i
          rowArr[i] = 1
          rowArr[x] = 0
          break
        }
      }
      return [newX, y]
    }

    const getRowOrColumn: GetRowOrColumnFn = (tileArr, i) => {
      const rowArr: TileArr = []
      for (let j = 0; j < 4; j++) {
        rowArr.push(tileArr[i + j * 4])
      }
      rowArr.reverse()
      return rowArr
    }

    move(getRowOrColumn, checkFreeSlot)
  }, [move])

  const moveRight = useCallback(() => {
    const checkFreeSlot: CheckFreeSlotFn = (x, y, rowArr) => {
      let newY = 3 - y
      for (let i = 0; i < y; i++) {
        if (rowArr[i] == 0) {
          newY = 3 - i
          rowArr[i] = 1
          rowArr[y] = 0
          break
        }
      }
      return [x, newY]
    }

    const getRowOrColumn: GetRowOrColumnFn = (tileMap, i) => {
      const arr = tileMap.slice(i * 4, i * 4 + 4)
      arr.reverse()
      return arr
    }

    move(getRowOrColumn, checkFreeSlot)
  }, [move])

  const moveLeft = useCallback(() => {
    const checkFreeSlot: CheckFreeSlotFn = (x, y, rowArr) => {
      let newY = y
      for (let i = 0; i < y; i++) {
        if (rowArr[i] == 0) {
          newY = i
          rowArr[i] = 1
          rowArr[y] = 0
          break
        }
      }
      return [x, newY]
    }

    const getRowOrColumn: GetRowOrColumnFn = (tileMap, i) => {
      const arr = tileMap.slice(i * 4, i * 4 + 4)
      return arr
    }

    move(getRowOrColumn, checkFreeSlot)
  }, [move])

  const start = useCallback(() => {
    dispatch({ type: 'EMPTY_BOARD' })
    dispatch({ type: 'CREATE_TILE' })
    dispatch({ type: 'CREATE_TILE' })
    recorded.current = false
  }, [])

  const stop = useCallback(() => {
    setSuspend(true)
  }, [])

  const resume = useCallback(() => {
    setSuspend(false)
  }, [])

  useEffect(() => {
    if ([GameStatus.SUCCESS, GameStatus.FAIL].includes(gameStatus) || suspend) {
      return
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      // disables page scrolling with keyboard arrows
      e.preventDefault()

      switch (e.code) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowUp':
          moveUp()
          break
        case 'ArrowDown':
          moveDown()
          break
      }
    }

    // can add throttle
    // const throttleHandle = throttle(handleKeyDown, 150)

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [moveLeft, moveRight, moveUp, moveDown, gameStatus, suspend])

  return {
    start,
    stop,
    resume,
    tiles,
    score,
    gameStatus,
  }
}

export default useGame
