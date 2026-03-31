
import { Provider } from 'react-redux'
import './App.css'
import { store } from './app/store'

function App() {

  return (
     <Provider store={store}>

      <h1 className="text-3xl font-bold ">Chatbox App</h1>
     
    </Provider>
  )
}

export default App
