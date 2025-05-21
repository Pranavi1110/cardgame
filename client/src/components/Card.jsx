import React from 'react';

const Card = ({ card, onClick }) => {
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer', border: '1px solid black', padding: 10, margin: 5 }}>
      <h3>{card.value} {card.suit}</h3>
    </div>
  );
};

export default Card;
