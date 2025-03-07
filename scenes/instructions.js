class InstructionMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionMenu' });
       
       this.teclado; 
       this.instruction;
    }

    preload() {
        this.load.image('instructions', 'assets/instructions.png');
    }

    create() {
        
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
       this.instruction = this.add.image(200,400 , 'instructions'); 
    }

    update() {
       if(this.escKey.isDown){
        this.instruction.setVisible(false);
        
    }
    }
}