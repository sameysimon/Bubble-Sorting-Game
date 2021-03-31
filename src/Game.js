import React, { useEffect, useState } from 'react';
import './Game.css';
class Game extends React.Component {
  
  
    constructor(props) {
      super(props);
      console.log("constructor.");
      var randomArray = []
      //It's making new arrays when it shouldn't?
      for (let index = 0; index < 10; index++) {
        randomArray[index] = Math.floor(Math.random() * 100)
      }
  
      var sorted = [...randomArray];
      for (let index = 0; index < 10; index++) {
        console.log(index + " index " + sorted[index] + "is sorted.  rand is " + randomArray[index]); 
      }
      
      sorted.sort(function(a,b){return a-b});

      this.state = {itemOne: 0, itemTwo: 1, itemsArray: randomArray, arrayLength: 10, selectedIndex: 0, sortedArray: sorted, won: "false", time: 0, gamePadIndex: -1, aiInterval: false};
      this.handleKeyPush = this.handleKeyPush.bind(this);
      
      this.checkForWin = this.checkForWin.bind(this);
      this.connectController = this.connectController.bind(this);
    
      this.gamePadPoll = this.gamePadPoll.bind(this);
      this.tick = this.tick.bind(this);
      this.aiTurn = this.aiTurn.bind(this);
    }

    tick() {
        console.log("Time: " + this.state.time);
        this.setState({time: this.state.time + 1});
    }
    
    checkForWin() {
      console.log("CHECK FOR WIN:");
      var sorted = this.state.sortedArray;
      var randomArray = this.state.itemsArray;
      for (let index = 0; index < 10; index++) {
        console.log("   " + index + " index " + sorted[index] + "is sorted.  rand is " + randomArray[index]); 
      }
  
      const array = this.state.itemsArray;
      const sortedArray = this.state.sortedArray;
      
      for (let index = 0; index < this.state.arrayLength; index++) {
        if (this.state.itemsArray[index] !== this.state.sortedArray[index]) {
          console.log("   NOT MATCH: " + index + " user's " + (this.state.itemsArray[index] + " and sorted's " + this.state.sortedArray[index]));
          return;
        }
      }
      clearInterval(this.state.interval);
      if (this.props.onFinish != null) {
        //If this component was given a function to call when it finishes, call it.
        this.props.onFinish();
      }
      if (this.props.aiControl != null) {
        //AI control was set, so disable the interval that calls the function that makes the AI move.
        if (this.props.aiControl == true) { clearInterval(this.state.aiInterval) }
      }
      this.setState({won: "true"});
      }
    
    moveRight() {
      var currentIndex = this.state.selectedIndex;
      currentIndex++;
      if (currentIndex === 4) {
        currentIndex = 0;
      }
      this.setState({selectedIndex : currentIndex})
    }
  
    moveLeft() {
      var currentIndex = this.state.selectedIndex;
      currentIndex--;
      if (currentIndex === -1) {
        currentIndex = 3;
      }
      this.setState({selectedIndex : currentIndex})
    }
  
    shiftRight() {
      var one = this.state.itemOne;
      var two = this.state.itemTwo;
      one++;
      two++;
      if (one >= this.state.arrayLength) {
        one = 0;
      } else if (two >= this.state.arrayLength) {
        two = 0;
      }
      this.setState({itemOne: one, itemTwo: two});
    }
  
    shiftLeft() {
      var one = this.state.itemOne;
      var two = this.state.itemTwo;
      one--;
      two--;
      if (one <= -1) {
        one = this.state.arrayLength -1;
      } else if (two <= -1) {
        two = this.state.arrayLength -1;
      }
      this.setState({itemOne: one, itemTwo: two});
    }
  
    selectItem() { 
      var currentIndex = this.state.selectedIndex;
      if (currentIndex === 3) {
        //Move right
        this.shiftRight();
      } else if (currentIndex === 0) {
        //move left
        this.shiftLeft();
      }
    }
  
    swapItems() {
      var acc;
      var array = this.state.itemsArray;
      acc = array[this.state.itemOne];
      array[this.state.itemOne] = array[this.state.itemTwo];
      array[this.state.itemTwo] = acc;
      this.setState({itemsArray: array});
      this.checkForWin();
      
    }
  
