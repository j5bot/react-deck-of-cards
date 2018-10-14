import React, { Component } from 'react';
import * as deckOfCards from 'deck-of-cards';

import logo from './logo.svg';
import './App.css';

const importAll = (r) => {
  let images = {};
  r.keys().map(
    (item, index) => {
      return images[item.split('/').pop()] = r(item);
    });
  return images;
};

const cardImages = importAll(require.context('../node_modules/svg-cards/png/2x', false, /\.(png|jpe?g|svg)$/));

// const cardImageKeys = Object.keys(cardImages);
const deck = new deckOfCards.DealableDeck();
deck.shuffle(7);

const getCardImage = (card) => {
  console.log(`${card.suit.name.toLowerCase().replace(/s$/,'') }_${card.value < 10 ? card.value+'' : card.name === 'Ten' ? '10' : card.name.toLowerCase() }.png`);
  return cardImages[ `${card.suit.name.toLowerCase().replace(/s$/,'') }_${card.value < 10 ? card.value+'' : card.name === 'Ten' ? '10' : card.name.toLowerCase() }.png` ];
};

const getCardName = (card) => {
  return `${card.name} of ${card.suit.name}`;
};

const Card = ({ cards, index }) => {

    const card = cards[ index ];

    return (
      <img alt={ getCardName(card) } src={ getCardImage(card) } />
    );
  };

const Deck = ({ back, deck, index }) => {
  let showCards = (deck.size() - index - 1) % 4;

  const cardStack = [];
  while (showCards--) {
    cardStack.push(<img className="cardBack" alt="Card Back" src={ cardImages[ `back-${ back }.png` ] } />);
  }

  return cardStack;
}

class App extends Component {

  constructor() {
    super();
    this.state = { index: 0 };
  }

  dealCard = () => {
    console.log('dealing');
    this.setState({
      index: this.state.index < deck.size() ? this.state.index + 1 : 0
    });
    console.log(this.state.index);
  }

  render() {

    console.log(deck.cardArray);

    return (
      <div className="App">
        <header className="App-header">

          <div className="Deck" onClick={ this.dealCard }>
            <Deck className="Deck" back={ 'teal' } deck={ deck } index={ this.state.index } onClick={ this.dealCard } />
          </div>

          <div className="Cards">
            <Card cards={ deck.cardArray } index={ this.state.index } />
          </div>

        </header>
      </div>
    );
  }
}

export default App;
