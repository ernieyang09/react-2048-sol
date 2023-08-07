import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import Abi from '@/libs/GAME2048ContractAbi.json'
import Address from '@/libs/GAME2048ContractAddress.json'
import { GAME2048 } from '@/types/contracts'

const useContract = ({ needSigner = true }) => {
  const { provider } = useWeb3React()

  const contract = useMemo(() => {
    if (!provider) {
      return null
    }
    // todo
    const signerOrProvider = needSigner ? provider?.getSigner() : provider
    return new ethers.Contract(Address, Abi, signerOrProvider)
  }, [provider, needSigner])

  return contract as GAME2048
}

export default useContract
