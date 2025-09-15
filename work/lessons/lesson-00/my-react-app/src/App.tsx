import { useState } from 'react'
import './App.css'


function App() {
  const [count, setCount] = useState<number>(0)
  const [name, setName] = useState<string>("");
  const [showName, setShowName] = useState<boolean>(true);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My name is Jingying Chen!</h1>
        <p>This is my first React Vite TypeScript project.</p>
        <button className="custom-btn" onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
        <div className="input-section">
          <input
            className="custom-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button className="custom-btn" onClick={() => setShowName(!showName)}>
            {showName ? "Hide Name" : "Show Name"}
          </button>
        </div>
        {showName && name && (
          <p className="greeting">Hello, {name}!</p>
        )}
      </header>
    </div>
  )
}

export default App