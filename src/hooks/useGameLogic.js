import { useState, useEffect, useRef } from "react";

export const useGameLogic = (cardValues, difficulty, gameStarted) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCPUScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);  //so player can't click more than two cards in one move
  const [currentTurn, setCurrentTurn] = useState("player");
  const [cpuMemory, setCPUMemory] = useState({});
  const matchTimerRef = useRef(null);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for(let i = shuffled.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled;
  }

  const initializeGame = () => {
    clearTimeout(matchTimerRef.current);
    matchTimerRef.current = null;

    const shuffled = shuffleArray(cardValues);
    const finalCards = shuffled.map((value, index) => (
      {
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
        matchedBy: null,
      }
    ));

    setCards(finalCards);

    setIsLocked(false);
    setMoves(0);
    setPlayerScore(0);
    setCPUScore(0);
    setCurrentTurn("player");
    setMatchedCards([]);
    setFlippedCards([]);
    setCPUMemory({});
  };

  useEffect(() => {
    initializeGame();
  }, []);   //hook? empty array is necessary

  const handleCardClick = (card, isCpuAction = false) => {
    if (!gameStarted){
      return;
    }
    if (card.isFlipped || card.isMatched || isLocked || flippedCards.length === 2 || (currentTurn !== "player" && !isCpuAction)) {
      return;
    }

    if(difficulty === "hard"){
      setCPUMemory((prev) => ({...prev, [card.id]: card.value}));
    }

    const newCards = cards.map((c) => {
      if(c.id === card.id) {
        return {...c, isFlipped: true};  //...c changes value of one property(isFlipped) in c
      }
      else{
        return c;
      }
      }
    );

    setCards(newCards);

    const newFlippedCards = [...flippedCards, card.id]
    setFlippedCards(newFlippedCards);

    if (flippedCards.length === 1){ //check for match if two cards flipped
      setIsLocked(true);
      const firstCard = cards[flippedCards[0]];


      if (firstCard.value === card.value){
        matchTimerRef.current = setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]); // prev is current state of matched cards
          if (currentTurn === "player"){
            setPlayerScore((prev) => prev + 1);
          }
          else {
            setCPUScore((prev) => prev + 1);
          }
          setCards((prev) =>
            prev.map((c) => {
            if(c.id === card.id || c.id === firstCard.id) {
              return {...c, isMatched: true, matchedBy: currentTurn};
            }
            else{
              return c;
            }
            })
          );

          setFlippedCards([]);
          setIsLocked(false);
        }, 400);
        
      }
      else{
        matchTimerRef.current = setTimeout(() => {
          const flippedBackCard = newCards.map((c)=> {  //use newCards instead of cards, since newCards already has flipped state as true?
            if (newFlippedCards.includes(c.id) || c.id === card.id){
              return {...c, isFlipped: false};
            }
            else{
              return c;
            }
          });

          setCards(flippedBackCard);

          setFlippedCards([]);
          setIsLocked(false);
          setCurrentTurn((prev) => prev === "player" ? "cpu" : "player");
        }, 1000);
      }

      setMoves((prev) => prev + 1);
    }
  };

  const chooseCPUCard = () => {  //CPU memory retention of chosen cards
    const availableCards = cards.filter((card) => !card.isMatched && !card.isFlipped);
    if(availableCards.length === 0) {
      return null;
    }

    if (difficulty === "hard"){
      if (flippedCards.length === 1){
        const firstCard = cards.find((card) => card.id === flippedCards[0]);
        const knownMatch = availableCards.find((card) => cpuMemory[card.id] === firstCard.value);
        if (knownMatch){
          return knownMatch
        }
      }

      else{
        const knownPair = availableCards.find((card) => {
          if(cpuMemory[card.id] === undefined){
            return false;
          }
          return availableCards.some((otherCard) =>
            otherCard.id !== card.id && cpuMemory[otherCard.id] === cpuMemory[card.id]
          );
        });

        if (knownPair){
          return knownPair;
        }
      }
    }

    const randomIndex = Math.floor((Math.random() * availableCards.length));

    return availableCards[randomIndex];
  }


  useEffect(() => {   //CPU logic
              if (!gameStarted || currentTurn !== "cpu" || isLocked || cards.length === 0) {
                  return;
              }
              const timer = setTimeout(() => {
                  const selectedCard = chooseCPUCard();
                  handleCardClick(selectedCard, true);
              }, 700);
              return () => clearTimeout(timer);
    }, [gameStarted, currentTurn, cards, flippedCards, isLocked, cpuMemory, handleCardClick]);

  const isGameComplete = matchedCards.length === cardValues.length;

  useEffect(() => {
    return () => {
        clearTimeout(matchTimerRef.current);
    };
  }, []);

  return {cards, playerScore, cpuScore, moves, currentTurn, isGameComplete, initializeGame, handleCardClick};
}