//javascript
/*Basically we just need to make a few houses up on hill. The hill because we are countering sea level rising, the houses because we are making a residential development, try to make it look like San Francisco too*/

//Dax   ok sounds good. 

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB); // Sky blue background
document.body.appendChild(renderer.domElement);

// Add camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Calculate house position (center point for camera focus)
const houseCenterY = 11.5 + 1; // House Y position + half its height

// Set camera initial position relative to house
camera.position.set(40, houseCenterY + 25, 40);

// Set orbit controls to target the house instead of origin
controls.target.set(0, houseCenterY, 0);
controls.update();

// Make sure the camera starts looking at the house
camera.lookAt(0, houseCenterY, 0);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Create skybox
function createSkybox() {
    const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
    const skyboxMaterials = [
        new THREE.MeshBasicMaterial({ 
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/cube/skybox/px.jpg'), 
            side: THREE.BackSide 
        }),
        new THREE.MeshBasicMaterial({ 
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/cube/skybox/nx.jpg'), 
            side: THREE.BackSide 
        }),
        new THREE.MeshBasicMaterial({ 
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/cube/skybox/py.jpg'), 
            side: THREE.BackSide 
        }),
        new THREE.MeshBasicMaterial({ 
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/cube/skybox/ny.jpg'), 
            side: THREE.BackSide 
        }),
        new THREE.MeshBasicMaterial({ 
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/cube/skybox/pz.jpg'), 
            side: THREE.BackSide 
        }),
        new THREE.MeshBasicMaterial({ 
            map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/cube/skybox/nz.jpg'), 
            side: THREE.BackSide 
        })
    ];
    
    // Fallback to gradient sky if textures fail to load
    const skyboxMaterial = new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        side: THREE.BackSide
    });
    
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    scene.add(skybox);
    
    return skybox;
}

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

// Create an enhanced tree with more realistic features
function createTree(posX, posZ, isSecondIsland = false, treeType = 'random') {
    // Skip tree creation entirely if it's meant for the second island (city)
    if (isSecondIsland) {
        return null; // Don't create trees on the city island
    }
    
    // Define island parameters
    let hillRadius = 15; // Still used for boundary checking
    let islandSurfaceY = 10.25; // Match with new island surface level
    let centerX = 8; // New island center X position (moved right)
    
    const adjustedX = posX - centerX;
    const distFromIslandCenter = Math.sqrt(adjustedX * adjustedX + posZ * posZ);
    
    // Skip tree creation if the position is outside the island radius (in water)
    if (distFromIslandCenter >= hillRadius) {
        return null; // Don't create trees in the water
    }
    
    // Use constant Y position for flat ground
    let yPosition = islandSurfaceY;
    
    // Create tree group to hold all components
    const treeGroup = new THREE.Group();
    
    // Randomly select tree type if not specified
    if (treeType === 'random') {
        island.position.y = 10; // Align with bridge road level

        const types = ['pine', 'oak', 'cypress', 'redwood'];
        treeType = types[Math.floor(Math.random() * types.length)];
    }
    
    // Randomize tree size for natural variation
    const sizeVariation = 0.7 + Math.random() * 0.6;
    
    // Create tree based on type
    switch(treeType) {
        case 'pine':
            createPineTree(treeGroup, sizeVariation);
            break;
        case 'oak':
            createOakTree(treeGroup, sizeVariation);
            break;
        case 'cypress':
            createCypressTree(treeGroup, sizeVariation);
            break;
        case 'redwood':
            createRedwoodTree(treeGroup, sizeVariation);
            break;
        default:
            createPineTree(treeGroup, sizeVariation);
    }
    
    // Position the entire tree group (adjust X by island offset)
    treeGroup.position.set(posX + centerX, yPosition, posZ);
    
    // Add random rotation for variety
    treeGroup.rotation.y = Math.random() * Math.PI * 2;
    
    // Add tree to scene
    scene.add(treeGroup);
    
    return treeGroup;
}

