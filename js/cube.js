var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

var scene = new THREE.Scene();
fogColor = new THREE.Color(0x635d59);
scene.background = fogColor;
var fogNear = 60;
scene.fog = new THREE.Fog(fogColor, fogNear, 210); //60 near
scene.background = new THREE.Color(0xD3D3D3);

var camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
var controls = new THREE.OrbitControls(camera);
controls.enableZoom = false;

controls.update();

var randNum;
var vertex;
var vertexTwo;
var face;
var movementArr;
let topped = false;
let topped1 = false;
let topped2 = false;
let spun = false;

function updateGroupGeometry( mesh, geometry ) {

	if ( geometry.isGeometry ) {

		geometry = new THREE.BufferGeometry().fromGeometry( geometry );


	}
}
//----------------------------------------------------------//
GameFlowState = {

		UNKNOWN : 0,
		INITIALISE : 1,
		GAMESTART: 2,
	  GAMEPLAY : 3,
		TALLY: 4
	};

////////////////////////KEYBOARD LISTENER ↓   ↓   ↓   //////////////

class Service{
     constructor(){

     }

     Update(){
     }
 };

class KeyboardService extends Service{
    constructor(){
        super();
        document.addEventListener("keydown", this.DocumentKeyDown, false);
        document.addEventListener("keyup", this.DocumentKeyUp, false);
        this.keys=[];
    }

    Update(){
    }

    IsKeydown(keyCode){
        return this.keys[keyCode];
    }

    DocumentKeyDown(event) {
         // console.log("Down")
         var keyCode = event.keyCode;
         keyboard.keys[keyCode]=true;
    };

    DocumentKeyUp(event) {
         // console.log("Up")
         var keyCode = event.keyCode;
         keyboard.keys[keyCode]=false;
    };

};

document.addEventListener("keydown", this.DocumentKeyDown, false);
document.addEventListener("keyup", this.DocumentKeyUp, false);



////////////////////////ENVIRONMENT ↓   ↓   ↓   //////////////

class Entity{
    constructor(){
			this.collidable = true;
    }


    Update() {
    }
}

class Environment extends Entity{
	constructor(){
				super();
				// this.collidable = false;
				this.meshgroup = new THREE.Group();
				this.geometry = new THREE.PlaneGeometry(300,300,10);
				this.material = new THREE.MeshPhongMaterial( {color: 0x0b001c, side: THREE.DoubleSide, transparent: true, opacity: 0} );
				this.mesh = new THREE.Mesh(this.geometry,this.material);
				this.mesh.castShadow = true;
				this.mesh.receiveShadow = true;
				this.mesh.position.x = this.mesh.position.y = this.mesh.position.z = 0;
				this.mesh.rotation.x = -3.14159 * 0.5;

				this.geom2 = new THREE.PlaneGeometry(650,2500,100);
				this.mat2 = new THREE.MeshLambertMaterial( {color: 0x5e5a96, transparent: true, opacity: 0, wireframe : false})
				this.mesh2 = new THREE.Mesh(this.geom2,this.mat2);
				this.mesh2.rotation.z = -3.14159 * 0.5;;
				this.mesh2.position.z = -650;
				this.mesh2.position.y = 100;

				this.meshgroup.add(this.mesh,this.mesh2);

				scene.add(this.meshgroup);

	};

	Update(){
		this.geometry.verticesNeedUpdate = true;
		this.material.needsUpdate = true;
		this.geometry.elementsNeedUpdate = true;
		this.geometry.morphTargetsNeedUpdate = true;
		this.geometry.uvsNeedUpdate = true;
		this.geometry.normalsNeedUpdate = true;
		this.geometry.colorsNeedUpdate = true;
		this.geometry.tangentsNeedUpdate = true;


	};
};

////////////////////////SOUNDS PLAYED FROM TONE.JS ↓   ↓   ↓   //////////////
class Sound{
	constructor(){
	}

	Update(){
	}
}


