import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import Abi from '@/libs/GAME2048ContractAbi.json'
import Address from '@/libs/GAME2048ContractAddress.json'

const useContract = ({ needSigner = true }) => {
  const { provider, ...x } = useWeb3React()

  const contract = useMemo(() => {
    if (!provider) {
      return null
    }
    // todo
    const signerOrProvider = needSigner ? provider?.getSigner() : provider
    return new ethers.Contract(Address, Abi, signerOrProvider)
  }, [provider, needSigner])

  return contract
}

export default useContract
