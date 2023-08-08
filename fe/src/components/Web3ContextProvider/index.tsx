import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { PRIORITIZED_CONNECTORS } from './connections'

import { PropsWithChildren, createContext, useContext, useMemo } from 'react'

interface IWrapContext {
  isCorrectNetwork: boolean
}

const WrapContext = createContext({} as ReturnType<typeof useWeb3React> & IWrapContext)

const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const original = useWeb3React()

  const isCorrectNetwork = original.isActive && original.chainId === 31337

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

const Web3Provider = ({ children }) => {
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