class WarpSound extends Sound{
	constructor(){
		super();

		this.synth = new Tone.MetalSynth({
			frequency  : 100 ,
			envelope  : {
				attack  : 0.01 ,
				decay  : 1.4 ,
				release  : 0.6
				}  ,
			harmonicity  : 5.1 ,
			modulationIndex  : 32 ,
			resonance  : 0 ,
			octaves  : -4
			}).toMaster();
		// this.synth.set(
		// 	{"frequency": 200,
		// 	});
		this.volume = 0;
	}

	Update(){
		if(gameFlow.currentState == 3){
			this.synth.triggerAttack(undefined, this.volume);
		}
	}
}



class StartSound extends Sound{
	constructor(){
		super();
		this.volume = 0.08;
		this.poly = new Tone.PolySynth(6, Tone.Synth).toMaster();
		this.poly.set("detune", -2500);
		// this.poly.volume.value = -20;
		this.poly.set({
			"filter" : {
				"type" : "highpass"
			},
			"envelope" : {
				"attack" : 0.85
			}
		});

	}

	Update(){
		if(gameFlow.currentState == 2 || gameFlow.currentState == 3 ){
			this.poly.triggerAttack(["C4", "E4", "A4"], undefined, this.volume );
		}




	}
}


////////////////////////HALF SPHERE ↓   ↓   ↓   //////////////
class HalfSphere extends Entity{
	constructor(){
		super();
		this.thetaLength = 0.8;
		this.geometry = new THREE.SphereBufferGeometry(20, 50, 30, 1, Math.PI*2, 0, this.thetaLength);

		this.material = new THREE.MeshLambertMaterial({color: 0x00684c, wireframe: true, side: THREE.DoubleSide, needsUpdate: true, transparent: true, opacity: 0});
		this.material.side = THREE.DoubleSide;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.castShadow = true;
		// this.mesh.position.set(0,20,0);
		this.mesh.position.x = 0;
		this.mesh.position.y = 20;
		this.mesh.position.z = 0;
		this.geometry.dynamic = true;
		this.geometry.verticesNeedUpdate = true;
		this.material.needsUpdate = true;
		this.geometry.elementsNeedUpdate = true;
		this.geometry.morphTargetsNeedUpdate = true;
		this.geometry.uvsNeedUpdate = true;
		this.geometry.normalsNeedUpdate = true;
		this.geometry.colorsNeedUpdate = true;
		this.geometry.tangentsNeedUpdate = true;
		scene.add(this.mesh);
	}

	Update(){
		this.geometry = new THREE.SphereBufferGeometry(20, 50, 30, 1, Math.PI*2, 0, this.thetaLength);
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.01;

		if(keyboard.IsKeydown(32) == true){
			let op = document.getElementById("clickable_groupTwo");
			var  temp = window.getComputedStyle(op).getPropertyValue("opacity");
			console.log(temp);
		}

	}
}


////////////////////////TENSEBOX ↓   ↓   ↓   //////////////
class TenseBox extends Entity{
    constructor(xPos,yPos,zPos){
        super();
        this.geometry = new THREE.BoxGeometry(8,8,8,2,2,2,2);
				this.geometry.dynamic = true;
				this.material = new THREE.MeshPhongMaterial( { vertexColors: THREE.VertexColors, color: 0xd6830e, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0} );
				this.material.needsUpdate = true;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
				this.size = 1.5;
        this.mesh.receiveShadow = false;
				this.speed = 0.005;


        //position
        this.mesh.position.y = yPos;
				this.mesh.position.x = xPos;
				this.mesh.position.z = zPos;
				scene.add(this.mesh);
			}

