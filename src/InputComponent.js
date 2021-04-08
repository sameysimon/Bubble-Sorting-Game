import React from 'react';
class InputComponent extends React.Component {
    constructor(props) {
      super(props);
      //Keyboard events:
      this.keyboardInput = this.keyboardInput.bind(this);
      this.enableInput = this.enableInput.bind(this);
      this.disableInput = this.disableInput.bind(this);
      this.onGamepadConnected = this.onGamepadConnected.bind(this);
      this.gamePadInput = this.gamepadInput.bind(this);
    }

    keyboardInput(e) {
      console.log("Key entered: " + e.key); 
    }
    onGamepadConnected(e) {
      const index = e.gamepad.index;
      console.log("Game pad connected with " + index);
      this.setState({gamepadIndex: index, smallInterval: setInterval(this.gamepadInput, 100)});
    }
    gamepadInput(){ }

    enableInput() {
      document.addEventListener("keydown", this.keyboardInput);
      window.addEventListener("gamepadconnected", this.onGamepadConnected, true); 
    }
    disableInput() {
      document.removeEventListener("keydown", this.keyboardInput);
      window.addEventListener("gamepadconnected", this.onGamepadConnected, true); 
    }
  
}
export default InputComponent;  