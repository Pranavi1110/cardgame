import React, { useState, useEffect } from 'react';
import Card from './Card';
import { createDeck } from '../utils/deck';
import ScoreChart from './ScoreChart';

const GameBoard = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [pool, setPool] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      const data = await response.json();
      setStats({ wins: data.wins, losses: data.losses });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    const newDeck = createDeck();
    setPlayerHand(newDeck.slice(0, 26));
    setComputerHand(newDeck.slice(26));
    setPool([]);
    setPlayerScore(0);
    setComputerScore(0);
    setResult(null);
    fetchStats();
  }, []);

  useEffect(() => {
    if (result === 'win' || result === 'lose') {
      fetch('http://localhost:5000/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      })
        .then(res => res.json())
        .then(data => {
          setStats({ wins: data.wins, losses: data.losses });
        })
        .catch(error => console.error('Failed to update stats:', error));
    }
  }, [result]);

  const playerTurn = (cardIndex) => {
    const card = playerHand[cardIndex];
    setPool([...pool, card]);

    const newPlayerHand = [...playerHand];
    newPlayerHand.splice(cardIndex, 1);
    setPlayerHand(newPlayerHand);

    setTimeout(() => {
      computerPlay(card.value);
    }, 1000);
  };

  const computerPlay = (playerCardValue) => {
    if (computerHand.length === 0) {
      setTimeout(() => endGame(), 300);
      return;
    }

    const compCard = computerHand[0];
    setPool((prev) => [...prev, compCard]);
    setComputerHand(computerHand.slice(1));

    if (compCard.value === playerCardValue) {
      setPlayerScore((prev) => prev + pool.length + 2);
      setPool([]);
    } else {
      setComputerScore((prev) => prev + pool.length + 2);
      setPool([]);
    }

    if (playerHand.length === 1 || computerHand.length === 1) {
      setTimeout(() => endGame(), 500);
    }
  };

  const endGame = () => {
    if (playerScore > computerScore) {
      setResult('win');
    } else if (playerScore < computerScore) {
      setResult('lose');
    } else {
      setResult('draw');
    }
  };

  return (
    <div>
      <h2>Card Game - Player vs Computer</h2>

      <div>
        <h3>Your Hand ({playerHand.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {playerHand.map((card, i) => (
            <Card key={i} card={card} onClick={() => playerTurn(i)} />
          ))}
        </div>
      </div>

      <div>
        <h3>Computer Hand ({computerHand.length})</h3>
        <p>Cards hidden</p>
      </div>

      <div>
        <h3>Pool Cards ({pool.length})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {pool.map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>
      </div>

      <h3>Scores</h3>
      <p>Player: {playerScore} | Computer: {computerScore}</p>

      {result && (
        <div>
          <h2>Game Result: {result.toUpperCase()}</h2>
        </div>
      )}

      <ScoreChart wins={stats.wins} losses={stats.losses} fetchStats={fetchStats} />
    </div>
  );
};

export default GameBoard;