    handleKeyPush(e) {
      if (this.props.gameEnabled == false) {return}
      //Check inputs:
      if (e.key === "d" || e.key === "ArrowRight") {
        this.moveRight();
      } else if (e.key === "a" || e.key === "ArrowLeft") {
        this.moveLeft();
      } else if (e.key === "Enter") {
        this.selectItem();
      } else if (e.key === " ") {
        this.swapItems();
      }
    };
    connectController(e) {
      var index = e.gamepad.index;
      console.log("Connecting Controller " + e.gamepad.index);
      
      this.setState({gamePadIndex: index});
      console.log(e);
      this.setState({gamePadPoll: setInterval(this.gamePadPoll, 100)});
    }
    gamePadPoll() {
      if (this.props.gameEnabled == true) {return}
      if (this.state.gamePadIndex == -1) {return}
      var gamepad = navigator.getGamepads()[this.state.gamePadIndex];
      var moveAxisX = gamepad.axes[0];
      if (moveAxisX > 0.7) {
        this.moveRight();
      }
      if (moveAxisX < -0.7) {
        this.moveLeft();
      }
    }

    componentWillMount() {
      if (this.props.aiControl == false) {
        document.addEventListener("keydown", this.handleKeyPush, true);
        window.addEventListener("gamepadconnected", (e) => this.connectController(e), true); 
      } else {
        this.setState({aiInterval: setInterval(this.aiTurn, 50)});
      }
      if (this.props.ownTimer == true) {
        console.log("Own Timer is true.");
        this.setState({interval: setInterval(this.tick, 1000)});
      }
    }
    componentWillUnmount() {
      console.log("Unmount Game!");
      document.removeEventListener("keydown", this.handleKeyPush, true);
      window.removeEventListener("gamepadconnected", (e) => this.connectController(e));
      clearInterval(this.state.interval);
    } 
    aiTurn() {
      if (this.props.gameEnabled == false) {return}
      if (this.state.selectedIndex != 3) {
        this.moveRight();
      } else {
        if (this.state.itemOne == 9 | this.state.itemsArray[this.state.itemOne] <= this.state.itemsArray[this.state.itemTwo]) {
          //At end of the array or items are in order.
          this.shiftRight();
        } else {
          //Out of order. Make swap.
          this.swapItems();
        }
      }
    }
    componentDidUpdate(prevProps) {
      if (this.props.gameEnabled == true) {
        if (this.props.aiControl == true) {
          
        } else if (this.state.aiInterval != null) {
          clearInterval(this.state.aiInterval);
        }
      }
    }
    render() {
      var valOne = this.state.itemsArray;
      var timerClass = "timer";
      let winBox;
      if (this.state.won == "true") {
        timerClass += " flash"
        winBox = (
          <div className="winBox"> 
            <h1>{(this.props.finishMsg != null ? this.props.finishMsg : "YOU WIN!" )}</h1>
          </div>
        )
      }
      if (this.props.ownTimer == false) { timerClass = "noDisplay"; }
      return (
        <div className="App">
          <div className="elementBox">
            {winBox}
            <NavButton actionFunc={() => this.shiftLeft()} selected={this.state.selectedIndex == 0 && "true"} arrow="<" />
            <Item actionFunc={() => this.swapItems()} selected={this.state.selectedIndex == 1 && "true"} value={valOne[this.state.itemOne]} index={this.state.itemOne}/>
            <Item actionFunc={() => this.swapItems()} selected={this.state.selectedIndex == 2 && "true"} value={valOne[this.state.itemTwo]} index={this.state.itemTwo}/>
            <NavButton actionFunc={() => this.shiftRight()} selected={this.state.selectedIndex == 3 && "true"} arrow=">" />
            
          </div>
          <h2 className={timerClass} >{Math.floor(this.state.time/60)}:{this.state.time % 60}</h2>
        </div>
      );
    }
  }
  
  class Item extends React.Component{
    constructor(props) {
      super(props); 
    }
    render() {
      var selectedState = "";
      if (this.props.selected === "true") {
        selectedState = " selected";
      }
      
      return (
        <div onClick={() => this.props.actionFunc()} className={"itemCard" + selectedState} >
          <h1>{this.props.value}</h1>
          {this.props.index}
        </div>
      );
  }
  
  }
  class NavButton extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var selectedState = "";
      if (this.props.selected === "true") {
        selectedState = " selected";
      }
      return(
        <div onClick={() => this.props.actionFunc()} className={"navButton" + selectedState}>
          <h1>{this.props.arrow}</h1>
        </div>
      );
    }
  }
  
  
  export default Game;