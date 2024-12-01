import * as THREE from 'three';

export default class BoxGeometry {
    geometry;
    width;
    height;
    depth;
    widthSegements;
    heightSegments;

    material;

    mesh;
    position;
    castShadow;
    receiveShadow;

    scriptFiles;
    scripts;

    constructor(params = {}) {
        // Geometry parameters
        this.geometry = ('geometry' in params) ? params['geometry'] : new THREE.BoxGeometry(1, 1, 1);
        
        // Material parameters
        this.material = ('material' in params) ? params['material'] : new THREE.MeshPhongMaterial({color: 0x0000ff});

        // Mesh parameters
        this.position = ('position' in params) ? params['position'] : [0, 0, 0];
        this.castShadow = ('castShadow' in params) ? params['castShadow'] : false;
        this.receiveShadow = ('receiveShadow' in params) ? params['receiveShadow'] : false;

        // Scripts
        this.scriptFiles = ('scriptFiles' in params) ? params['scriptFiles'] : [];
        this.scripts     = []
        this.loadScriptFiles(params['scriptFiles']);

        // Generate actual mesh.
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(...this.position);
        this.mesh.castShadow = this.castShadow;
        this.mesh.receiveShadow = this.receiveShadow;
    }

    loadScriptFiles() {
        console.log(`  Running load_script_files()`);
        this.scriptFiles.forEach(script_file => {
            let scriptFilename = `../Scripts/${script_file}`;
            console.log(`  Loading script file: ${scriptFilename}`);
            //const script_functions = require(`../Scripts/${script_file}`);
            this.loadScript(scriptFilename);
        });

        console.log(`  Loaded ${this.scripts.length} scripts.`)
    }
    
    async loadScript(scriptFilename) {
        const script = await import(scriptFilename).then(script => {
            this.scripts.push(script.update);
            return script;
        });
    }

    update() {
        this.scripts.forEach((script, scriptIndex) => {
            //script(this);
            //console.log(`script promose: ${result}`);
        })
    }
}