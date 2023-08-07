type NUM2048 = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048

type Tile = {
  id: number
  value: NUM2048
  x: number
  y: number
  update?: undefined | 'value' | 'delete'
}

type Board = {
  [id: number]: Tile
}

export type { Tile, Board }
