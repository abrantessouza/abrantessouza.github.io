var game = new Phaser.Game(800, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors;
var players;
var player;
var debugText;
var ground;
var details;
var tween;
var flyergap;
var frame;



function preload() {
	game.load.audio('jump',['res/jump.mp3','res/jump.ogg']);
	game.load.audio('music',['res/music.mp3','res/music.ogg']);
	//game.load.image('tux', 'res/tux.png');
	game.load.spritesheet('tux', 'res/sprite_teste.png', 67, 85, 6);
	game.load.image('flyer_gap', 'res/flyergap.png');
	game.load.image('fundo', 'res/background2.jpg');
	game.load.image('sign', 'res/sign.png');
	game.load.image('profile', 'res/profile_icon.png');
	game.load.image('capelo', 'res/capelo.png');
	game.load.image('xp', 'res/xp.png');
	game.load.image('ground', 'res/ground.png');
	game.load.image('frame', 'res/frame.png');
	game.load.bitmapFont('carrier_command', 'res/fonts/carrier_command.png', 'res/fonts/carrier_command.xml');
	
}

function create() {
	music = game.add.audio("music");
	music.play('',0,1,true);
	
	game.stage.backgroundColor = "#DDDDDD";
	game.physics.startSystem(Phaser.Physics.P2JS);
	
	game.world.setBounds(0, 0, 1024, 1524);
	game.add.tileSprite(0, 0, 1024, 1524, 'fundo');
	players = game.add.group();
	players.enableBody = true;
	createPlayer(15,5, -300, 150);		
	
	platforms = game.add.group();	
	platforms.enableBody =  true;
	
	
		
	objectsBackground = game.add.group();
	objectsBackground.enableBody =  true;	
	
	
	createPlatform();
	createFlyerGap(329,954);
	var style = { font: "bold 20px arcade", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    debugText = game.add.text(0, 0, "", style);
    debugText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
    debugText.setTextBounds(0, 100, 800, 100);
	
	bmpText = game.add.bitmapText(450, 477, 'carrier_command',"",20);
	
	detailText = game.add.text(0, 0, "", style);;
	
	cursors = game.input.keyboard.createCursorKeys();

	floatFrames = game.add.group();
	
	frame = floatFrames.create(100, game.world.width/2 - 930 , 'frame');
	frame.scale.setTo(1.68,4.3);
	
	details = game.input.keyboard.addKey(Phaser.Keyboard.D);	
}

var hit  = 0;
var movY = '650';
function move (){
	hit +=1;
	if(hit % 2 != 0){
		game.add.tween(frame).to( { y: "+"+movY }, 1000, Phaser.Easing.Linear.None, true);
	}else{
		game.add.tween(frame).to( { y: '-'+movY }, 1000, Phaser.Easing.Linear.None, true);
	}	
}


function update() {
	playerUpdate();	
	game.world.bringToTop(platforms);
	game.world.bringToTop(players);
	game.world.bringToTop(floatFrames);
	game.world.bringToTop(detailText);
}

function createFlyerGap(x, y){
	flyergap = platforms.create(x, y, 'flyer_gap');
	flyergap.scale.setTo(2,2);
	flyergap.body.colliderWorldBounds = true;
	flyergap.body.immovable = true;
}

function createPlayer(x,y,j,v){
	var player = players.create(x,y, 'tux');	
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true
	
	player.jump = j;
	player.v = v;
	
	player.animations.add('start', [3], 10, true);
	player.animations.play('start');
	
	player.animations.add('left', [0,1,2], 15, true);	
    player.animations.add('right', [3,4,5], 15, true);
	
	
	game.camera.follow(player);
	
}

var y = 0;


function playerUpdate(){
	//game.physics.arcade.collide(players, flyergaps);
	game.physics.arcade.collide(players, platforms, function(a, b){
		if(b.key == 'flyer_gap'){
			b.body.velocity.y = -60;
			b.body.velocity.x = 20;	
			if(Math.round(b.body.y)== 720){
				b.body.velocity.y = 0;
			}
		}	
		
	});	 
	players.forEach(function(p){
		var jumping = false;
		if(p.body.velocity.y < -0.9  || p.body.velocity.y > 10  ){
			jumping = true;
		}
		if(jumping){
			p.animations.stop();
		}
		p.body.velocity.x = 0;
		debugText.text = "{x:"+Math.round(p.x)+" | "+"y:"+Math.round(p.y)+" | frameY: "+Math.round(frame.y)+"}";
		debugText.x = p.x - 280;
		debugText.y = p.y-160;	
		
		
		if(p.x > 703 && p.x < 801){
			movY = 650;
			frame.x = p.x - 500;
			showFrame(p,[703, 801], 479,"           SOBRE MIM\r\n", "\n31 anos, Brasileiro, Carioca \nda Gema, Casado e amante\nde tecnologia." );		
		}else if(p.x > 300 && p.x < 418){
			movY = 600;
			frame.x = p.x - 300;
			showFrame(p,[300, 418], 377, "      Aonde sou graduado\r\n", "\n*UNESA: Tecnologia em \nInformatica p/ Internet (2015)\n\n*UNESA: Bacharel em \nTurismo (2010) " );		
		}
		else if(p.x > 100 && p.x < 180){			
			movY = 500;
			frame.x = p.x - 80;
			var textExp1 = "\n*LABORATORIO DE CONTROLE DE \n DOPAGEM(LBCD) [2011 - 2016]\n-Web Developer Front-End & \n Backend p/ intranet \n-Treinamento de pessoal \n para utilizacao dos sistemas \n-Montagem & Manutencao de \n Micro-Computadores   1/2";
			var textExp2 = "\n*DEVSITE [2012-2013]\n-Prestacao de servicos de\n montagem e manutencao de \n micros e consultoria     2/2   ";
			var exp;
			var arrText = [textExp1, textExp2];
			exp = arrText[0];
			if(y > 501 && y < 1000){
				exp = arrText[1];				
			}else if(y > 15 && y < 500 ){
				exp = arrText[0];
			}else if(y > 1001){
				y = 0;				
			}
			y++;
			showFrame(p,[100, 180], 237, "         Experiencias\r\n", exp);	
		}
		else{
			if(hit % 2 != 0){details.onDown.add(move, this);
				game.add.tween(frame).to( { y: '-'+movY }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(detailText).to( { y: '-'+movY }, 1000, Phaser.Easing.Linear.None, true);		
				hit = 0;
			}
			bmpText.text = ""; 
			details.onDown.remove(move, this);			
		}
		
		if(cursors.left.isDown){
			p.body.velocity.x =  -p.v;
			p.animations.play('left');		
			
		}else if(cursors.right.isDown){
			p.body.velocity.x = p.v;
			p.animations.play('right');
						
		}else{
			p.animations.stop();
		}
		
		if(cursors.up.isDown && p.body.touching.down ){
			var snd = game.add.audio("jump");
			snd.play();
			p.body.velocity.y = p.jump;					
		}
		
	});
}


function showFrame(p,x,y,text1,text2)
{
	if(p.x > x[0] && p.x < x[1]){
			if(Math.round(p.y) == y ){				
				details.onDown.add(move, this);
				//details.onDown.add(sp.tooglePause, this);
				bmpText.text = "Pressione a tecla D!!";
				bmpText.y = p.y - 200;
				bmpText.x = p.x - 200;
				
				detailText.text = text1;
				detailText.text += text2;
				
				detailText.y = frame.y + 90;
				detailText.x = frame.x + 40;			
				
			}		 
		}	
}



function createPlatform(){
	
	//chão
	
	for(var i = 0; i < game.world.width; i += 64){
		ground = platforms.create(i, game.world.height - 64, 'ground');
		ground.body.immovable = true;
		//ground1.key = ground.key;
	}
	
	//plataformas
		//PROFILE
	var sign = objectsBackground.create(110 + 640, game.world.height - 300, 'sign');
	sign.body.immovable = true;
	var profile = objectsBackground.create(135 + 640, game.world.height - 290, 'profile');
	profile.body.immovable = true;
	for(var i = 0; i < 64 * 3; i+=64){
		ground = platforms.create(i + 650, game.world.height - 198, 'ground');
		ground.body.immovable = true;		
	}	
	
		//GRADUAÇÃO
	var sign = objectsBackground.create(110 + 240, game.world.height - 400, 'sign');
	sign.body.immovable = true;
	var capelo = objectsBackground.create(135 + 240, game.world.height -385, 'capelo');
	capelo.body.immovable = true;	
	for(var i = 0; i < 64 * 3; i+=64){
		ground = platforms.create(i + 300, game.world.height - 300, 'ground');
		ground.body.immovable = true;
	}

	
		//XPs
	var sign = objectsBackground.create(110 +0, game.world.height -550, 'sign');
	sign.body.immovable = true;
	var xp = objectsBackground.create(140, game.world.height -538, 'xp');
	xp.body.immovable = true;	
	for(var i = 0; i < 64 * 3; i+=64){
		ground = platforms.create(i + 100, game.world.height - 440, 'ground');
		ground.body.immovable = true;
	}

	
}
