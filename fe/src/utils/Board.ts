import { Board, Tile } from '@/types/Tile'
import { GameStatus } from '@/constants'

// maybe make it as class

const updateBoard = (tiles: Board): { [id: number]: Tile } => {
  const newBoard = Object.values(tiles).reduce((a, tile) => {
    if (tile.update === 'delete') {
      return a
    }
    if (tile.update === 'value') {
      return { ...a, [tile.id]: { ...tile, value: tile.value * 2, update: undefined } }
    }
    return { ...a, [tile.id]: { ...tile } }
  }, {})

  return newBoard
}

// time complexity O(2 * n ^ 2)
const checkBoard = (tiles: Board): GameStatus => {
  const tileMap = Array(16).fill(0)
  const currentBoard = Object.values(tiles)

  for (const tile of currentBoard) {
    if (tile.value === 2048) {
      return GameStatus.SUCCESS
    }
    const { x, y } = tile
    tileMap[x * 4 + y] = tile
  }
  if (currentBoard.length !== 16) {
    return GameStatus.PENDING
  }
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (tileMap[i * 4 + j].value === tileMap[i * 4 + j - 1].value) {
        return GameStatus.PENDING
      }
    }
    for (let j = i + 1; j < 4; j++) {
      if (tileMap[i + j * 4].value === tileMap[i + j * 4 - 4].value) {
        return GameStatus.PENDING
      }
    }
  }

  for (let i = 3; i > -1; i--) {
    for (let j = i - 1; j > -1; j--) {
      if (tileMap[i * 4 + j].value === tileMap[i * 4 + j + 1].value) {
        return GameStatus.PENDING
      }
    }
    for (let j = i - 1; j > -1; j--) {
      if (tileMap[i + j * 4].value === tileMap[i + j * 4 + 4].value) {
        return GameStatus.PENDING
      }
    }
  }
  return GameStatus.FAIL
}

export { checkBoard, updateBoard }