// Creates a realistic pine tree
function createPineTree(group, scale = 1) {
    // Create a more detailed trunk with bark texture
    const trunkGeometry = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 3 * scale, 12);
    const trunkMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B4513,
        shininess: 2,
        flatShading: true
    });
    
    // Add noise to trunk vertices for more realistic bark
    const trunkPositions = trunkGeometry.attributes.position;
    for (let i = 0; i < trunkPositions.count; i++) {
        const x = trunkPositions.getX(i);
        const y = trunkPositions.getY(i);
        const z = trunkPositions.getZ(i);
        
        // Don't modify top and bottom vertices
        if (Math.abs(y) < 1.48 * scale) {
            // Add some random bumps to simulate bark
            const barkDepth = 0.02 * scale;
            trunkPositions.setX(i, x + (Math.random() - 0.5) * barkDepth);
            trunkPositions.setZ(i, z + (Math.random() - 0.5) * barkDepth);
        }
    }
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.position.y = 1.5 * scale;
    group.add(trunk);
    
    // Create multiple cones for a fuller pine tree look
    const treeHeight = 7 * scale;
    const numLayers = 5;
    
    for (let i = 0; i < numLayers; i++) {
        const layerHeight = treeHeight / numLayers;
        // Make cones wider at bottom, narrower at top
        const coneRadius = (1.2 - i * 0.15) * scale;
        const coneHeight = (treeHeight / 2) * (1 - i * 0.15);
        
        const coneGeometry = new THREE.ConeGeometry(
            coneRadius, 
            coneHeight, 
            8
        );
        
        // Vary the green colors slightly for more realism
        const greenHue = 0.25 + Math.random() * 0.1; // Slight variation in green
        const greenSaturation = 0.5 + Math.random() * 0.2;
        const greenLightness = 0.25 + Math.random() * 0.1;
        
        const coneMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(greenHue, greenSaturation, greenLightness),
            flatShading: true,
            shininess: 3
        });
        
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.castShadow = true;
        cone.receiveShadow = true;
        
        // Position each cone layer with slight overlaps
        const layerPosition = 3 * scale + (i * layerHeight * 0.8);
        cone.position.y = layerPosition;
        
        group.add(cone);
        
        // Add some randomness to vertices for a less perfect shape
        const positions = cone.geometry.attributes.position;
        for (let j = 0; j < positions.count; j++) {
            // Skip the top vertex of the cone
            if (j > 0) {
                const x = positions.getX(j);
                const y = positions.getY(j);
                const z = positions.getZ(j);
                
                // Add random displacement to x and z
                positions.setX(j, x + (Math.random() - 0.5) * 0.1 * scale);
                positions.setZ(j, z + (Math.random() - 0.5) * 0.1 * scale);
            }
        }
        
        cone.geometry.computeVertexNormals();
    }
    
    // Add some fallen pine needles around the base
    const needlesGeometry = new THREE.CircleGeometry(0.8 * scale, 8);
    const needlesMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a5f0b,
        shininess: 5,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const needles = new THREE.Mesh(needlesGeometry, needlesMaterial);
    needles.rotation.x = -Math.PI / 2; // Lay flat on ground
    needles.position.y = 0.01; // Just above ground
    needles.receiveShadow = true;
    group.add(needles);
}

// Creates a broad-leafed deciduous tree like an oak
function createOakTree(group, scale = 1) {
    // Create trunk with more realistic taper and bark texture
    const trunkGeometry = new THREE.CylinderGeometry(0.25 * scale, 0.4 * scale, 2.5 * scale, 12);
    const trunkMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x5D4037, // Darker brown for oak
        shininess: 2,
        flatShading: true 
    });
    
    // Add bark texture by modifying vertices
    const trunkPositions = trunkGeometry.attributes.position;
    for (let i = 0; i < trunkPositions.count; i++) {
        const x = trunkPositions.getX(i);
        const y = trunkPositions.getY(i);
        const z = trunkPositions.getZ(i);
        
        if (Math.abs(y) < 1.2 * scale) {
            // More pronounced bark for oak
            const barkDepth = 0.03 * scale;
            trunkPositions.setX(i, x + (Math.random() - 0.5) * barkDepth);
            trunkPositions.setZ(i, z + (Math.random() - 0.5) * barkDepth);
        }
    }
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.position.y = 1.25 * scale;
    group.add(trunk);
    
    // Create main branches
    createBranches(group, scale, trunk.position.y + trunkGeometry.parameters.height/2);
    
    // Create foliage as a cluster of spheres for oak's rounded canopy
    const foliageGroup = new THREE.Group();
    const foliageRadius = 2.2 * scale;
    const foliageCenterY = 4.5 * scale;
    
    // Create multiple overlapping spheres for fuller foliage
    const numSpheres = 15;
    for (let i = 0; i < numSpheres; i++) {
        // Random position within the overall foliage shape
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * foliageRadius * 0.8;
        const height = Math.random() * foliageRadius - foliageRadius/4;
        
        const sphereX = Math.cos(angle) * radius;
        const sphereY = foliageCenterY + height;
        const sphereZ = Math.sin(angle) * radius;
        
        // Random size for each foliage clump
        const sphereSize = (0.8 + Math.random() * 0.7) * scale;
        
        // Vary the green color for each sphere
        const greenHue = 0.25 + Math.random() * 0.10; // Greens
        const greenSaturation = 0.6 + Math.random() * 0.3;
        const greenLightness = 0.25 + Math.random() * 0.15;
        
        const sphereGeometry = new THREE.SphereGeometry(sphereSize, 8, 8);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(greenHue, greenSaturation, greenLightness),
            flatShading: true,
            shininess: 5
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(sphereX, sphereY, sphereZ);
        sphere.castShadow = true;
        
        // Add some irregularity to the foliage spheres
        const positions = sphere.geometry.attributes.position;
        for (let j = 0; j < positions.count; j++) {
            const x = positions.getX(j);
            const y = positions.getY(j);
            const z = positions.getZ(j);
            
            positions.setX(j, x + (Math.random() - 0.5) * 0.15 * scale);
            positions.setY(j, y + (Math.random() - 0.5) * 0.15 * scale);
            positions.setZ(j, z + (Math.random() - 0.5) * 0.15 * scale);
        }
        
        sphere.geometry.computeVertexNormals();
        foliageGroup.add(sphere);
    }
    
    group.add(foliageGroup);
    
    // Add some ground details like roots or fallen leaves
    const rootsGeometry = new THREE.CircleGeometry(0.8 * scale, 12);
    const rootsMaterial = new THREE.MeshPhongMaterial({
        color: 0x5D4037,
        shininess: 2,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const roots = new THREE.Mesh(rootsGeometry, rootsMaterial);
    roots.rotation.x = -Math.PI / 2; // Lay flat on ground
    roots.position.y = 0.01; // Just above ground
    roots.receiveShadow = true;
    group.add(roots);
}

// Create branches for trees
function createBranches(group, scale, startY) {
    // Create 3-4 main branches extending from the trunk
    const numBranches = 3 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numBranches; i++) {
        // Angle from trunk
        const angle = (i / numBranches) * Math.PI * 2;
        const angleOffset = Math.random() * 0.5 - 0.25;
        
        // Branch parameters
        const branchLength = (0.8 + Math.random() * 0.7) * scale;
        const branchThickness = (0.1 + Math.random() * 0.05) * scale;
        const branchAngle = Math.PI/4 + Math.random() * Math.PI/8; // ~45° up from horizontal
        
        // Create branch geometry
        const branchGeometry = new THREE.CylinderGeometry(
            branchThickness * 0.7, // Thinner at the end
            branchThickness,
            branchLength,
            8
        );
        const branchMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x5D4037,
            shininess: 2,
            flatShading: true
        });
        
        // Add bend to the branch by modifying vertices
        const branchPositions = branchGeometry.attributes.position;
        for (let j = 0; j < branchPositions.count; j++) {
            const x = branchPositions.getX(j);
            const y = branchPositions.getY(j);
            const z = branchPositions.getZ(j);
            
            // Add slight bend upward toward the end of the branch
            const bendFactor = (y / branchLength) * 0.1 * scale;
            branchPositions.setY(j, y + bendFactor);
            
            // Add some random variation for more natural look
            branchPositions.setX(j, x + (Math.random() - 0.5) * 0.02 * scale);
            branchPositions.setZ(j, z + (Math.random() - 0.5) * 0.02 * scale);
        }
        
        branchGeometry.computeVertexNormals();
        
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        branch.castShadow = true;
        branch.receiveShadow = true;
        
        // Position branch
        branch.position.y = startY - (0.3 * scale) - (Math.random() * 0.4 * scale);
        
        // Rotate branch to proper orientation
        branch.rotation.z = branchAngle;
        branch.rotation.y = angle + angleOffset;
        
        // Move branch outward from trunk center
        const radialDist = 0.2 * scale;
        branch.position.x = Math.cos(angle + angleOffset) * radialDist;
        branch.position.z = Math.sin(angle + angleOffset) * radialDist;
        
        // Adjust pivot point to connect to trunk
        branchGeometry.translate(0, -branchLength/2, 0);
        
        group.add(branch);
    }
}

