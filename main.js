// import * as THREE from './build/three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { Car } from './car.js';



var frustumSize = 200;
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
var scene = new THREE.Scene();


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.gammaOutput = true
renderer.gammaFactor = 2.2
document.body.appendChild( renderer.domElement );

// background and light
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

scene.add( new THREE.AmbientLight( 0x666666 ) );

var light = new THREE.DirectionalLight( 0xdfebff, 1.1 );
light.position.set( 500, 500, 300 );
light.position.multiplyScalar( 1.3 );
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
var d = 300;
light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;
light.shadow.camera.far = 5000;
scene.add( light );

// car
var car = new Car(scene);

// load model
var loader = new GLTFLoader();
var trees = []
loader.load( './models/scene.gltf', function ( gltf ) {
    const scale = 0.04
    gltf.scene.scale.set(scale, scale, scale)
    gltf.scene.traverse( function( node ) {

        if ( node.isMesh ) { node.castShadow = true; }

    } );
    trees.push(gltf.scene)
    scene.add( trees[trees.length - 1] );
    
}, undefined, function ( error ) {
	console.error( error );
} );


// draw plane
var geometry = new THREE.BoxBufferGeometry( 200, 1, 200 );
var material = new THREE.MeshPhongMaterial( { color: 0xD6DBDF } );
var plane = new THREE.Mesh (geometry, material)
plane.receiveShadow = true;
scene.add( plane )

// camera
camera.position.set( -100, 100, 100 );
camera.lookAt(0,0,0)

// keyboard event
var keymap = {}; // You could also use an array
document.addEventListener("keydown", onkeydown, false);
document.addEventListener("keyup", onkeyup, false);
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keymap[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
}

function animate() {
    requestAnimationFrame( animate );
    let pedal = 0, steer = 0
    if (keymap[87]) { // w
        pedal = 1
    } else if (keymap[83]) { // s
        pedal = -1
    }

    if (keymap[65]) { // a
        steer = -1
    } else if (keymap[68]) { // d
        steer = 1
    }
    car.updateControl(pedal, steer)

    renderer.render( scene, camera );
}

animate();




// document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    event.preventDefault();
    var keyCode = event.which;
    if (keyCode == 37) {
        // left
        moveCamera(1,0)
    } else if (keyCode == 38) {
        // up
        moveCamera(0,1)
    } else if (keyCode == 39) {
        // right
        moveCamera(-1,0)
    } else if (keyCode == 40) {
        // down
        moveCamera(0,-1)
    } 
    if (keyCode == 87) { //W
        car.position.z -= 1
    } else if (keyCode == 83) { //S
        car.position.z += 1
    } 
    
    if (keyCode == 65) { //A
        car.position.x -= 1
    } else if (keyCode == 68) { //D
        car.position.x += 1
    }
};

function moveCamera( angleX, angleY ) {

    camera.position.x += angleX
    camera.position.y += angleY
    camera.updateMatrix();


}