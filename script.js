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

// Create grey circular base at ocean level
function createGreyBase() {
    // Use the same radius as the bottom of the sloping terrain
    const baseRadius = 30;
    const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, 0.5, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x808080, // Grey color
        shininess: 10
    });

    const base = new THREE.Mesh(baseGeometry, baseMaterial);

    // Position at ocean level, moved away from the island in the negative Z direction
    base.position.set(14.8, 2, -75); // Move to negative Z direction so it doesn't overlap

    base.receiveShadow = true;
    scene.add(base);

    return base;
}

// Create sloping terrain for the grey circular base
function createGreyBaseSlope() {
    // Create a truncated cone (frustum) for the sloping sides
    // Top radius matches the grey base, bottom is moderately wider for a medium slope
    const slopeGeometry = new THREE.CylinderGeometry(
        30,     // Top radius - match the grey base
        38,     // Bottom radius - moderate difference for medium slope (between 45 and 32)
        7,      // Height - moderate height (between 5.5 and 9)
        32,     // Radial segments for smoother appearance
        9,      // Height segments to allow vertex manipulation
        false   // Open-ended false (we want closed ends)
    );

    // Slope material - darker grey than the base to suggest shadow
    const slopeMaterial = new THREE.MeshPhongMaterial({
        color: 0x606060,  // Darker grey than the top
        shininess: 5,
        flatShading: true  // Add some texture to the terrain
    });

    const slope = new THREE.Mesh(slopeGeometry, slopeMaterial);

    // Position the slope to connect the grey base to the ocean
    // Center X,Z with the grey base, Y positioned for moderate slope
    slope.position.set(14.8, -1.5, -75);  // Y adjusted for moderate height

    // Add some random variation to the slope vertices for a more natural appearance
    const positions = slope.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        // Don't modify vertices at the very top (keep it flat to match the base)
        // and less modification near the top than bottom
        if (y < 3) {
            const distFromTop = 3.5 - y;  // Adjusted for new height
            const randomNoise = (Math.random() - 0.5) * 0.1 * distFromTop;

            // More distortion as we get further from center
            const distFromCenter = Math.sqrt(x * x + z * z);
            const edgeNoise = (Math.random() - 0.5) * 0.15 * distFromCenter / 30;

            positions.setX(i, x + randomNoise + edgeNoise);
            positions.setZ(i, z + randomNoise + edgeNoise);

            // Add some vertical variation too, but less of it
            positions.setY(i, y + (Math.random() - 0.5) * 0.05 * distFromTop);
        }
    }

    // No longer adding rock details to the slope
    // addGreyBaseRocks(slope); - removed

    slope.geometry.computeVertexNormals();
    slope.castShadow = true;
    slope.receiveShadow = true;
    slope.renderOrder = -1; // Render before other objects

    scene.add(slope);

    return slope;
}

// Function is kept but no longer called
function addGreyBaseRocks(slope) {
    // Rock generation code remains but is no longer used
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
    switch (treeType) {
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
    createBranches(group, scale, trunk.position.y + trunkGeometry.parameters.height / 2);

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
        const height = Math.random() * foliageRadius - foliageRadius / 4;

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
        const branchAngle = Math.PI / 4 + Math.random() * Math.PI / 8; // ~45° up from horizontal

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
        branchGeometry.translate(0, -branchLength / 2, 0);

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

            const distFromCenter = Math.sqrt(x * x + z * z);
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
        { x: 3, z: 2, type: 'pine' },
        { x: -3, z: -2, type: 'oak' },
        { x: 4, z: -3, type: 'cypress' },
        { x: 10, z: 0, type: 'redwood' },
        { x: -10, z: 0, type: 'pine' },
        { x: 5, z: 8, type: 'oak' },
        { x: -5, z: 8, type: 'cypress' },
        { x: 8, z: -8, type: 'redwood' },
        { x: -8, z: -8, type: 'pine' },
        { x: 0, z: 10, type: 'oak' },
        { x: 0, z: -10, type: 'redwood' },
        // Add more trees in new positions
        { x: 12, z: 5, type: 'pine' },
        { x: -12, z: 5, type: 'cypress' },
        { x: 6, z: 12, type: 'oak' },
        { x: -6, z: 12, type: 'redwood' },
        { x: 15, z: -3, type: 'pine' },
        { x: -15, z: -3, type: 'oak' },
        { x: 9, z: -15, type: 'cypress' },
        { x: -9, z: -15, type: 'redwood' },
        { x: 3, z: 15, type: 'pine' },
        { x: -3, z: 15, type: 'oak' }
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
    slope.position.set(14.8, -3 + 13 / 2, 0);  // X matches island, Y centers the geometry vertically

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

// Create a detailed skyscraper for the grey base
function createSkyscraper() {
    const skyscraperGroup = new THREE.Group();

    // Main tower - tall rectangular prism (reduced dimensions)
    const towerHeight = 40;  // Reduced from 60
    const towerWidth = 7;    // Reduced from 10
    const towerDepth = 7;    // Reduced from 10

    const towerGeometry = new THREE.BoxGeometry(towerWidth, towerHeight, towerDepth);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: false,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const structuralMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        shininess: 80
    });

    // Create materials array for the tower with glass on most sides and structural elements
    const towerMaterials = [
        glassMaterial,     // right side
        glassMaterial,     // left side
        structuralMaterial, // top
        structuralMaterial, // bottom
        glassMaterial,     // front
        glassMaterial      // back
    ];

    const tower = new THREE.Mesh(towerGeometry, towerMaterials);
    tower.position.y = towerHeight / 2;
    tower.castShadow = true;
    tower.receiveShadow = true;
    skyscraperGroup.add(tower);

    // Add window details to the tower
    addWindowsToTower(tower, towerWidth, towerHeight, towerDepth);

    // Create a tapered top section (reduced dimensions)
    const topHeight = 10;  // Reduced from 15
    const topBaseWidth = towerWidth;
    const topTipWidth = towerWidth / 2;

    const topGeometry = new THREE.CylinderGeometry(
        topTipWidth / 2, // top radius (narrower)
        topBaseWidth / 2, // bottom radius (wider)
        topHeight,
        8 // octagonal
    );

    const topMaterial = new THREE.MeshPhongMaterial({
        color: 0x999999,
        shininess: 100
    });

    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = towerHeight + topHeight / 2;
    top.castShadow = true;
    top.receiveShadow = true;
    skyscraperGroup.add(top);

    // Add a spire/antenna at the top (reduced height)
    const spireHeight = 7;  // Reduced from 10
    const spireGeometry = new THREE.CylinderGeometry(0.1, 0.4, spireHeight, 8);
    const spireMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        shininess: 100
    });

    const spire = new THREE.Mesh(spireGeometry, spireMaterial);
    spire.position.y = towerHeight + topHeight + spireHeight / 2;
    spire.castShadow = true;
    skyscraperGroup.add(spire);

    // Add a base/lobby area (reduced dimensions)
    const baseHeight = 4;  // Reduced from 5
    const baseWidth = towerWidth * 1.5;
    const baseDepth = towerDepth * 1.5;

    const baseGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x555555,
        shininess: 60
    });

    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = baseHeight / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    skyscraperGroup.add(base);

    // Add entrance (slightly reduced)
    const entranceWidth = 2.5;  // Reduced from 3
    const entranceHeight = 1.8;  // Reduced from 2
    const entranceDepth = 0.5;

    const entranceGeometry = new THREE.BoxGeometry(entranceWidth, entranceHeight, entranceDepth);
    const entranceMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222,
        shininess: 100
    });

    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entrance.position.set(0, entranceHeight / 2, baseDepth / 2 + 0.01);
    base.add(entrance);

    // Position the entire skyscraper at the center of the grey base
    skyscraperGroup.position.set(14.8, 2, -75);

    scene.add(skyscraperGroup);
    return skyscraperGroup;
}