// Creates a tall, narrow cypress tree (common in San Francisco)
function createCypressTree(group, scale = 1) {
    // Create trunk with distinctive reddish-brown color
    const trunkGeometry = new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 2.8 * scale, 10);
    const trunkMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B5A2B, 
        shininess: 2,
        flatShading: true
    });
    
    // Add bark texture
    const trunkPositions = trunkGeometry.attributes.position;
    for (let i = 0; i < trunkPositions.count; i++) {
        const x = trunkPositions.getX(i);
        const y = trunkPositions.getY(i);
        const z = trunkPositions.getZ(i);
        
        if (Math.abs(y) < 1.3 * scale) {
            const barkDepth = 0.015 * scale;
            trunkPositions.setX(i, x + (Math.random() - 0.5) * barkDepth);
            trunkPositions.setZ(i, z + (Math.random() - 0.5) * barkDepth);
        }
    }
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.position.y = 1.4 * scale;
    group.add(trunk);
    
    // Create distinctive cypress shape - elongated and tapering toward top
    const cypressHeight = 8 * scale;
    const baseWidth = 1.5 * scale;
    const topWidth = 0.4 * scale;
    
    // Build foliage from overlapping cones
    const numCones = 6;
    for (let i = 0; i < numCones; i++) {
        const heightFraction = i / (numCones - 1);
        const coneHeight = cypressHeight / (numCones - 0.5);
        
        // Calculate width based on height (wider at bottom, narrower at top)
        const coneWidth = baseWidth - heightFraction * (baseWidth - topWidth);
        
        const coneGeometry = new THREE.ConeGeometry(coneWidth, coneHeight, 10);
        
        // Cypress is more gray-green
        const greenHue = 0.26 + Math.random() * 0.05;
        const greenSaturation = 0.4 + Math.random() * 0.15;
        const greenLightness = 0.2 + Math.random() * 0.1;
        
        const coneMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(greenHue, greenSaturation, greenLightness),
            flatShading: true,
            shininess: 3
        });
        
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.castShadow = true;
        cone.receiveShadow = true;
        
        // Stagger the cones to create the cypress shape
        const conePosition = 3 * scale + heightFraction * 5 * scale;
        cone.position.y = conePosition;
        
        // Add some irregularity to make it look less perfect
        const positions = cone.geometry.attributes.position;
        for (let j = 0; j < positions.count; j++) {
            // Don't modify the top vertex
            if (j > 0) {
                const x = positions.getX(j);
                const y = positions.getY(j);
                const z = positions.getZ(j);
                
                const distortion = 0.08 * scale;
                positions.setX(j, x + (Math.random() - 0.5) * distortion);
                positions.setZ(j, z + (Math.random() - 0.5) * distortion);
            }
        }
        
        cone.geometry.computeVertexNormals();
        group.add(cone);
    }
    
    // Add fallen needles at base
    const needlesGeometry = new THREE.CircleGeometry(0.7 * scale, 8);
    const needlesMaterial = new THREE.MeshPhongMaterial({
        color: 0x556B2F,
        shininess: 1,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    const needles = new THREE.Mesh(needlesGeometry, needlesMaterial);
    needles.rotation.x = -Math.PI / 2;
    needles.position.y = 0.01;
    needles.receiveShadow = true;
    group.add(needles);
}

// Creates a tall California redwood tree
function createRedwoodTree(group, scale = 1) {
    // Taller, larger scale for redwoods
    const redwoodScale = scale * 1.5;
    
    // Create distinctive reddish trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.35 * redwoodScale, 0.5 * redwoodScale, 6 * redwoodScale, 12);
    const trunkMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B2500, // Reddish-brown
        shininess: 2,
        flatShading: true
    });
    
    // Add deep ridged bark texture
    const trunkPositions = trunkGeometry.attributes.position;
    for (let i = 0; i < trunkPositions.count; i++) {
        const x = trunkPositions.getX(i);
        const y = trunkPositions.getY(i);
        const z = trunkPositions.getZ(i);
        
        if (Math.abs(y) < 2.9 * redwoodScale) {
            // Deep ridged bark characteristic of redwoods
            const barkDepth = 0.04 * redwoodScale;
            const angle = Math.atan2(z, x);
            const ridges = Math.sin(angle * 12) * barkDepth;
            
            const distFromCenter = Math.sqrt(x*x + z*z);
            const normalizedX = x / distFromCenter;
            const normalizedZ = z / distFromCenter;
            
            trunkPositions.setX(i, x + normalizedX * ridges);
            trunkPositions.setZ(i, z + normalizedZ * ridges);
        }
    }
    
    trunkGeometry.computeVertexNormals();
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.position.y = 3 * redwoodScale;
    group.add(trunk);
    
    // Create redwood's distinctive conical shape with layered foliage
    const foliageHeight = 12 * redwoodScale;
    const numLayers = 7;
    
    for (let i = 0; i < numLayers; i++) {
        const layerHeight = foliageHeight / numLayers;
        const heightPosition = i / (numLayers - 1); // 0 to 1
        
        // Wider at bottom, narrower at top
        const coneWidth = (1.8 - heightPosition * 0.9) * redwoodScale;
        const coneHeight = 3 * redwoodScale * (1 - heightPosition * 0.3);
        
        const coneGeometry = new THREE.ConeGeometry(coneWidth, coneHeight, 10);
        
        // Deep green for redwoods
        const greenHue = 0.25 + Math.random() * 0.05;
        const greenSaturation = 0.6 + Math.random() * 0.2;
        const greenLightness = 0.2 + Math.random() * 0.06;
        
        const coneMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(greenHue, greenSaturation, greenLightness),
            flatShading: true,
            shininess: 3
        });
        
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.castShadow = true;
        cone.receiveShadow = true;
        
        // Position each layer
        const layerPosition = (6 * redwoodScale) + i * layerHeight * 0.9;
        cone.position.y = layerPosition;
        
        // Add some randomness to vertices for a less perfect look
        const positions = cone.geometry.attributes.position;
        for (let j = 0; j < positions.count; j++) {
            if (j > 0) { // Skip the top vertex
                const x = positions.getX(j);
                const y = positions.getY(j);
                const z = positions.getZ(j);
                
                positions.setX(j, x + (Math.random() - 0.5) * 0.15 * redwoodScale);
                positions.setZ(j, z + (Math.random() - 0.5) * 0.15 * redwoodScale);
            }
        }
        
        cone.geometry.computeVertexNormals();
        group.add(cone);
    }
    
    // Add fallen needles and small branches at base
    const debrisGeometry = new THREE.CircleGeometry(1.0 * redwoodScale, 10);
    const debrisMaterial = new THREE.MeshPhongMaterial({
        color: 0x3C280D,
        shininess: 1,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
    debris.rotation.x = -Math.PI / 2;
    debris.position.y = 0.01;
    debris.receiveShadow = true;
    group.add(debris);
}

// Create main island as a flat cylinder that connects with the bridge road
function createMainIsland() {
    // Use a cylinder with minimal height for a flat island
    const islandGeometry = new THREE.CylinderGeometry(15, 15, 0.5, 32);
    const islandMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x91BD59, // Grass green color
        shininess: 0
    });
    
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    
    // Position at the bridge road level and move to the right
    island.position.y = 10; // Align with bridge road level
    island.position.x = 14.8; // Move island to the right
    
    // Add some texture to the island surface
    const textureDetail = 100;
    for (let i = 0; i < textureDetail; i++) {
        // Create small bumps of varying shades of green
        const bumpGeometry = new THREE.CylinderGeometry(
            0.2 + Math.random() * 0.3,  // Random radius
            0.1 + Math.random() * 0.2,
            0.1,
            8
        );
        
        // Vary the green color slightly
        const greenValue = 0.4 + Math.random() * 0.2;
        const bumpMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(0.2, greenValue, 0.1),
            shininess: 0
        });
        
        const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
        
        // Position randomly within island bounds
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 14; // Keep within island radius
        
        bump.position.x = Math.cos(angle) * radius;
        bump.position.z = Math.sin(angle) * radius;
        bump.position.y = 0.3; // Small elevation above island surface
        
        island.add(bump);
    }
    
    island.receiveShadow = true;
    scene.add(island);
    
    return island;
}

