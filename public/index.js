//npx vite serve public
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import BoxGeometry from './Components/BoxGeometry';
/*import { cameraPosition } from 'three/webgpu';*/

// --- Variables
let camera, controls, scene, renderer;
let clock = new THREE.Clock();
let cameraSpeed = 10;
let cameraRotateSpeed = Math.PI / 2;
let cameraPosition = new THREE.Vector3(0, 1, 5);
let cameraRotation = new THREE.Vector3(0, 0, 0);
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let sceneEntities = [];
let keyboard = {};



// Initialize the editor scene.
function init() {
    initRenderer();
    initScene();
    initSky();
    initCameras();
    initLights();
    initControls();
    initInput();

    loadEntitiesFromFile();
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.body.appendChild(renderer.domElement);

    renderer.setAnimationLoop(animate);

    //Create a helper for the shadow camera (optional)
    //const helper = new THREE.CameraHelper(light.shadow.camera);
    //scene.add(helper);
}

function initSky() {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    const phi = THREE.MathUtils.degToRad(90);
    const theta = THREE.MathUtils.degToRad(180);
    const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
    sky.material.uniforms.sunPosition.value = sunPosition;
    scene.add(sky);
}

function initCameras() {
    // --- Camera
    camera = new THREE.PerspectiveCamera(75, windowHalfX /windowHalfY, 1, 10000);
    camera.position.copy(cameraPosition);
    camera.rotation.setFromVector3(cameraRotation);
}

function initLights() {
    // Ambient
    const lightAmbient = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( lightAmbient );

    // Directional 1
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 5, 0);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 10;
    scene.add(light);

    //scene.add( new THREE.CameraHelper( light.shadow.camera ) );
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.addEventListener('change', render);
}

async function loadEntitiesFromFile() {
    const response = await fetch("Data/Entities.json");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("INFO: loading entities.json:");

    Object.entries(json).forEach((entry) => {
        const [key, entity] = entry;
        console.log(`${key}: ${JSON.stringify(entity)}`);
        
        let command = `new ${entity.component}(${JSON.stringify(entity.params)})`;
        console.log(`Calling: ${command}`);
        let component = eval(command);
        scene.add(component.mesh);
        sceneEntities.push(component);
        console.log(component);
    });
}

function initInput() {
    // Event listeners for keyboard input
    window.addEventListener('keydown', function(event) {
        keyboard[event.key] = true;
    });
    window.addEventListener('keyup', function(event) {
        keyboard[event.key] = false;
    });
}

init();
animate();

// --- Entities
// Plane 1
let geometry = new THREE.PlaneGeometry(5, 20, 32);
let material = new THREE.MeshPhongMaterial({color: 0x00ff00, side: THREE.DoubleSide, depthWrite: false});
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI / 2;
//plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);


window.onresize = function () {
    camera.aspect = windowHalfX /windowHalfY;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
};


function animate()
{
    requestAnimationFrame(update);
    render();
    update();
}


function update() {
    var delta = clock.getDelta();
    var moveDistance = cameraSpeed * delta; // pixels per second.
    var rotateAngle = Math.PI / 2 * delta;  // pi/2 radians (90 degrees) per second.
    
    controls.update();
    handleKeyboardInput(delta);

    // Update the camera.

    //cube1.animate();
    /*
    sceneEntities.forEach((entity, entityIndex) => {
        entity.update();
    });
    */
}

function render() {
	renderer.render(scene, camera);
}

function handleKeyboardInput(delta) {
    if(keyboard['w']) {
        cameraPosition.z -= cameraSpeed * delta;
    }
    if(keyboard['s']) {
        cameraPosition.z += cameraSpeed * delta;
    }
    if(keyboard['a']) {
        cameraPosition.x -= cameraSpeed * delta;
    }
    if(keyboard['d']) {
        cameraPosition.x += cameraSpeed * delta;
    }
    camera.position.copy(cameraPosition);
}


/*
// model
var loader = new THREE.FBXLoader();
loader.load("models/fbx/Samba Dancing.fbx", function (object) {
    object.mixer = new THREE.AnimationMixer(object);
    var action = object.mixer.clipAction(object.animations[0]);
    action.play();
    scene.add(object);
});
*/