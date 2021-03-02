

//when live
import * as THREE from '/GMAData/three/build/three.module.js';
import {GLTFLoader} from '/GMAData/three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from '/GMAData/three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from '/GMAData/three/examples/jsm/loaders/RGBELoader.js';

//local
// import * as THREE from '/three/build/three.module.js';
// import {GLTFLoader} from '/three/examples/jsm/loaders/GLTFLoader.js';
// import {OrbitControls} from '/three/examples/jsm/controls/OrbitControls.js';
// import { RGBELoader } from '/three/examples/jsm/loaders/RGBELoader.js';

let scene, camera, renderer, controls; //global so can be referenced wherever
let mouse = new THREE.Vector2(), INTERSECTED = null;

var intersects = [];
var raycaster = new THREE.Raycaster();
var lastIntersect = null;
var origColor = null;

const objects = [];
let postcodes = [
    {
        "identifier":"g1",
        "displayName" : "G1",
        "requests": 12,
        "fulfilledRequests":100
    },
    {
        "identifier":"g3",
        "displayName" : "G3",
        "requests": 114,
        "fulfilledRequests":100
    },
    {
        "identifier":"g4",
        "displayName" : "G4",
        "requests": 0,
        "fulfilledRequests":100
    },
    {
        "identifier":"g5",
        "displayName" : "G5",
        "requests": 3,
        "fulfilledRequests":100
    },
    {
        "identifier":"g11",
        "displayName" : "G11",
        "requests": 145,
        "fulfilledRequests":100
    },
    {
        "identifier":"g12",
        "displayName" : "G12",
        "requests": 166,
        "fulfilledRequests":100
    },
    {
        "identifier":"g13",
        "displayName" : "G13",
        "requests": 666,
        "fulfilledRequests":100
    },
    {
        "identifier":"g14",
        "displayName" : "G14",
        "requests": 363,
        "fulfilledRequests":100
    },
    {
        "identifier":"g15",
        "displayName" : "G15",
        "requests": 453,
        "fulfilledRequests":100
    },
    {
        "identifier":"g20",
        "displayName" : "G20",
        "requests": 786,
        "fulfilledRequests":100
    },
    {
        "identifier":"g21",
        "displayName" : "G21",
        "requests": 423,
        "fulfilledRequests":100
    },
    {
        "identifier":"g22",
        "displayName" : "G22",
        "requests": 456,
        "fulfilledRequests":100
    },
    {
        "identifier":"g23",
        "displayName" : "G23",
        "requests": 42,
        "fulfilledRequests":100
    },
    {
        "identifier":"g31",
        "displayName" : "G31",
        "requests": 423,
        "fulfilledRequests":100
    },
    {
        "identifier":"g32",
        "displayName" : "G32",
        "requests": 44,
        "fulfilledRequests":100
    },
    {
        "identifier":"g33",
        "displayName" : "G33",
        "requests": 644,
        "fulfilledRequests":100
    },
    {
        "identifier":"g34",
        "displayName" : "G34",
        "requests": 144,
        "fulfilledRequests":100
    },
    {
        "identifier":"g40",
        "displayName" : "G40",
        "requests": 1,
        "fulfilledRequests":100
    },
    {
        "identifier":"g41",
        "displayName" : "G41",
        "requests": 145,
        "fulfilledRequests":100
    },
    {
        "identifier":"g42",
        "displayName" : "G42",
        "requests": 44,
        "fulfilledRequests":100
    },
    {
        "identifier":"g43",
        "displayName" : "G43",
        "requests": 146,
        "fulfilledRequests":100
    },
    {
        "identifier":"g44",
        "displayName" : "G44",
        "requests": 146,
        "fulfilledRequests":100
    },
    {
        "identifier":"g45",
        "displayName" : "G45",
        "requests": 111,
        "fulfilledRequests":100
    },
    {
        "identifier":"g46",
        "displayName" : "G46",
        "requests": 464,
        "fulfilledRequests":100
    },
    {
        "identifier":"g51",
        "displayName" : "G51",
        "requests": 464,
        "fulfilledRequests":100
    },
    {
        "identifier":"g52",
        "displayName" : "G52",
        "requests": 11,
        "fulfilledRequests":100
    },
    {
        "identifier":"g53",
        "displayName" : "G53",
        "requests": 456,
        "fulfilledRequests":100
    },
    {
        "identifier":"g66",
        "displayName" : "G66",
        "requests": 112,
        "fulfilledRequests":100
    },
    {
        "identifier":"g69",
        "displayName" : "G69",
        "requests": 489,
        "fulfilledRequests":100
    },
    {
        "identifier":"g72",
        "displayName" : "G72",
        "requests": 422,
        "fulfilledRequests":100
    },
    {
        "identifier":"g73",
        "displayName" : "G73",
        "requests": 111,
        "fulfilledRequests":100
    },
    {
        "identifier":"g74",
        "displayName" : "G74",
        "requests": 445,
        "fulfilledRequests":100
    },
    {
        "identifier":"g78",
        "displayName" : "G78",
        "requests": 53,
        "fulfilledRequests":100
    },
    {
        "identifier":"g81",
        "displayName" : "G81",
        "requests": 53,
        "fulfilledRequests":100
    },
    {
        "identifier":"g82",
        "displayName" : "G82",
        "requests": 44,
        "fulfilledRequests":100
    },
    {
        "identifier":"ml4",
        "displayName" : "ML4",
        "requests": 11,
        "fulfilledRequests":100
    }
]

