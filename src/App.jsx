import { useState, useRef } from "react";
import { GameHeader } from "./components/GameHeader";
import { Card } from "./components/Card";
import { WinMessage } from "./components/WinMessage";
import { useGameLogic } from "./hooks/useGameLogic";

const cardValues = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
];

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const {cards, playerScore, cpuScore, moves, currentTurn, isGameComplete, initializeGame, handleCardClick} = useGameLogic(cardValues, difficulty, gameStarted);
  const cardsRef = useRef(null);

  const handleStartGame = () => {
    setGameStarted(true);

    cardsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
  };

  const handleBack = () => {
    initializeGame();
    setGameStarted(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="app">
      <GameHeader playerScore={playerScore} cpuScore={cpuScore} moves={moves} difficulty = {difficulty} setDifficulty = {setDifficulty} currentTurn = {currentTurn} gameStarted = {gameStarted} onStart={handleStartGame} onReset={initializeGame} onBack={handleBack}/>

      {isGameComplete && (<WinMessage
        playerScore={playerScore}
        cpuScore={cpuScore}
        moves={moves}
        />
      )}

      <div className="cards-grid" ref={cardsRef}>
        {cards.map((card) => (
          <Card card={card} onClick={(selectedCard) => {
            if(gameStarted){
              handleCardClick(selectedCard)
            }
          }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
