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

// Define createTree function first since it's used by other functions
function createTree(posX, posZ, isSecondIsland = false) {
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
    // Calculate Y position based on the hill's surface
    let hillRadius, baseY, centerX = 0;
    
    if (isSecondIsland) {
        hillRadius = 15;
        baseY = 21.5;
        centerX = -60;
    } else {
        hillRadius = 15; // Changed to match second island size
        baseY = 21.5;
        centerX = 0;
    }
    
    const adjustedX = posX - centerX;
    const distFromIslandCenter = Math.sqrt(adjustedX * adjustedX + posZ * posZ);
    
    // Only calculate height if within island radius
    let yPosition = 0;
    if (distFromIslandCenter < hillRadius) {
        const heightOffset = hillRadius - Math.sqrt(hillRadius * hillRadius - distFromIslandCenter * distFromIslandCenter);
        yPosition = baseY - heightOffset;
    } else {
        // If outside radius, place at water level
        yPosition = -3;
    }
    
    trunk.position.set(posX, yPosition, posZ);
    trunk.castShadow = true;
    scene.add(trunk);
    
    const leavesGeometry = new THREE.ConeGeometry(1, 3, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x228B22,
        flatShading: true 
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(posX, yPosition + 2.5, posZ);
    leaves.castShadow = true;
    scene.add(leaves);
}

// Create the main island (hill) - now positioned at the other end of the bridge
function createMainIsland() {
    const hillGeometry = new THREE.SphereGeometry(
        25,  // radius - increased to accommodate more houses
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
    hill.position.x = 0; // Position at the right end of the bridge
    hill.receiveShadow = true;
    scene.add(hill);
    
    return hill;
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
    
    // Add subtle foam around islands
    function createFoam(centerX, centerZ, radius) {
        const foamGeometry = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 64);
        const foamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        
        const foam = new THREE.Mesh(foamGeometry, foamMaterial);
        foam.rotation.x = -Math.PI / 2;
        foam.position.set(centerX, -3.4, centerZ);
        scene.add(foam);
        
        return foam;
    }
    
    // Create foam rings around both islands
    const mainIslandFoam = createFoam(0, 0, 25);
    const secondIslandFoam = createFoam(-60, 0, 15);
    
    return {
        surface: ocean,
        deep: deepOcean,
        foams: [mainIslandFoam, secondIslandFoam]
    };
}

// Create Golden Gate Bridge with more detail - now connecting the two islands properly
function createBridge() {
    const bridgeGroup = new THREE.Group();
    
    // Bridge deck
    const deckGeometry = new THREE.BoxGeometry(60, 0.5, 6);
    const deckMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.position.set(-30, 10, 0); // Position between islands
    deck.castShadow = true;
    bridgeGroup.add(deck);
    
    // Road on the bridge
    const roadGeometry = new THREE.BoxGeometry(60, 0.1, 4);
    const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.set(-30, 10.3, 0);
    bridgeGroup.add(road);
    
    // Road markings
    const markingsGeometry = new THREE.PlaneGeometry(0.5, 2);
    const markingsMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    for (let i = -55; i <= -5; i += 5) {
        const marking = new THREE.Mesh(markingsGeometry, markingsMaterial);
        marking.rotation.x = -Math.PI / 2;
        marking.position.set(i, 10.31, 0);
        bridgeGroup.add(marking);
    }
    
    // Bridge towers
    function createTower(x) {
        const towerGroup = new THREE.Group();
        
        // Tower base
        const baseGeometry = new THREE.BoxGeometry(4, 20, 4);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xb22222 }); // Golden Gate red
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 10;
        base.castShadow = true;
        towerGroup.add(base);
        
        // Tower top
        const topGeometry = new THREE.BoxGeometry(3, 5, 3);
        const top = new THREE.Mesh(topGeometry, baseMaterial);
        top.position.y = 22.5;
        top.castShadow = true;
        towerGroup.add(top);
        
        // Tower details
        const detailGeometry = new THREE.BoxGeometry(4.5, 0.5, 4.5);
        const detail1 = new THREE.Mesh(detailGeometry, baseMaterial);
        detail1.position.y = 20;
        towerGroup.add(detail1);
        
        const detail2 = new THREE.Mesh(detailGeometry, baseMaterial);
        detail2.position.y = 5;
        towerGroup.add(detail2);
        
        towerGroup.position.set(x, 0, 0);
        return towerGroup;
    }
    
    // Add two towers
    bridgeGroup.add(createTower(-10));
    bridgeGroup.add(createTower(-50));
    
    // Bridge cables
    const cableGeometry = new THREE.CylinderGeometry(0.2, 0.2, 60, 8);
    const cableMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    
    // Main cables (2 on each side)
    for (let z = -2.5; z <= 2.5; z += 5) {
        const cable = new THREE.Mesh(cableGeometry, cableMaterial);
        cable.rotation.z = Math.PI / 2; // Rotate to horizontal
        cable.position.set(-30, 20, z);
        bridgeGroup.add(cable);
    }
    
    // Suspension cables
    for (let x = -55; x <= -5; x += 2.5) {
        for (let z = -2.5; z <= 2.5; z += 5) {
            const height = 20 - 5 * Math.cos((x + 30) * Math.PI / 50);
            const suspensionGeometry = new THREE.CylinderGeometry(0.05, 0.05, height - 10, 8);
            const suspension = new THREE.Mesh(suspensionGeometry, cableMaterial);
            suspension.position.set(x, 10 + (height - 10) / 2, z);
            bridgeGroup.add(suspension);
        }
    }
    
    // Cross beams
    for (let x = -55; x <= -5; x += 5) {
        const beamGeometry = new THREE.BoxGeometry(0.5, 0.5, 6);
        const beam = new THREE.Mesh(beamGeometry, cableMaterial);
        beam.position.set(x, 9.5, 0);
        bridgeGroup.add(beam);
    }
    
    scene.add(bridgeGroup);
    return bridgeGroup;
}