		Update(){
			this.geometry.verticesNeedUpdate = true;
			this.geometry.elementsNeedUpdate = true;
			this.geometry.morphTargetsNeedUpdate = true;
			this.geometry.uvsNeedUpdate = true;
			this.geometry.normalsNeedUpdate = true;
			this.geometry.colorsNeedUpdate = true;
			this.geometry.tangentsNeedUpdate = true;


			this.mesh.rotation.x -= this.speed;
			this.mesh.rotation.y -= this.speed;
			this.mesh.rotation.z -= this.speed;


			/////Random Pulse Movement ↓   ↓   ↓   ///////
			function randMovement(){

						 movementArr = [

						 function(){
						 for (var i=3; i<9; i++){
							 vertex = player.geometry.vertices[i];
								 if(vertex.x >=7){
									 topped = true;
								 }else if(vertex.x <=4){
									 topped = false;
								 }

								 if (topped){
									 vertex.x -= 0.07;
								 }else if(!topped){
									 vertex.x += 0.07;
								 }
						 }},

							function(){
							 for (var i=9; i<18; i++){
								 vertex = player.geometry.vertices[i];
								 if(vertex.x <= -8){
									 topped1 = true;
								 }else if(vertex.x >= -4){
									 topped1 = false
								 }

								 if (topped1){
									 vertex.x += 0.07;
								 }else if(!topped1){
									 vertex.x -= 0.07;
								 }


						 }},

							 function(){
								 let p;
								 let i;
								 for (i=18;i<20;i++){
		 							 vertex = player.geometry.vertices[i];
									 if(vertex.y >= 8){
										 topped2 = true;
									 }else if(vertex.y <= 4){
										 topped2 = false;
									 }

									 if(topped2){
										 vertex.y -= 0.07;
									 }else if(!topped2){
										 vertex.y += 0.07;
									 }
								 }

								 for (p=1;p<3;p++){
									 vertexTwo = player.geometry.vertices[p];
									 if(topped2){
										 vertexTwo.y -= 0.07;
									 }else if(!topped2){
										 vertexTwo.y += 0.07;
									 }

								 }
							}]

						 for(let i=0; i<movementArr.length; i++){
							 movementArr[i]();
						 }
			}

			randMovement();
			}


		Reset(){
		}


}


////////////////////////REACTIONS MOVEMENTS FOR BOX ↓   ↓   ↓   //////////////
function getRandomNum(min, max) {
	return Math.random() * (max - min) + min;
}

function roundDecimalFive(x){
	return Math.ceil(x/.05)*.05;
}

function randBool(){
	var i = Math.random() >= 0.5;
	return i;
}
function reactions(){
	if(gameFlow.currentState == 3){

		if(micVol > 0.9 && spun == false){
			player.speed = 0.00005;
			player.speed += micVol/12.5;
			if(startSound.volume < 0.3){
				startSound.volume += 0.05;
			}else if(startSound.volume > 0.3){
				startSound.volume = 0.3;
			}

			if(spun == true){
				randBool();
			}

			////POSITIONS
			if(randBool && spun == false){
				player.mesh.position.x -= micVol/12.5;
				player.mesh.position.z -= micVol/12.5;
				halfSphere.mesh.position.x -= micVol/12.5;
				halfSphere.mesh.position.z -= micVol/12.5;
			}else if(!randBool && spun == false) {
				player.mesh.position.x += micVol/12.5;
				player.mesh.position.z += micVol/12.5;
				halfSphere.mesh.position.x += micVol/12.5;
				halfSphere.mesh.position.z += micVol/12.5;
			}

			////anxSound////
			if(anxSound.volume < 0.02){
				anxSound.volume += 0.002;
			}

		}else if(micVol < 0.9){
			spun = true;
			//SPINSPEED
			if(player.speed >= 0.005){
				player.speed -= 0.005;
			}else if(player.speed < 0.005){
				player.speed = 0.005;
			}

			if(player.speed <= 0.105){
				spun = false;
			}



			//POSITION CORRECTION
			if(player.mesh.position.x < 0){
				player.mesh.position.x += 0.05;
				player.mesh.position.z += 0.05;
			}else if(player.mesh.position.x > 0){
				player.mesh.position.x -= 0.05;
				player.mesh.position.z -= 0.05;
			}

			if(halfSphere.mesh.position.x > 0){
				halfSphere.mesh.position.x -= 0.05;
				halfSphere.mesh.position.z -= 0.05;
			}else if(halfSphere.mesh.position.x < 0){
				halfSphere.mesh.position.x += 0.05;
				halfSphere.mesh.position.z += 0.05;
			}

			if(startSound.volume > 0.01 ){
				startSound.volume -= 0.05;
			}else{
				startSound.volume = 0.01;
			}

			if(anxSound.volume > 0){
				anxSound.volume -= 0.005
			}else if(anxSound.volume < 0){
				anxSound.volume = 0
			}
		}}}

