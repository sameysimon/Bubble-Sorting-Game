import React, { useEffect, useState } from 'react';
class TextWriter extends React.Component {
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
  export default TextWriter;