// Create fog for San Francisco feel
function addFog() {
    scene.fog = new THREE.FogExp2(0xcccccc, 0.0015);
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
        [8, -3],      // House 6 - adjusted position
        [-8, -3],     // House 7 - adjusted position
        [0, -8]       // House 8 - adjusted position
    ];
    
    // Create houses at each position with slight variations
    housePositions.forEach((pos, index) => {
        const house = createHouse();
        
        // Calculate Y position based on the hill's surface
        // For a sphere with radius r, the height at distance d from center is r - sqrt(r^2 - d^2)
        const distanceFromCenter = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
        const hillRadius = 25; // Changed to match island size
        const heightOffset = hillRadius - Math.sqrt(hillRadius * hillRadius - distanceFromCenter * distanceFromCenter);
        const yPosition = 21.5 - heightOffset; // Base Y position adjusted for hill height
        
        house.position.set(pos[0], yPosition, pos[1]);
        
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

// Add environment elements
function addEnvironment() {
    // Add more trees scattered around the hill
    const treePositions = [
        [3, 2], [-3, -2], [4, -3],  // Original trees
        [10, 0], [-10, 0], [5, 8], [-5, 8],
        [8, -8], [-8, -8], [0, 10], [0, -10]
    ];
    
    treePositions.forEach(pos => {
        createTree(pos[0], pos[1]);
    });
    
    // Add paths connecting houses
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
        
        // Calculate Y position based on the hill's surface
        const distanceFromCenter = Math.sqrt(midX * midX + midZ * midZ);
        const hillRadius = 25; // Changed to match island size
        const heightOffset = hillRadius - Math.sqrt(hillRadius * hillRadius - distanceFromCenter * distanceFromCenter);
        const yPosition = 21.51 - heightOffset; // Slightly above the hill surface
        
        path.position.set(midX, yPosition, midZ);
        
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

// Add boats to the ocean
function addBoats() {
    function createBoat(x, z, size = 1, type = 'regular') {
        const boatGroup = new THREE.Group();
        
        let hullColor, cabinColor;
        
        if (type === 'ferry') {
            hullColor = 0x1e3f66;
            cabinColor = 0xffffff;
        } else if (type === 'sailboat') {
            hullColor = 0xffffff;
            cabinColor = 0x8B4513;
        } else {
            hullColor = 0xffffff;
            cabinColor = 0x1e3f66;
        }
        
        // Boat hull
        const hullGeometry = new THREE.BoxGeometry(4 * size, 1 * size, 2 * size);
        const hullMaterial = new THREE.MeshPhongMaterial({ color: hullColor });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);
        hull.position.y = -2.5; // Just above water level
        hull.castShadow = true;
        boatGroup.add(hull);
        
        // Boat cabin
        const cabinGeometry = new THREE.BoxGeometry(2 * size, 1 * size, 1.5 * size);
        const cabinMaterial = new THREE.MeshPhongMaterial({ color: cabinColor });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.y = -1.5;
        cabin.castShadow = true;
        boatGroup.add(cabin);
        
        // Add sail for sailboats
        if (type === 'sailboat') {
            const mastGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
            const mastMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const mast = new THREE.Mesh(mastGeometry, mastMaterial);
            mast.position.y = 0;
            boatGroup.add(mast);
            
            const sailGeometry = new THREE.PlaneGeometry(3, 4);
            const sailMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFFFFF, 
                side: THREE.DoubleSide 
            });
            const sail = new THREE.Mesh(sailGeometry, sailMaterial);
            sail.rotation.y = Math.PI / 2;
            sail.position.set(0, 0, 0);
            boatGroup.add(sail);
        }
        
        boatGroup.position.set(x, 0, z);
        scene.add(boatGroup);
        
        return boatGroup;
    }
    
    // Add several boats of different types
    const boats = [
        createBoat(-20, 15, 1, 'regular'),
        createBoat(-40, -10, 1.5, 'ferry'),
        createBoat(15, -25, 0.8, 'sailboat'),
        createBoat(25, 20, 0.7, 'sailboat'),
        createBoat(-15, -20, 1.2, 'ferry'),
        createBoat(5, 30, 0.9, 'regular'),
        createBoat(-30, 25, 0.8, 'sailboat'),
        // Add more boats for a busier bay
        createBoat(-5, -35, 1.1, 'ferry'),
        createBoat(35, -5, 0.6, 'sailboat'),
        createBoat(-45, 30, 0.9, 'sailboat'),
        createBoat(10, 40, 1.3, 'ferry')
    ];
    
    return boats;
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

// Create all scene elements in the correct order
const skybox = createSkybox();
const mainIsland = createMainIsland();
const secondIsland = createSecondIsland();
const sfSkyline = createSFSkyline();
const ocean = createOcean();
const bridge = createBridge();
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
        
        // Animate foam rings
        if (ocean.foams) {
            ocean.foams.forEach((foam, index) => {
                const foamScale = 1 + Math.sin(time * 0.5 + index) * 0.03;
                foam.scale.set(foamScale, 1, foamScale);
                foam.position.y = -3.4 + Math.sin(time * 0.7 + index * 2) * 0.1;
            });
        }
    }
    
    // Animate boats
    if (boats) {
        boats.forEach((boat, index) => {
            const time = Date.now() * 0.001;
            // Gentle bobbing motion
            boat.position.y = Math.sin(time * 0.8 + index * 0.2) * 0.2;
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
