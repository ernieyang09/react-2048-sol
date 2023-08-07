import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { ConnectionType, getConnection, PRIORITIZED_CONNECTORS } from './connections'

const Web3Provider = ({ children }) => {
  console.log(1)

  return (
    <Web3ReactProvider
      connectors={Object.values(PRIORITIZED_CONNECTORS).map((connector) => [
        connector.connector,
        connector.hooks,
      ])}>
      {children}
    </Web3ReactProvider>
  )
}

export default Web3Provider

{
  /* export const useWeb3Context = () => {
  const { web3ProviderData } = useContext(Web3Context)
  if (Object.keys(web3ProviderData).length === 0) {
    throw new Error(
      'useWeb3Context() can only be used inside of <Web3ContextProvider />, ' +
        'please declare it at a higher level.',
    )
  }

  return web3ProviderData
} */
}