// Helper function to add window details to the tower
function addWindowsToTower(tower, width, height, depth) {
    const windowRowCount = 20;
    const windowColCount = 6;  // 3 columns per side
    const windowWidth = 0.5;
    const windowHeight = 1;
    const windowDepth = 0.05;

    const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        emissive: 0x555555
    });

    // Add windows to front face
    for (let row = 0; row < windowRowCount; row++) {
        for (let col = 0; col < windowColCount / 2; col++) {
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);

            // Improved positioning formula to ensure windows are centered and within the tower face
            // For 3 columns, we want positions at roughly -width/3, 0, and width/3
            const xPos = (col - 1) * (width / 3);
            const yPos = (row - windowRowCount / 2) * (height / windowRowCount) + height / windowRowCount;

            windowMesh.position.set(xPos, yPos, depth / 2 + 0.01);
            tower.add(windowMesh);

            // Add matching window to back face
            const backWindowMesh = windowMesh.clone();
            backWindowMesh.position.z = -depth / 2 - 0.01;
            backWindowMesh.rotation.y = Math.PI;
            tower.add(backWindowMesh);
        }
    }

    // Add windows to left and right faces
    for (let row = 0; row < windowRowCount; row++) {
        for (let col = 0; col < windowColCount / 2; col++) {
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);

            // Improved positioning formula for side faces
            const zPos = (col - 1) * (depth / 3);
            const yPos = (row - windowRowCount / 2) * (height / windowRowCount) + height / windowRowCount;

            windowMesh.position.set(width / 2 + 0.01, yPos, zPos);
            windowMesh.rotation.y = Math.PI / 2;
            tower.add(windowMesh);

            // Add matching window to other side
            const otherWindowMesh = windowMesh.clone();
            otherWindowMesh.position.x = -width / 2 - 0.01;
            otherWindowMesh.rotation.y = -Math.PI / 2;
            tower.add(otherWindowMesh);
        }
    }
}

// Function to add multiple skyscrapers to the grey base
function addCityscape() {
    // Define the center point of the grey base
    const centerX = 14.8;
    const centerY = 2;
    const centerZ = -75;

    // Define the radius of the grey base to stay within
    const baseRadius = 28; // Slightly less than actual 30 to keep buildings fully on the base

    // Create an array to track building positions to prevent overlap
    const buildingPositions = [];

    // Add fewer buildings with more spacing
    const maxBuildingCount = 10; // Reduced from 15

    for (let i = 0; i < maxBuildingCount; i++) {
        // Skip the first iteration since we already have a central skyscraper
        if (i === 0) continue;

        // Generate random position within the circular base
        let posX, posZ;
        let validPosition = false;
        let attempts = 0;

        // Try to find a valid position that doesn't overlap with existing buildings
        while (!validPosition && attempts < 50) {
            // Random angle and distance from center (more buildings toward the edges)
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.random() * baseRadius; // Quadratic distribution for more buildings at the perimeter

            posX = centerX + Math.cos(angle) * distance;
            posZ = centerZ + Math.sin(angle) * distance;

            // Check if this position is far enough from existing buildings
            validPosition = true;
            for (const pos of buildingPositions) {
                const dx = posX - pos.x;
                const dz = posZ - pos.z;
                const minDistance = pos.radius + 5; // Increased from 3 to 5 for more spacing

                if (dx * dx + dz * dz < minDistance * minDistance) {
                    validPosition = false;
                    break;
                }
            }

            attempts++;
        }

        if (!validPosition) continue; // Skip if we couldn't find a valid position

        // Determine building type based on random selection
        const buildingType = Math.floor(Math.random() * 5); // 0-4 different building types
        let building;
        let buildingRadius;

        switch (buildingType) {
            case 0:
                // Tall rectangular skyscraper
                building = createRectangularSkyscraper(posX, centerY, posZ);
                buildingRadius = 4;
                break;
            case 1:
                // Cylindrical tower
                building = createCylindricalTower(posX, centerY, posZ);
                buildingRadius = 3.5;
                break;
            case 2:
                // Stepped pyramid-style building
                building = createSteppedBuilding(posX, centerY, posZ);
                buildingRadius = 5;
                break;
            case 3:
                // Twin towers
                building = createTwinTowers(posX, centerY, posZ);
                buildingRadius = 5;
                break;
            case 4:
                // Modern curved building
                building = createCurvedBuilding(posX, centerY, posZ);
                buildingRadius = 4;
                break;
        }

        // Add this building's position to our tracking array
        buildingPositions.push({
            x: posX,
            z: posZ,
            radius: buildingRadius
        });
    }
}