// Create a San Francisco skyline on the second island
function createSFSkyline() {
    const cityGroup = new THREE.Group();
    
    // Create a base for the city
    const baseGeometry = new THREE.CylinderGeometry(15, 15, 2, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(-60, -2.5, 0);
    base.receiveShadow = true;
    cityGroup.add(base);
    
    // Function to create a building
    function createBuilding(x, z, height, width, depth, color) {
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            shininess: 50
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, height/2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        return building;
    }
    
    // Create Transamerica Pyramid (iconic SF building)
    const pyramidGeometry = new THREE.ConeGeometry(2, 20, 4);
    const pyramidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xF5F5F5,
        shininess: 80
    });
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.position.set(-60, 10, 0);
    pyramid.castShadow = true;
    cityGroup.add(pyramid);
    
    // Create Salesforce Tower (tallest building)
    const salesforceTower = createBuilding(-65, 3, 25, 3, 3, 0xA9A9A9);
    cityGroup.add(salesforceTower);
    
    // Create other tall buildings
    cityGroup.add(createBuilding(-55, 5, 18, 4, 4, 0xD3D3D3));
    cityGroup.add(createBuilding(-63, -5, 15, 3, 3, 0xE0E0E0));
    cityGroup.add(createBuilding(-57, -3, 20, 2.5, 2.5, 0xC0C0C0));
    cityGroup.add(createBuilding(-52, 0, 16, 3, 3, 0xD3D3D3));
    cityGroup.add(createBuilding(-68, 0, 14, 2, 2, 0xE8E8E8));
    cityGroup.add(createBuilding(-58, 8, 17, 2, 2, 0xD3D3D3));
    cityGroup.add(createBuilding(-50, -5, 13, 2.5, 2.5, 0xC0C0C0));
    cityGroup.add(createBuilding(-70, 5, 12, 2, 2, 0xE0E0E0));
    cityGroup.add(createBuilding(-65, -8, 15, 2, 2, 0xD3D3D3));
    
    // Add medium buildings
    for (let i = 0; i < 15; i++) {
        const x = -60 + (Math.random() * 20 - 10);
        const z = Math.random() * 20 - 10;
        const height = 5 + Math.random() * 8;
        const width = 1.5 + Math.random() * 1.5;
        const depth = 1.5 + Math.random() * 1.5;
        const color = 0xA0A0A0 + Math.random() * 0x505050;
        
        cityGroup.add(createBuilding(x, z, height, width, depth, color));
    }
    
    // Add small buildings/houses
    for (let i = 0; i < 30; i++) {
        const x = -60 + (Math.random() * 25 - 12.5);
        const z = Math.random() * 25 - 12.5;
        const height = 2 + Math.random() * 3;
        const width = 1 + Math.random() * 1;
        const depth = 1 + Math.random() * 1;
        const color = 0xA0A0A0 + Math.random() * 0x505050;
        
        // Don't place buildings too close to the tallest ones
        const distToCenter = Math.sqrt((x+60)*(x+60) + z*z);
        if (distToCenter > 5) {
            cityGroup.add(createBuilding(x, z, height, width, depth, color));
        }
    }
    
    scene.add(cityGroup);
    return cityGroup;
}

