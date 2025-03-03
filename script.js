//javascript
/*Basically we just need to make a few houses up on hill. The hill because we are countering sea level rising, the houses because we are making a residential development, try to make it look like San Francisco too*/

//Dax   ok sounds good. 

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Calculate house position (center point for camera focus)
const houseCenterY = 11.5 + 1; // House Y position + half its height

// Set camera initial position relative to house
camera.position.set(15, houseCenterY + 5, 15);

// Set orbit controls to target the house instead of origin
controls.target.set(0, houseCenterY, 0);
controls.update();

// Make sure the camera starts looking at the house
camera.lookAt(0, houseCenterY, 0);

// Create house structure
function createHouse() {
    const group = new THREE.Group();

    // Main house (cube) - use textured material
    const geometry = new THREE.BoxGeometry(3, 2, 2);
    const houseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf5f5f0,  // Slightly off-white
        shininess: 10     // Less shiny for more realistic appearance
    });
    const house = new THREE.Mesh(geometry, houseMaterial);
    house.position.y = 1;
    house.castShadow = true;
    house.receiveShadow = true;
    group.add(house);

    // More detailed roof
    const roofGeometry = new THREE.ConeGeometry(2.2, 1.5, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8b4513,
        shininess: 5,     // Less shiny roof
        flatShading: true // Add some texture to the roof
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 2 + 0.75;
    roof.castShadow = true;
    roof.receiveShadow = true;
    group.add(roof);

    // Chimney
    const chimneyGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
    const chimneyMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
    chimney.position.set(0.8, 2.8, 0);
    chimney.castShadow = true;
    group.add(chimney);

    // Door with frame
    const doorFrameGeometry = new THREE.BoxGeometry(0.6, 1.1, 0.1);
    const doorFrameMaterial = new THREE.MeshPhongMaterial({ color: 0x5c4033 });
    const doorFrame = new THREE.Mesh(doorFrameGeometry, doorFrameMaterial);
    doorFrame.position.set(0, 0.55, 1.005);
    doorFrame.castShadow = true;
    group.add(doorFrame);
    
    const doorGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
    const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x964B00 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.5, 1.01);
    door.castShadow = true;
    group.add(door);

    // Doorknob
    const doorknobGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const doorknobMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const doorknob = new THREE.Mesh(doorknobGeometry, doorknobMaterial);
    doorknob.position.set(0.15, 0.5, 1.07);
    group.add(doorknob);

    // Windows with frames
    function createWindowWithFrame(posX) {
        const frameGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.1);
        const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x5c4033 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(posX, 1.2, 1.005);
        frame.castShadow = true;
        group.add(frame);
        
        const windowGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.7,
            shininess: 100
        });
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(posX, 1.2, 1.01);
        window.castShadow = true;
        group.add(window);
        
        // Window crossbars
        const barGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.05);
        const barMaterial = new THREE.MeshPhongMaterial({ color: 0x5c4033 });
        const horizontalBar = new THREE.Mesh(barGeometry, barMaterial);
        horizontalBar.position.set(posX, 1.2, 1.02);
        group.add(horizontalBar);
        
        const verticalBarGeo = new THREE.BoxGeometry(0.05, 0.5, 0.05);
        const verticalBar = new THREE.Mesh(verticalBarGeo, barMaterial);
        verticalBar.position.set(posX, 1.2, 1.02);
        group.add(verticalBar);
    }
    
    createWindowWithFrame(1);
    createWindowWithFrame(-1);

    // Add a simple porch
    const porchGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8);
    const porchMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const porch = new THREE.Mesh(porchGeometry, porchMaterial);
    porch.position.set(0, 0, 1.4);
    porch.castShadow = true;
    porch.receiveShadow = true;
    group.add(porch);
    
    // Porch steps
    const stepsGeometry = new THREE.BoxGeometry(1, 0.2, 0.4);
    const steps = new THREE.Mesh(stepsGeometry, porchMaterial);
    steps.position.set(0, -0.15, 1.8);
    steps.castShadow = true;
    steps.receiveShadow = true;
    group.add(steps);

    return group;
}

// Replace ground plane with hill
const hillGeometry = new THREE.SphereGeometry(
    15,  // radius
    32,  // widthSegments
    32,  // heightSegments
    0,   // phiStart
    Math.PI * 2,  // phiLength
    0,    // thetaStart - start from top pole
    Math.PI/4     // thetaLength - reduced to quarter sphere (45 degrees)
);
const hillMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x90EE90,
    side: THREE.DoubleSide
});
const hill = new THREE.Mesh(hillGeometry, hillMaterial);
hill.position.y = -3.5; // Keep the hill position the same
hill.receiveShadow = true;
scene.add(hill);

// Enable shadows
renderer.shadowMap.enabled = true;

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Add house to scene
const house = createHouse();
house.position.y = 11.5; // Corrected position to sit on top of the quarter sphere
scene.add(house);

// Add environment elements
function addEnvironment() {
    // Add a tree
    function createTree(posX, posZ) {
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(posX, 12.5, posZ);
        trunk.castShadow = true;
        scene.add(trunk);
        
        const leavesGeometry = new THREE.ConeGeometry(1, 3, 8);
        const leavesMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x228B22,
            flatShading: true 
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(posX, 15, posZ);
        leaves.castShadow = true;
        scene.add(leaves);
    }
    
    createTree(3, 2);
    createTree(-3, -2);
    createTree(4, -3);
    
    // Add a simple path to the house
    const pathGeometry = new THREE.PlaneGeometry(1, 3);
    const pathMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xD2B48C,
        side: THREE.DoubleSide
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = Math.PI / 2;
    path.position.set(0, 11.51, 3);
    path.receiveShadow = true;
    scene.add(path);
}

// Add this line after adding the house to scene
addEnvironment();

// Improve lighting
directionalLight.position.set(15, 20, 15);
directionalLight.intensity = 0.9;

// Add a warm ambient light for better atmosphere
const warmLight = new THREE.AmbientLight(0xffcc99, 0.3);
scene.add(warmLight);

// Slightly modify the camera position for a better view
camera.position.set(18, houseCenterY + 6, 18);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
