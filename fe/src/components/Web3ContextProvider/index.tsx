import { Web3ReactProvider, useWeb3React, Web3ContextType } from '@web3-react/core'
import { PRIORITIZED_CONNECTORS } from './connections'

import { PropsWithChildren, createContext, useContext, useMemo } from 'react'

import { CHAIN_ID } from '@/constants/config'

interface IWrapContext {
  isCorrectNetwork: boolean
}

const WrapContext = createContext({} as Web3ContextType & IWrapContext)

const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const original = useWeb3React()
  original.provider?.getSigner

  const isCorrectNetwork = original.isActive && original.chainId === CHAIN_ID

  const value = useMemo(
    () => ({
      ...original,
      isCorrectNetwork,
    }),
    [original, isCorrectNetwork],
  )

  return <WrapContext.Provider value={value}>{children}</WrapContext.Provider>
}

export const useWrapWeb3ReactContext = () => useContext(WrapContext)

const Web3Provider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Web3ReactProvider
      connectors={Object.values(PRIORITIZED_CONNECTORS).map((connector) => [
        connector.connector,
        connector.hooks,
      ])}>
      <Provider>{children}</Provider>
    </Web3ReactProvider>
  )
}

export default Web3Provider
