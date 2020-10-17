import { Map } from 'immutable'

export type User = {
  id: number
  name: string
}

export type Ledger = Map<string, number>