// Create a second island (Marin Headlands)
function createSecondIsland() {
    const islandGeometry = new THREE.SphereGeometry(
        15,  // smaller radius
        32,  // widthSegments
        32,  // heightSegments
        0,   // phiStart
        Math.PI * 2,  // phiLength
        0,    // thetaStart - start from top pole
        Math.PI/4     // thetaLength - reduced to quarter sphere (45 degrees)
    );
    const islandMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x9b7653, // More brownish color for Marin Headlands
        side: THREE.DoubleSide
    });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.set(-60, -3.5, 0); // Position to the left (west) of main island
    island.receiveShadow = true;
    scene.add(island);
    
    // Add some trees to the second island edges
    for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 4;
        const x = -60 + Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        createTree(x, z, true); // true indicates it's on the second island
    }
    
    return island;
}

// Create enhanced ocean with realistic water effect
function createOcean() {
    // Create a larger ocean plane
    const oceanGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
    
    // Create a more realistic water material
    const oceanMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0077be,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
        reflectivity: 1.0,
        envMapIntensity: 1.5
    });
    
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -3.5; // Same level as the bottom of the islands
    ocean.receiveShadow = true;
    
    // Add a second layer for wave depth effect
    const deepOceanGeometry = new THREE.PlaneGeometry(500, 500);
    const deepOceanMaterial = new THREE.MeshPhongMaterial({
        color: 0x004080,
        transparent: true,
        opacity: 0.9
    });
    
    const deepOcean = new THREE.Mesh(deepOceanGeometry, deepOceanMaterial);
    deepOcean.rotation.x = -Math.PI / 2;
    deepOcean.position.y = -5.5; // Below the surface
    
    scene.add(ocean);
    scene.add(deepOcean);
    
    // Return ocean structure without foam rings
    return {
        surface: ocean,
        deep: deepOcean,
        foams: [] // Empty array instead of creating foam rings
    };
}

