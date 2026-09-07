// ============================================
// LABS MODULE
// Handles all virtual lab experiments and animations
// ============================================

// Lab Functions
function startPhysicsLab(experiment) {
    const modal = document.getElementById('lab-modal');
    const title = document.getElementById('lab-title');
    const content = document.getElementById('lab-content');
    
    if (experiment === 'pendulum') {
        title.textContent = 'Pendulum Motion Experiment';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Study the relationship between pendulum length and period.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Interactive Simulation</h4>
                    <div class="bg-gray-100 rounded-lg p-8 text-center">
                        <canvas id="pendulum-canvas" width="400" height="300" class="mx-auto border border-gray-300 bg-white"></canvas>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Controls</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Pendulum Length (m):</label>
                            <input type="range" id="length-slider" min="0.5" max="2" step="0.1" value="1" 
                                   class="w-full" onchange="updatePendulum()">
                            <span id="length-value">1.0 m</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Angle (degrees):</label>
                            <input type="range" id="angle-slider" min="5" max="45" step="5" value="15" 
                                   class="w-full" onchange="updatePendulum()">
                            <span id="angle-value">15°</span>
                        </div>
                        <button onclick="runPendulumSimulation()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            <i class="fas fa-play mr-2"></i>Run Simulation
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Observations</h4>
                    <div id="pendulum-results" class="bg-blue-50 p-4 rounded">
                        <p>Run the simulation to see results...</p>
                    </div>
                </div>
            </div>
        `;
    } else if (experiment === 'projectile') {
        title.textContent = 'Projectile Motion Experiment';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Explore how initial velocity and angle affect projectile trajectory.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Interactive Simulation</h4>
                    <div class="bg-gray-100 rounded-lg p-8 text-center">
                        <canvas id="projectile-canvas" width="400" height="300" class="mx-auto border border-gray-300 bg-white"></canvas>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Controls</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Velocity (m/s):</label>
                            <input type="range" id="velocity-slider" min="10" max="50" step="5" value="25" 
                                   class="w-full" onchange="updateProjectile()">
                            <span id="velocity-value">25 m/s</span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Launch Angle (degrees):</label>
                            <input type="range" id="launch-angle-slider" min="15" max="75" step="5" value="45" 
                                   class="w-full" onchange="updateProjectile()">
                            <span id="launch-angle-value">45°</span>
                        </div>
                        <button onclick="runProjectileSimulation()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            <i class="fas fa-play mr-2"></i>Launch
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Results</h4>
                    <div id="projectile-results" class="bg-blue-50 p-4 rounded">
                        <p>Launch the projectile to see results...</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

function startChemistryLab(experiment) {
    const modal = document.getElementById('lab-modal');
    const title = document.getElementById('lab-title');
    const content = document.getElementById('lab-content');
    
    if (experiment === 'titration') {
        title.textContent = 'Acid-Base Titration Experiment';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Determine the concentration of an unknown acid solution through titration.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Virtual Titration Setup</h4>
                    <div class="bg-gray-100 rounded-lg p-8">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white rounded p-4">
                                <h5 class="font-semibold mb-2">Burette (Base)</h5>
                                <div class="text-center">
                                    <div class="w-16 h-32 bg-blue-200 mx-auto mb-2 rounded"></div>
                                    <p>0.1 M NaOH</p>
                                    <p>Volume: <span id="base-volume">0.0</span> mL</p>
                                </div>
                            </div>
                            <div class="bg-white rounded p-4">
                                <h5 class="font-semibold mb-2">Flask (Acid)</h5>
                                <div class="text-center">
                                    <div class="w-20 h-20 bg-pink-200 mx-auto mb-2 rounded-full" id="acid-ph"></div>
                                    <p>Unknown HCl</p>
                                    <p>pH: <span id="ph-value">3.0</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Titration Controls</h4>
                    <div class="space-y-4">
                        <button onclick="addBase(0.5)" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Add Base (0.5 mL)
                        </button>
                        <button onclick="resetTitration()" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Reset Experiment
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">pH Curve</h4>
                    <div class="bg-gray-100 rounded p-4">
                        <canvas id="ph-curve" width="400" height="200" class="w-full"></canvas>
                    </div>
                </div>
            </div>
        `;
    } else if (experiment === 'reactions') {
        title.textContent = 'Chemical Reactions Explorer';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Explore Different Reaction Types</h4>
                    <p class="text-gray-600">Select a reaction type to see the molecular animation and balanced equation.</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="showReaction('synthesis')" class="bg-green-500 text-white p-4 rounded hover:bg-green-600">
                        <i class="fas fa-plus mb-2"></i>
                        <p>Synthesis Reaction</p>
                    </button>
                    <button onclick="showReaction('decomposition')" class="bg-orange-500 text-white p-4 rounded hover:bg-orange-600">
                        <i class="fas fa-minus mb-2"></i>
                        <p>Decomposition Reaction</p>
                    </button>
                    <button onclick="showReaction('single')" class="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
                        <i class="fas fa-exchange-alt mb-2"></i>
                        <p>Single Displacement</p>
                    </button>
                    <button onclick="showReaction('double')" class="bg-purple-500 text-white p-4 rounded hover:bg-purple-600">
                        <i class="fas fa-random mb-2"></i>
                        <p>Double Displacement</p>
                    </button>
                </div>
                
                <div id="reaction-display" class="bg-gray-50 rounded p-6">
                    <p class="text-center text-gray-500">Select a reaction type to begin...</p>
                </div>
            </div>
        `;
    } else if (experiment === 'solutions') {
        title.textContent = 'Solutions & Concentrations Lab';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Objective</h4>
                    <p class="text-gray-600">Learn to calculate molarity, molality, and prepare chemical solutions.</p>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Solution Calculator</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Solute Mass (g):</label>
                            <input type="number" id="solute-mass" value="58.44" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Molar Mass (g/mol):</label>
                            <input type="number" id="molar-mass" value="58.44" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Solution Volume (L):</label>
                            <input type="number" id="solution-volume" value="0.5" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Solvent Mass (kg):</label>
                            <input type="number" id="solvent-mass" value="0.495" step="0.001" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                    </div>
                    <button onclick="calculateSolution()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">
                        <i class="fas fa-calculator mr-2"></i>Calculate
                    </button>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Common Compounds</h4>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="setCompound('NaCl', 58.44)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            NaCl (58.44 g/mol)
                        </button>
                        <button onclick="setCompound('HCl', 36.46)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            HCl (36.46 g/mol)
                        </button>
                        <button onclick="setCompound('NaOH', 40.00)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            NaOH (40.00 g/mol)
                        </button>
                        <button onclick="setCompound('H₂SO₄', 98.08)" class="bg-blue-100 px-3 py-2 rounded text-sm hover:bg-blue-200">
                            H₂SO₄ (98.08 g/mol)
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Results</h4>
                    <div id="solution-results" class="bg-green-50 p-4 rounded">
                        <p>Enter values and click Calculate to see results...</p>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Dilution Calculator</h4>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Concentration (M):</label>
                            <input type="number" id="initial-conc" value="1.0" step="0.1" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Final Volume (L):</label>
                            <input type="number" id="final-volume" value="0.25" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Final Concentration (M):</label>
                            <input type="number" id="final-conc" value="0.1" step="0.01" 
                                   class="w-full px-3 py-2 border rounded">
                        </div>
                    </div>
                    <button onclick="calculateDilution()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mt-4">
                        <i class="fas fa-flask mr-2"></i>Calculate Dilution
                    </button>
                    <div id="dilution-results" class="bg-purple-50 p-4 rounded mt-4">
                        <p>Calculate dilution requirements...</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

function startBiologyLab(experiment) {
    const modal = document.getElementById('lab-modal');
    const title = document.getElementById('lab-title');
    const content = document.getElementById('lab-content');
    
    if (experiment === 'celldivision') {
        title.textContent = 'Cell Division Explorer';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">Explore Mitosis and Meiosis</h4>
                    <p class="text-gray-600">Visualize the stages of cell division and understand the differences.</p>
                </div>
                
                <div class="flex space-x-4">
                    <button onclick="showCellDivision('mitosis')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Mitosis
                    </button>
                    <button onclick="showCellDivision('meiosis')" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                        Meiosis
                    </button>
                </div>
                
                <div id="cell-division-content" class="bg-gray-50 rounded p-6">
                    <p class="text-center text-gray-500">Select a division type to explore...</p>
                </div>
            </div>
        `;
    } else if (experiment === 'dna') {
        title.textContent = 'DNA Structure Explorer';
        content.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">DNA Double Helix Structure</h4>
                    <p class="text-gray-600">Explore the structure of DNA and base pairing rules.</p>
                </div>
                
                <div class="bg-gray-100 rounded-lg p-8 text-center">
                    <canvas id="dna-canvas" width="400" height="300" class="mx-auto border border-gray-300 bg-white"></canvas>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold mb-2">Base Pairing Rules</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded">
                            <h5 class="font-semibold text-blue-700">Adenine (A)</h5>
                            <p>Always pairs with Thymine (T)</p>
                            <p>2 hydrogen bonds</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded">
                            <h5 class="font-semibold text-green-700">Guanine (G)</h5>
                            <p>Always pairs with Cytosine (C)</p>
                            <p>3 hydrogen bonds</p>
                        </div>
                    </div>
                </div>
                
                <button onclick="animateDNA()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    <i class="fas fa-play mr-2"></i>Animate DNA
                </button>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

function closeLabModal() {
    document.getElementById('lab-modal').classList.add('hidden');
}

// Lab Simulation Functions
function updatePendulum() {
    const length = document.getElementById('length-slider').value;
    const angle = document.getElementById('angle-slider').value;
    document.getElementById('length-value').textContent = length + ' m';
    document.getElementById('angle-value').textContent = angle + '°';
}

function runPendulumSimulation() {
    const length = parseFloat(document.getElementById('length-slider').value);
    const initialAngle = parseFloat(document.getElementById('angle-slider').value) * Math.PI / 180;
    
    const period = 2 * Math.PI * Math.sqrt(length / 9.8);
    const frequency = 1 / period;
    const angularFrequency = 2 * Math.PI / period;
    const maxVelocity = angularFrequency * length * Math.sin(initialAngle);
    const maxKineticEnergy = 0.5 * 0.1 * Math.pow(maxVelocity, 2);
    const maxPotentialEnergy = 0.1 * 9.8 * length * (1 - Math.cos(initialAngle));
    const totalEnergy = maxKineticEnergy + maxPotentialEnergy;
    
    const observationsDiv = document.getElementById('pendulum-results');
    const currentContent = observationsDiv.innerHTML;
    const observationCount = (currentContent.match(/Observation \d+/g) || []).length + 1;
    
    const newObservation = `
        <div class="border-l-4 border-blue-500 pl-4 mb-3">
            <h5 class="font-semibold text-blue-700">Observation ${observationCount}</h5>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Length:</strong> ${length.toFixed(1)} m</p>
                <p><strong>Initial Angle:</strong> ${(initialAngle * 180 / Math.PI).toFixed(0)}°</p>
                <p><strong>Period:</strong> ${period.toFixed(3)} s</p>
                <p><strong>Frequency:</strong> ${frequency.toFixed(2)} Hz</p>
                <p><strong>Max Velocity:</strong> ${maxVelocity.toFixed(3)} m/s</p>
                <p><strong>Total Energy:</strong> ${totalEnergy.toFixed(4)} J</p>
            </div>
        </div>
    `;
    
    observationsDiv.innerHTML = currentContent.includes('Run the simulation') ? 
        newObservation : currentContent + newObservation;
}

function updateProjectile() {
    const velocity = document.getElementById('velocity-slider').value;
    const angle = document.getElementById('launch-angle-slider').value;
    document.getElementById('velocity-value').textContent = velocity + ' m/s';
    document.getElementById('launch-angle-value').textContent = angle + '°';
}

function runProjectileSimulation() {
    const v0 = parseFloat(document.getElementById('velocity-slider').value);
    const angle = parseFloat(document.getElementById('launch-angle-slider').value) * Math.PI / 180;
    const vx = v0 * Math.cos(angle);
    const vy = v0 * Math.sin(angle);
    const maxHeight = (vy * vy) / (2 * 9.8);
    const range = (v0 * v0 * Math.sin(2 * angle)) / 9.8;
    const time = 2 * vy / 9.8;
    
    document.getElementById('projectile-results').innerHTML = `
        <p><strong>Maximum Height:</strong> ${maxHeight.toFixed(2)} m</p>
        <p><strong>Range:</strong> ${range.toFixed(2)} m</p>
        <p><strong>Time of Flight:</strong> ${time.toFixed(2)} s</p>
        <p><strong>Horizontal Velocity:</strong> ${vx.toFixed(2)} m/s</p>
        <p><strong>Initial Vertical Velocity:</strong> ${vy.toFixed(2)} m/s</p>
    `;
}

// Chemistry lab functions
function addBase(amount) {
    baseVolume += amount;
    currentPH = Math.min(11, 3.0 + baseVolume * 0.16);
    
    document.getElementById('base-volume').textContent = baseVolume.toFixed(1);
    document.getElementById('ph-value').textContent = currentPH.toFixed(1);
    
    const acidPh = document.getElementById('acid-ph');
    if (currentPH < 4) {
        acidPh.className = 'w-20 h-20 bg-pink-200 mx-auto mb-2 rounded-full';
    } else if (currentPH < 6) {
        acidPh.className = 'w-20 h-20 bg-purple-200 mx-auto mb-2 rounded-full';
    } else if (currentPH < 8) {
        acidPh.className = 'w-20 h-20 bg-blue-200 mx-auto mb-2 rounded-full';
    } else {
        acidPh.className = 'w-20 h-20 bg-green-200 mx-auto mb-2 rounded-full';
    }
}

function resetTitration() {
    baseVolume = 0;
    currentPH = 3.0;
    document.getElementById('base-volume').textContent = '0.0';
    document.getElementById('ph-value').textContent = '3.0';
    document.getElementById('acid-ph').className = 'w-20 h-20 bg-pink-200 mx-auto mb-2 rounded-full';
}

function showReaction(type) {
    const display = document.getElementById('reaction-display');
    const reactions = {
        synthesis: {
            name: "Synthesis Reaction",
            equation: "2H₂ + O₂ → 2H₂O",
            description: "Two or more simple substances combine to form a more complex substance."
        },
        decomposition: {
            name: "Decomposition Reaction",
            equation: "2H₂O → 2H₂ + O₂",
            description: "A complex substance breaks down into simpler substances."
        },
        single: {
            name: "Single Displacement",
            equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
            description: "An element replaces another element in a compound."
        },
        double: {
            name: "Double Displacement",
            equation: "AgNO₃ + NaCl → AgCl + NaNO₃",
            description: "Two compounds exchange ions to form two new compounds."
        }
    };
    
    const reaction = reactions[type];
    display.innerHTML = `
        <h4 class="text-xl font-semibold mb-3">${reaction.name}</h4>
        <div class="bg-gray-100 p-4 rounded mb-3">
            <p class="text-lg font-mono text-center">${reaction.equation}</p>
        </div>
        <p class="text-gray-600">${reaction.description}</p>
    `;
}

function showCellDivision(type) {
    const content = document.getElementById('cell-division-content');
    
    if (type === 'mitosis') {
        content.innerHTML = `
            <h4 class="text-xl font-semibold mb-4">Mitosis - Cell Division for Growth</h4>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Prophase</h5>
                    <p>Chromosomes condense, nuclear envelope breaks down</p>
                </div>
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Metaphase</h5>
                    <p>Chromosomes align at the center</p>
                </div>
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Anaphase</h5>
                    <p>Sister chromatids separate</p>
                </div>
                <div class="bg-blue-50 p-4 rounded">
                    <h5 class="font-semibold">Telophase</h5>
                    <p>Two daughter nuclei form</p>
                </div>
            </div>
            <p class="mt-4"><strong>Result:</strong> 2 identical daughter cells (diploid)</p>
        `;
    } else {
        content.innerHTML = `
            <h4 class="text-xl font-semibold mb-4">Meiosis - Cell Division for Reproduction</h4>
            <div class="space-y-4">
                <div class="bg-purple-50 p-4 rounded">
                    <h5 class="font-semibold">Meiosis I</h5>
                    <p>Homologous chromosomes separate, reducing chromosome number by half</p>
                </div>
                <div class="bg-purple-50 p-4 rounded">
                    <h5 class="font-semibold">Meiosis II</h5>
                    <p>Sister chromatids separate, similar to mitosis</p>
                </div>
            </div>
            <p class="mt-4"><strong>Result:</strong> 4 unique daughter cells (haploid)</p>
        `;
    }
}

function animateDNA() {
    const canvas = document.getElementById('dna-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let rotation = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 20; i++) {
            const y = i * 15;
            const x1 = 200 + Math.sin(rotation + i * 0.3) * 50;
            const x2 = 200 - Math.sin(rotation + i * 0.3) * 50;
            
            ctx.beginPath();
            ctx.arc(x1, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x2, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = '#10B981';
            ctx.stroke();
        }
        
        rotation += 0.05;
        requestAnimationFrame(draw);
    }
    draw();
}

// Solutions Lab Functions
function calculateSolution() {
    const mass = parseFloat(document.getElementById('solute-mass').value);
    const molarMass = parseFloat(document.getElementById('molar-mass').value);
    const volume = parseFloat(document.getElementById('solution-volume').value);
    const solventMass = parseFloat(document.getElementById('solvent-mass').value);
    
    const moles = mass / molarMass;
    const molarity = moles / volume;
    const molality = moles / solventMass;
    const totalMass = mass + solventMass * 1000;
    const massPercent = (mass / totalMass) * 100;
    const normality = molarity;
    
    const resultsDiv = document.getElementById('solution-results');
    resultsDiv.innerHTML = `
        <div class="space-y-2">
            <h5 class="font-semibold text-green-700">Calculation Results:</h5>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Moles of Solute:</strong> ${moles.toFixed(4)} mol</p>
                <p><strong>Molarity (M):</strong> ${molarity.toFixed(3)} mol/L</p>
                <p><strong>Molality (m):</strong> ${molality.toFixed(3)} mol/kg</p>
                <p><strong>Mass Percent:</strong> ${massPercent.toFixed(2)}%</p>
                <p><strong>Normality (N):</strong> ${normality.toFixed(3)} N</p>
                <p><strong>Total Solution Mass:</strong> ${totalMass.toFixed(2)} g</p>
            </div>
        </div>
    `;
}

function calculateDilution() {
    const initialConc = parseFloat(document.getElementById('initial-conc').value);
    const finalVolume = parseFloat(document.getElementById('final-volume').value);
    const finalConc = parseFloat(document.getElementById('final-conc').value);
    
    const initialVolume = (finalConc * finalVolume) / initialConc;
    const waterToAdd = finalVolume - initialVolume;
    const dilutionFactor = initialConc / finalConc;
    
    const resultsDiv = document.getElementById('dilution-results');
    resultsDiv.innerHTML = `
        <div class="space-y-2">
            <h5 class="font-semibold text-purple-700">Dilution Results:</h5>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Initial Volume Needed:</strong> ${initialVolume.toFixed(3)} L</p>
                <p><strong>Water to Add:</strong> ${waterToAdd.toFixed(3)} L</p>
                <p><strong>Dilution Factor:</strong> ${dilutionFactor.toFixed(1)}x</p>
                <p><strong>Final Concentration:</strong> ${finalConc.toFixed(2)} M</p>
            </div>
        </div>
    `;
}

function setCompound(compound, molarMass) {
    document.getElementById('molar-mass').value = molarMass;
    
    if (compound === 'NaCl') {
        document.getElementById('solute-mass').value = '58.44';
        document.getElementById('solution-volume').value = '0.5';
        document.getElementById('solvent-mass').value = '0.495';
    } else if (compound === 'HCl') {
        document.getElementById('solute-mass').value = '36.46';
        document.getElementById('solution-volume').value = '0.25';
        document.getElementById('solvent-mass').value = '0.248';
    } else if (compound === 'NaOH') {
        document.getElementById('solute-mass').value = '40.00';
        document.getElementById('solution-volume').value = '0.5';
        document.getElementById('solvent-mass').value = '0.496';
    } else if (compound === 'H₂SO₄') {
        document.getElementById('solute-mass').value = '98.08';
        document.getElementById('solution-volume').value = '0.25';
        document.getElementById('solvent-mass').value = '0.247';
    }
    
    calculateSolution();
}

// Physics Lab Module Functions
function openPhysicsModule(moduleId) {
    const module = physicsModules[moduleId];
    if (!module) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-${module.color}-500 to-${module.color}-600 rounded-full flex items-center justify-center">
                        <i class="fas ${module.icon} text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">${module.title}</h2>
                        <p class="text-gray-600">${module.experiments.length} experiments available</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="this.closest('.fixed').remove(); showSection('physics-lab')" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Lab
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <div class="grid md:grid-cols-2 gap-4">
                    ${module.experiments.map(experiment => `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" onclick="openPhysicsExperiment('${moduleId}', '${experiment.id}')">
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <h3 class="font-semibold text-gray-800">${experiment.title}</h3>
                                    <div class="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                        <span><i class="fas fa-clock mr-1"></i>${experiment.duration}</span>
                                        <span class="px-2 py-1 bg-${experiment.difficulty === 'Beginner' ? 'green' : experiment.difficulty === 'Intermediate' ? 'yellow' : 'red'}-100 text-${experiment.difficulty === 'Beginner' ? 'green' : experiment.difficulty === 'Intermediate' ? 'yellow' : 'red'}-800 rounded-full text-xs">
                                            ${experiment.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <i class="fas fa-play-circle text-${module.color}-500 text-xl"></i>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">${experiment.description}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs bg-${module.color}-100 text-${module.color}-800 px-2 py-1 rounded-full">
                                    <i class="fas fa-flask mr-1"></i>Interactive Experiment
                                </span>
                                <i class="fas fa-arrow-right text-${module.color}-500"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function startPhysicsExperiment(moduleId, experimentId) {
    const module = physicsModules[moduleId];
    const experiment = module.experiments.find(exp => exp.id === experimentId);
    if (!experiment) return;
    
    const experimentModal = document.createElement('div');
    experimentModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    experimentModal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${experiment.title} - Interactive Demo</h2>
                    <p class="text-gray-600 mt-1">Virtual Physics Laboratory</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="closeExperimentDemo('${moduleId}', '${experimentId}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Details
                    </button>
                    <button onclick="closeExperimentDemoToLab()" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        <i class="fas fa-home mr-2"></i>Physics Lab
                    </button>
                    <button onclick="closeExperimentDemoToLab()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <div id="experiment-container">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(experimentModal);
    
    loadExperimentContent(experimentId);
}

function closeExperimentDemo(moduleId, experimentId) {
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => modal.remove());
    
    setTimeout(() => {
        openPhysicsExperiment(moduleId, experimentId);
    }, 100);
}

function closeExperimentDemoToLab() {
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => modal.remove());
    
    setTimeout(() => {
        showSection('physics-lab');
    }, 100);
}

function openPhysicsExperiment(moduleId, experimentId) {
    const module = physicsModules[moduleId];
    const experiment = module.experiments.find(exp => exp.id === experimentId);
    if (!experiment) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${experiment.title}</h2>
                    <div class="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <span><i class="fas fa-clock mr-1"></i>${experiment.duration}</span>
                        <span class="px-2 py-1 bg-${experiment.difficulty === 'Beginner' ? 'green' : experiment.difficulty === 'Intermediate' ? 'yellow' : 'red'}-100 text-${experiment.difficulty === 'Beginner' ? 'green' : experiment.difficulty === 'Intermediate' ? 'yellow' : 'red'}-800 rounded-full text-xs">
                            ${experiment.difficulty}
                        </span>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="this.closest('.fixed').remove(); openPhysicsModule('${moduleId}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Module
                    </button>
                    <button onclick="this.closest('.fixed').remove(); showSection('physics-lab')" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center">
                        <i class="fas fa-home mr-2"></i>Physics Lab
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <div class="bg-gray-100 rounded-lg p-8 mb-6 text-center">
                    <div class="w-16 h-16 bg-${module.color}-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i class="fas fa-play text-white text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Virtual Experiment</h3>
                    <p class="text-gray-600 mb-4">${experiment.description}</p>
                    <button onclick="startPhysicsExperiment('${moduleId}', '${experimentId}')" class="mt-4 bg-${module.color}-500 text-white px-6 py-2 rounded-lg hover:bg-${module.color}-600 transition-colors">
                        <i class="fas fa-play mr-2"></i>Start Experiment
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function loadExperimentContent(experimentId) {
    const container = document.getElementById('experiment-container');
    
    switch(experimentId) {
        case 'pendulum':
            loadPendulumExperiment(container);
            break;
        case 'projectile':
            loadProjectileExperiment(container);
            break;
        case 'collision':
            loadCollisionExperiment(container);
            break;
        case 'gas-laws':
            loadGasLawsExperiment(container);
            break;
        case 'circuits':
            loadCircuitsExperiment(container);
            break;
        case 'refraction':
            loadRefractionExperiment(container);
            break;
        case 'heat-transfer':
            loadHeatTransferExperiment(container);
            break;
        case 'radioactivity':
            loadRadioactivityExperiment(container);
            break;
        case 'standing-waves':
            loadStandingWavesExperiment(container);
            break;
        case 'doppler':
            loadDopplerExperiment(container);
            break;
        default:
            loadDefaultExperiment(container, experimentId);
    }
}

// Load experiment UI functions
function loadPendulumExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Pendulum Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="pendulum-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startPendulumAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="pausePendulumAnimation()" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                        <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                    <button onclick="resetPendulumAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Length (m): <span id="length-value">1.0</span></label>
                            <input type="range" id="pendulum-length" min="0.5" max="2.0" step="0.1" value="1.0" class="w-full" onchange="updatePendulumParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Angle (degrees): <span id="angle-value">30</span></label>
                            <input type="range" id="pendulum-angle" min="5" max="90" step="5" value="30" class="w-full" onchange="updatePendulumParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Gravity (m/s²): <span id="gravity-value">9.8</span></label>
                            <input type="range" id="pendulum-gravity" min="1" max="20" step="0.2" value="9.8" class="w-full" onchange="updatePendulumParams()">
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Measurements</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Period (T):</span>
                            <span id="period-value" class="font-mono">2.01 s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Frequency (f):</span>
                            <span id="frequency-value" class="font-mono">0.50 Hz</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Angular Velocity (ω):</span>
                            <span id="angular-velocity-value" class="font-mono">3.13 rad/s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Max Velocity:</span>
                            <span id="max-velocity-value" class="font-mono">0.82 m/s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initPendulumAnimation();
}

function loadProjectileExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Projectile Motion Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="projectile-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startProjectileAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Launch
                    </button>
                    <button onclick="resetProjectileAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Launch Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Velocity (m/s): <span id="velocity-value">20</span></label>
                            <input type="range" id="projectile-velocity" min="5" max="50" step="1" value="20" class="w-full" onchange="updateProjectileParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Launch Angle (degrees): <span id="launch-angle-value">45</span></label>
                            <input type="range" id="projectile-angle" min="15" max="75" step="5" value="45" class="w-full" onchange="updateProjectileParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Gravity (m/s²): <span id="proj-gravity-value">9.8</span></label>
                            <input type="range" id="projectile-gravity" min="1" max="20" step="0.2" value="9.8" class="w-full" onchange="updateProjectileParams()">
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Trajectory Data</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Max Height:</span>
                            <span id="max-height-value" class="font-mono">10.2 m</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Range:</span>
                            <span id="range-value" class="font-mono">40.8 m</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Time of Flight:</span>
                            <span id="flight-time-value" class="font-mono">2.89 s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Impact Velocity:</span>
                            <span id="impact-velocity-value" class="font-mono">20.0 m/s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initProjectileAnimation();
}

function loadCollisionExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Elastic Collision Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="collision-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startCollisionAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="resetCollisionAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Collision Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Ball 1 Mass (kg): <span id="mass1-value">2.0</span></label>
                            <input type="range" id="ball1-mass" min="0.5" max="5.0" step="0.5" value="2.0" class="w-full" onchange="updateCollisionParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Ball 1 Velocity (m/s): <span id="vel1-value">5.0</span></label>
                            <input type="range" id="ball1-velocity" min="1" max="10" step="0.5" value="5.0" class="w-full" onchange="updateCollisionParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Ball 2 Mass (kg): <span id="mass2-value">1.0</span></label>
                            <input type="range" id="ball2-mass" min="0.5" max="5.0" step="0.5" value="1.0" class="w-full" onchange="updateCollisionParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Ball 2 Velocity (m/s): <span id="vel2-value">0.0</span></label>
                            <input type="range" id="ball2-velocity" min="-5" max="5" step="0.5" value="0.0" class="w-full" onchange="updateCollisionParams()">
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Collision Results</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Ball 1 Final Velocity:</span>
                            <span id="ball1-final" class="font-mono">0.0 m/s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Ball 2 Final Velocity:</span>
                            <span id="ball2-final" class="font-mono">0.0 m/s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Total Momentum:</span>
                            <span id="total-momentum" class="font-mono">10.0 kg·m/s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Total KE:</span>
                            <span id="total-ke" class="font-mono">25.0 J</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initCollisionAnimation();
}

function loadGasLawsExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Gas Laws Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="gas-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startGasAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="pauseGasAnimation()" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                        <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                    <button onclick="resetGasAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Gas Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Temperature (K): <span id="temp-value">300</span></label>
                            <input type="range" id="gas-temperature" min="200" max="500" step="10" value="300" class="w-full" onchange="updateGasParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Volume (L): <span id="volume-value">10.0</span></label>
                            <input type="range" id="gas-volume" min="5" max="20" step="0.5" value="10.0" class="w-full" onchange="updateGasParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Number of Molecules: <span id="molecules-value">50</span></label>
                            <input type="range" id="gas-molecules" min="20" max="100" step="5" value="50" class="w-full" onchange="updateGasParams()">
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Gas Properties</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Pressure (atm):</span>
                            <span id="pressure-value" class="font-mono">2.45</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Average Speed:</span>
                            <span id="avg-speed-value" class="font-mono">450 m/s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Kinetic Energy:</span>
                            <span id="ke-value" class="font-mono">6.2×10⁻²¹ J</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Collisions/sec:</span>
                            <span id="collision-rate" class="font-mono">1200</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initGasAnimation();
}

function loadCircuitsExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Electric Circuit Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="circuit-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startCircuitAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Power On
                    </button>
                    <button onclick="pauseCircuitAnimation()" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                        <i class="fas fa-pause mr-2"></i>Power Off
                    </button>
                    <button onclick="resetCircuitAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Circuit Components</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Voltage (V): <span id="voltage-value">12.0</span></label>
                            <input type="range" id="circuit-voltage" min="1" max="24" step="1" value="12" class="w-full" onchange="updateCircuitParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Resistance 1 (Ω): <span id="res1-value">10.0</span></label>
                            <input type="range" id="resistor1" min="1" max="50" step="1" value="10" class="w-full" onchange="updateCircuitParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Resistance 2 (Ω): <span id="res2-value">20.0</span></label>
                            <input type="range" id="resistor2" min="1" max="50" step="1" value="20" class="w-full" onchange="updateCircuitParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Circuit Type:</label>
                            <select id="circuit-type" class="w-full p-2 border rounded" onchange="updateCircuitParams()">
                                <option value="series">Series</option>
                                <option value="parallel">Parallel</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Circuit Analysis</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Total Resistance:</span>
                            <span id="total-resistance" class="font-mono">30.0 Ω</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Total Current:</span>
                            <span id="total-current" class="font-mono">0.40 A</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Power Dissipated:</span>
                            <span id="power-dissipated" class="font-mono">4.8 W</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Current R1:</span>
                            <span id="current-r1" class="font-mono">0.40 A</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Current R2:</span>
                            <span id="current-r2" class="font-mono">0.40 A</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initCircuitAnimation();
}

function loadHeatTransferExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Heat Transfer Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="heat-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startHeatAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="pauseHeatAnimation()" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                        <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                    <button onclick="resetHeatAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Heat Transfer Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Hot Temperature (°C): <span id="hot-temp-value">100</span></label>
                            <input type="range" id="hot-temperature" min="50" max="200" step="10" value="100" class="w-full" onchange="updateHeatParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Cold Temperature (°C): <span id="cold-temp-value">20</span></label>
                            <input type="range" id="cold-temperature" min="0" max="50" step="5" value="20" class="w-full" onchange="updateHeatParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Thermal Conductivity: <span id="conductivity-value">0.5</span></label>
                            <input type="range" id="thermal-conductivity" min="0.1" max="1.0" step="0.1" value="0.5" class="w-full" onchange="updateHeatParams()">
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Heat Transfer Data</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Heat Flow Rate:</span>
                            <span id="heat-flow" class="font-mono">40.0 W/m²</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Temperature Gradient:</span>
                            <span id="temp-gradient" class="font-mono">80.0 °C/m</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Average Temperature:</span>
                            <span id="avg-temperature" class="font-mono">60.0 °C</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Heat Transferred:</span>
                            <span id="heat-transferred" class="font-mono">0.0 J</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initHeatAnimation();
}

function loadRadioactivityExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Radioactive Decay Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="radioactivity-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startRadioactivityAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="pauseRadioactivityAnimation()" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                        <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                    <button onclick="resetRadioactivityAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Radioactive Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Initial Nuclei: <span id="initial-nuclei-value">1000</span></label>
                            <input type="range" id="initial-nuclei" min="100" max="2000" step="100" value="1000" class="w-full" onchange="updateRadioactivityParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Half-Life (years): <span id="half-life-value">10</span></label>
                            <input type="range" id="half-life" min="1" max="50" step="1" value="10" class="w-full" onchange="updateRadioactivityParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Decay Type:</label>
                            <select id="decay-type" class="w-full p-2 border rounded" onchange="updateRadioactivityParams()">
                                <option value="alpha">Alpha Decay</option>
                                <option value="beta">Beta Decay</option>
                                <option value="gamma">Gamma Decay</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Decay Statistics</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Remaining Nuclei:</span>
                            <span id="remaining-nuclei" class="font-mono">1000</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Decayed Nuclei:</span>
                            <span id="decayed-nuclei" class="font-mono">0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Decay Constant (λ):</span>
                            <span id="decay-constant" class="font-mono">0.0693 yr⁻¹</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Activity (Bq):</span>
                            <span id="activity" class="font-mono">69.3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initRadioactivityAnimation();
}

function loadStandingWavesExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Standing Waves Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="standing-waves-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startStandingWavesAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="pauseStandingWavesAnimation()" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                        <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                    <button onclick="resetStandingWavesAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Wave Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Frequency (Hz): <span id="frequency-value">440</span></label>
                            <input type="range" id="wave-frequency" min="100" max="1000" step="10" value="440" class="w-full" onchange="updateStandingWavesParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Amplitude: <span id="amplitude-value">50</span></label>
                            <input type="range" id="wave-amplitude" min="10" max="80" step="5" value="50" class="w-full" onchange="updateStandingWavesParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Wave Speed (m/s): <span id="wave-speed-value">340</span></label>
                            <input type="range" id="wave-speed" min="100" max="500" step="10" value="340" class="w-full" onchange="updateStandingWavesParams()">
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Wave Properties</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Wavelength (λ):</span>
                            <span id="wavelength" class="font-mono">0.77 m</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Period (T):</span>
                            <span id="period" class="font-mono">2.27 ms</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Angular Frequency (ω):</span>
                            <span id="angular-freq" class="font-mono">2765 rad/s</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Nodes:</span>
                            <span id="nodes-count" class="font-mono">5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initStandingWavesAnimation();
}

function loadDopplerExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Doppler Effect Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="doppler-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startDopplerAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="pauseDopplerAnimation()" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                        <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                    <button onclick="resetDopplerAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Doppler Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Source Velocity (m/s): <span id="source-velocity-value">20</span></label>
                            <input type="range" id="source-velocity" min="0" max="50" step="5" value="20" class="w-full" onchange="updateDopplerParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Source Frequency (Hz): <span id="source-freq-value">440</span></label>
                            <input type="range" id="source-frequency" min="200" max="800" step="20" value="440" class="w-full" onchange="updateDopplerParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Sound Speed (m/s): <span id="sound-speed-value">340</span></label>
                            <input type="range" id="sound-speed" min="300" max="400" step="10" value="340" class="w-full" onchange="updateDopplerParams()">
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Doppler Effect Data</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Observed Frequency:</span>
                            <span id="observed-freq" class="font-mono">466.9 Hz</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Frequency Shift:</span>
                            <span id="freq-shift" class="font-mono">+26.9 Hz</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Mach Number:</span>
                            <span id="mach-number" class="font-mono">0.059</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Wavelength Change:</span>
                            <span id="wavelength-change" class="font-mono">-0.018 m</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initDopplerAnimation();
}

function loadRefractionExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4">Light Refraction Simulation</h3>
                <div class="relative bg-white rounded-lg border-2 border-gray-300 h-64 mb-4">
                    <canvas id="refraction-canvas" width="400" height="250"></canvas>
                </div>
                <div class="flex space-x-3">
                    <button onclick="startRefractionAnimation()" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button onclick="resetRefractionAnimation()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <i class="fas fa-redo mr-2"></i>Reset
                    </button>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Light Parameters</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-1">Incident Angle (degrees): <span id="incident-angle-value">45</span></label>
                            <input type="range" id="incident-angle" min="0" max="85" step="5" value="45" class="w-full" onchange="updateRefractionParams()">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Medium 1:</label>
                            <select id="medium1" class="w-full p-2 border rounded" onchange="updateRefractionParams()">
                                <option value="1.00">Air (n=1.00)</option>
                                <option value="1.33">Water (n=1.33)</option>
                                <option value="1.50">Glass (n=1.50)</option>
                                <option value="2.42">Diamond (n=2.42)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Medium 2:</label>
                            <select id="medium2" class="w-full p-2 border rounded" onchange="updateRefractionParams()">
                                <option value="1.00">Air (n=1.00)</option>
                                <option value="1.33" selected>Water (n=1.33)</option>
                                <option value="1.50">Glass (n=1.50)</option>
                                <option value="2.42">Diamond (n=2.42)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Refraction Results</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Refracted Angle:</span>
                            <span id="refracted-angle" class="font-mono">32.1°</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Critical Angle:</span>
                            <span id="critical-angle" class="font-mono">48.6°</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Reflection Coefficient:</span>
                            <span id="reflection-coeff" class="font-mono">0.04</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Transmission:</span>
                            <span id="transmission" class="font-mono">96%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initRefractionAnimation();
}

function loadDefaultExperiment(container, experimentId) {
    container.innerHTML = `
        <div class="bg-blue-50 rounded-lg p-8 text-center">
            <div class="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i class="fas fa-flask text-white text-3xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Experiment Coming Soon!</h3>
            <p class="text-blue-800 mb-6">Interactive simulation for ${experimentId} is under development.</p>
        </div>
    `;
}

// Animation initialization functions (simplified - full implementations would be very long)
function initPendulumAnimation() {
    const canvas = document.getElementById('pendulum-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let angle = 30 * Math.PI / 180;
    let angleVelocity = 0;
    let angleAcceleration = 0;
    let damping = 0.995;
    
    function drawPendulum() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const length = parseFloat(document.getElementById('pendulum-length')?.value || 1.0) * 100;
        const gravity = parseFloat(document.getElementById('pendulum-gravity')?.value || 9.8);
        
        angleAcceleration = (-gravity / length) * Math.sin(angle);
        angleVelocity += angleAcceleration * 0.1;
        angleVelocity *= damping;
        angle += angleVelocity * 0.1;
        
        const centerX = canvas.width / 2;
        const centerY = 50;
        const bobX = centerX + length * Math.sin(angle);
        const bobY = centerY + length * Math.cos(angle);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#666';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(bobX, bobY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        
        updatePendulumMeasurements(length/100, gravity, Math.abs(angle));
    }
    
    window.startPendulumAnimation = function() {
        if (pendulumAnimation) return;
        pendulumAnimation = setInterval(drawPendulum, 50);
    };
    
    window.pausePendulumAnimation = function() {
        if (pendulumAnimation) {
            clearInterval(pendulumAnimation);
            pendulumAnimation = null;
        }
    };
    
    window.resetPendulumAnimation = function() {
        pausePendulumAnimation();
        angle = 30 * Math.PI / 180;
        angleVelocity = 0;
        drawPendulum();
    };
    
    window.updatePendulumParams = function() {
        const length = document.getElementById('pendulum-length').value;
        const angleDeg = document.getElementById('pendulum-angle').value;
        const gravity = document.getElementById('pendulum-gravity').value;
        
        document.getElementById('length-value').textContent = length;
        document.getElementById('angle-value').textContent = angleDeg;
        document.getElementById('gravity-value').textContent = gravity;
        
        angle = angleDeg * Math.PI / 180;
        updatePendulumMeasurements(length, gravity, Math.abs(angle));
    };
    
    function updatePendulumMeasurements(length, gravity, angle) {
        const period = 2 * Math.PI * Math.sqrt(length / gravity);
        const frequency = 1 / period;
        const angularVelocity = Math.sqrt(gravity / length);
        const maxVelocity = angularVelocity * length * Math.sin(angle);
        
        document.getElementById('period-value').textContent = period.toFixed(2) + ' s';
        document.getElementById('frequency-value').textContent = frequency.toFixed(2) + ' Hz';
        document.getElementById('angular-velocity-value').textContent = angularVelocity.toFixed(2) + ' rad/s';
        document.getElementById('max-velocity-value').textContent = maxVelocity.toFixed(2) + ' m/s';
    }
    
    drawPendulum();
}

function initProjectileAnimation() {
    const canvas = document.getElementById('projectile-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let projectileX = 50;
    let projectileY = 200;
    let velocityX = 0;
    let velocityY = 0;
    let time = 0;
    
    function drawProjectile() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const velocity = parseFloat(document.getElementById('projectile-velocity')?.value || 20);
        const angleDeg = parseFloat(document.getElementById('projectile-angle')?.value || 45);
        const gravity = parseFloat(document.getElementById('projectile-gravity')?.value || 9.8);
        const angleRad = angleDeg * Math.PI / 180;
        
        if (time === 0) {
            velocityX = velocity * Math.cos(angleRad);
            velocityY = -velocity * Math.sin(angleRad);
        }
        
        projectileX += velocityX * 0.1;
        projectileY += velocityY * 0.1;
        velocityY += gravity * 0.1;
        time += 0.1;
        
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.lineTo(400, 200);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(projectileX, projectileY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        
        if (projectileY >= 200) {
            pauseProjectileAnimation();
            updateProjectileMeasurements(velocity, angleDeg, gravity, time);
        }
    }
    
    window.startProjectileAnimation = function() {
        if (projectileAnimation) return;
        resetProjectileAnimation();
        projectileAnimation = setInterval(drawProjectile, 50);
    };
    
    window.pauseProjectileAnimation = function() {
        if (projectileAnimation) {
            clearInterval(projectileAnimation);
            projectileAnimation = null;
        }
    };
    
    window.resetProjectileAnimation = function() {
        pauseProjectileAnimation();
        projectileX = 50;
        projectileY = 200;
        time = 0;
        drawProjectile();
    };
    
    window.updateProjectileParams = function() {
        const velocity = document.getElementById('projectile-velocity').value;
        const angle = document.getElementById('projectile-angle').value;
        const gravity = document.getElementById('projectile-gravity').value;
        
        document.getElementById('velocity-value').textContent = velocity;
        document.getElementById('launch-angle-value').textContent = angle;
        document.getElementById('proj-gravity-value').textContent = gravity;
        
        updateProjectileMeasurements(velocity, angle, gravity, 0);
    };
    
    function updateProjectileMeasurements(velocity, angle, gravity, time) {
        const angleRad = angle * Math.PI / 180;
        const maxHeight = (velocity * velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * gravity);
        const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;
        const flightTime = (2 * velocity * Math.sin(angleRad)) / gravity;
        
        document.getElementById('max-height-value').textContent = maxHeight.toFixed(1) + ' m';
        document.getElementById('range-value').textContent = range.toFixed(1) + ' m';
        document.getElementById('flight-time-value').textContent = flightTime.toFixed(2) + ' s';
        document.getElementById('impact-velocity-value').textContent = velocity.toFixed(1) + ' m/s';
    }
    
    drawProjectile();
}

// Placeholder implementations for other animations
function initCollisionAnimation() {
    const canvas = document.getElementById('collision-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let ball1X = 50, ball1Y = 125;
    let ball2X = 300, ball2Y = 125;
    let vel1 = 5, vel2 = 0;
    let hasCollided = false;
    
    function drawCollision() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const mass1 = parseFloat(document.getElementById('ball1-mass')?.value || 2.0);
        const mass2 = parseFloat(document.getElementById('ball2-mass')?.value || 1.0);
        
        if (!hasCollided && Math.abs(ball1X - ball2X) <= 30) {
            const v1 = ((mass1 - mass2) * vel1 + 2 * mass2 * vel2) / (mass1 + mass2);
            const v2 = ((mass2 - mass1) * vel2 + 2 * mass1 * vel1) / (mass1 + mass2);
            vel1 = v1;
            vel2 = v2;
            hasCollided = true;
            updateCollisionResults(mass1, mass2, vel1, vel2);
        }
        
        ball1X += vel1;
        ball2X += vel2;
        
        ctx.beginPath();
        ctx.arc(ball1X, ball1Y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(ball2X, ball2Y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        
        if (ball1X > canvas.width + 20 || ball2X > canvas.width + 20) {
            pauseCollisionAnimation();
        }
    }
    
    window.startCollisionAnimation = function() {
        if (collisionAnimation) return;
        resetCollisionAnimation();
        collisionAnimation = setInterval(drawCollision, 50);
    };
    
    window.pauseCollisionAnimation = function() {
        if (collisionAnimation) {
            clearInterval(collisionAnimation);
            collisionAnimation = null;
        }
    };
    
    window.resetCollisionAnimation = function() {
        pauseCollisionAnimation();
        ball1X = 50; ball1Y = 125;
        ball2X = 300; ball2Y = 125;
        vel1 = parseFloat(document.getElementById('ball1-velocity')?.value || 5.0);
        vel2 = parseFloat(document.getElementById('ball2-velocity')?.value || 0.0);
        hasCollided = false;
        drawCollision();
    };
    
    window.updateCollisionParams = function() {
        const mass1 = document.getElementById('ball1-mass').value;
        const mass2 = document.getElementById('ball2-mass').value;
        const vel1 = document.getElementById('ball1-velocity').value;
        const vel2 = document.getElementById('ball2-velocity').value;
        
        document.getElementById('mass1-value').textContent = mass1;
        document.getElementById('mass2-value').textContent = mass2;
        document.getElementById('vel1-value').textContent = vel1;
        document.getElementById('vel2-value').textContent = vel2;
        
        const totalMomentum = mass1 * vel1 + mass2 * vel2;
        const totalKE = 0.5 * mass1 * vel1 * vel1 + 0.5 * mass2 * vel2 * vel2;
        document.getElementById('total-momentum').textContent = totalMomentum.toFixed(1) + ' kg·m/s';
        document.getElementById('total-ke').textContent = totalKE.toFixed(1) + ' J';
    };
    
    function updateCollisionResults(mass1, mass2, v1, v2) {
        document.getElementById('ball1-final').textContent = v1.toFixed(2) + ' m/s';
        document.getElementById('ball2-final').textContent = v2.toFixed(2) + ' m/s';
    }
    
    drawCollision();
}

function initGasAnimation() {
    const canvas = document.getElementById('gas-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const molecules = [];
    const numMolecules = 50;
    
    for (let i = 0; i < numMolecules; i++) {
        molecules.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: 3
        });
    }
    
    function drawGas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const temperature = parseFloat(document.getElementById('gas-temperature')?.value || 300);
        const speedFactor = Math.sqrt(temperature / 300);
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        molecules.forEach(mol => {
            mol.x += mol.vx * speedFactor;
            mol.y += mol.vy * speedFactor;
            
            if (mol.x <= 15 || mol.x >= canvas.width - 15) mol.vx *= -1;
            if (mol.y <= 15 || mol.y >= canvas.height - 15) mol.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(mol.x, mol.y, mol.radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#10B981';
            ctx.fill();
        });
        
        updateGasMeasurements(temperature);
    }
    
    window.startGasAnimation = function() {
        if (gasAnimation) return;
        gasAnimation = setInterval(drawGas, 50);
    };
    
    window.pauseGasAnimation = function() {
        if (gasAnimation) {
            clearInterval(gasAnimation);
            gasAnimation = null;
        }
    };
    
    window.resetGasAnimation = function() {
        pauseGasAnimation();
        molecules.forEach(mol => {
            mol.x = Math.random() * canvas.width;
            mol.y = Math.random() * canvas.height;
            mol.vx = (Math.random() - 0.5) * 4;
            mol.vy = (Math.random() - 0.5) * 4;
        });
        drawGas();
    };
    
    window.updateGasParams = function() {
        const temp = document.getElementById('gas-temperature').value;
        const volume = document.getElementById('gas-volume').value;
        const molecules = document.getElementById('gas-molecules').value;
        
        document.getElementById('temp-value').textContent = temp;
        document.getElementById('volume-value').textContent = volume;
        document.getElementById('molecules-value').textContent = molecules;
        
        updateGasMeasurements(temp);
    };
    
    function updateGasMeasurements(temperature) {
        const volume = parseFloat(document.getElementById('gas-volume')?.value || 10.0);
        const n = parseFloat(document.getElementById('gas-molecules')?.value || 50);
        const R = 0.0821;
        const pressure = (n * R * temperature) / volume;
        const avgSpeed = Math.sqrt(3 * 1.38e-23 * temperature / 4.65e-26);
        const ke = 1.5 * 1.38e-23 * temperature;
        
        document.getElementById('pressure-value').textContent = pressure.toFixed(2);
        document.getElementById('avg-speed-value').textContent = Math.round(avgSpeed) + ' m/s';
        document.getElementById('ke-value').textContent = ke.toExponential(1) + ' J';
        document.getElementById('collision-rate').textContent = Math.round(n * 24);
    }
    
    drawGas();
}

function initCircuitAnimation() {
    const canvas = document.getElementById('circuit-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let currentFlow = 0;
    let electrons = [];
    
    for (let i = 0; i < 10; i++) {
        electrons.push({
            position: i * 40,
            speed: 0
        });
    }
    
    function drawCircuit() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const voltage = parseFloat(document.getElementById('circuit-voltage')?.value || 12);
        const res1 = parseFloat(document.getElementById('resistor1')?.value || 10);
        const res2 = parseFloat(document.getElementById('resistor2')?.value || 20);
        const circuitType = document.getElementById('circuit-type')?.value || 'series';
        
        const totalRes = circuitType === 'series' ? res1 + res2 : (res1 * res2) / (res1 + res2);
        const current = voltage / totalRes;
        currentFlow = current;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        
        ctx.strokeRect(20, 110, 30, 30);
        ctx.fillStyle = '#333';
        ctx.fillText('+', 25, 105);
        ctx.fillText('-', 25, 155);
        
        ctx.beginPath();
        ctx.moveTo(50, 125);
        ctx.lineTo(150, 125);
        ctx.moveTo(180, 125);
        ctx.lineTo(280, 125);
        ctx.moveTo(310, 125);
        ctx.lineTo(350, 125);
        ctx.lineTo(350, 200);
        ctx.lineTo(20, 200);
        ctx.lineTo(20, 140);
        ctx.stroke();
        
        ctx.strokeRect(150, 115, 30, 20);
        ctx.strokeRect(280, 115, 30, 20);
        
        if (current > 0) {
            ctx.fillStyle = '#3B82F6';
            electrons.forEach(electron => {
                const x = 50 + electron.position;
                const y = 125;
                
                if (x < 350) {
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
                
                electron.position += current * 2;
                if (electron.position > 300) {
                    electron.position = 0;
                }
            });
        }
        
        updateCircuitMeasurements(voltage, res1, res2, circuitType, current);
    }
    
    window.startCircuitAnimation = function() {
        if (circuitAnimation) return;
        circuitAnimation = setInterval(drawCircuit, 100);
    };
    
    window.pauseCircuitAnimation = function() {
        if (circuitAnimation) {
            clearInterval(circuitAnimation);
            circuitAnimation = null;
        }
    };
    
    window.resetCircuitAnimation = function() {
        pauseCircuitAnimation();
        electrons.forEach(electron => {
            electron.position = Math.random() * 300;
            electron.speed = 0;
        });
        drawCircuit();
    };
    
    window.updateCircuitParams = function() {
        const voltage = document.getElementById('circuit-voltage').value;
        const res1 = document.getElementById('resistor1').value;
        const res2 = document.getElementById('resistor2').value;
        
        document.getElementById('voltage-value').textContent = voltage;
        document.getElementById('res1-value').textContent = res1;
        document.getElementById('res2-value').textContent = res2;
        
        drawCircuit();
    };
    
    function updateCircuitMeasurements(voltage, res1, res2, type, current) {
        const totalRes = type === 'series' ? res1 + res2 : (res1 * res2) / (res1 + res2);
        const power = voltage * current;
        const currentR1 = type === 'series' ? current : voltage / res1;
        const currentR2 = type === 'series' ? current : voltage / res2;
        
        document.getElementById('total-resistance').textContent = totalRes.toFixed(1) + ' Ω';
        document.getElementById('total-current').textContent = current.toFixed(2) + ' A';
        document.getElementById('power-dissipated').textContent = power.toFixed(1) + ' W';
        document.getElementById('current-r1').textContent = currentR1.toFixed(2) + ' A';
        document.getElementById('current-r2').textContent = currentR2.toFixed(2) + ' A';
    }
    
    drawCircuit();
}

function initRefractionAnimation() {
    const canvas = document.getElementById('refraction-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function drawRefraction() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const incidentAngle = parseFloat(document.getElementById('incident-angle')?.value || 45);
        const n1 = parseFloat(document.getElementById('medium1')?.value || 1.00);
        const n2 = parseFloat(document.getElementById('medium2')?.value || 1.33);
        
        const angleRad = incidentAngle * Math.PI / 180;
        const sinRefracted = (n1 * Math.sin(angleRad)) / n2;
        const refractedAngle = Math.asin(sinRefracted) * 180 / Math.PI;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(200 - 100 * Math.sin(angleRad), canvas.height / 2 - 100 * Math.cos(angleRad));
        ctx.stroke();
        
        ctx.strokeStyle = '#3B82F6';
        ctx.beginPath();
        ctx.moveTo(200, canvas.height / 2);
        ctx.lineTo(200 + 100 * Math.sin(refractedAngle * Math.PI / 180), canvas.height / 2 + 100 * Math.cos(refractedAngle * Math.PI / 180));
        ctx.stroke();
        
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(200, 30);
        ctx.lineTo(200, canvas.height - 30);
        ctx.stroke();
        ctx.setLineDash([]);
        
        updateRefractionMeasurements(incidentAngle, n1, n2, refractedAngle);
    }
    
    window.startRefractionAnimation = function() {
        drawRefraction();
    };
    
    window.resetRefractionAnimation = function() {
        drawRefraction();
    };
    
    window.updateRefractionParams = function() {
        const angle = document.getElementById('incident-angle').value;
        document.getElementById('incident-angle-value').textContent = angle;
        drawRefraction();
    };
    
    function updateRefractionMeasurements(incident, n1, n2, refracted) {
        const criticalAngle = n2 > n1 ? Math.asin(n1 / n2) * 180 / Math.PI : 90;
        const reflectionCoeff = Math.pow((n1 - n2) / (n1 + n2), 2);
        const transmission = (1 - reflectionCoeff) * 100;
        
        document.getElementById('refracted-angle').textContent = refracted.toFixed(1) + '°';
        document.getElementById('critical-angle').textContent = criticalAngle.toFixed(1) + '°';
        document.getElementById('reflection-coeff').textContent = reflectionCoeff.toFixed(2);
        document.getElementById('transmission').textContent = transmission.toFixed(0) + '%';
    }
    
    drawRefraction();
}

function initHeatAnimation() {
    const canvas = document.getElementById('heat-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    const particles = [];
    
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            temp: 0
        });
    }
    
    function drawHeatTransfer() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const hotTemp = parseFloat(document.getElementById('hot-temperature')?.value || 100);
        const coldTemp = parseFloat(document.getElementById('cold-temperature')?.value || 20);
        const conductivity = parseFloat(document.getElementById('thermal-conductivity')?.value || 0.5);
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, `rgb(255, ${Math.round(255 - hotTemp)}, 0)`);
        gradient.addColorStop(0.5, `rgb(255, ${Math.round(255 - (hotTemp + coldTemp) / 2)}, 0)`);
        gradient.addColorStop(1, `rgb(0, ${Math.round(255 - coldTemp)}, 255)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            const distFromLeft = particle.x / canvas.width;
            particle.temp = hotTemp * (1 - distFromLeft) + coldTemp * distFromLeft;
            
            const speedFactor = conductivity * Math.sqrt(particle.temp / 100);
            particle.x += particle.vx * speedFactor;
            particle.y += particle.vy * speedFactor;
            
            if (particle.x <= 5 || particle.x >= canvas.width - 5) particle.vx *= -1;
            if (particle.y <= 5 || particle.y >= canvas.height - 5) particle.vy *= -1;
            
            const red = Math.min(255, Math.round(particle.temp * 2.55));
            const blue = Math.min(255, Math.round((100 - particle.temp) * 2.55));
            ctx.fillStyle = `rgb(${red}, 100, ${blue})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        updateHeatMeasurements(hotTemp, coldTemp, conductivity, time);
        time += 0.1;
    }
    
    window.startHeatAnimation = function() {
        if (heatAnimation) return;
        heatAnimation = setInterval(drawHeatTransfer, 50);
    };
    
    window.pauseHeatAnimation = function() {
        if (heatAnimation) {
            clearInterval(heatAnimation);
            heatAnimation = null;
        }
    };
    
    window.resetHeatAnimation = function() {
        pauseHeatAnimation();
        time = 0;
        particles.forEach(particle => {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.vx = (Math.random() - 0.5) * 2;
            particle.vy = (Math.random() - 0.5) * 2;
        });
        drawHeatTransfer();
    };
    
    window.updateHeatParams = function() {
        const hot = document.getElementById('hot-temperature').value;
        const cold = document.getElementById('cold-temperature').value;
        const conductivity = document.getElementById('thermal-conductivity').value;
        
        document.getElementById('hot-temp-value').textContent = hot;
        document.getElementById('cold-temp-value').textContent = cold;
        document.getElementById('conductivity-value').textContent = conductivity;
        
        updateHeatMeasurements(hot, cold, conductivity, time);
    };
    
    function updateHeatMeasurements(hot, cold, k, time) {
        const heatFlow = k * (hot - cold);
        const tempGradient = (hot - cold) / 1.0;
        const avgTemp = (hot + cold) / 2;
        const heatTransferred = heatFlow * time;
        
        document.getElementById('heat-flow').textContent = heatFlow.toFixed(1) + ' W/m²';
        document.getElementById('temp-gradient').textContent = tempGradient.toFixed(1) + ' °C/m';
        document.getElementById('avg-temperature').textContent = avgTemp.toFixed(1) + ' °C';
        document.getElementById('heat-transferred').textContent = heatTransferred.toFixed(1) + ' J';
    }
    
    drawHeatTransfer();
}

function initRadioactivityAnimation() {
    const canvas = document.getElementById('radioactivity-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let nuclei = [];
    let decayedNuclei = [];
    let time = 0;
    
    function initializeNuclei() {
        nuclei = [];
        decayedNuclei = [];
        const count = parseInt(document.getElementById('initial-nuclei')?.value || 1000);
        
        for (let i = 0; i < count; i++) {
            nuclei.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 2
            });
        }
    }
    
    function drawRadioactivity() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const halfLife = parseFloat(document.getElementById('half-life')?.value || 10);
        const decayConstant = 0.693 / halfLife;
        const decayProb = decayConstant * 0.01;
        
        for (let i = nuclei.length - 1; i >= 0; i--) {
            if (Math.random() < decayProb) {
                const nucleus = nuclei.splice(i, 1)[0];
                decayedNuclei.push(nucleus);
            }
        }
        
        ctx.fillStyle = '#3B82F6';
        nuclei.forEach(nucleus => {
            ctx.beginPath();
            ctx.arc(nucleus.x, nucleus.y, nucleus.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        ctx.fillStyle = '#EF4444';
        decayedNuclei.forEach(nucleus => {
            ctx.beginPath();
            ctx.arc(nucleus.x, nucleus.y, nucleus.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        updateRadioactivityMeasurements(nuclei.length, decayedNuclei.length, decayConstant);
        time += 0.01;
    }
    
    window.startRadioactivityAnimation = function() {
        if (radioactivityAnimation) return;
        radioactivityAnimation = setInterval(drawRadioactivity, 50);
    };
    
    window.pauseRadioactivityAnimation = function() {
        if (radioactivityAnimation) {
            clearInterval(radioactivityAnimation);
            radioactivityAnimation = null;
        }
    };
    
    window.resetRadioactivityAnimation = function() {
        pauseRadioactivityAnimation();
        time = 0;
        initializeNuclei();
        drawRadioactivity();
    };
    
    window.updateRadioactivityParams = function() {
        const initial = document.getElementById('initial-nuclei').value;
        const halfLife = document.getElementById('half-life').value;
        
        document.getElementById('initial-nuclei-value').textContent = initial;
        document.getElementById('half-life-value').textContent = halfLife;
        
        const decayConstant = 0.693 / halfLife;
        document.getElementById('decay-constant').textContent = decayConstant.toFixed(4) + ' yr⁻¹';
        
        resetRadioactivityAnimation();
    };
    
    function updateRadioactivityMeasurements(remaining, decayed, decayConstant) {
        const initial = parseInt(document.getElementById('initial-nuclei')?.value || 1000);
        const activity = remaining * decayConstant;
        
        document.getElementById('remaining-nuclei').textContent = remaining;
        document.getElementById('decayed-nuclei').textContent = decayed;
        document.getElementById('activity').textContent = activity.toFixed(1);
    }
    
    initializeNuclei();
    drawRadioactivity();
}

function initStandingWavesAnimation() {
    const canvas = document.getElementById('standing-waves-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    function drawStandingWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const frequency = parseFloat(document.getElementById('wave-frequency')?.value || 440);
        const amplitude = parseFloat(document.getElementById('wave-amplitude')?.value || 50);
        const waveSpeed = parseFloat(document.getElementById('wave-speed')?.value || 340);
        
        const wavelength = waveSpeed / frequency;
        const angularFreq = 2 * Math.PI * frequency;
        const waveNumber = 2 * Math.PI / wavelength;
        
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
            const xPos = x / canvas.width * 2;
            const y = canvas.height / 2 + amplitude * Math.sin(waveNumber * xPos) * Math.cos(angularFreq * time);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        ctx.fillStyle = '#EF4444';
        for (let i = 0; i <= 4; i++) {
            const nodeX = (i / 4) * canvas.width;
            ctx.beginPath();
            ctx.arc(nodeX, canvas.height / 2, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.fillStyle = '#10B981';
        for (let i = 0; i < 4; i++) {
            const antinodeX = ((i + 0.5) / 4) * canvas.width;
            const antinodeY = canvas.height / 2 + amplitude * Math.cos(angularFreq * time);
            ctx.beginPath();
            ctx.arc(antinodeX, antinodeY, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        updateStandingWavesMeasurements(frequency, amplitude, waveSpeed);
        time += 0.01;
    }
    
    window.startStandingWavesAnimation = function() {
        if (standingWavesAnimation) return;
        standingWavesAnimation = setInterval(drawStandingWaves, 50);
    };
    
    window.pauseStandingWavesAnimation = function() {
        if (standingWavesAnimation) {
            clearInterval(standingWavesAnimation);
            standingWavesAnimation = null;
        }
    };
    
    window.resetStandingWavesAnimation = function() {
        pauseStandingWavesAnimation();
        time = 0;
        drawStandingWaves();
    };
    
    window.updateStandingWavesParams = function() {
        const frequency = document.getElementById('wave-frequency').value;
        const amplitude = document.getElementById('wave-amplitude').value;
        const speed = document.getElementById('wave-speed').value;
        
        document.getElementById('frequency-value').textContent = frequency;
        document.getElementById('amplitude-value').textContent = amplitude;
        document.getElementById('wave-speed-value').textContent = speed;
        
        updateStandingWavesMeasurements(frequency, amplitude, speed);
    };
    
    function updateStandingWavesMeasurements(frequency, amplitude, waveSpeed) {
        const wavelength = waveSpeed / frequency;
        const period = 1 / frequency;
        const angularFreq = 2 * Math.PI * frequency;
        
        document.getElementById('wavelength').textContent = wavelength.toFixed(2) + ' m';
        document.getElementById('period').textContent = (period * 1000).toFixed(2) + ' ms';
        document.getElementById('angular-freq').textContent = angularFreq.toFixed(0) + ' rad/s';
        document.getElementById('nodes-count').textContent = '5';
    }
    
    drawStandingWaves();
}

function initDopplerAnimation() {
    const canvas = document.getElementById('doppler-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let sourceX = 50;
    let waves = [];
    let time = 0;
    
    function drawDoppler() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const sourceVelocity = parseFloat(document.getElementById('source-velocity')?.value || 20);
        const sourceFrequency = parseFloat(document.getElementById('source-frequency')?.value || 440);
        const soundSpeed = parseFloat(document.getElementById('sound-speed')?.value || 340);
        
        sourceX += sourceVelocity * 0.1;
        if (sourceX > canvas.width) sourceX = 0;
        
        if (time % (1 / sourceFrequency * 100) < 1) {
            waves.push({
                x: sourceX,
                y: canvas.height / 2,
                radius: 0,
                maxRadius: 100
            });
        }
        
        waves = waves.filter(wave => {
            wave.radius += soundSpeed * 0.01;
            
            if (wave.radius < wave.maxRadius) {
                const alpha = 1 - (wave.radius / wave.maxRadius);
                ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.radius, 0, 2 * Math.PI);
                ctx.stroke();
                return true;
            }
            return false;
        });
        
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(sourceX, canvas.height / 2, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sourceX, canvas.height / 2);
        ctx.lineTo(sourceX + sourceVelocity, canvas.height / 2);
        ctx.stroke();
        
        updateDopplerMeasurements(sourceVelocity, sourceFrequency, soundSpeed);
        time += 1;
    }
    
    window.startDopplerAnimation = function() {
        if (dopplerAnimation) return;
        dopplerAnimation = setInterval(drawDoppler, 50);
    };
    
    window.pauseDopplerAnimation = function() {
        if (dopplerAnimation) {
            clearInterval(dopplerAnimation);
            dopplerAnimation = null;
        }
    };
    
    window.resetDopplerAnimation = function() {
        pauseDopplerAnimation();
        sourceX = 50;
        waves = [];
        time = 0;
        drawDoppler();
    };
    
    window.updateDopplerParams = function() {
        const velocity = document.getElementById('source-velocity').value;
        const frequency = document.getElementById('source-frequency').value;
        const speed = document.getElementById('sound-speed').value;
        
        document.getElementById('source-velocity-value').textContent = velocity;
        document.getElementById('source-freq-value').textContent = frequency;
        document.getElementById('sound-speed-value').textContent = speed;
        
        updateDopplerMeasurements(velocity, frequency, speed);
    };
    
    function updateDopplerMeasurements(sourceVel, sourceFreq, soundSpeed) {
        const observedFreq = sourceFreq * (soundSpeed / (soundSpeed - sourceVel));
        const freqShift = observedFreq - sourceFreq;
        const machNumber = sourceVel / soundSpeed;
        const wavelengthChange = (soundSpeed / observedFreq) - (soundSpeed / sourceFreq);
        
        document.getElementById('observed-freq').textContent = observedFreq.toFixed(1) + ' Hz';
        document.getElementById('freq-shift').textContent = (freqShift >= 0 ? '+' : '') + freqShift.toFixed(1) + ' Hz';
        document.getElementById('mach-number').textContent = machNumber.toFixed(3);
        document.getElementById('wavelength-change').textContent = wavelengthChange.toFixed(3) + ' m';
    }
    
    drawDoppler();
}

// Life Skills Lab Functions
const lifeSkillsModules = {
    financial: {
        title: "Financial Management",
        icon: "fa-wallet",
        color: "green",
        lessons: [
            {
                id: "budget-basics",
                title: "Budget Basics",
                duration: "15 min",
                difficulty: "Beginner",
                content: {
                    video: "Learn how to create a simple monthly budget",
                    steps: [
                        "Track your income (pocket money, part-time job, etc.)",
                        "List all your expenses (snacks, transport, entertainment)",
                        "Categorize expenses into needs and wants",
                        "Set savings goals (at least 20% of income)",
                        "Review and adjust your budget weekly"
                    ],
                    examples: [
                        "Monthly allowance: ₹2000",
                        "Needs: ₹1200 (transport, food, study materials)",
                        "Wants: ₹400 (movies, games, shopping)",
                        "Savings: ₹400 (20% for future goals)"
                    ],
                    exercise: "Create your own monthly budget with your actual income and expenses"
                }
            },
            {
                id: "upi-digital-payments",
                title: "UPI & Digital Payments",
                duration: "20 min",
                difficulty: "Beginner",
                content: {
                    video: "Master UPI apps and safe digital transactions",
                    steps: [
                        "Install a trusted UPI app (PhonePe, GPay, PayTM)",
                        "Link your bank account securely",
                        "Set a strong UPI PIN",
                        "Start with small transactions",
                        "Always verify recipient details before paying"
                    ],
                    examples: [
                        "Scanning QR codes at shops",
                        "Sending money to friends",
                        "Paying bills online",
                        "Recharging mobile/data"
                    ],
                    exercise: "Practice sending ₹10 to a friend and getting it back"
                }
            },
            {
                id: "avoiding-scams",
                title: "Avoiding Financial Scams",
                duration: "25 min",
                difficulty: "Intermediate",
                content: {
                    video: "Identify and protect yourself from common scams",
                    steps: [
                        "Never share OTP or passwords with anyone",
                        "Verify unknown numbers before sharing info",
                        "Don't click suspicious links in messages",
                        "Use official websites for payments",
                        "Report scam attempts to parents/police"
                    ],
                    examples: [
                        "Fake job offers asking for payment",
                        "Lottery winning messages",
                        "Bank account update requests",
                        "Online shopping frauds"
                    ],
                    exercise: "Identify 3 red flags in sample scam messages"
                }
            }
        ]
    },
    digital: {
        title: "Digital Essentials",
        icon: "fa-laptop",
        color: "blue",
        lessons: [
            {
                id: "online-forms",
                title: "Filling Online Forms",
                duration: "20 min",
                difficulty: "Beginner",
                content: {
                    video: "Learn to fill applications, registrations, and forms correctly",
                    steps: [
                        "Read all instructions carefully",
                        "Keep necessary documents ready",
                        "Fill mandatory fields first",
                        "Double-check information before submitting",
                        "Save confirmation numbers/references"
                    ],
                    examples: [
                        "School admission forms",
                        "Scholarship applications",
                        "Competition registrations",
                        "Online exam forms"
                    ],
                    exercise: "Fill a sample scholarship application form"
                }
            },
            {
                id: "ticket-booking",
                title: "Online Ticket Booking",
                duration: "25 min",
                difficulty: "Beginner",
                content: {
                    video: "Book train, bus, movie tickets online safely",
                    steps: [
                        "Choose a trusted booking platform",
                        "Compare prices and timings",
                        "Enter correct passenger details",
                        "Select payment method carefully",
                        "Save e-tickets and booking references"
                    ],
                    examples: [
                        "IRCTC train booking",
                        "RedBus bus tickets",
                        "Movie ticket bookings",
                        "Flight reservations"
                    ],
                    exercise: "Practice booking a mock movie ticket"
                }
            }
        ]
    },
    communication: {
        title: "Communication Skills",
        icon: "fa-comments",
        color: "purple",
        lessons: [
            {
                id: "public-speaking",
                title: "Confident Public Speaking",
                duration: "30 min",
                difficulty: "Intermediate",
                content: {
                    video: "Overcome fear and speak confidently in front of others",
                    steps: [
                        "Prepare your content thoroughly",
                        "Practice in front of a mirror",
                        "Start with small groups",
                        "Maintain eye contact",
                        "Use simple, clear language"
                    ],
                    examples: [
                        "Class presentations",
                        "Assembly speeches",
                        "Debate competitions",
                        "Group discussions"
                    ],
                    exercise: "Record a 2-minute self-introduction video"
                }
            },
            {
                id: "email-writing",
                title: "Professional Email Writing",
                duration: "25 min",
                difficulty: "Intermediate",
                content: {
                    video: "Write effective emails for teachers, applications, and formal communication",
                    steps: [
                        "Use a clear subject line",
                        "Start with proper greeting",
                        "Be concise and to the point",
                        "Check spelling and grammar",
                        "End with proper closing and signature"
                    ],
                    examples: [
                        "Email to teacher about doubt",
                        "Application for internship",
                        "Thank you email",
                        "Request for information"
                    ],
                    exercise: "Write a professional email to a teacher asking for guidance"
                }
            }
        ]
    },
    coding: {
        title: "Coding for Kids",
        icon: "fa-code",
        color: "orange",
        lessons: [
            {
                id: "programming-basics",
                title: "Programming Fundamentals",
                duration: "40 min",
                difficulty: "Beginner",
                content: {
                    video: "Understand basic programming concepts",
                    steps: [
                        "Learn what algorithms are",
                        "Understand variables and data types",
                        "Practice basic logic building",
                        "Try simple coding exercises",
                        "Use block-based coding platforms first"
                    ],
                    examples: [
                        "Making a calculator",
                        "Creating simple games",
                        "Solving puzzles with code",
                        "Building animations"
                    ],
                    exercise: "Complete a simple coding challenge on Scratch or Code.org"
                }
            }
        ]
    },
    bargaining: {
        title: "Bargaining & Negotiation",
        icon: "fa-handshake",
        color: "yellow",
        lessons: [
            {
                id: "smart-bargaining",
                title: "Polite Bargaining Techniques",
                duration: "20 min",
                difficulty: "Beginner",
                content: {
                    video: "Learn to negotiate prices respectfully and effectively",
                    steps: [
                        "Research market prices beforehand",
                        "Be polite and respectful to sellers",
                        "Start with 70-80% of asking price",
                        "Bundle multiple items for better deals",
                        "Know when to walk away"
                    ],
                    examples: [
                        "Local market shopping",
                        "Book negotiations",
                        "Service provider pricing",
                        "Second-hand purchases"
                    ],
                    exercise: "Role-play a bargaining scenario with a friend"
                }
            }
        ]
    },
    career: {
        title: "Career Exploration Hub",
        icon: "fa-rocket",
        color: "indigo",
        lessons: [
            {
                id: "career-fit-test",
                title: "AI Career Fit Test",
                duration: "25 min",
                difficulty: "Beginner",
                content: {
                    video: "Discover your perfect career match with AI analysis",
                    steps: [
                        "Take personality assessment test",
                        "Evaluate your strengths and interests",
                        "Analyze work style preferences",
                        "Get AI-powered career recommendations",
                        "Receive personalized roadmap"
                    ],
                    examples: [
                        "Personality type analysis",
                        "Interest inventory results",
                        "Skill gap identification",
                        "Career compatibility scores"
                    ],
                    exercise: "Complete the comprehensive AI career assessment"
                }
            },
            {
                id: "career-categories",
                title: "Explore Career Categories",
                duration: "30 min",
                difficulty: "Beginner",
                content: {
                    video: "Discover 10 major career paths with detailed insights",
                    steps: [
                        "Browse government & civil services careers",
                        "Explore engineering & technology options",
                        "Learn about medical & healthcare fields",
                        "Discover creative & arts careers",
                        "Understand business & entrepreneurship"
                    ],
                    examples: [
                        "IAS/IPS civil services",
                        "Software engineering",
                        "Doctor/nursing careers",
                        "Design & animation",
                        "Startup entrepreneurship"
                    ],
                    exercise: "Research 3 career paths that interest you most"
                }
            }
        ]
    }
};

function openLifeSkillsModule(moduleId) {
    const module = lifeSkillsModules[moduleId];
    if (!module) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-${module.color}-500 to-${module.color}-600 rounded-full flex items-center justify-center">
                        <i class="fas ${module.icon} text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">${module.title}</h2>
                        <p class="text-gray-600">${module.lessons.length} lessons available</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Life Skills
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <div class="grid md:grid-cols-2 gap-4">
                    ${module.lessons.map(lesson => `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" onclick="openLifeSkillsLesson('${moduleId}', '${lesson.id}')">
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <h3 class="font-semibold text-gray-800">${lesson.title}</h3>
                                    <div class="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                        <span><i class="fas fa-clock mr-1"></i>${lesson.duration}</span>
                                        <span class="px-2 py-1 bg-${lesson.difficulty === 'Beginner' ? 'green' : lesson.difficulty === 'Intermediate' ? 'yellow' : 'red'}-100 text-${lesson.difficulty === 'Beginner' ? 'green' : lesson.difficulty === 'Intermediate' ? 'yellow' : 'red'}-800 rounded-full text-xs">
                                            ${lesson.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <i class="fas fa-play-circle text-${module.color}-500 text-xl"></i>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">${lesson.content.video}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs bg-${module.color}-100 text-${module.color}-800 px-2 py-1 rounded-full">
                                    <i class="fas fa-video mr-1"></i>Video Lesson
                                </span>
                                <i class="fas fa-arrow-right text-${module.color}-500"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openLifeSkillsLesson(moduleId, lessonId) {
    const module = lifeSkillsModules[moduleId];
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${lesson.title}</h2>
                    <div class="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <span><i class="fas fa-clock mr-1"></i>${lesson.duration}</span>
                        <span class="px-2 py-1 bg-${lesson.difficulty === 'Beginner' ? 'green' : lesson.difficulty === 'Intermediate' ? 'yellow' : 'red'}-100 text-${lesson.difficulty === 'Beginner' ? 'green' : lesson.difficulty === 'Intermediate' ? 'yellow' : 'red'}-800 rounded-full text-xs">
                            ${lesson.difficulty}
                        </span>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="this.closest('.fixed').remove(); openLifeSkillsModule('${moduleId}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Module
                    </button>
                    <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center">
                        <i class="fas fa-home mr-2"></i>Life Skills
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <div class="bg-gray-100 rounded-lg p-6 mb-6">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="w-16 h-16 bg-${module.color}-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-play text-white text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold">${lesson.content.video}</h3>
                            <p class="text-gray-600">Interactive video lesson</p>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-6">
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Steps to Follow</h3>
                        <div class="space-y-2">
                            ${lesson.content.steps.map((step, index) => `
                                <div class="flex items-start space-x-3 bg-blue-50 p-3 rounded">
                                    <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">${index + 1}</span>
                                    <p class="text-gray-800">${step}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Examples</h3>
                        <div class="grid grid-cols-2 gap-3">
                            ${lesson.content.examples.map(example => `
                                <div class="bg-green-50 p-3 rounded text-sm">
                                    <p class="text-gray-800">${example}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Practice Exercise</h3>
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p class="text-yellow-800">${lesson.content.exercise}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