// Create a rectangular skyscraper with random height and proportions
function createRectangularSkyscraper(x, y, z) {
    const group = new THREE.Group();

    // Random dimensions
    const height = 20 + Math.random() * 25;
    const width = 4 + Math.random() * 3;
    const depth = 4 + Math.random() * 3;

    // Main building
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);

    // Choose a random glass color
    const glassColors = [0x88ccff, 0x99ddff, 0x77aacc, 0xaaddee, 0x66bbdd];
    const glassColor = glassColors[Math.floor(Math.random() * glassColors.length)];

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: glassColor,
        metalness: 0.9,
        roughness: 0.1,
        transparent: false,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const structuralMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        shininess: 80
    });

    // Create materials array for the building
    const buildingMaterials = [
        glassMaterial,     // right side
        glassMaterial,     // left side
        structuralMaterial, // top
        structuralMaterial, // bottom
        glassMaterial,     // front
        glassMaterial      // back
    ];

    const building = new THREE.Mesh(buildingGeometry, buildingMaterials);
    building.position.y = height / 2;
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    // Add windows
    addSimpleWindows(building, width, height, depth);

    // Add a roof structure (50% chance)
    if (Math.random() > 0.5) {
        const roofHeight = 2 + Math.random() * 3;
        const roofGeometry = new THREE.BoxGeometry(width * 0.7, roofHeight, depth * 0.7);
        const roofMaterial = new THREE.MeshPhongMaterial({
            color: 0x999999,
            shininess: 100
        });

        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height + roofHeight / 2;
        roof.castShadow = true;
        group.add(roof);
    }

    // Position the building
    group.position.set(x, y, z);

    scene.add(group);
    return group;
}

// Create a cylindrical tower
function createCylindricalTower(x, y, z) {
    const group = new THREE.Group();

    // Random dimensions
    const height = 15 + Math.random() * 30;
    const radius = 2 + Math.random() * 2;

    // Main tower
    const towerGeometry = new THREE.CylinderGeometry(radius, radius, height, 16);

    // Choose a random material type
    const materialType = Math.floor(Math.random() * 3);
    let towerMaterial;

    if (materialType === 0) {
        // Glass
        towerMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.9,
            roughness: 0.1,
            transparent: false,
            reflectivity: 1.0
        });
    } else if (materialType === 1) {
        // Concrete
        towerMaterial = new THREE.MeshPhongMaterial({
            color: 0xdddddd,
            shininess: 30
        });
    } else {
        // Metal
        towerMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.8,
            roughness: 0.2
        });
    }

    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = height / 2;
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);

    // Add circular windows
    addCircularWindows(tower, radius, height);

    // Add a spire (30% chance)
    if (Math.random() < 0.3) {
        const spireHeight = height * 0.2;
        const spireGeometry = new THREE.ConeGeometry(radius * 0.5, spireHeight, 16);
        const spireMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            shininess: 100
        });

        const spire = new THREE.Mesh(spireGeometry, spireMaterial);
        spire.position.y = height + spireHeight / 2;
        spire.castShadow = true;
        group.add(spire);
    }

    // Position the building
    group.position.set(x, y, z);

    scene.add(group);
    return group;
}

// Create a stepped/pyramid style building
function createSteppedBuilding(x, y, z) {
    const group = new THREE.Group();

    // Number of steps
    const steps = 3 + Math.floor(Math.random() * 3);

    // Base dimensions
    const baseWidth = 6 + Math.random() * 4;
    const baseDepth = 6 + Math.random() * 4;
    const totalHeight = 15 + Math.random() * 20;

    // Material
    const buildingMaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 50
    });

    // Create each step
    for (let i = 0; i < steps; i++) {
        const stepRatio = 1 - (i / steps);
        const stepWidth = baseWidth * stepRatio;
        const stepDepth = baseDepth * stepRatio;
        const stepHeight = totalHeight / steps;

        const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
        const step = new THREE.Mesh(stepGeometry, buildingMaterial);

        step.position.y = (stepHeight * i) + (stepHeight / 2);
        step.castShadow = true;
        step.receiveShadow = true;

        group.add(step);

        // Add windows to each step
        addSimpleWindows(step, stepWidth, stepHeight, stepDepth, 0.3, 0.6);
    }

    // Position the building
    group.position.set(x, y, z);

    scene.add(group);
    return group;
}