////////////////////////LIGHT ↓   ↓   ↓   //////////////
class Light extends Entity{
    constructor(x, y, z, i, c){
        super();

        this.light = new THREE.DirectionalLight(c, i);
				this.collidable = false;
        this.light.position.set(x, y, z);
        this.light.castShadow = true;
        // the map size is the texture/buffer used to store the shadows
        // therefore smaller is faster, and bigger is better quality
        this.light.shadow.mapSize.width = 512;
        this.light.shadow.mapSize.height = 512;

        // shadow camera is to create a box within which shadows are calculated
        this.light.shadow.camera.near = 1;
        this.light.shadow.camera.far = 900;

        this.light.shadow.camera.left     = -600;
        this.light.shadow.camera.right    =  600;
        this.light.shadow.camera.top      =  600;
        this.light.shadow.camera.bottom   = -600;


        // the shadow map is stretched to fit the shadow camera box
        scene.add(this.light);

       this.helper = new THREE.DirectionalLightHelper( this.light, 5 );
       // scene.add( this.helper );


    }
}

////////////////////////GAME FLOW STATE ↓   ↓   ↓   //////////////

class GameFlow {
		constructor() {
      this.currentState = GameFlowState.INITIALISE;


		}

    Update() {
			switch(this.currentState){
				case GameFlowState.INITIALISE:

				camera.position.set( 300, 300, 300 );
				camera.rotation.x += 40;
				document.getElementById("intro_ui").style.display = 'block';
				gameFlow.currentState = GameFlowState.UNKNOWN;
					document.getElementById("intro_ok_button").onclick = function(){
					Tone.start();
					document.getElementById("intro_ui").style.display = 'none';
					gameFlow.currentState = GameFlowState.GAMESTART;
					}


				break;

				case GameFlowState.GAMESTART:




				let counter = 0;
					if (camera.position.x > 0){
						camera.position.x -= 1;
					}else counter ++;

					if(camera.position.y > 60){
						camera.position.y -= 1;

					}else counter ++;

					if(camera.position.z > 100){
						camera.position.z -= 1;
					} counter++;

					if(floor.mat2.opacity < 1){
						floor.mat2.opacity += 0.1;
						floor.material.opacity += 0.1;
						player.material.opacity += 0.09;

					}else counter++;

					if(halfSphere.material.opacity < 1){
						halfSphere.material.opacity += 0.01;
					}else counter++;

					if(counter == 5){
						halfSphere.material.transparency = true;
						gameFlow.currentState = GameFlowState.GAMEPLAY;
					}


				break;

				case GameFlowState.GAMEPLAY:
				mic.start();


				break;



			}
    } //switch
}




///////////////////////NEW ENTITIES ↓   ↓   ↓   //////////////

var light1 = new Light(0, 40, 0,2.7,0xFFE4B5);
var light2 = new Light(-40, 40, 0,2.9,0xffffff  );
// var light3 = new Light(10, 0, 10,0.5,0xffffff);

var keyboard = new KeyboardService();
var player = new TenseBox(0,20,0);
var gameFlow = new GameFlow();
var floor = new Environment();
var anxSound = new WarpSound();
var startSound = new StartSound();
var halfSphere = new HalfSphere()
var mic;
var micVol;
mic = new p5.AudioIn();

var record = function(){
	micVol = mic.getLevel();
	roundDecimalFive(micVol);
	if(micVol > 12){
		micVol = 12;
	}
}




////////////////////////ANIMATION ↓   ↓   ↓   //////////////


var animate = function(){
	requestAnimationFrame(animate);
		player.Update();
		record();
		reactions();
		gameFlow.Update();
		anxSound.Update();
		startSound.Update();
		controls.update();
		halfSphere.Update();
    renderer.render(scene,camera);
};

animate();
