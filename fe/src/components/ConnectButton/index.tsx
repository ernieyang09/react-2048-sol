import { styled } from '@linaria/react'
import { useWeb3React } from '@web3-react/core'
import MetaMaskIcon from '@/assets/metamask.svg'

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

const ConnectButton = () => {
  const { isActive, connector, account } = useWeb3React()

  // useEffect(() => {
  //   const deactivate = async () => {
  //     console.log(1, connector)
  //     await connector.deactivate()
  //   }
  //   if (chainId !== 31337) {
  //     deactivate()
  //   }
  // }, [chainId, connector])

  const handleConnect = async () => {
    try {
      // await connector.activate(11155111)
      await connector.activate(31337)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <SConnectButton onClick={handleConnect}>
      <div className="wrapper">
        <img className="icon" src={MetaMaskIcon} />
        {isActive ? `${account?.slice(0, 4)}...${account?.slice(-4)}` : 'Connect'}
      </div>
    </SConnectButton>
  )
}
;``
export default ConnectButton