// Create twin towers connected by bridges
function createTwinTowers(x, y, z) {
    const group = new THREE.Group();

    // Dimensions
    const towerHeight = 25 + Math.random() * 20;
    const towerWidth = 3 + Math.random() * 2;
    const towerDepth = 3 + Math.random() * 2;
    const towerSpacing = 3 + Math.random() * 2;

    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: false,
        reflectivity: 1.0
    });

    const structuralMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        shininess: 80
    });

    // Create first tower
    const tower1Geometry = new THREE.BoxGeometry(towerWidth, towerHeight, towerDepth);
    const tower1Materials = [
        glassMaterial, glassMaterial,
        structuralMaterial, structuralMaterial,
        glassMaterial, glassMaterial
    ];

    const tower1 = new THREE.Mesh(tower1Geometry, tower1Materials);
    tower1.position.set(-towerSpacing / 2, towerHeight / 2, 0);
    tower1.castShadow = true;
    tower1.receiveShadow = true;
    group.add(tower1);

    // Create second tower
    const tower2Geometry = new THREE.BoxGeometry(towerWidth, towerHeight, towerDepth);
    const tower2 = new THREE.Mesh(tower2Geometry, tower1Materials);
    tower2.position.set(towerSpacing / 2, towerHeight / 2, 0);
    tower2.castShadow = true;
    tower2.receiveShadow = true;
    group.add(tower2);

    // Add windows to both towers
    addSimpleWindows(tower1, towerWidth, towerHeight, towerDepth);
    addSimpleWindows(tower2, towerWidth, towerHeight, towerDepth);

    // Add connecting bridges (2-3 of them)
    const bridgeCount = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < bridgeCount; i++) {
        const bridgeHeight = 1.5;
        const bridgeY = (towerHeight * (i + 1)) / (bridgeCount + 1);

        const bridgeGeometry = new THREE.BoxGeometry(towerSpacing, bridgeHeight, towerDepth * 0.6);
        const bridgeMaterial = new THREE.MeshPhongMaterial({
            color: 0x999999,
            shininess: 80
        });

        const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        bridge.position.y = bridgeY;
        bridge.castShadow = true;
        group.add(bridge);
    }

    // Position the building
    group.position.set(x, y, z);

    scene.add(group);
    return group;
}

// Create a modern curved building
function createCurvedBuilding(x, y, z) {
    const group = new THREE.Group();

    // Dimensions
    const height = 20 + Math.random() * 15;
    const radius = 3 + Math.random() * 2;

    // Create a curved shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(radius * 1.5, 0, radius, radius);
    shape.quadraticCurveTo(radius * 2, radius * 2, 0, radius * 2);
    shape.quadraticCurveTo(-radius * 1.5, radius * 2, -radius, radius);
    shape.quadraticCurveTo(-radius * 2, 0, 0, 0);

    // Extrude the shape
    const extrudeSettings = {
        steps: 1,
        depth: height,
        bevelEnabled: false
    };

    const buildingGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    buildingGeometry.rotateX(-Math.PI / 2); // Rotate to make height go up

    // Material
    const buildingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x99ccdd,
        metalness: 0.7,
        roughness: 0.2,
        reflectivity: 0.8
    });

    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    // Add some horizontal accent lines
    const accentCount = Math.floor(height / 5);
    for (let i = 1; i <= accentCount; i++) {
        const accentY = (height * i) / (accentCount + 1);

        const accentGeometry = new THREE.TorusGeometry(radius * 1.02, 0.1, 16, 32, Math.PI * 2);
        const accentMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100
        });

        const accent = new THREE.Mesh(accentGeometry, accentMaterial);
        accent.position.y = accentY;
        accent.rotation.x = Math.PI / 2;
        group.add(accent);
    }

    // Position the building
    group.position.set(x, y, z);

    scene.add(group);
    return group;
}

// Helper function to add simple windows to rectangular buildings
function addSimpleWindows(building, width, height, depth, windowWidth = 0.4, windowHeight = 0.8) {
    const windowRowCount = Math.max(3, Math.floor(height / 3));
    const windowColCount = Math.max(2, Math.floor(width / 2));

    const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, 0.05);
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        emissive: 0x555555
    });

    // Add windows to front and back
    for (let row = 0; row < windowRowCount; row++) {
        for (let col = 0; col < windowColCount; col++) {
            // Calculate position
            const xPos = (col - (windowColCount - 1) / 2) * (width / windowColCount);
            const yPos = (row - (windowRowCount - 1) / 2) * (height / windowRowCount);

            // Front window
            const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
            frontWindow.position.set(xPos, yPos, depth / 2 + 0.01);
            building.add(frontWindow);

            // Back window
            const backWindow = frontWindow.clone();
            backWindow.position.z = -depth / 2 - 0.01;
            backWindow.rotation.y = Math.PI;
            building.add(backWindow);
        }
    }

    // Add windows to sides
    const sideColCount = Math.max(2, Math.floor(depth / 2));

    for (let row = 0; row < windowRowCount; row++) {
        for (let col = 0; col < sideColCount; col++) {
            // Calculate position
            const zPos = (col - (sideColCount - 1) / 2) * (depth / sideColCount);
            const yPos = (row - (windowRowCount - 1) / 2) * (height / windowRowCount);

            // Right window
            const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
            rightWindow.position.set(width / 2 + 0.01, yPos, zPos);
            rightWindow.rotation.y = Math.PI / 2;
            building.add(rightWindow);

            // Left window
            const leftWindow = rightWindow.clone();
            leftWindow.position.x = -width / 2 - 0.01;
            leftWindow.rotation.y = -Math.PI / 2;
            building.add(leftWindow);
        }
    }
}

// Helper function to add circular windows to cylindrical buildings
function addCircularWindows(tower, radius, height) {
    const windowRowCount = Math.max(4, Math.floor(height / 3));
    const windowColCount = 8; // Around the cylinder

    const windowRadius = 0.3;
    const windowGeometry = new THREE.CircleGeometry(windowRadius, 8);
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        emissive: 0x555555
    });

    for (let row = 0; row < windowRowCount; row++) {
        for (let col = 0; col < windowColCount; col++) {
            // Calculate position
            const angle = (col / windowColCount) * Math.PI * 2;
            const xPos = Math.cos(angle) * (radius + 0.01);
            const zPos = Math.sin(angle) * (radius + 0.01);
            const yPos = (row - (windowRowCount - 1) / 2) * (height / windowRowCount);

            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(xPos, yPos, zPos);

            // Rotate to face outward
            window.lookAt(xPos * 2, yPos, zPos * 2);

            tower.add(window);
        }
    }
}

