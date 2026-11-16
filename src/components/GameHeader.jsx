export const GameHeader = ({playerScore, cpuScore, moves, difficulty, setDifficulty, currentTurn, gameStarted, onStart, onReset, onBack}) => {
    return (
    <div className="game-header">
        <h1>Memory Game</h1>

        {!gameStarted ? (
            <div className = "game-instructions">
                <h2>Instructions</h2>
                <p>Both you and the CPU take turns flipping two cards to find matching pairs.</p>
                <p>Matching pairs earn one point. Finding a match grants the current player another turn.</p>

                <div className="diff-selector">
                    <h2>Choose Difficulty</h2>
                    <div className="difficulty-selector">
                        <button className={`btn ${difficulty === "easy" ? "selected" : ""}`} onClick={() => setDifficulty("easy")}>Easy</button>
                        <button className={`btn ${difficulty === "hard" ? "selected" : ""}`} onClick={() => setDifficulty("hard")}>Hard</button>
                    </div>

                <p>{difficulty === "easy" ? "CPU selects cards randomly." : "CPU remembers previously revealed cards."}</p>

                <button className="btn" onClick={onStart}>Start Game</button>
                </div>
            </div>
        ) : (
            <>
                <div className="stats">
                    <div className="stat-item">
                        <span className="stat-label">Player Score:</span>{" "}
                        <span className="stat-value">{playerScore}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">CPU Score:</span>{" "}
                        <span className="stat-value">{cpuScore}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Moves:</span>{" "}
                        <span className="stat-value">{moves}</span>
                    </div>
                </div>
                <h2 className= "turn-indicator">{currentTurn === "player" ? "Your Turn" : "CPU Turn"}</h2>
                <button className="btn" onClick={onReset}>New Game</button>
                <button className="btn" onClick={onBack}>Back</button>
            </>
        )}
    </div>
    );
};