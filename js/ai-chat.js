// ============================================
// AI CHAT MODULE
// Handles AI chat functionality and responses
// ============================================

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Get AI response
    getAIResponse(message);
}

function askQuickQuestion(question) {
    const input = document.getElementById('user-input');
    input.value = question;
    sendMessage();
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message flex items-start space-x-3';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user text-white text-sm"></i>
            </div>
            <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 max-w-md">
                <p class="text-gray-800">${message}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot text-white text-sm"></i>
            </div>
            <div class="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 max-w-md">
                <p class="text-gray-800">${message}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getAIResponse(message) {
    // Show typing indicator
    addMessage('Thinking...', 'ai');
    
    try {
        let response;
        if (useRealAI && aiApiKey) {
            response = await getRealAIResponse(message);
        } else {
            response = await mockAIResponse(message);
        }
        
        // Remove typing indicator and add real response
        const lastMessage = document.querySelector('.chat-message:last-child');
        lastMessage.remove();
        
        addMessage(response, 'ai');
    } catch (error) {
        // Remove typing indicator
        const lastMessage = document.querySelector('.chat-message:last-child');
        lastMessage.remove();
        
        addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

async function getRealAIResponse(message) {
    const systemPrompt = `You are an educational AI assistant for the Bharat Education Portal. You help students with Physics, Chemistry, Biology, Mathematics, and general study topics. 

Guidelines:
- Provide clear, educational explanations
- Solve math problems step-by-step when asked
- Be encouraging and supportive
- Keep responses appropriate for students
- For complex math problems, show the working process
- If you don't know something, admit it and suggest resources

Student question: ${message}`;

    const response = await fetch(aiApiEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${aiApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

function configureAI() {
    const apiKey = prompt('Enter your AI API Key (OpenAI or compatible):');
    if (apiKey) {
        aiApiKey = apiKey;
        useRealAI = true;
        updateAIStatus('AI API configured! Full features enabled.', 'success');
        addMessage('AI API configured successfully! I can now provide intelligent responses and solve complex math problems.', 'ai');
    } else {
        useRealAI = false;
        updateAIStatus('Using demo mode. Click "Configure AI" to enable full features.', 'demo');
        addMessage('Using demo mode. To enable full AI features including complex math problem solving, please configure your API key.', 'ai');
    }
}

function updateAIStatus(message, type) {
    const statusElement = document.getElementById('ai-status');
    if (statusElement) {
        statusElement.textContent = message;
        if (type === 'success') {
            statusElement.className = 'text-sm text-green-600 font-semibold';
        } else {
            statusElement.className = 'text-sm text-gray-500';
        }
    }
}

async function mockAIResponse(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = message.toLowerCase();
    
    // Newton's Laws
    if (lowerMessage.includes('newton') && lowerMessage.includes('law')) {
        return "Newton's Laws of Motion:\n\n1️⃣ **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n2️⃣ **Second Law**: F = ma (Force equals mass times acceleration). The acceleration of an object is directly proportional to the net force acting on it.\n\n3️⃣ **Third Law**: For every action, there is an equal and opposite reaction.\n\nWhich law would you like me to explain in more detail?";
    }
    
    if (lowerMessage.includes('third law') || (lowerMessage.includes('action') && lowerMessage.includes('reaction'))) {
        return "🍎 **Newton's Third Law Explained:**\n\n**Statement:** For every action, there is an equal and opposite reaction.\n\n**Meaning:**\n• When object A exerts a force on object B\n• Object B exerts an equal force in the opposite direction on object A\n• Forces always occur in pairs\n• The forces are equal in magnitude but opposite in direction\n\n**Examples:**\n• **Rocket**: Pushes gas down → Gas pushes rocket up\n• **Walking**: Push foot backward → Ground pushes foot forward\n• **Swimming**: Push water back → Water pushes you forward\n• **Jumping**: Push ground down → Ground pushes you up\n\n**Key Point:** The forces act on different objects, so they don't cancel out!";
    }
    
    // Photosynthesis
    if (lowerMessage.includes('photosynthesis')) {
        return "🌱 **Photosynthesis Explained:**\n\nPhotosynthesis is the process by which plants convert light energy into chemical energy.\n\n**Equation:** 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**Steps:**\n1️⃣ Light-dependent reactions (capture light energy)\n2️⃣ Calvin cycle (produce glucose)\n3️⃣ Release oxygen as byproduct\n\n**Importance:** Produces oxygen we breathe and forms the base of most food chains!";
    }
    
    // Chemical equations
    if (lowerMessage.includes('balance') && lowerMessage.includes('equation')) {
        return handleChemicalEquation(message);
    }
    
    if (lowerMessage.includes('h2') && lowerMessage.includes('o2') && lowerMessage.includes('h2o')) {
        return handleChemicalEquation(message);
    }
    
    // Derivatives
    if (lowerMessage.includes('derivative') || lowerMessage.includes('differentiation')) {
        return "📐 **Derivatives in Calculus:**\n\nA derivative measures the rate of change of a function.\n\n**Basic Rules:**\n• Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\n• Product Rule: d/dx(uv) = u'v + uv'\n• Chain Rule: d/dx(f(g(x))) = f'(g(x))·g'(x)\n\n**Example:** If f(x) = x² + 3x - 2\nThen f'(x) = 2x + 3\n\nThe derivative tells us the slope of the tangent line at any point!";
    }
    
    // Atoms
    if (lowerMessage.includes('atom')) {
        return "⚛️ **Atoms Explained:**\n\nAn atom is the basic unit of matter consisting of:\n\n**Structure:**\n• **Nucleus**: Contains protons (+) and neutrons (neutral)\n• **Electrons**: Negatively charged particles orbiting the nucleus\n\n**Key Facts:**\n• Protons determine the element (atomic number)\n• Neutrons affect mass but not charge\n• Electrons determine chemical behavior\n• Most of an atom is empty space!\n\n**Example:** Carbon has 6 protons, 6 neutrons, and 6 electrons";
    }
    
    // Cells
    if (lowerMessage.includes('cell')) {
        return "🔬 **Cells Explained:**\n\nCells are the basic building blocks of life.\n\n**Types:**\n• **Prokaryotic**: No nucleus (bacteria)\n• **Eukaryotic**: Has nucleus (plants, animals, fungi)\n\n**Plant Cell Parts:**\n• Cell wall: Structural support\n• Chloroplasts: Photosynthesis\n• Large vacuole: Water storage\n\n**Animal Cell Parts:**\n• No cell wall\n• Small vacuoles\n• Centrioles for cell division\n\n**Common to Both:**\n• Nucleus: DNA storage\n• Mitochondria: Energy production\n• Cytoplasm: Cell contents";
    }
    
    // Energy
    if (lowerMessage.includes('energy')) {
        return "⚡ **Energy Explained:**\n\nEnergy is the capacity to do work or cause change.\n\n**Forms of Energy:**\n• **Kinetic**: Energy of motion (moving objects)\n• **Potential**: Stored energy (position, chemical bonds)\n• **Thermal**: Heat energy\n• **Electrical**: Movement of electrons\n• **Chemical**: Stored in chemical bonds\n• **Nuclear**: Stored in atomic nuclei\n\n**Conservation of Energy:**\nEnergy cannot be created or destroyed, only transformed from one form to another.";
    }
    
    // Math equations
    if (lowerMessage.includes('solve') && (lowerMessage.includes('x') || lowerMessage.includes('equation'))) {
        return solveMathEquation(message);
    }
    
    if (lowerMessage.includes('2x') && lowerMessage.includes('5x') && lowerMessage.includes('3')) {
        return solveMathEquation(message);
    }
    
    // Question patterns
    const questionPatterns = [
        'what is', 'define', 'explain', 'what are', 'what does', 'what do',
        'how does', 'how do', 'how is', 'how are', 'how can',
        'why is', 'why are', 'why do', 'why does',
        'solve', 'calculate', 'find', 'determine', 'compute'
    ];
    
    const isQuestion = questionPatterns.some(pattern => lowerMessage.includes(pattern));
    
    if (isQuestion) {
        if (lowerMessage.includes('what is') || lowerMessage.includes('define') || lowerMessage.includes('explain')) {
            return handleExplanationRequest(message);
        }
        
        if (lowerMessage.includes('solve') || lowerMessage.includes('calculate') || lowerMessage.includes('find')) {
            return handleProblemSolving(message);
        }
        
        if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('do') || lowerMessage.includes('does'))) {
            return handleHowItWorks(message);
        }
        
        if (lowerMessage.includes('why') || lowerMessage.includes('because')) {
            return handleWhyQuestion(message);
        }
    }
    
    // Subject-specific responses
    if (lowerMessage.includes('physics') || lowerMessage.includes('force') || lowerMessage.includes('motion') || lowerMessage.includes('energy')) {
        return "⚛️ **Physics Help:**\n\nI can help you with:\n• **Mechanics**: Newton's laws, motion, forces, energy\n• **Waves**: Sound, light, electromagnetic radiation\n• **Thermodynamics**: Heat, temperature, energy transfer\n• **Electricity**: Circuits, charges, magnetism\n• **Modern Physics**: Quantum mechanics, relativity\n\nWhat specific physics concept or problem can I help you solve?";
    }
    
    if (lowerMessage.includes('chemistry') || lowerMessage.includes('chemical') || lowerMessage.includes('atom') || lowerMessage.includes('molecule')) {
        return "🧪 **Chemistry Assistance:**\n\nI can help with:\n• **Atomic Structure**: Protons, neutrons, electrons, isotopes\n• **Chemical Bonding**: Ionic, covalent, metallic bonds\n• **Reactions**: Balancing equations, types of reactions\n• **Solutions**: Concentration, pH, acids and bases\n• **Organic Chemistry**: Hydrocarbons, functional groups\n• **Periodic Trends**: Properties across periods and groups\n\nWhat chemistry topic do you need help with?";
    }
    
    if (lowerMessage.includes('biology') || lowerMessage.includes('cell') || lowerMessage.includes('gene') || lowerMessage.includes('dna')) {
        return "🧬 **Biology Support:**\n\nI can assist with:\n• **Cell Biology**: Structure, organelles, cell division\n• **Genetics**: DNA, RNA, inheritance, mutations\n• **Evolution**: Natural selection, adaptation, speciation\n• **Ecology**: Ecosystems, food chains, biodiversity\n• **Human Biology**: Systems, organs, homeostasis\n\nWhat biological concept would you like to explore?";
    }
    
    if (lowerMessage.includes('math') || lowerMessage.includes('algebra') || lowerMessage.includes('geometry') || lowerMessage.includes('calculus')) {
        return "📊 **Mathematics Help:**\n\nI can solve problems in:\n• **Algebra**: Equations, functions, polynomials\n• **Geometry**: Shapes, angles, area, volume\n• **Trigonometry**: Sine, cosine, tangent, identities\n• **Calculus**: Derivatives, integrals, limits\n• **Statistics**: Probability, data analysis, graphs\n\nGive me a specific math problem and I'll solve it step-by-step!";
    }
    
    // Study help
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('prepare') || lowerMessage.includes('exam')) {
        return "📚 **Study Strategies:**\n\n**Effective Learning Techniques:**\n1️⃣ **Active Recall**: Test yourself instead of re-reading\n2️⃣ **Spaced Repetition**: Review material at increasing intervals\n3️⃣ **Practice Problems**: Apply concepts to solve problems\n4️⃣ **Teach Others**: Explain concepts to someone else\n\n**Exam Preparation:**\n• Start early and create a schedule\n• Focus on understanding, not memorization\n• Practice with past papers\n• Get adequate sleep before exams\n\nWhat subject are you preparing for?";
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "👋 Hello! I'm your AI learning assistant, ready to help with Physics, Chemistry, Biology, Mathematics, and study strategies!\n\n**What can I help you with today?**\n• Ask me to explain concepts\n• Solve math or science problems\n• Help with homework questions\n• Study for exams\n\nWhat would you like to learn about?";
    }
    
    // Default response
    return "🎓 **Your AI Learning Assistant**\n\nI'm here to help with:\n\n📚 **Subjects:** Physics, Chemistry, Biology, Mathematics\n🔬 **Lab Help:** Virtual experiments and simulations\n📝 **Study Tips:** Effective learning strategies\n✏️ **Problem Solving:** Step-by-step solutions\n\n**How to ask me:**\n• \"Explain [concept]\" - for detailed explanations\n• \"Solve [problem]\" - for step-by-step solutions\n• \"How does [process] work?\" - for process explanations\n• \"Why [phenomenon]?\" - for understanding reasons\n\n**Example questions:**\n• \"Explain Newton's third law\"\n• \"Solve: 2x² + 5x - 3 = 0\"\n• \"How does photosynthesis work?\"\n• \"Balance: H₂ + O₂ → H₂O\"\n\nWhat would you like to learn about today?";
}

function handleExplanationRequest(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('atom')) {
        return "⚛️ **Atoms Explained:**\n\nAn atom is the basic unit of matter consisting of:\n\n**Structure:**\n• **Nucleus**: Contains protons (+) and neutrons (neutral)\n• **Electrons**: Negatively charged particles orbiting the nucleus\n\n**Key Facts:**\n• Protons determine the element (atomic number)\n• Neutrons affect mass but not charge\n• Electrons determine chemical behavior\n• Most of an atom is empty space!";
    }
    
    if (lowerMessage.includes('cell')) {
        return "🔬 **Cells Explained:**\n\nCells are the basic building blocks of life.\n\n**Types:**\n• **Prokaryotic**: No nucleus (bacteria)\n• **Eukaryotic**: Has nucleus (plants, animals, fungi)";
    }
    
    if (lowerMessage.includes('energy')) {
        return "⚡ **Energy Explained:**\n\nEnergy is the capacity to do work or cause change.\n\n**Forms of Energy:**\n• **Kinetic**: Energy of motion\n• **Potential**: Stored energy\n• **Thermal**: Heat energy\n• **Electrical**: Movement of electrons\n• **Chemical**: Stored in chemical bonds\n• **Nuclear**: Stored in atomic nuclei";
    }
    
    return "I'd be happy to explain that! Could you be more specific about what concept you'd like me to explain?";
}

function handleProblemSolving(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('equation') || lowerMessage.includes('x') || lowerMessage.includes('=')) {
        return solveMathEquation(message);
    }
    
    if (lowerMessage.includes('force') || lowerMessage.includes('acceleration') || lowerMessage.includes('mass')) {
        return "🔬 **Physics Problem Solving:**\n\n**Key Formulas:**\n• Force: F = ma\n• Weight: W = mg (g = 9.8 m/s²)\n• Momentum: p = mv\n• Kinetic Energy: KE = ½mv²\n• Potential Energy: PE = mgh\n\nPlease provide the specific numbers and what you need to find!";
    }
    
    return "I can help solve problems step-by-step! Please provide:\n\n• **Math Problems**: Give me the equation or numbers\n• **Physics Problems**: Include given values and what to find\n• **Chemistry Problems**: Show the reaction or concentrations";
}

function handleHowItWorks(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('respiration')) {
        return "🫁 **Cellular Respiration:**\n\n**Process:** Converting glucose to ATP (energy)\n\n**Equation:** C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP\n\n**Steps:**\n1️⃣ **Glycolysis**: Glucose → Pyruvate (2 ATP)\n2️⃣ **Krebs Cycle**: Pyruvate → CO₂ (2 ATP)\n3️⃣ **Electron Transport**: Oxygen → Water (32 ATP)\n\n**Total**: ~36 ATP per glucose molecule";
    }
    
    if (lowerMessage.includes('nervous system')) {
        return "🧠 **How the Nervous System Works:**\n\n**Basic Process:**\n1️⃣ **Stimulus** detected by receptors\n2️⃣ **Signal** travels through sensory neurons\n3️⃣ **Processing** in brain/spinal cord\n4️⃣ **Response** sent via motor neurons\n5️⃣ **Action** by muscles/glands";
    }
    
    return "I can explain how things work! Please specify what process or system you'd like me to explain.";
}