// Add cars to the city area
function addCars() {
    const carCount = 15; // Number of cars to add
    const cars = [];

    // Create car models and place them around the city
    for (let i = 0; i < carCount; i++) {
        // Create a car
        const car = createCar();

        // Position the car on the city streets
        // City is centered around position (14.8, 2, -75) with grey base
        // Keep cars within the flat part of the base (radius 28 instead of 30 for safe margin)
        const radius = 15 + Math.random() * 13; // Distance from city center (max 28)
        const angle = Math.random() * Math.PI * 2; // Random angle
        const x = 14.8 + Math.cos(angle) * radius;
        const z = -75 + Math.sin(angle) * radius;

        // Y position is just above the ground
        const y = 2.3; // Slightly above the grey base at y=2

        car.position.set(x, y, z);

        // Random rotation to face different directions
        car.rotation.y = Math.random() * Math.PI * 2;

        // Add to scene and store reference
        scene.add(car);
        cars.push(car);
    }

    return cars;
}

// Create a single car model
function createCar() {
    const car = new THREE.Group();

    // Random car color
    const carColors = [
        0xff0000, // red
        0x0000ff, // blue
        0x00ff00, // green
        0xffff00, // yellow
        0x000000, // black
        0xffffff, // white
        0xaaaaaa, // silver
    ];
    const carColor = carColors[Math.floor(Math.random() * carColors.length)];

    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: carColor,
        shininess: 80
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    car.add(body);

    // Car cabin
    const cabinGeometry = new THREE.BoxGeometry(1, 0.4, 0.9);
    const cabinMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        shininess: 90,
        transparent: true,
        opacity: 0.7
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(-0.1, 0.9, 0);
    car.add(cabin);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        shininess: 30
    });

    // Front left wheel
    const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFL.rotation.x = Math.PI / 2;
    wheelFL.position.set(0.6, 0.2, 0.5);
    car.add(wheelFL);

    // Front right wheel
    const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFR.rotation.x = Math.PI / 2;
    wheelFR.position.set(0.6, 0.2, -0.5);
    car.add(wheelFR);

    // Rear left wheel
    const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelRL.rotation.x = Math.PI / 2;
    wheelRL.position.set(-0.6, 0.2, 0.5);
    car.add(wheelRL);

    // Rear right wheel
    const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelRR.rotation.x = Math.PI / 2;
    wheelRR.position.set(-0.6, 0.2, -0.5);
    car.add(wheelRR);

    // Headlights
    const headlightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const headlightMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffcc,
        shininess: 100
    });

    // Left headlight
    const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightL.position.set(1.05, 0.5, 0.3);
    car.add(headlightL);

    // Right headlight
    const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightR.position.set(1.05, 0.5, -0.3);
    car.add(headlightR);

    // Add shadows
    car.traverse(object => {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });

    // Scale car down to match scene scale
    car.scale.set(0.8, 0.8, 0.8);

    return car;
}

// Create all scene elements in the correct order
const skybox = createSkybox();
const greyBase = createGreyBase();
const greyBaseSlope = createGreyBaseSlope();
const skyscraper = createSkyscraper(); // Add the main skyscraper to the scene
addCityscape(); // Add additional skyscrapers around the main one
const mainIsland = createMainIsland();
const slope = createSlopingTerrain();
const ocean = createOcean();
const boats = addBoats();
const seagulls = addSeagulls();
const cars = addCars(); // Add cars to the city
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

// Add toggle switch functionality for sea level rise
const sceneToggle = document.getElementById('sceneToggle');
const switchStateEl = document.getElementById('switchState');
let isRising = false;
let targetSeaLevel = -3.5; // Default sea level
const normalSeaLevel = -3.5; // Store the original sea level
const floodedSeaLevel = 5; // Increased from 3 to 5 for higher flooding
let animationInProgress = false;
let rainSystem = null; // Store reference to rain particles
let carsFloating = false; // Track if cars are in floating mode

// Store original car positions for restoration when water recedes
const carOriginalPositions = [];
const carDriftDirections = [];

// Initialize switch state
switchStateEl.classList.add('normal-state');
switchStateEl.textContent = 'Normal';

// Create the rain system
function createRain() {
    // Create geometry for raindrops
    const rainCount = 15000;
    const rainGeometry = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3); // 3 values (x,y,z) per raindrop
    const rainVelocities = new Float32Array(rainCount);

    // Set each raindrop to a random position above the scene
    const areaSize = 200; // Rain area
    const height = 100; // Rain starts from this height

    for (let i = 0; i < rainCount; i++) {
        const i3 = i * 3;

        // Random position within a square area
        rainPositions[i3] = (Math.random() * areaSize) - (areaSize / 2);
        rainPositions[i3 + 1] = height - Math.random() * 30; // Different heights
        rainPositions[i3 + 2] = (Math.random() * areaSize) - (areaSize / 2);

        // Increased velocity for faster rain
        rainVelocities[i] = 0.5 + Math.random() * 0.8;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

    // Create material for raindrops - slightly transparent, blue-tinted
    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaccff,
        size: 0.2,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    // Create the particle system
    const rain = new THREE.Points(rainGeometry, rainMaterial);
    rain.userData = { velocities: rainVelocities };

    return rain;
}

// Update rain animation in the render loop
function animateRain() {
    if (!rainSystem) return;

    const positions = rainSystem.geometry.attributes.position;
    const velocities = rainSystem.userData.velocities;

    for (let i = 0; i < positions.count; i++) {
        // Move raindrop down based on velocity
        positions.setY(i, positions.getY(i) - velocities[i]);

        // If raindrop goes below a certain height, reset it to the top
        if (positions.getY(i) < -5) {
            positions.setY(i, 100 - Math.random() * 30);

            // Also randomize X and Z a bit for variation
            const areaSize = 200;
            positions.setX(i, (Math.random() * areaSize) - (areaSize / 2));
            positions.setZ(i, (Math.random() * areaSize) - (areaSize / 2));
        }
    }

    positions.needsUpdate = true;
}

