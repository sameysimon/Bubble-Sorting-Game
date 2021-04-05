import React from 'react';
class InputComponent extends React.Component {
    constructor(props) {
      super(props);
      //Keyboard events:
      this.keyboardInput = this.keyboardInput.bind(this);
      this.enableKeyboardInput = this.enableKeyboardInput.bind(this);
      this.disableKeyboardInput = this.disableKeyboardInput.bind(this);
    }
    keyboardInput(e) {
      console.log("Key entered: " + e.key); 
    }
    enableKeyboardInput() {
      document.addEventListener("keydown", this.keyboardInput);
    }
    disableKeyboardInput() {
      document.removeEventListener("keydown", this.keyboardInput);
    }
  
}
export default InputComponent;  