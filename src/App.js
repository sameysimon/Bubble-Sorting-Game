import './App.css';
import Game from './Game.js';
import MultiGameManager from './MultiGame';
import React, { useEffect, useState } from 'react';
import './Game.css';
var bubbleSortCode = `private void bubbleSort(int[] theArray) {
  int temp;//We need this integer to facilitate swap operations.
  for (int i = 0; i < theArray.length - 1; i++) {
    for (int j = 0; j < i; j++) {
      if (theArray[j] < theArray[j+1]) {
        //These are out of order! Perform the swap!
        temp = array[j];
        array[j] = array[j+1];
        array[j+1] = temp;
      }
    }
  }`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {gameState: "MainMenu", escaping: "", time: 0};
    
  }

  handleEscapePush(e) {
    console.log("App key push.");
    if (e.key == "Escape") {
      this.setState({gameState: "MainMenu"});
    }
  }
  componentWillMount() {
    document.addEventListener("keydown", (e) => this.handleEscapePush(e));
    
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => this.handleEscapePush(e));
  } 

  startGame() {
    this.setState({gameState: "Game"});
  }
  render() {
    var timePoints =this.state.time;
    if (this.state.gameState == "Game") {
      return(
        <div className="Screen">
          <Game ownTimer={true} enabled={true} gameEnabled={true} aiControl={false}/>
          <div onClick={() => {this.setState({gameState: "MainMenu"})}} className={"EscapeButton"}><p>Escape</p></div>
        </div>
      );
    } else if (this.state.gameState == "MainMenu") {
      return(
        
        <div className="Screen">
          <div className="backgroundCode"><WriteText speed={100} text={bubbleSortCode} /></div>
          <h1 className="MainTitle">Bubble Sort<br/>The Video Game</h1>
          <div className="OptionsMenu">
            <div onClick={() => {this.startGame()}} className="Option">Play Game</div>
            <div onClick={() => {this.setState({gameState: "Verses"})}} className="Option">Player vs Computer</div>
            <div onClick={() => {this.setState({gameState: "HowToPlay"})}} className="Option">How To Play</div>
            <div className="Option">Quit</div>
          </div>
        </div>

      );
    } else if (this.state.gameState == "Verses") {
      return (
        <div className="Screen">
          <MultiGameManager />
      
        </div>
      );
      
    } else if (this.state.gameState == "HowToPlay") {
      return(
        <div className="Screen">
          <h1 className="Heading">How To Play</h1>
          <div className="ArticleText">
            <p>Do you think of yourself as smarter than a computer?</p>
            <p>Do you take the magic of computation for granted?</p>
            <p>Well then, it's time to pit your wits against the metal. In a fight between neuron and transistor, in this game you will sort 10 values in an array using Bubble sort in a race against your computer.</p>
            <p>Use the A and D keys to navigate options. When the arrows are highlighted, hit ENTER to shift your view up and down the array.</p>
            <p>Use the SPACE key to swap the two visible elements.</p>
            <p>You're done when index 0 holds your smallest value and index 9 holds your largest value.</p>
            <p>From Team Humanity, good luck.</p>
          </div>
          <div onClick={() => {this.setState({gameState: "MainMenu"})}} className={"EscapeButton"}><p>Escape</p></div>
        </div>
      );
    }
  }
}
class WriteText extends React.Component {
  //Simply writes text to screen from prop.
  constructor(props) {
    super(props)
    this.typeText = this.typeText.bind(this);
    this.state = ({interval: setInterval(this.typeText, this.props.speed), currText: ""})
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  typeText() {
    var currText = this.state.currText;
    var finalText = this.props.text;
    if (currText == finalText) {
      //If name is correct, finish editing
      clearInterval(this.state.interval);//Clear interval to stop typing
    } else {
      if (currText != "" & currText != finalText.substr(0,currText.length)) {
        //The characters typed aren't the same. There's been a typo.
        currText = currText.substr(0, currText.length - 1);
        //Remove the last character to backspace the mistake.
      } else {
        var rand = Math.random();//Generate a random number between 0 and 1
        if (rand < 0.1) {
          //10% chance of typo.
          //Type something random:
          currText += String.fromCharCode(Math.floor(Math.random() * Math.floor(25)) + 97)
        } else {
          currText = finalText.substr(0,currText.length + 1);
        }
      } 
    }

    this.setState({currText: currText});
  }


  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  render() {
    return(this.state.currText);
  }
}
export default App;