// Store original car positions and generate random drift directions
function initializeCarData() {
    if (cars && carOriginalPositions.length === 0) {
        cars.forEach((car, index) => {
            // Store original position
            carOriginalPositions.push({
                x: car.position.x,
                y: car.position.y,
                z: car.position.z,
                rotation: car.rotation.y
            });

            // Generate random drift direction
            const angle = Math.random() * Math.PI * 2;
            // Much slower drift speed (10x slower than before)
            const speed = 0.002 + Math.random() * 0.003;

            // Determine if this car will float or sink (alternating)
            const willFloat = index % 2 === 0;

            carDriftDirections.push({
                x: Math.cos(angle) * speed,
                z: Math.sin(angle) * speed,
                // Slower rotation as well
                rotationSpeed: (Math.random() - 0.5) * 0.002,
                willFloat: willFloat // Store whether this car will float or sink
            });
        });
    }
}

// Call once to initialize
initializeCarData();

sceneToggle.addEventListener('change', function () {
    if (this.checked) {
        // Rising sea level
        targetSeaLevel = floodedSeaLevel;
        isRising = true;

        // Update switch state
        switchStateEl.textContent = 'Flooding';
        switchStateEl.classList.remove('normal-state');
        switchStateEl.classList.add('flooded-state');

        // Add rain effect
        if (!rainSystem) {
            rainSystem = createRain();
            scene.add(rainSystem);
        }

        // Enable car floating
        carsFloating = true;
        
        // Show water in the cement slab
        if (cementSlab && cementSlab.waterFlow) {
            cementSlab.waterFlow.visible = true;
            
            // Animate water filling the slab
            animateWaterFlow(cementSlab.waterFlow, true);
        }
    } else {
        // Lowering sea level
        targetSeaLevel = normalSeaLevel;
        isRising = false;

        // Update switch state
        switchStateEl.textContent = 'Normal';
        switchStateEl.classList.remove('flooded-state');
        switchStateEl.classList.add('normal-state');

        // Remove rain effect
        if (rainSystem) {
            scene.remove(rainSystem);
            rainSystem.geometry.dispose();
            rainSystem.material.dispose();
            rainSystem = null;
        }

        // Disable car floating - cars will return to original positions
        carsFloating = false;
        
        // Animate water draining from the slab
        if (cementSlab && cementSlab.waterFlow) {
            animateWaterFlow(cementSlab.waterFlow, false);
        }
    }

    if (!animationInProgress) {
        animateSeaLevel();
    }
});

// Function to animate sea level rising/falling
function animateSeaLevel() {
    animationInProgress = true;

    // Update boats with the ocean
    function updateBoatsPosition() {
        if (boats) {
            boats.forEach(boat => {
                // Keep the relative position to ocean surface
                boat.position.y = ocean.surface.position.y + Math.sin(Date.now() * 0.001) * 0.2;
            });
        }
    }

    function animate() {
        if ((isRising && ocean.surface.position.y < targetSeaLevel) ||
            (!isRising && ocean.surface.position.y > targetSeaLevel)) {

            // Calculate step - faster rising than falling for dramatic effect
            const step = isRising ? 0.05 : 0.03;

            // Move ocean surface toward target
            if (isRising) {
                ocean.surface.position.y = Math.min(ocean.surface.position.y + step, targetSeaLevel);
                // Also move deep ocean layer
                ocean.deep.position.y = ocean.surface.position.y - 2;
            } else {
                ocean.surface.position.y = Math.max(ocean.surface.position.y - step, targetSeaLevel);
                // Also move deep ocean layer
                ocean.deep.position.y = ocean.surface.position.y - 2;
            }

            updateBoatsPosition();

            requestAnimationFrame(animate);
        } else {
            animationInProgress = false;
        }
    }

    animate();
}

