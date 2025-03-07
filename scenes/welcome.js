class WelcomeMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeMenu' });
        
        this.video;
        this.teclado;
        this.seta_1;
        this.seta_2;
    }

    preload() {
         this.load.video('WelcomeVideo', 'assets/backgroundVideo.mp4');
         this.load.font('PressStart2P', 'assets/ARCADECLASSIC.TTF', 'truetype');
         this.load.image('Seta_1', 'assets/seta.png');
         this.load.image('Seta_2', 'assets/seta.png');
    }

    create() {
       this.video = this.add.video(800, 450, 'WelcomeVideo').setScale(1.4);
        this.video.setLoop(true);
        this.video.play();
    
        this.seta_1 = this.add.image(720,450, 'Seta_1').setScale(0.1, 0.1);
        this.seta_2 = this.add.image(880,450, 'Seta_2').setScale(-0.1, -0.1);
        
        this.start = this.add.text(800, 450, 'JOGAR', {
        ontSize: '44px',
        color: '#32CD32',
        fontFamily: 'ARCADECLASSIC',
       
    }).setOrigin(0.5, 0.5).setScale(2.0);
    
    this.instructions = this.add.text(800, 500, 'INSTRUÇÕES', {
        ontSize: '44px',
        color: '#ffff00',
        fontFamily: 'ARCADECLASSIC',
       
    }).setOrigin(0.5, 0.5).setScale(2.0);
    
    this.teclado = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
   
    }

    update() {
       if(this.teclado.down.isDown){
        this.instructions.setColor('#32CD32')
        this.seta_1.y = 500
        this.seta_1.x = 670;
        this.seta_2.y = 500;
        this.seta_2.x = 930;
        this.start.setColor('#ffff00')
    }
    
    if (this.enterKey.isDown && this.seta_1.y === 450){
        this.scene.launch('GameScene');
        this.video.pause();
    }
   
    if (this.enterKey.isDown && this.seta_1.y === 500){
        this.scene.launch('InstructionMenu');
        this.video.pause();
    }
   
   
    if(this.teclado.up.isDown){
        this.instructions.setColor('#ffff00')
        this.seta_1.y = 450
        this.seta_1.x = 720;
        this.seta_2.y = 450;
        this.seta_2.x = 880;
        this.start.setColor('#32CD32')
    }

  

}


}
