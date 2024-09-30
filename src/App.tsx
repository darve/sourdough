import './App.scss'

import Quokka from './components/Canvas';
import clip from "./clips/clip";

function App() {
  return (
    <div className="App">
      <Quokka clip={clip} />
    </div>
  )
}

export default App