init();
animate();
render();

function init() {
    var maxRequestsValue = 0;



    postcodes.forEach(element => {
        if(element.requests>maxRequestsValue){
            maxRequestsValue = element.requests;
        }
    });
    scene = new THREE.Scene();
    {
        const color ="aliceblue";
        const near = 10;
        const far = 20;
        scene.fog = new THREE.Fog(color, near, far);
        scene.background = new THREE.Color(color)
    }
    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    const loc = new THREE.Vector3(0,3,0);
    createMeshText("Testing text", loc);


    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,0.1, 1000);
    new RGBELoader() //load HDRI
    .setDataType( THREE.UnsignedByteType )
    .setPath( 'Textures/' )
    .load( 'CGSkies_0338_free.hdr', function ( texture ) {
        const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
        //scene.background = envMap;
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
        loader.load( 'postcodes.gltf', function ( gltf ) {
            scene.add( gltf.scene );
            gltf.scene.traverse(function(child){
                    let thisSegment = postcodes.find(thisSegment => thisSegment.identifier === child.name);
                    if(thisSegment!=null)
                    {
                    const col = new THREE.Color(1,1,1);
                    const percent = thisSegment.requests/maxRequestsValue;
                    col.r = 0;
                    col.g = percent;
                    col.b = 0;
                    var mat =new THREE.MeshPhysicalMaterial( { color: col } );
                    mat.transmission = 0.1;
                    mat.roughness = 0.02;
                    mat.transparent = true;
                    child.material = mat;
                    child.scale.y = percent+0.01;
                    objects.push(child);
                    }   
            });
            render();
        } );
    });
    //RENDERER SETTINGS
    renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 2.0;
	renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);
    //NEEDED TO GENERATE HDRI
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();
    //DEFAULT ORBIT CONTROLS
    controls = new OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.target.set( 0, 0, - 0.2 );
    controls.minPolarAngle = Math.PI/6;
    controls.maxPolarAngle = Math.PI/2.25;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 12;
    controls.enableDamping = true;
    controls.dampingFactor =0.1;
    camera.position.set( - 1.8, 3, 10 );
    //REmember to call this after a manual move!
    controls.update();
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener('resize', onWindowResize, false);
}
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    update();
    renderer.render(scene, camera);
}

function update(){
   
}

function createMeshText(string, location)
{
    const loaderf = new THREE.FontLoader();

    loaderf.load( 'textures/helvetiker_regular.typeface.json', function ( font ) {

	const geometry = new THREE.TextGeometry( string, {
		font: font,
		size: 0.8,
		height: 0.08,
		curveSegments: 12,
		bevelEnabled: false,
		bevelThickness: 10,
		bevelSize: 0.8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
    const mat = new THREE.MeshPhysicalMaterial({color:"black"})
    const mesh = new THREE.Mesh(geometry,mat);
    mesh.position.y = location.y;
    scene.add(mesh);

    } );
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

function onMouseMove(event){
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects, true );


	if ( intersects.length > 0 ) {
		var object = intersects[ 0 ].object;
        if(object!==lastIntersect) //runs if object changed
        {
            if(lastIntersect !== null && origColor !== null)
            {
                //reset last intersect colour
                //console.log(origColor);
                lastIntersect.material.color.set(origColor);
            }

            //console.log("OBJECT CHANGED");
            //get colour of new object
            const col = new THREE.Color(object.material.color);
            origColor = col;
            //set colour of selected object to custom temp colour
            object.material.color.set("red");

            lastIntersect = object;
        }


        
        
		
	
	}

}