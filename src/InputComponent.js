import React from 'react';
class InputComponent extends React.Component {
  
    constructor(props) {
      super(props);
      //Keyboard events:
      this.keyboardInput = this.keyboardInput.bind(this);
      this.enableInput = this.enableInput.bind(this);
      this.disableInput = this.disableInput.bind(this);
      this.connectGamepad = this.connectGamepad.bind(this);
      this.gamepadInput = this.gamepadInput.bind(this);

      this.gamepadTimestamp = 0;
      window.addEventListener("gamepadconnected", this.connectGamepad, true);
    }

    keyboardInput(e) {
      console.log("Key entered: " + e.key); 
    }
    componentWillMount() {
      
    }
    connectGamepad(e) {
      console.log("Tries to connect gamepad");
      if (navigator.getGamepads()[0] != null) {
        console.log("Gamepad found and connected");
        this.setState({smallInterval: setInterval(this.gamepadInput, 75)});
      }
    }

    gamepadInput(e) {
      
    }

    enableInput() {
      document.addEventListener("keydown", this.keyboardInput);
      this.connectGamepad()//Tries to connect a gamepad to the component.
    }
    disableInput() {
      document.removeEventListener("keydown", this.keyboardInput);
      window.removeEventListener("gamepadconnected", this.connectGamepad, true); 
      clearInterval(this.state.smallInterval);
    }
  
}
export default InputComponent;  