// Add houses to scene in a San Francisco style layout
function addHouses() {
    // Define house positions (x, z coordinates)
    const housePositions = [
        [0, 0],       // Original house position (center)
        [8, 5],       // House 2
        [-8, 5],      // House 3
        [5, -8],      // House 4
        [-5, -8],     // House 5
        [8, -3],      // House 6
        [-8, -3],     // House 7
        [0, -8]       // House 8
    ];
    
    // Island parameters
    const islandSurfaceY = 10.25; // Slightly above island surface
    const islandCenterX = 15; // Island center X position
    
    // Create houses at each position with slight variations
    housePositions.forEach((pos, index) => {
        const house = createHouse();
        
        // Place all houses on the flat surface, adjusted for island position
        house.position.set(pos[0] + islandCenterX, islandSurfaceY, pos[1]);
        
        // Rotate houses to face different directions
        house.rotation.y = Math.random() * Math.PI * 2;
        
        // Add slight random variations to house scale for diversity
        if (index > 0) { // Keep the original house unchanged
            const scaleVariation = 0.8 + Math.random() * 0.4; // Scale between 0.8 and 1.2
            house.scale.set(scaleVariation, scaleVariation, scaleVariation);
        }
        
        scene.add(house);
    });
}

// Update the addEnvironment function for paths
function addEnvironment() {
    // Define positions for different tree types (more trees for fuller environment)
    const treeData = [
        // Main island trees - more varied positioning and types
        {x: 3, z: 2, type: 'pine'}, 
        {x: -3, z: -2, type: 'oak'}, 
        {x: 4, z: -3, type: 'cypress'},
        {x: 10, z: 0, type: 'redwood'}, 
        {x: -10, z: 0, type: 'pine'}, 
        {x: 5, z: 8, type: 'oak'},
        {x: -5, z: 8, type: 'cypress'}, 
        {x: 8, z: -8, type: 'redwood'}, 
        {x: -8, z: -8, type: 'pine'},
        {x: 0, z: 10, type: 'oak'}, 
        {x: 0, z: -10, type: 'redwood'},
        // Add more trees in new positions
        {x: 12, z: 5, type: 'pine'},
        {x: -12, z: 5, type: 'cypress'},
        {x: 6, z: 12, type: 'oak'},
        {x: -6, z: 12, type: 'redwood'},
        {x: 15, z: -3, type: 'pine'},
        {x: -15, z: -3, type: 'oak'},
        {x: 9, z: -15, type: 'cypress'},
        {x: -9, z: -15, type: 'redwood'},
        {x: 3, z: 15, type: 'pine'},
        {x: -3, z: 15, type: 'oak'}
    ];
    
    // Add trees to main island
    treeData.forEach(data => {
        createTree(data.x, data.z, false, data.type);
    });
    
    // Create paths connecting houses 
    function createPath(startX, startZ, endX, endZ) {
        const pathLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
        const pathGeometry = new THREE.PlaneGeometry(1, pathLength);
        const pathMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xD2B48C,
            side: THREE.DoubleSide
        });
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        
        // Position at midpoint
        const midX = (startX + endX) / 2;
        const midZ = (startZ + endZ) / 2;
        
        // Use constant Y position for flat ground (slightly above the surface)
        const yPosition = 10.26; // Just slightly above the flat island surface
        const islandCenterX = 20; // Island center X position
        
        path.position.set(midX + islandCenterX, yPosition, midZ);
        
        // Rotate to connect the points
        const angle = Math.atan2(endZ - startZ, endX - startX);
        path.rotation.set(Math.PI / 2, 0, angle - Math.PI / 2);
        
        path.receiveShadow = true;
        scene.add(path);
    }
    
    // Create paths between houses
    createPath(0, 0, 8, 5);
    createPath(0, 0, -8, 5);
    createPath(0, 0, 5, -8);
    createPath(0, 0, -5, -8);
    createPath(8, 5, 8, -3);
    createPath(-8, 5, -8, -3);
    createPath(5, -8, 0, -8);
    createPath(-5, -8, 0, -8);
}

// Add boats to the ocean, but remove any cars
function addBoats() {
    const boats = [];
    
    // Define sailboat positions - revised to avoid intersection with residential island
    const boatPositions = [
        { x: -20, z: 20 },
        { x: -40, z: -15 },
        { x: 20, z: -35 },  // Moved further away from residential island (was x:20, z:-25)
        { x: 50, z: 15 }
    ];
    
    // Create only sailboats
    boatPositions.forEach(pos => {
        const boat = createSailboat();
        boat.position.set(pos.x, -3, pos.z);
        scene.add(boat);
        boats.push(boat);
    });
    
    return boats;
}

