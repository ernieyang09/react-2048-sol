import { styled } from '@linaria/react'
import MetaMaskIcon from '@/assets/metamask.svg'
import {
  ConnectionType,
  getConnection,
  tryDeactivateConnector,
} from '../Web3ContextProvider/connections'

import { useWrapWeb3ReactContext } from '../Web3ContextProvider'

const SConnectButton = styled.div`
  padding: 6px 12px;
  border: 2px solid #1b9aaa;
  border-radius: 4px;
  color: #1b9aaa;
  cursor: pointer;

  .wrapper {
    display: flex;
    align-items: center;
  }
  .icon {
    margin-right: 4px;
  }
`

const connector = getConnection(ConnectionType.INJECTED).connector

const ConnectButton = () => {
  const { isActive, account, isCorrectNetwork } = useWrapWeb3ReactContext()

  const handleConnect = async () => {
    await connector.activate(31337)
  }

  const handleDisconnect = async () => {
    await tryDeactivateConnector(connector)
  }

  const handleSwitchNetwork = async () => {
    await connector.activate(31337)
  }

  return (
    <SConnectButton
      onClick={
        !isActive ? handleConnect : isCorrectNetwork ? handleDisconnect : handleSwitchNetwork
      }>
      <div className="wrapper">
        <img className="icon" src={MetaMaskIcon} />
        {!isActive && 'Connect'}
        {isActive
          ? isCorrectNetwork
            ? `${account?.slice(0, 4)}...${account?.slice(-4)}`
            : 'Switch Network'
          : null}
      </div>
    </SConnectButton>
  )
}
;``
export default ConnectButton