// Animation loop with water and boat movement
function animate() {
    requestAnimationFrame(animate);

    // Animate rain if present
    animateRain();

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
            // Gentle bobbing motion - adjusted to be relative to ocean surface position
            boat.position.y = ocean.surface.position.y + Math.sin(time * 0.8 + index * 0.2) * 0.2;
            // Gentle rotation
            boat.rotation.z = Math.sin(time * 0.5 + index * 0.3) * 0.05;
            boat.rotation.x = Math.sin(time * 0.7 + index * 0.1) * 0.03;
        });
    }

    // Animate cars
    if (cars) {
        cars.forEach((car, index) => {
            if (carsFloating) {
                // Cars float on water when it's high enough
                if (ocean.surface.position.y > 2.5) { // Only float when water is above the base
                    cars.forEach((car, index) => {
                        // Get whether this car will float or sink
                        const willFloat = carDriftDirections[index].willFloat;

                        // Make cars float at water level (slightly above to show they're floating)
                        const floatHeight = ocean.surface.position.y + 0.2;
                        const sinkHeight = ocean.surface.position.y - 0.8; // Underwater

                        if (willFloat) {
                            // FLOATING CARS - same as before
                            // Gradually lift cars to floating height if they're not there yet
                            if (car.position.y < floatHeight) {
                                car.position.y = Math.min(car.position.y + 0.05, floatHeight);
                            } else {
                                // Bobbing motion once they're floating
                                const time = Date.now() * 0.001;
                                car.position.y = floatHeight + Math.sin(time * 0.8 + index * 0.2) * 0.1;

                                // Apply drift in random direction
                                car.position.x += carDriftDirections[index].x;
                                car.position.z += carDriftDirections[index].z;

                                // Add slight rotation to simulate water movement
                                car.rotation.y += carDriftDirections[index].rotationSpeed;

                                // Add slight tilt
                                car.rotation.z = Math.sin(time * 0.5 + index * 0.3) * 0.05;
                                car.rotation.x = Math.sin(time * 0.7 + index * 0.1) * 0.05;
                            }
                        } else {
                            // SINKING CARS - gradually sink below water level and stay there
                            if (car.position.y > sinkHeight) {
                                // Sink gradually
                                car.position.y = Math.max(car.position.y - 0.03, sinkHeight);

                                // Tilt as it sinks
                                car.rotation.z += 0.01 * (index % 2 === 0 ? 1 : -1);
                                car.rotation.x += 0.005 * (index % 3 === 0 ? 1 : -1);
                            } else {
                                // Once at sink height, stay there with minimal movement
                                const time = Date.now() * 0.0005;

                                // Very slight bobbing, almost stationary
                                car.position.y = sinkHeight + Math.sin(time * 0.2 + index) * 0.01;

                                // No horizontal movement - car is "drowned"
                            }
                        }
                    });
                } else {
                    // Water not high enough yet, normal circular movement
                    // ... existing code for normal movement ...
                }
            } else {
                // Water is receding - return cars to their normal behavior
                if (ocean.surface.position.y < 3) {
                    // Return to original positions if water is low enough
                    const original = carOriginalPositions[index];

                    // If we're still floating, gently move back towards original path
                    if (car.position.y > original.y + 0.1) {
                        const time = Date.now() * 0.0005;
                        const radius = 15 + (index % 7) * 1.8;
                        const carAngle = time * (0.2 + (index % 3) * 0.1) + index;

                        // Target position on the circular path
                        const targetX = 14.8 + Math.cos(carAngle) * radius;
                        const targetZ = -75 + Math.sin(carAngle) * radius;

                        // Move gradually back to path
                        car.position.x += (targetX - car.position.x) * 0.02;
                        car.position.z += (targetZ - car.position.z) * 0.02;
                        car.position.y -= 0.05; // Move down gradually

                        // Gradually straighten rotation
                        car.rotation.x *= 0.9;
                        car.rotation.z *= 0.9;

                        // Point in the direction of movement
                        const nextAngle = carAngle + 0.01;
                        const nextX = 14.8 + Math.cos(nextAngle) * radius;
                        const nextZ = -75 + Math.sin(nextAngle) * radius;

                        car.lookAt(nextX, car.position.y, nextZ);
                        car.rotateY(Math.PI / 2);
                    } else {
                        // Back to normal circular movement
                        const time = Date.now() * 0.0005;
                        const radius = 15 + (index % 7) * 1.8;
                        const speed = 0.2 + (index % 3) * 0.1;
                        const carAngle = time * speed + index;

                        car.position.x = 14.8 + Math.cos(carAngle) * radius;
                        car.position.z = -75 + Math.sin(carAngle) * radius;
                        car.position.y = original.y;

                        const nextAngle = carAngle + 0.01;
                        const nextX = 14.8 + Math.cos(nextAngle) * radius;
                        const nextZ = -75 + Math.sin(nextAngle) * radius;

                        car.lookAt(nextX, car.position.y, nextZ);
                        car.rotateY(Math.PI / 2);
                    }
                }
            }
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

// Create a cement slab running down the hillside
function createCementSlab() {
    // Define slab parameters
    const slabWidth = 2.0;
    const slabThickness = 0.3;
    const segments = 20;
    
    // Create the slab shape (simple rectangle)
    const slabShape = new THREE.Shape();
    slabShape.moveTo(-slabWidth/2, 0);
    slabShape.lineTo(slabWidth/2, 0);
    slabShape.lineTo(slabWidth/2, slabThickness);
    slabShape.lineTo(-slabWidth/2, slabThickness);
    slabShape.lineTo(-slabWidth/2, 0);
    
    // Island position parameters
    const islandCenterX = 14.8;   // X position matching the island
    const islandCenterZ = 0;      // Z position of the island
    const islandSurfaceY = 10;    // Elevation of the island surface
    const radius = 15;            // Distance from island center
    
    // Position on left side of island (-90 degrees)
    const angle = -Math.PI/2;     // Left side rotation
    const startX = islandCenterX + Math.cos(angle) * radius;
    const startZ = islandCenterZ + Math.sin(angle) * radius;
    
    // Calculate direction vector pointing outward from island center
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);
    
    // Create points for the curve path with a gentler slope and shorter length
    const curvePoints = [
        new THREE.Vector3(0, 0, 0),                    // Start at island edge
        new THREE.Vector3(dirX * 4, -3, dirZ * 4),     // Gentler initial drop
        new THREE.Vector3(dirX * 8, -6, dirZ * 8),     // Gentler middle slope
        new THREE.Vector3(dirX * 12, -9, dirZ * 12),   // Gentler lower slope
        new THREE.Vector3(dirX * 16, -12, dirZ * 16)   // End at gentler depth
    ];
    
    // Create a smooth curve
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    
    // Create extrusion settings
    const extrudeSettings = {
        steps: segments,
        bevelEnabled: false,
        extrudePath: curve
    };
    
    // Create slab geometry
    const slabGeometry = new THREE.ExtrudeGeometry(slabShape, extrudeSettings);
    
    // Create cement material
    const cementMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888, // Darker grey color
        shininess: 20,
        flatShading: false
    });
    
    // Create the slab mesh
    const slab = new THREE.Mesh(slabGeometry, cementMaterial);
    
    // Position at the calculated edge position
    slab.position.set(startX, islandSurfaceY, startZ);
    
    // Rotate to align with the radial direction
    slab.rotation.y = angle + Math.PI/2;
    
    slab.castShadow = true;
    slab.receiveShadow = true;
    
    scene.add(slab);
    
    // Add barriers along the sides of the slab
    addBarriers(curve, slab, slabWidth, angle);
    
    // Create water inside the slab (initially hidden)
    const waterFlow = createWaterFlow(curve, slabWidth, slabThickness, angle, startX, startZ, islandSurfaceY);
    
    return {
        slab: slab,
        waterFlow: waterFlow,
        curve: curve,
        startPosition: { x: startX, y: islandSurfaceY, z: startZ },
        angle: angle
    };
}

