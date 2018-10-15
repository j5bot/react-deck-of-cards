import React, { Component } from 'react';
import * as deckOfCards from 'deck-of-cards';

import './App.css';

const importAll = (r) => {
  let images = {};
  r.keys().map(
    (item, index) => {
      return images[item.split('/').pop()] = r(item);
    });
  return images;
};

const svgCardImages = importAll(require.context('../node_modules/svg-cards/png/2x', false, /\.(png|jpe?g|svg)$/));
const englishCardImages = importAll(require.context('../resources/cards/English', false, /\.(png|jpe?g|svg)$/));
const atlasCardImages = importAll(require.context('../resources/cards/Atlas', false, /\.(png|jpe?g|svg)$/));


const deck = new deckOfCards.DealableDeck();
deck.shuffle(7);

const getCardImage = (card, version='atlas') => {
  switch (version) {
    case 'english':
      return englishCardImages[
        `English_pattern_${ card.value > 1 && card.value < 10  ? card.value+'' : card.name === 'Ten' ? '10' : card.lower }_of_${card.suit.lower }.svg`
      ];
    case 'atlas':
      return atlasCardImages[
        `Atlas_deck_${ card.value > 1 && card.value < 10  ? card.value+'' : card.name === 'Ten' ? '10' : card.lower }_of_${card.suit.lower }.svg`
      ];
    default:
    case 'svg':
      return svgCardImages[
        `${card.suit.lower.replace(/s$/,'') }_${card.value < 10 ? card.value+'' : card.name === 'Ten' ? '10' : card.lower }.png`
      ];
  }
};

const getCardBack = ({ version='atlas', cardBack='green_and_dark_red' }) => {
  switch (version) {
    case 'english':
      return englishCardImages[ `English_pattern_back_${ cardBack }.svg` ];
    case 'atlas':
      return atlasCardImages[ `Atlas_deck_card_back_${ cardBack }.svg` ]
    default:
    case 'svg':
      return svgCardImages[ `back-${ cardBack }.png` ];
  }
};

const getCardName = (card) => {
  return `${card.name} of ${card.suit.name}`;
};

const Card = ({ cards, index, version='english', click }) => {

    const card = cards[ index ];

    return card && (
      <img alt={ getCardName(card) } src={ getCardImage(card, version) } onClick={click} />
    );
  };

const Deck = ({ back, deck, index, version='english', cardBack='green_and_dark_red' }) => {
  const cardsLeft = (deck.size() - index - 1);
  let showCards = cardsLeft > 3 ? 3 : cardsLeft % 4;

  const cardStack = [];
  while (showCards--) {
    cardStack.push(<img key={showCards} className="cardBack" alt="Card Back" src={ getCardBack({ version, cardBack }) } />);
  }

  return cardStack;
}

const VersionSwitcher = ({switcher}) => {

  const cards = [
    {
      value: '10',
      name: 'Queen',
      lower: 'queen',
      suit: {
        name: 'Clubs',
        lower: 'clubs'
      },
      version: 'english'
    },
    {
      value: '10',
      name: 'Queen',
      lower: 'queen',
      suit: {
        name: 'Hearts',
        lower: 'hearts'
      },
      version: 'atlas'
    }
  ]

  return cards.map(
    (card,index) => {
      return (
        <div key={index} className="VersionSwitcher flexible row spaced">
          <Card cards={cards} index={index} version={card.version} click={ () => switcher(card.version) }/>
        </div>
      );
    }
  );

};

class App extends Component {

  constructor() {
    super();
    this.state = { index: 0, version: 'english', cardBack: 'green_and_dark_red' };
  }

  dealCard = () => {
    this.setState({
      index: this.state.index < deck.size() ? this.state.index + 1 : 0
    });
  }

  switcher = (version) => {
    console.log(version);
    this.setState({
      version: version
    });
  }

  render() {

    return (
      <div className="App flexible wrapped column centered">

        <h1>React Deck-of-Cards</h1>
        <h2>React code implementing <a href="https://go.jonathancook.site/deck-of-cards-repo" target="_blank">deck-of-cards</a></h2>
        <h3>Also, view <a href="https://go.jonathancook.site/deck-of-cards-demo" target="_blank">deck-of-cards Demo/Tests/Code Coverage</a></h3>

        <header className="App-header flexible row centered">

          <section className="deal flexible wrapped row spaced">
            <h2>Deal Cards</h2>

            <div className="Cards">
              <Card cards={ deck.cardArray }
                index={ this.state.index }
                version={ this.state.version } />
            </div>

            <div className="Deck flexible row centered" onClick={ this.dealCard }>
              <Deck className="Deck" version="english"
                cardBack={ this.state.cardBack }
                deck={ deck }
                index={ this.state.index }
                onClick={ this.dealCard }
                />
            </div>

          </section>

          <section className="switch flexible wrapped row spaced">
            <h2>Change Card Style</h2>
            <VersionSwitcher switcher={ this.switcher }/>
          </section>

        </header>
      </div>
    );
  }
}

export default App;
