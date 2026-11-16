export const WinMessage = ({moves, playerScore, cpuScore}) => {
    let result, winner;

    if (playerScore > cpuScore){
        result = "You Won!"
        winner = "player"
    }
    else if(cpuScore > playerScore){
        result = "You Lost!"
        winner = "cpu"
    }
    else{
        result = "Draw!"
    }
    return (
        <div className="win-message">
            <h2>{result}</h2>
            <p>Winner's score is {winner === "player" ? playerScore : cpuScore}! This game took {moves} moves!</p>
        </div>
    );
}