


import * as THREE from './three/build/three.module.js';
import {GLTFLoader} from './three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from './three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from './three/examples/jsm/loaders/RGBELoader.js';


let scene, camera, renderer; //global so can be referenced wherever

init();

render();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1, 1000);
    new RGBELoader() //load HDRI
    .setDataType( THREE.UnsignedByteType )
    .setPath( 'Textures/' )
    .load( 'lilienstein_1k.hdr', function ( texture ) {

        const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        render();

        //LOAD MODELS HERE
        const loader = new GLTFLoader().setPath( 'Meshes/' );
        loader.load( 'glasgow.gltf', function ( gltf ) {
            scene.add( gltf.scene );



            render();

        } );
    });
    //RENDERER SETTINGS
    renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(renderer.domElement);

    //NEEDED TO GENERATE HDRI
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();
   
    //DEFAULT ORBIT CONTROLS: TO DO: CONSTRAIN SO YOU CAN'T GO UNDER MAP
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.target.set( 0, 0, - 0.2 );

    camera.position.set( - 1.8, 1.5, 2.7 );
    //REmember to call this after a manual move!
    controls.update();

    window.addEventListener('resize', onWindowResize, false);
}




function render(){



    renderer.render(scene, camera);
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
    
}



