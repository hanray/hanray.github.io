import * as THREE from '../build/three.module.js';

import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { ARButton } from '../jsm/webxr/ARButton.js';
import Stats    from '../jsm/libs/stats.module.js';

class App {
    constructor(){
    
        const container = document.createElement( 'div' );
        document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
        
        this.scene = new THREE.Scene();
       const hemiLight =  new THREE.HemisphereLight( 0x606060, 0x404040, 1);
       this.scene.add(hemiLight );
   
        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );
            
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.xr.enabled = true; 

        container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();
        
        this.stats = new Stats();
       
       console.log("Hi from the constructor");
        
        window.addEventListener('resize', this.resize.bind(this) );
        this.start();
        this.initScene();
        this.setupVR();
    }

start(){

    console.log("Started methods..");

}
  initScene(){
     this.geometry = new THREE.BoxBufferGeometry( 0.06, 0.06, 0.06 ); 
     this.meshes = [];
     console.log("Geometry loaded");

 }
 
 setupVR(){
     
     const self = this;
     let controller;
     
     function onSelect() {
         const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
         const mesh = new THREE.Mesh( self.geometry, material );
         mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
         mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
         self.scene.add( mesh );
         self.meshes.push( mesh );
         console.log("screen tapped");

     }

     const btn = new ARButton( this.renderer );
     controller = this.renderer.xr.getController( 0 );
     controller.addEventListener( 'select', onSelect );
     this.scene.add( controller );
     this.renderer.setAnimationLoop( this.render.bind(this) );
     console.log("AR Enabled..");
 }

 
 resize(){
     this.camera.aspect = window.innerWidth / window.innerHeight;
     this.camera.updateProjectionMatrix();
     this.renderer.setSize( window.innerWidth, window.innerHeight );  
 }
 
 render( ) {   
    // this.stats.update();
     this.meshes.forEach( (mesh) => { mesh.rotateY( 0.01 ); });
     this.renderer.render( this.scene, this.camera );
     this.camera.lookAt(this.scene.position);

 }

}
export {App};