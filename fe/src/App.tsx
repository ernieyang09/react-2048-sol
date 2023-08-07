import Web3ContextProvider from '@/components/Web3ContextProvider'
import Home from '@/pages/Home'
import Theme from '@/style/Theme'

function App() {
  return (
    <Web3ContextProvider>
      <Theme>
        <Home />
      </Theme>
    </Web3ContextProvider>
  )
}

export default App