function handleWhyQuestion(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sky') && lowerMessage.includes('blue')) {
        return "🌍 **Why the Sky is Blue:**\n\n**Rayleigh Scattering:**\n1️⃣ Sunlight contains all colors (white light)\n2️⃣ Blue light has shorter wavelength (~450nm)\n3️⃣ Short wavelengths scatter more than long ones\n4️⃣ Blue light scatters in all directions\n5️⃣ We see blue from all directions";
    }
    
    if (lowerMessage.includes('gravity')) {
        return "🌍 **Why Gravity Exists:**\n\n**Einstein's Explanation:**\nGravity isn't a force, but the curvature of spacetime!\n\n**How it works:**\n1️⃣ Mass/energy warps the fabric of spacetime\n2️⃣ Objects follow the straightest path through curved space\n3️⃣ This curved path appears as \"gravity\" to us\n4️⃣ More mass = more curvature = stronger gravity";
    }
    
    return "I love explaining \"why\" questions! Please tell me what phenomenon you're curious about.";
}

function handleChemicalEquation(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('h2') && lowerMessage.includes('o2') && lowerMessage.includes('h2o')) {
        return "⚗️ **Balancing: H₂ + O₂ → H₂O**\n\n**Step 1:** Count atoms on both sides\n• Left: H=2, O=2\n• Right: H=2, O=1\n\n**Step 2:** Balance oxygen first\n• Add coefficient 2 to H₂O: H₂ + O₂ → 2H₂O\n• Now: Left H=2, O=2 | Right H=4, O=2\n\n**Step 3:** Balance hydrogen\n• Add coefficient 2 to H₂: 2H₂ + O₂ → 2H₂O\n• Final: Left H=4, O=2 | Right H=4, O=2 ✅\n\n**Balanced Equation:** 2H₂ + O₂ → 2H₂O";
    }
    
    return "I can help balance chemical equations! Please provide the unbalanced equation.";
}

function solveMathEquation(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('2x') && lowerMessage.includes('5x') && lowerMessage.includes('3')) {
        return "📐 **Solving: 2x² + 5x - 3 = 0**\n\n**Method: Quadratic Formula**\nFor ax² + bx + c = 0, x = [-b ± √(b²-4ac)]/2a\n\n**Given:** a=2, b=5, c=-3\n\n**Step 1:** Calculate discriminant\nΔ = b² - 4ac = 5² - 4(2)(-3) = 25 + 24 = 49\n\n**Step 2:** Apply formula\nx = [-5 ± √49]/(2×2) = [-5 ± 7]/4\n\n**Step 3:** Find both solutions\nx₁ = (-5 + 7)/4 = 2/4 = 0.5\nx₂ = (-5 - 7)/4 = -12/4 = -3\n\n**Answer:** x = 0.5 or x = -3";
    }
    
    return "I can solve math equations step-by-step! Please provide the specific equation.";
}