// Helper function to create a sailboat
function createSailboat() {
    const boatGroup = new THREE.Group();
    
    // Boat hull
    const hullGeometry = new THREE.BoxGeometry(4, 1, 1.5);
    const hullMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.y = 0.5;
    boatGroup.add(hull);
    
    // Boat sail
    const sailGeometry = new THREE.PlaneGeometry(2, 3);
    const sailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });
    const sail = new THREE.Mesh(sailGeometry, sailMaterial);
    sail.rotation.y = Math.PI / 2;
    sail.position.set(0, 2.5, 0);
    boatGroup.add(sail);
    
    // Boat mast
    const mastGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const mastMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const mast = new THREE.Mesh(mastGeometry, mastMaterial);
    mast.position.set(0, 2, 0);
    boatGroup.add(mast);
    
    boatGroup.castShadow = true;
    
    return boatGroup;
}

// Add seagulls flying around
function addSeagulls() {
    const seagulls = [];
    
    function createSeagull(x, y, z) {
        const seagullGroup = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        seagullGroup.add(body);
        
        // Wings
        const wingGeometry = new THREE.PlaneGeometry(1.5, 0.5);
        const wingMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFFFF, 
            side: THREE.DoubleSide 
        });
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-0.7, 0, 0);
        leftWing.rotation.z = Math.PI / 6;
        seagullGroup.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0.7, 0, 0);
        rightWing.rotation.z = -Math.PI / 6;
        seagullGroup.add(rightWing);
        
        seagullGroup.position.set(x, y, z);
        scene.add(seagullGroup);
        
        return {
            group: seagullGroup,
            wings: { left: leftWing, right: rightWing },
            speed: 0.05 + Math.random() * 0.05,
            direction: new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 0.2 - 0.1,
                Math.random() * 2 - 1
            ).normalize(),
            flapDirection: 1,
            flapSpeed: 0.1 + Math.random() * 0.1
        };
    }
    
    // Create several seagulls
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 100 - 50;
        const y = 10 + Math.random() * 20;
        const z = Math.random() * 100 - 50;
        seagulls.push(createSeagull(x, y, z));
    }
    
    return seagulls;
}

// Add sloping terrain between the residential island and ocean
function createSlopingTerrain() {
    // Create a truncated cone (frustum) for the sloping sides
    // Top radius matches the residential island, bottom is wider
    const slopeGeometry = new THREE.CylinderGeometry(
        15,     // Top radius - match the residential island
        30,     // Bottom radius - wider base in the water
        13,     // Height - from below water to the island surface
        32,     // Radial segments for smoother appearance
        8,      // Height segments to allow vertex manipulation
        false   // Open-ended false (we want closed ends)
    );
    
    // Terrain material - slightly darker than the top to suggest shadow
    const slopeMaterial = new THREE.MeshPhongMaterial({
        color: 0x75A743,  // Slightly darker green than the top
        shininess: 5,
        flatShading: true  // Add some texture to the terrain
    });
    
    const slope = new THREE.Mesh(slopeGeometry, slopeMaterial);
    
    // Position the slope's top at the same level as the island bottom
    // and at the same X,Z coordinates
    slope.position.set(14.8, -3 + 13/2, 0);  // X matches island, Y centers the geometry vertically
    
    // Add some random variation to the slope vertices for a more natural appearance
    const positions = slope.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Don't modify vertices at the very top (keep it flat to match the island)
        // and less modification near the top than bottom
        if (y < 6) {
            const distFromTop = 6 - y;  // 0 at y=6, increasing as we go down
            const randomNoise = (Math.random() - 0.5) * 0.1 * distFromTop;
            
            // More distortion as we get further from center
            const distFromCenter = Math.sqrt(x * x + z * z);
            const edgeNoise = (Math.random() - 0.5) * 0.15 * distFromCenter / 15;
            
            positions.setX(i, x + randomNoise + edgeNoise);
            positions.setZ(i, z + randomNoise + edgeNoise);
            
            // Add some vertical variation too, but less of it
            positions.setY(i, y + (Math.random() - 0.5) * 0.05 * distFromTop);
        }
    }
    
    // Add some vegetation and rock details to the slope
    addSlopeDetails(slope);
    
    slope.geometry.computeVertexNormals();
    slope.castShadow = true;
    slope.receiveShadow = true;
    slope.renderOrder = -1; // Render before other objects
    
    scene.add(slope);
    
    return slope;
}

