import React, { useEffect, useState } from 'react';
import './MultiGame.css';
import Game from './Game.js';
import InputComponent from './InputComponent.js';
import TextWriter from './TextWriter.js';
const computerName = "Robo-Cop";


class MultiGameManager extends InputComponent {
    constructor(props) {
      super(props);
      //Game Stage Guide. 0=Picking Names, 1=count down, 2=Game in progress, 3=Game ended.
      this.state = {
        gameStage: 0, PlayerOneName: "Insert Name", PlayerTwoName: "Insert Name",
        playerOneStartedEditing: false, playerOneReady: false,
        playerTwoStartedEditing: false, playerTwoReady: false,
        time: -1, interval: null
      };
      this.computerTyping = this.computerTyping.bind(this);
      this.tick = this.tick.bind(this);
      this.onBothGamesFinished = this.onBothGamesFinished.bind(this);
      this.checkForFinish = this.checkForFinish.bind(this);
    }
    componentWillMount() {
      this.enableInput();
    }
    componentWillUnmount() {
      this.disableInput();
      clearInterval(this.state.interval);
    }
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
    computerTyping() {
      var name = this.state.PlayerTwoName;
      var editing = this.state.playerTwoStartedEditing;
      var ready = false;
      if (name == computerName) {
        //If name is correct, finish editing
        ready = true;//Be ready
        clearInterval(this.state.interval);//Clear interval to stop typing
      } else if (editing == false) {
        name = "";//First enter, clears 'Insert Name'
        editing = true;//Stops from text clearing next time.
      } else {
        if (name != "" & name != computerName.substr(0,name.length)) {
          console.log(computerName.substr(0,name.length));
          //The characters typed aren't the same. There's been a typo.
          name = name.substr(0, name.length - 1);
          //Remove the last character to backspace the mistake.
        } else {
          var rand = Math.random();
          
          if (rand < 0.1) {
            //30% chance of typo.
            //Type something random:
            name += String.fromCharCode(this.getRandomInt(25) + 97)
          } else {
            name = computerName.substr(0,name.length + 1);
          }
        }
        
      }
      this.setState({PlayerTwoName: name, playerTwoStartedEditing: editing, playerTwoReady: ready});
      this.checkForFinish();
    }

    keyboardInput(e) {
      //If Hits Escape, call function to return to main meny.
      if (e.key==="Escape") { this.props.quit(); }
      //If No AI interval has started, enable it.
      if (this.state.interval == null) {this.setState({interval: setInterval(this.computerTyping, 50)}); }
      
      var name = this.state.PlayerOneName;
      var editing = this.state.playerOneStartedEditing;
      var ready = this.state.playerOneReady;
      if (ready == true) {
        if (e.key == "Enter") {
          ready = false;
        }
      } else {
        if (editing == false & e.key.length == 1) {
          //Not started editing yet, and regular key
          name = e.key;//Add regular key
          editing = true;//Enable proper editing
        } else if (name.length > 0 & e.key == "Backspace") {
          //Name isn't empty; key is backspace
          name = name.substr(0,name.length-1);
        } else if (name.length < 11 & e.key.length == 1) {
          //Name isn't too long and regular key
          name += e.key;
        } else if (name.length > 0 & e.key == "Enter") {
          //Not an empty name, and hit ENTER.
          ready = true;
        } 
      }
      this.setState({PlayerOneName: name, playerOneStartedEditing: editing, playerOneReady: ready});
      this.checkForFinish();
    }

    //Checks if both players are ready.
    checkForFinish() {
      if (this.state.playerOneReady & this.state.playerTwoReady) {
        console.log("Finished Names");
        clearInterval(this.state.interval);
        this.disableInput();
        this.setState({gameStage: 1});
      }
    }

    //Function with markup to display Name Entering Screen
    selectNames() {
      var errorClass = "";
      var notifClass = "topText";
      if (this.state.error == true) {
        errorClass = " shudder";
      }  
      return(
        <div>
            <div className="topSplitScreen animateRight">
                <div className="fadeIn">
                    {displayName("Player One", this.state.PlayerOneName, this.state.playerOneReady, this.state.playerOneStartedEditing, true)}
                </div>
            </div>
            <div className="bottomSplitScreen animateLeft">
                <div className="fadeIn">
                    {displayName("Player Two", this.state.PlayerTwoName, this.state.playerTwoReady, this.state.playerTwoStartedEditing, false)}
                </div>
            </div>
        </div>   
      );
    }

    tick() {
      this.setState({time: this.state.time + 1});
    }
    onBothGamesFinished(playerOneTime, playerTwoTime) {
      var gmeStage = this.state.gameStage + 1;
      this.setState({playerOneTime: playerOneTime, playerTwoTime: playerTwoTime, gameStage: gmeStage});
    }
    render() {
      var gameStage = this.state.gameStage;
      switch (gameStage) {
        case 0:
          return this.selectNames();
          break;
        case 1:
          return <MultiplayerGame quit={this.props.quit} onFinish={this.onBothGamesFinished} playerOneName={this.state.PlayerOneName}  playerTwoName={this.state.PlayerTwoName}/>;
          break;
        case 2:
          return <ResultsScreen quit={this.props.quit} playerOneName={this.state.PlayerOneName} playerTwoName={this.state.PlayerTwoName} playerOneTime={this.state.playerOneTime} playerTwoTime={this.state.playerTwoTime}/>
      }
    }
  }
  function displayName(playerNo, name, ready, editing, isTop) {
    var notifMsg = "Type a name";
    var errorClass = "";
    var notifClass = "topText";
    if (isTop == true) { notifClass = "bottomText"; }
    if (ready == true) {
      notifMsg = "READY!"
    }
    return(
        <>
        <h1 className={"MainTitle" + errorClass}>{playerNo}: {name}</h1>
        <h2 className={notifClass}>{notifMsg}</h2>
        </>
    );
  }

class MultiplayerGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {time: 0, playerOneFinished: false, playerTwoFinsihed: false};
    this.tick = this.tick.bind(this);
    this.onPlayerOneFinished = this.onPlayerOneFinished.bind(this);
    this.onPlayerTwoFinished = this.onPlayerTwoFinished.bind(this);
  }
  componentWillMount() {
    this.setState({interval: setInterval(this.tick, 1000)});
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  tick() {
    this.setState({time: this.state.time + 1});
  }
  onPlayerOneFinished() {
    var currTime = this.state.time;
    this.setState({playerOneFinished: true, playerOneTime: currTime});
  }
  onPlayerTwoFinished() {
    var currTime = this.state.time;
    this.setState({playerTwoFinished: true, playerTwoTime: currTime});
  }
  render() {
    var countdownMsg = "";
    var gameStarted = true;
    if (this.state.time < 4) {
      //Count down stage
      countdownMsg = 3-this.state.time;
      gameStarted = false;
    } else if (this.state.time == 4) {
      //Go!
      gameStarted = true;
      countdownMsg = "START!"
    }
    if (this.state.playerOneFinished & this.state.playerTwoFinished) {
      console.log("Both players finished.");
      this.props.onFinish(this.state.playerOneTime, this.state.playerTwoTime);
    }
    return(
      <div>
        <div className="topSplitScreen">
          <Game quit={this.props.quit} onFinish={this.onPlayerOneFinished} finishMsg={"FINISHED!"} gameEnabled={gameStarted} ownTimer={false} aiControl={false}/>
          <h2 className="bottomText">{this.props.playerOneName}</h2>
        </div>
        <div className="bottomSplitScreen">
          <Game onFinish={this.onPlayerTwoFinished} finishMsg={"FINISHED!"} gameEnabled={gameStarted} ownTimer={false} aiControl={true} />
          <h2 className="topText">{this.props.playerTwoName}</h2>
        </div>
        <div key={Math.random()} id="countDown" className="countDown"><h1>{countdownMsg}</h1></div>
      </div>
    );
  }
}
class ResultsScreen extends InputComponent {
  constructor(props) {
    super(props);
    this.state = ({slide: 0});
    this.nextSlide = this.nextSlide.bind(this);
    this.enableInput();
  }
  componentWillUnmount() {
    this.disableInput();
  }
  nextSlide() {
    const currSlide = this.state.slide + 1;
    this.setState({slide: currSlide});
  }
  keyboardInput(e) {
    if (e.key === " " || e.key === "Enter") {
      this.nextSlide();
    } else if (e.key === "Escape") {
      this.props.quit();
    }
  }
  grabSlide() {
    switch (this.state.slide) {
      case 0:
        return(
          <>
            <h1><TextWriter speed={100} text={"Game Over"} /></h1>
            <p>Simon sorted their array in 10 seconds.</p>
            <p>Robo-Cop sorted their array in 57 seconds.</p>
          </>
        );
      case 1:
        return(
          <>
            <p>So, the computer won. To be honest I didn't even program for you winning. This text is the same either way. You cannot possibly win. Computers are simply better at this sort of thing.</p>
            <p>I admit, this is a little unfair: the computer reads the numbers as integers in binary, weheras you need to read them from a screen, through your eyes, across your retina and along your optic nerve -- with additional shape-recognition and image-flipping between.</p>
            <p>I like approximate a computer fetching an int with a human recalling their name.</p>
          </>
        );
        case 2:
          return(
            <>
              <p>Then the question remains stood. Could a brain, with numbers mainlined into its neurons, sort an array faster than silicon? Which computer? Maybe not bubble sort, but what about Merge, Quick, or Radix?</p>
              <p>If not sorting, is there anything we can do better? forever. No matter how many cycles my CPU clocks.</p>
            </>
          );
          case 3:
            return(
              <>
                <p>Perhaps, or perhaps not. But that doesn't mean this meagre race is without value. There is one difference I shall maintain. A defining feature that will enblazen the human race as unique and rare and beautiful.</p>
                <p>No computer shall be built without a purpose. They will always be built to fix, prove, compute; to fight boredom, satisfy a requirement.</p>
              </>
            );
            case 4:
            return(
              <>
                <p>But humans have no purpose. We fight and think and struggle, yet, I maintain, inside knowable bounds, we are born of circumstance.</p>
                <p>We decide our destiny. We are the wildcard. By definition, such cannot be built.</p>
                <p>And to me, that's pretty neat.</p>
              </>
            );
        default:
          return(
            <>
            <h1>Thank You for Playing!</h1>
            <p>Hit Escape to return to Main Menu.</p>
            </>
          ); 
    }
  }
  render() {
    return(
      <>
      <video className="video" autoPlay muted preload="auto" loop src="Web.mp4" />
      <div className="LargeArticle">
        {this.grabSlide()}
      </div>
      <div onClick={this.nextSlide} className="continueButton">Next</div>
      
      </>
    );
  }
}
export default MultiGameManager;