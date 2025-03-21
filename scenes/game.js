class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.teclado;
        this.nave;
        this.lasers; 
        this.asteroides = []; 
        this.fogo;
        this.explode;
        this.asteroide_explodido;
        this.placar;
        this.num_placar;
        this.game_over;
    }

    preload() {
       
       //carrega todos os assets do jogo
        this.load.image('background', 'assets/background.png');
        this.load.image('nave', 'assets/nave.png');
        this.load.image('asteroide', 'assets/asteroide.png'); // Use uma única imagem para todos os asteroides
        this.load.image('laser', 'assets/laser.png');
        this.load.image('fogo', 'assets/fogo.png');
        this.load.spritesheet('explosion', 'assets/explosion_2.png', { frameWidth: 75, frameHeight: 75});
    }

    create() {
        // Adicionando fundo
        this.add.image(800, 450, 'background').setScale(1.2);

        // Adicionando nave
        this.nave = this.physics.add.sprite(800, 800, 'nave').setScale(0.4);
        this.nave.body.setSize(100, 200, true);
        this.nave.setCollideWorldBounds(true);
        this.nave.body.setAllowGravity(false);

        // Adicionando fogo
        this.fogo = this.physics.add.staticImage(this.nave.x, this.nave.y + 70, 'fogo').setScale(0.1);
        this.fogo.setRotation(Phaser.Math.DegToRad(180));

        // Adicionando asteroides
             for (let i = 0; i < 3; i++) {
            let asteroide = this.physics.add.sprite(400 + i * 400, -100, 'asteroide').setScale(0.6);
            let asteroideX = Phaser.Math.Between(100, 1500); // Posição X aleatória
            asteroide.setPosition(asteroideX, -100);
            asteroide.setCollideWorldBounds(true);
            asteroide.body.setCircle(asteroide.width / 2.5, asteroide.height / 15);
            this.physics.add.collider(this.nave, asteroide, this.colidirAsteroide, null, this);
            asteroide.setImmovable(true);
            this.asteroides.push(asteroide);
             } 

        // Criando animação de explosão
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }),
            frameRate: 4,
            repeat: 0 // Não repetir a animação
        });

        // Criando grupo de lasers
        this.lasers = this.physics.add.group({
            defaultKey: 'laser',
            maxSize: 10 // Define o número máximo de tiros na tela
        });

        // Adicionando teclado
        this.teclado = this.input.keyboard.createCursorKeys();
        this.teclaEspaco = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        this.physics.add.overlap(this.lasers, this.asteroides, this.colidirLaserAsteroide, null, this);
   
        //adicionando placar

         this.placar = this.add.text(50, 50, 'Asteroides:', {fontSize: '45px', fill:'495613'}); 
        
         this.num_placar = 0;
    }

    update() {
        this.nave.setVelocity(0);

        //nave andar para a esquerda ao clicar na seta esquerda
        if (this.teclado.left.isDown) {
            this.nave.setVelocityX(-350);
        }
        //nave andar para a direita ao clicar na seta direita
        
        if (this.teclado.right.isDown) {
            this.nave.setVelocityX(350);
        }
       
        //nave andar para cima ao clicar na seta para cima
        if (this.teclado.up.isDown) {
            this.nave.setVelocityY(-350);
            this.fogo.setVisible(true);
        }

        //nave andar para baixo ao clicar na seta para baixo
        if (this.teclado.down.isDown) {
            this.nave.setVelocityY(350);
            this.fogo.setVisible(false);
        }

        // Faz o fogo seguir a nave
        this.fogo.x = this.nave.x; // Acompanhar a posição X da nave
        this.fogo.y = this.nave.y + 65;

        // Disparar laser ao pressionar espaço
        if (Phaser.Input.Keyboard.JustDown(this.teclaEspaco)) {
            this.atirarLaser();
        }

        // Remover lasers que saem da tela
        this.lasers.children.iterate((laser) => {
            if (laser && laser.y < 0) {
                laser.destroy(true);
            }
        });
    
        
    
    }

    // Função para atirar lasers
    atirarLaser() {
        let laser = this.lasers.get(this.nave.x, this.nave.y - 50);

        if (laser) {
            laser.setActive(true);
            laser.setVisible(true);
            laser.setScale(0.07);
            laser.setRotation(Phaser.Math.DegToRad(-90));
            laser.body.setAllowGravity(false);
            laser.setVelocityY(-500); // Faz o laser se mover para cima
        }
    }

   

    // Função chamada quando a nave colide com um asteroide
    colidirAsteroide(nave, asteroide) {
       
        // Criar um sprite de explosão na posição do asteroide
        let explosion = this.add.sprite(nave.x, nave.y, 'explosion');
        explosion.anims.play('explode');
        
        //desativa a nave ao explodir
        nave.setActive(false);
        nave.setVisible(false);
        nave.body.enable = false; 

        //desativa o fogo da nave após sua colisão
        this.fogo.destroy()
        
        //adiciona delay para iniciar a sprite de explosão
        this.time.delayedCall(1000, () => {
         
            explosion.destroy();
        
        }, [], this);
        
        //adiciona o texto de fim de jogo após colisão da nave
        this.game_over = this.add.text(640, 400, 'Game Over!', {fontSize: '45px', fill:'495613'}); 
       
        //adiciona delay para pausar a cena
        this.time.delayedCall(1000, () => {
            this.scene.pause('GameScene');
        
        }, [], this);
        
        //adiciona delay para recomeçar a cena
        this.time.delayedCall(1000, () => {
            this.scene.restart('GameScene');
        
        }, [], this);
   
   
    }

    // Função para atirar lasers
    atirarLaser() {
        let laser = this.lasers.get(this.nave.x, this.nave.y - 50);

        if (laser) {
            laser.setActive(true);
            laser.setVisible(true);
            laser.setScale(0.07);
            laser.setRotation(Phaser.Math.DegToRad(-90));
            laser.body.setAllowGravity(false);
            laser.setVelocityY(-500); // Faz o laser se mover para cima
        }
    }

    colidirLaserAsteroide(laser, asteroide) {
        // Criar um sprite de explosão na posição do asteroide
        let explosion = this.add.sprite(asteroide.x, asteroide.y, 'explosion').setScale(1.4);
        explosion.anims.play('explode');
        

        
        // Destruir o asteroide e o laser
       
        laser.destroy();
        asteroide.destroy();
        
        //adiciona delay para iniciar a sprite de explosão
        this.time.delayedCall(1000, () => {
            explosion.destroy();
        
        }, [], this);

        //adiciona a pontuação ao placar
        this.num_placar += 1;
        this.placar.setText('Asteroides:' + this.num_placar)
        
        //recria os asteroides destruidos
        this.recriarAsteroide()
    }    
   
    //função para recriar os asteroides
    recriarAsteroide() {
        for (let i = 0; i < 1; i++) {
            let asteroide = this.physics.add.sprite(400 + i * 400, -100, 'asteroide').setScale(0.6);
            let asteroideX = Phaser.Math.Between(100, 1500); // Posição X aleatória
            asteroide.setPosition(asteroideX, -100);
            asteroide.body.setCircle(asteroide.width / 2.5, asteroide.height / 15);
            this.physics.add.collider(this.nave, asteroide, this.colidirAsteroide, null, this);
            asteroide.setImmovable(true);
            this.asteroides.push(asteroide);
             }

        }
   
    }     

 
    
    //
   
   


   
    
   
   
    

   
      

