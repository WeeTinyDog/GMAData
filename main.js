


import * as THREE from '/three/build/three.module.js';
import {GLTFLoader} from '/three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from '/three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from '/three/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '/three/examples/jsm/utils/RoughnessMipmapper.js';

let scene, camera, renderer;

init();

render();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1, 1000);
    new RGBELoader()
    .setDataType( THREE.UnsignedByteType )
    .setPath( 'Textures/' )
    .load( 'lilienstein_1k.hdr', function ( texture ) {

        const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        render();

        // model

        // use of RoughnessMipmapper is optional
        const roughnessMipmapper = new RoughnessMipmapper( renderer );

        const loader = new GLTFLoader().setPath( 'Meshes/' );
        loader.load( 'glasgow.gltf', function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                    // roughnessMipmapper.generateMipmaps( child.material );

                }

            } );

            scene.add( gltf.scene );

            roughnessMipmapper.dispose();

            render();

        } );
    });
    renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(renderer.domElement);


    const pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();
   
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.target.set( 0, 0, - 0.2 );

    camera.position.set( - 1.8, 1.5, 2.7 );
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
    
}