// Create water flow inside the cement slab with improved visibility
function createWaterFlow(curve, slabWidth, slabThickness, angle, startX, startZ, startY) {
    // Create a slightly smaller shape for the water to avoid z-fighting
    const waterWidth = slabWidth - 0.3;  // Make even smaller to avoid edge clipping
    const waterShape = new THREE.Shape();
    waterShape.moveTo(-waterWidth/2, 0.08);  // Higher from bottom
    waterShape.lineTo(waterWidth/2, 0.08);
    waterShape.lineTo(waterWidth/2, slabThickness - 0.08);
    waterShape.lineTo(-waterWidth/2, slabThickness - 0.08);
    waterShape.lineTo(-waterWidth/2, 0.08);
    
    // Create water geometry with more steps for smoother look
    const waterGeometry = new THREE.ExtrudeGeometry(waterShape, {
        steps: 60,  // More steps for smoother curve
        bevelEnabled: false,
        extrudePath: curve
    });
    
    // Create water material with more vibrant color and higher opacity
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x44aaff,  // Brighter blue
        transparent: true,
        opacity: 0.9,  // Higher initial opacity
        shininess: 100  // More reflective
    });
    
    // Create water mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    
    // Position and rotate to match the slab
    water.position.set(startX, startY, startZ);
    water.rotation.y = angle + Math.PI/2;
    
    // Initially hide the water (will be shown during flooding)
    water.visible = false;
    
    // Set render order higher to ensure it renders on top
    water.renderOrder = 2;
    
    // Add to scene
    scene.add(water);
    
    return water;
}

// Add cement barriers along the sides of the slab
function addBarriers(curve, slab, slabWidth, baseAngle) {
    const barrierHeight = 0.3;
    const barrierWidth = 0.15;
    
    // Create continuous barriers for both sides
    [-1, 1].forEach(side => {
        // Create a custom shape for the continuous barrier
        const barrierShape = new THREE.Shape();
        barrierShape.moveTo(0, 0);
        barrierShape.lineTo(barrierWidth, 0);
        barrierShape.lineTo(barrierWidth, barrierHeight);
        barrierShape.lineTo(0, barrierHeight);
        barrierShape.lineTo(0, 0);
        
        // Create a path that follows the edge of the slab
        const barrierPath = curve.clone();
        
        // Create extrusion settings
        const extrudeSettings = {
            steps: 40, // More steps for smoother curve
            bevelEnabled: false,
            extrudePath: barrierPath
        };
        
        // Create barrier geometry
        const barrierGeometry = new THREE.ExtrudeGeometry(barrierShape, extrudeSettings);
        
        // Create barrier material
        const barrierMaterial = new THREE.MeshPhongMaterial({
            color: 0x777777, // Slightly darker than the slab
            shininess: 15
        });
        
        // Create the barrier mesh
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        
        // Position and rotate the barrier to align with the slab edge
        barrier.position.copy(slab.position);
        barrier.rotation.copy(slab.rotation);
        
        // Offset the barrier to the edge of the slab
        barrier.translateX((slabWidth/2 - barrierWidth/2) * side);
        
        barrier.castShadow = true;
        barrier.receiveShadow = true;
        scene.add(barrier);
    });
}

// Add the cement slab to the scene
const cementSlab = createCementSlab();

// Improved water animation function
function animateWaterFlow(waterMesh, isFlowing) {
    // Animation parameters
    const duration = isFlowing ? 2000 : 1500; // ms - faster animation
    const startTime = Date.now();
    
    // Initial and target values - more pronounced change
    const initialOpacity = isFlowing ? 0 : 0.9;
    const targetOpacity = isFlowing ? 0.9 : 0;
    
    // Set initial state
    waterMesh.material.opacity = initialOpacity;
    waterMesh.visible = true;
    
    // Animation function
    function updateWaterAnimation() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Update opacity with easing
        const easedProgress = isFlowing ? 
            Math.sin(progress * Math.PI/2) : // Ease in for filling
            1 - Math.sin((1-progress) * Math.PI/2); // Ease out for draining
        
        waterMesh.material.opacity = initialOpacity + (targetOpacity - initialOpacity) * easedProgress;
        
        if (progress < 1) {
            // Continue animation
            requestAnimationFrame(updateWaterAnimation);
        } else {
            // Animation complete
            if (!isFlowing) {
                waterMesh.visible = false;
            }
            
            // Ensure final opacity is set correctly
            waterMesh.material.opacity = targetOpacity;
        }
    }
    
    // Start animation
    updateWaterAnimation();
    
    // Force immediate visibility for debugging
    if (isFlowing) {
        waterMesh.visible = true;
        waterMesh.material.opacity = 0.9;
    }
}

// Immediately attempt to fix the current state
if (cementSlab && cementSlab.waterFlow) {
    // If flooding is active, make water visible immediately
    if (sceneToggle.checked) {
        cementSlab.waterFlow.visible = true;
        cementSlab.waterFlow.material.opacity = 0.9;
        cementSlab.waterFlow.material.color.set(0x44aaff);
        cementSlab.waterFlow.renderOrder = 2;
    }
}

// Add water ripple effect to the animate function
const originalAnimate = animate;
animate = function() {
    originalAnimate();
    
    // Animate water in the cement slab if visible
    if (cementSlab && cementSlab.waterFlow && cementSlab.waterFlow.visible) {
        // Add subtle wave animation to the water
        const time = Date.now() * 0.001;
        const waterMaterial = cementSlab.waterFlow.material;
        
        // Subtle color variation
        const blueBase = 0.6;
        const blueVariation = Math.sin(time * 0.5) * 0.1 + blueBase;
        waterMaterial.color.setRGB(0.2, 0.5, blueVariation);
        
        // Subtle opacity variation for flowing effect
        const opacityBase = 0.8;
        const opacityVariation = Math.sin(time * 2) * 0.05;
        waterMaterial.opacity = opacityBase + opacityVariation;
    }
};
