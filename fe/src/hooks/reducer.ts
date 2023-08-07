import { Board } from '@/types/Tile'
import { updateBoard } from '@/utils/Board'
let idx = 99

interface IState {
  tiles: Board
  stateChanging: boolean
}

export const initState: IState = {
  tiles: {},
  stateChanging: false,
}

type ACTION_MOVE_TILE = { type: 'MOVE_TILE'; payload: Board }
type ACTION_CREATE_TILE = { type: 'CREATE_TILE' }
type ACTION_UPDATE_TILE = { type: 'UPDATE_TILE' }
type ACTION_START_MOVE = { type: 'START_MOVE' }
type ACTION_END_MOVE = { type: 'END_MOVE' }
type ACTION_EMPTY_BOARD = { type: 'EMPTY_BOARD' }

export type TypeAction =
  | ACTION_MOVE_TILE
  | ACTION_CREATE_TILE
  | ACTION_UPDATE_TILE
  | ACTION_START_MOVE
  | ACTION_END_MOVE
  | ACTION_EMPTY_BOARD

const createTile = (tiles: Board) => {
  // maybe split condition into another function
  const set = new Set([...Array(16).keys()])

  for (const tile of Object.values(tiles)) {
    set.delete(tile.x * 4 + tile.y)
  }

  if (set.size === 0) {
    return undefined
  }

  const items = Array.from(set)
  const positionIdx = items[Math.floor(Math.random() * items.length)]

  return {
    id: idx++,
    x: Math.floor(positionIdx / 4),
    y: positionIdx % 4,
    value: Math.random() < 0.9 ? (2 as const) : (4 as const),
    update: undefined,
  }
}

// TODO optimize move function(extract)
export const reducer = (state: IState, action: TypeAction): IState => {
  switch (action.type) {
    case 'START_MOVE': {
      return {
        ...state,
        stateChanging: true,
      }
    }
    case 'END_MOVE': {
      return {
        ...state,
        stateChanging: false,
      }
    }
    case 'MOVE_TILE': {
      const tiles = action.payload
      return {
        ...state,
        tiles: {
          ...tiles,
        },
      }
    }
    case 'CREATE_TILE': {
      const { tiles } = state

      const tile = createTile(tiles)

      return {
        ...state,
        tiles: {
          ...state.tiles,
          ...(tile && { [tile.id]: tile }),
        },
      }
    }
    case 'EMPTY_BOARD': {
      return {
        ...initState,
      }
    }
    case 'UPDATE_TILE': {
      const { tiles } = state
      const newBoard = updateBoard(tiles)
      const tile = createTile(newBoard)

      return {
        ...state,
        tiles: {
          ...newBoard,
          ...(tile && { [tile.id]: tile }),
        },
      }
    }
    default:
      return state
  }
}
