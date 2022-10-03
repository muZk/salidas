import logo from './logo.svg';
import './App.css';
import Hero from './Hero';
import { useState } from 'react';
import Expense from './Expense';

function App() {
  const [screen, setScreen] = useState("hero");

  return (
    <div className="App">
      {screen === "hero" ? <Hero onClick={() => setScreen("expense")} /> : <Expense />}
    </div>
  );
}

export default App;