// Add visual details to the slope for more realism
function addSlopeDetails(slope) {
    // Add some rock outcroppings
    for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const heightPercent = Math.random(); // 0 = bottom, 1 = top
        const radiusPercent = 0.6 + Math.random() * 0.4; // Keep rocks on the slope
        
        // Calculate position on the slope
        const radius = 15 + (30 - 15) * (1 - heightPercent) * radiusPercent;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = -3 + heightPercent * 13; // Map from water level to just below island
        
        // Create a rock
        const rockSize = 0.5 + Math.random() * 1.5;
        const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 0);
        const rockMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.4 + Math.random() * 0.2, 0.4 + Math.random() * 0.2, 0.4 + Math.random() * 0.2),
            flatShading: true
        });
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(14.8 + x, y, z);
        rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        scene.add(rock);
    }
    
    // Add some small vegetation patches
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const heightPercent = 0.3 + Math.random() * 0.7; // Keep vegetation on upper 70% of slope
        const radiusPercent = 0.7 + Math.random() * 0.3; // Keep vegetation on the slope
        
        // Calculate position on the slope
        const radius = 15 + (30 - 15) * (1 - heightPercent) * radiusPercent;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = -3 + heightPercent * 13; // Map from water level to just below island
        
        // Create vegetation patch
        const vegSize = 0.8 + Math.random() * 1.2;
        const vegGeometry = new THREE.SphereGeometry(vegSize, 4, 4);
        const vegMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.1, 0.3 + Math.random() * 0.3, 0.1),
            flatShading: true
        });
        
        const veg = new THREE.Mesh(vegGeometry, vegMaterial);
        veg.position.set(14.8 + x, y + vegSize * 0.3, z);
        veg.scale.y = 0.5; // Flatten it a bit
        veg.castShadow = true;
        veg.receiveShadow = true;
        
        scene.add(veg);
    }
}

// Create fog for San Francisco feel
function addFog() {
    scene.fog = new THREE.FogExp2(0xcccccc, 0.0015);
}

// Create all scene elements in the correct order
const skybox = createSkybox();
const mainIsland = createMainIsland();
const slope = createSlopingTerrain();
const secondIsland = createSecondIsland();
const sfSkyline = createSFSkyline();
const ocean = createOcean();
const boats = addBoats();
const seagulls = addSeagulls();
addFog();

// Call these functions to add houses and environment
addHouses();
addEnvironment();

// Improve lighting
directionalLight.position.set(25, 30, 25);
directionalLight.intensity = 0.9;

// Add a warm ambient light for better atmosphere
const warmLight = new THREE.AmbientLight(0xffcc99, 0.3);
scene.add(warmLight);

// Adjust camera position for a better view of both islands and the bridge
camera.position.set(50, houseCenterY + 30, 50);

// Animation loop with water and boat movement
function animate() {
    requestAnimationFrame(animate);
    
    // Animate ocean waves with more realistic pattern
    if (ocean && ocean.surface && ocean.surface.geometry && 
        ocean.surface.geometry.attributes && ocean.surface.geometry.attributes.position) {
        const vertices = ocean.surface.geometry.attributes.position;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getZ(i);
            
            // Create more complex wave patterns
            const waveHeight1 = 0.2;
            const waveHeight2 = 0.1;
            const waveHeight3 = 0.05;
            
            const waveFactor1 = Math.sin(x * 0.05 + time * 0.8) * waveHeight1;
            const waveFactor2 = Math.sin(z * 0.08 + time * 0.6) * waveHeight2;
            const waveFactor3 = Math.sin((x + z) * 0.03 + time * 1.2) * waveHeight3;
            
            // Combine wave patterns
            const y = waveFactor1 + waveFactor2 + waveFactor3;
            
            // Apply height
            vertices.setY(i, y);
        }
        
        vertices.needsUpdate = true;
        ocean.surface.geometry.computeVertexNormals();
    }
    
    // Animate boats
    if (boats) {
        boats.forEach((boat, index) => {
            const time = Date.now() * 0.001;
            // Gentle bobbing motion
            boat.position.y = -3 + Math.sin(time * 0.8 + index * 0.2) * 0.2;
            // Gentle rotation
            boat.rotation.z = Math.sin(time * 0.5 + index * 0.3) * 0.05;
            boat.rotation.x = Math.sin(time * 0.7 + index * 0.1) * 0.03;
        });
    }
    
    // Animate seagulls
    if (seagulls) {
        seagulls.forEach(seagull => {
            // Move seagull
            seagull.group.position.x += seagull.direction.x * seagull.speed;
            seagull.group.position.y += seagull.direction.y * seagull.speed;
            seagull.group.position.z += seagull.direction.z * seagull.speed;
            
            // Flap wings
            const time = Date.now() * 0.001;
            seagull.wings.left.rotation.z = Math.PI / 6 + Math.sin(time * seagull.flapSpeed) * 0.5;
            seagull.wings.right.rotation.z = -Math.PI / 6 - Math.sin(time * seagull.flapSpeed) * 0.5;
            
            // Change direction occasionally or if out of bounds
            const bounds = 100;
            if (
                Math.random() < 0.005 ||
                Math.abs(seagull.group.position.x) > bounds ||
                Math.abs(seagull.group.position.z) > bounds ||
                seagull.group.position.y < 5 ||
                seagull.group.position.y > 40
            ) {
                seagull.direction.set(
                    Math.random() * 2 - 1,
                    Math.random() * 0.2 - 0.1,
                    Math.random() * 2 - 1
                ).normalize();
                
                // Point in the direction of movement
                seagull.group.lookAt(
                    seagull.group.position.x + seagull.direction.x,
                    seagull.group.position.y + seagull.direction.y,
                    seagull.group.position.z + seagull.direction.z
                );
            }
        });
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
