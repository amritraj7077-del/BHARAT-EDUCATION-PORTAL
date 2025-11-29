// Global variables
let currentSection = 'home';
let aiApiKey = ''; // User will need to set their API key
let aiApiEndpoint = 'https://api.openai.com/v1/chat/completions'; // OpenAI API endpoint
let useRealAI = false; // Toggle between mock and real AI
let chatHistory = [];

// Marketplace and Credit System
let userCredits = 500; // Starting credits
let marketplaceBooks = []; // Student listings
let myListings = []; // User's listings
let transactions = []; // Transaction history

// Community Chat System
let currentChatRoom = null;
let currentUser = {
    name: "Student User",
    avatar: "👨‍🎓",
    id: "student_" + Math.random().toString(36).substr(2, 9)
};

// Chat rooms data
const chatRooms = {
    general: {
        name: "General Discussion",
        description: "Open to all students",
        icon: "fa-comments",
        color: "blue",
        onlineCount: 12,
        messages: [
            {
                id: 1,
                user: "Rahul Sharma",
                avatar: "👨‍🎓",
                message: "Hey everyone! How's the preparation going?",
                timestamp: new Date(Date.now() - 3600000),
                isOwn: false
            },
            {
                id: 2,
                user: "Priya Patel",
                avatar: "👩‍🎓",
                message: "Great! Just finished the physics assignment. Anyone need help?",
                timestamp: new Date(Date.now() - 3000000),
                isOwn: false
            },
            {
                id: 3,
                user: "Amit Kumar",
                avatar: "👨‍🏫",
                message: "I'm stuck on calculus problems. Can someone explain derivatives?",
                timestamp: new Date(Date.now() - 1800000),
                isOwn: false
            }
        ]
    },
    study: {
        name: "Study Groups",
        description: "Collaborative learning",
        icon: "fa-book-open",
        color: "green",
        onlineCount: 8,
        messages: [
            {
                id: 1,
                user: "Neha Singh",
                avatar: "👩‍🎓",
                message: "Starting a study group for JEE preparation. Who's interested?",
                timestamp: new Date(Date.now() - 7200000),
                isOwn: false
            },
            {
                id: 2,
                user: "Vikram Reddy",
                avatar: "👨‍🎓",
                message: "Count me in! I need help with organic chemistry.",
                timestamp: new Date(Date.now() - 6000000),
                isOwn: false
            }
        ]
    },
    physics: {
        name: "Physics Help",
        description: "Get physics assistance",
        icon: "fa-atom",
        color: "purple",
        onlineCount: 5,
        messages: [
            {
                id: 1,
                user: "Dr. Sharma",
                avatar: "👨‍🏫",
                message: "Remember: F = ma is the foundation of mechanics!",
                timestamp: new Date(Date.now() - 5400000),
                isOwn: false
            },
            {
                id: 2,
                user: "Kavya Nair",
                avatar: "👩‍🎓",
                message: "Can someone explain quantum mechanics basics?",
                timestamp: new Date(Date.now() - 2400000),
                isOwn: false
            }
        ]
    },
    math: {
        name: "Mathematics",
        description: "Solve problems together",
        icon: "fa-calculator",
        color: "orange",
        onlineCount: 7,
        messages: [
            {
                id: 1,
                user: "Prof. Gupta",
                avatar: "👨‍🏫",
                message: "Practice makes perfect! Try solving 5 problems daily.",
                timestamp: new Date(Date.now() - 4800000),
                isOwn: false
            },
            {
                id: 2,
                user: "Arjun Mehta",
                avatar: "👨‍🎓",
                message: "Integration techniques are tricky. Any tips?",
                timestamp: new Date(Date.now() - 1200000),
                isOwn: false
            }
        ]
    }
};

// Initialize sample marketplace data
function initializeMarketplace() {
    marketplaceBooks = [
        {
            id: 101,
            title: "Physics for JEE Advanced",
            author: "H.C. Verma",
            category: "textbooks",
            condition: "good",
            price: 150,
            originalPrice: 450,
            seller: "Rahul Sharma",
            description: "Good condition, minimal highlighting, covers all JEE topics",
            contactMethod: "chat",
            listedDate: new Date('2024-01-15')
        },
        {
            id: 102,
            title: "Organic Chemistry Notes",
            author: "Self-prepared",
            category: "notes",
            condition: "new",
            price: 80,
            originalPrice: 0,
            seller: "Priya Patel",
            description: "Complete handwritten notes for 12th grade organic chemistry",
            contactMethod: "email",
            listedDate: new Date('2024-01-20')
        },
        {
            id: 103,
            title: "The Alchemist",
            author: "Paulo Coelho",
            category: "novels",
            condition: "fair",
            price: 50,
            originalPrice: 250,
            seller: "Amit Kumar",
            description: "Classic novel, slightly worn cover, readable condition",
            contactMethod: "phone",
            listedDate: new Date('2024-01-18')
        }
    ];
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('section-active');
        section.classList.add('section-hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('section-hidden');
    document.getElementById(sectionId).classList.add('section-active');
    
    currentSection = sectionId;
    
    // Initialize section-specific content
    if (sectionId === 'library') {
        loadBooks();
    } else if (sectionId === 'marketplace') {
        loadMarketplace();
    } else if (sectionId === 'profile') {
        loadProfile();
    } else if (sectionId === 'community') {
        loadCommunity();
    }
}

// AI Chat Functions
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

// Real AI API Integration
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

// API Configuration Function
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

// Update AI Status Display
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

// Mock AI Response (replace with actual API call)
async function mockAIResponse(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced keyword-based responses for demo
    const lowerMessage = message.toLowerCase();
    
    // Debug: Log the message to see what's being received
    console.log("AI received message:", message);
    console.log("Lowercase message:", lowerMessage);
    
    // Check for specific topics first (more specific checks)
    if (lowerMessage.includes('newton') && lowerMessage.includes('law')) {
        return "Newton's Laws of Motion:\n\n1️⃣ **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n2️⃣ **Second Law**: F = ma (Force equals mass times acceleration). The acceleration of an object is directly proportional to the net force acting on it.\n\n3️⃣ **Third Law**: For every action, there is an equal and opposite reaction.\n\nWhich law would you like me to explain in more detail?";
    }
    
    // Check for third law specifically
    if (lowerMessage.includes('third law') || lowerMessage.includes('action') && lowerMessage.includes('reaction')) {
        return "🍎 **Newton's Third Law Explained:**\n\n**Statement:** For every action, there is an equal and opposite reaction.\n\n**Meaning:**\n• When object A exerts a force on object B\n• Object B exerts an equal force in the opposite direction on object A\n• Forces always occur in pairs\n• The forces are equal in magnitude but opposite in direction\n\n**Examples:**\n• **Rocket**: Pushes gas down → Gas pushes rocket up\n• **Walking**: Push foot backward → Ground pushes foot forward\n• **Swimming**: Push water back → Water pushes you forward\n• **Jumping**: Push ground down → Ground pushes you up\n\n**Key Point:** The forces act on different objects, so they don't cancel out!\n\nClear explanation?";
    }
    
    if (lowerMessage.includes('photosynthesis')) {
        return "🌱 **Photosynthesis Explained:**\n\nPhotosynthesis is the process by which plants convert light energy into chemical energy.\n\n**Equation:** 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**Steps:**\n1️⃣ Light-dependent reactions (capture light energy)\n2️⃣ Calvin cycle (produce glucose)\n3️⃣ Release oxygen as byproduct\n\n**Importance:** Produces oxygen we breathe and forms the base of most food chains!\n\nNeed more details on any part?";
    }
    
    if (lowerMessage.includes('balance') && lowerMessage.includes('equation')) {
        return handleChemicalEquation(message);
    }
    
    // Check for chemical equation patterns
    if (lowerMessage.includes('h2') && lowerMessage.includes('o2') && lowerMessage.includes('h2o')) {
        return handleChemicalEquation(message);
    }
    
    if (lowerMessage.includes('derivative') || lowerMessage.includes('differentiation')) {
        return "📐 **Derivatives in Calculus:**\n\nA derivative measures the rate of change of a function.\n\n**Basic Rules:**\n• Power Rule: d/dx(xⁿ) = nxⁿ⁻¹\n• Product Rule: d/dx(uv) = u'v + uv'\n• Chain Rule: d/dx(f(g(x))) = f'(g(x))·g'(x)\n\n**Example:** If f(x) = x² + 3x - 2\nThen f'(x) = 2x + 3\n\nThe derivative tells us the slope of the tangent line at any point!\n\nWould you like me to solve a specific derivative problem?";
    }
    
    if (lowerMessage.includes('atom')) {
        return "⚛️ **Atoms Explained:**\n\nAn atom is the basic unit of matter consisting of:\n\n**Structure:**\n• **Nucleus**: Contains protons (+) and neutrons (neutral)\n• **Electrons**: Negatively charged particles orbiting the nucleus\n\n**Key Facts:**\n• Protons determine the element (atomic number)\n• Neutrons affect mass but not charge\n• Electrons determine chemical behavior\n• Most of an atom is empty space!\n\n**Example:** Carbon has 6 protons, 6 neutrons, and 6 electrons\n\nNeed more details about atomic structure?";
    }
    
    if (lowerMessage.includes('cell')) {
        return "🔬 **Cells Explained:**\n\nCells are the basic building blocks of life.\n\n**Types:**\n• **Prokaryotic**: No nucleus (bacteria)\n• **Eukaryotic**: Has nucleus (plants, animals, fungi)\n\n**Plant Cell Parts:**\n• Cell wall: Structural support\n• Chloroplasts: Photosynthesis\n• Large vacuole: Water storage\n\n**Animal Cell Parts:**\n• No cell wall\n• Small vacuoles\n• Centrioles for cell division\n\n**Common to Both:**\n• Nucleus: DNA storage\n• Mitochondria: Energy production\n• Cytoplasm: Cell contents\n\nWant to dive deeper into cell biology?";
    }
    
    if (lowerMessage.includes('energy')) {
        return "⚡ **Energy Explained:**\n\nEnergy is the capacity to do work or cause change.\n\n**Forms of Energy:**\n• **Kinetic**: Energy of motion (moving objects)\n• **Potential**: Stored energy (position, chemical bonds)\n• **Thermal**: Heat energy\n• **Electrical**: Movement of electrons\n• **Chemical**: Stored in chemical bonds\n• **Nuclear**: Stored in atomic nuclei\n\n**Conservation of Energy:**\nEnergy cannot be created or destroyed, only transformed from one form to another.\n\n**Examples:**\n• Falling object: Potential → Kinetic\n• Battery: Chemical → Electrical\n• Light bulb: Electrical → Light + Heat\n\nWhich energy form would you like to explore?";
    }
    
    // Check for math equation solving
    if (lowerMessage.includes('solve') && (lowerMessage.includes('x') || lowerMessage.includes('equation'))) {
        return solveMathEquation(message);
    }
    
    if (lowerMessage.includes('2x') && lowerMessage.includes('5x') && lowerMessage.includes('3')) {
        return solveMathEquation(message);
    }
    
    // Check for question patterns
    const questionPatterns = [
        'what is', 'define', 'explain', 'what are', 'what does', 'what do',
        'how does', 'how do', 'how is', 'how are', 'how can',
        'why is', 'why are', 'why do', 'why does',
        'solve', 'calculate', 'find', 'determine', 'compute'
    ];
    
    const isQuestion = questionPatterns.some(pattern => lowerMessage.includes(pattern));
    
    if (isQuestion) {
        // Try to match specific question types
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
    
    // Enhanced subject responses with more detail
    if (lowerMessage.includes('physics') || lowerMessage.includes('force') || lowerMessage.includes('motion') || lowerMessage.includes('energy')) {
        return "⚛️ **Physics Help:**\n\nI can help you with:\n• **Mechanics**: Newton's laws, motion, forces, energy\n• **Waves**: Sound, light, electromagnetic radiation\n• **Thermodynamics**: Heat, temperature, energy transfer\n• **Electricity**: Circuits, charges, magnetism\n• **Modern Physics**: Quantum mechanics, relativity\n\n**Current Topics:**\n• F = ma and force problems\n• Conservation of energy\n• Wave properties\n• Circuit analysis\n\nWhat specific physics concept or problem can I help you solve?";
    }
    
    if (lowerMessage.includes('chemistry') || lowerMessage.includes('chemical') || lowerMessage.includes('atom') || lowerMessage.includes('molecule')) {
        return "🧪 **Chemistry Assistance:**\n\nI can help with:\n• **Atomic Structure**: Protons, neutrons, electrons, isotopes\n• **Chemical Bonding**: Ionic, covalent, metallic bonds\n• **Reactions**: Balancing equations, types of reactions\n• **Solutions**: Concentration, pH, acids and bases\n• **Organic Chemistry**: Hydrocarbons, functional groups\n• **Periodic Trends**: Properties across periods and groups\n\n**Common Problems:**\n• Balancing chemical equations\n• Calculating molarity/mass\n• Understanding reaction mechanisms\n\nWhat chemistry topic do you need help with?";
    }
    
    if (lowerMessage.includes('biology') || lowerMessage.includes('cell') || lowerMessage.includes('gene') || lowerMessage.includes('dna')) {
        return "🧬 **Biology Support:**\n\nI can assist with:\n• **Cell Biology**: Structure, organelles, cell division\n• **Genetics**: DNA, RNA, inheritance, mutations\n• **Evolution**: Natural selection, adaptation, speciation\n• **Ecology**: Ecosystems, food chains, biodiversity\n• **Human Biology**: Systems, organs, homeostasis\n\n**Key Processes:**\n• Photosynthesis and cellular respiration\n• Mitosis and meiosis\n• Protein synthesis\n• Natural selection\n\nWhat biological concept would you like to explore?";
    }
    
    if (lowerMessage.includes('math') || lowerMessage.includes('algebra') || lowerMessage.includes('geometry') || lowerMessage.includes('calculus')) {
        return "📊 **Mathematics Help:**\n\nI can solve problems in:\n• **Algebra**: Equations, functions, polynomials\n• **Geometry**: Shapes, angles, area, volume\n• **Trigonometry**: Sine, cosine, tangent, identities\n• **Calculus**: Derivatives, integrals, limits\n• **Statistics**: Probability, data analysis, graphs\n\n**Problem Types:**\n• Step-by-step equation solving\n• Geometric proofs\n• Derivative/integral calculations\n• Word problems\n\nGive me a specific math problem and I'll solve it step-by-step!";
    }
    
    // Study help responses
    if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('prepare') || lowerMessage.includes('exam')) {
        return "📚 **Study Strategies:**\n\n**Effective Learning Techniques:**\n1️⃣ **Active Recall**: Test yourself instead of re-reading\n2️⃣ **Spaced Repetition**: Review material at increasing intervals\n3️⃣ **Practice Problems**: Apply concepts to solve problems\n4️⃣ **Teach Others**: Explain concepts to someone else\n\n**Exam Preparation:**\n• Start early and create a schedule\n• Focus on understanding, not memorization\n• Practice with past papers\n• Get adequate sleep before exams\n\n**Subject-Specific Tips:**\n• Physics: Focus on concepts and problem-solving\n• Chemistry: Memorize key reactions and formulas\n• Biology: Understand processes and connections\n• Math: Practice, practice, practice!\n\nWhat subject are you preparing for?";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "👋 Hello! I'm your AI learning assistant, ready to help with Physics, Chemistry, Biology, Mathematics, and study strategies!\n\n**What can I help you with today?**\n• Ask me to explain concepts\n• Solve math or science problems\n• Help with homework questions\n• Study for exams\n\nWhat would you like to learn about?";
    }
    
    // Default comprehensive response
    return "🎓 **Your AI Learning Assistant**\n\nI'm here to help with:\n\n📚 **Subjects:** Physics, Chemistry, Biology, Mathematics\n🔬 **Lab Help:** Virtual experiments and simulations\n📝 **Study Tips:** Effective learning strategies\n✏️ **Problem Solving:** Step-by-step solutions\n\n**How to ask me:**\n• \"Explain [concept]\" - for detailed explanations\n• \"Solve [problem]\" - for step-by-step solutions\n• \"How does [process] work?\" - for process explanations\n• \"Why [phenomenon]?\" - for understanding reasons\n\n**Example questions:**\n• \"Explain Newton's third law\"\n• \"Solve: 2x² + 5x - 3 = 0\"\n• \"How does photosynthesis work?\"\n• \"Balance: H₂ + O₂ → H₂O\"\n\nWhat would you like to learn about today?";
}

// Handle explanation requests
function handleExplanationRequest(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('atom')) {
        return "⚛️ **Atoms Explained:**\n\nAn atom is the basic unit of matter consisting of:\n\n**Structure:**\n• **Nucleus**: Contains protons (+) and neutrons (neutral)\n• **Electrons**: Negatively charged particles orbiting the nucleus\n\n**Key Facts:**\n• Protons determine the element (atomic number)\n• Neutrons affect mass but not charge\n• Electrons determine chemical behavior\n• Most of an atom is empty space!\n\n**Example:** Carbon has 6 protons, 6 neutrons, and 6 electrons\n\nNeed more details about atomic structure?";
    }
    
    if (lowerMessage.includes('cell')) {
        return "🔬 **Cells Explained:**\n\nCells are the basic building blocks of life.\n\n**Types:**\n• **Prokaryotic**: No nucleus (bacteria)\n• **Eukaryotic**: Has nucleus (plants, animals, fungi)\n\n**Plant Cell Parts:**\n• Cell wall: Structural support\n• Chloroplasts: Photosynthesis\n• Large vacuole: Water storage\n\n**Animal Cell Parts:**\n• No cell wall\n• Small vacuoles\n• Centrioles for cell division\n\n**Common to Both:**\n• Nucleus: DNA storage\n• Mitochondria: Energy production\n• Cytoplasm: Cell contents\n\nWant to dive deeper into cell biology?";
    }
    
    if (lowerMessage.includes('energy')) {
        return "⚡ **Energy Explained:**\n\nEnergy is the capacity to do work or cause change.\n\n**Forms of Energy:**\n• **Kinetic**: Energy of motion (moving objects)\n• **Potential**: Stored energy (position, chemical bonds)\n• **Thermal**: Heat energy\n• **Electrical**: Movement of electrons\n• **Chemical**: Stored in chemical bonds\n• **Nuclear**: Stored in atomic nuclei\n\n**Conservation of Energy:**\nEnergy cannot be created or destroyed, only transformed from one form to another.\n\n**Examples:**\n• Falling object: Potential → Kinetic\n• Battery: Chemical → Electrical\n• Light bulb: Electrical → Light + Heat\n\nWhich energy form would you like to explore?";
    }
    
    return "I'd be happy to explain that! Could you be more specific about what concept you'd like me to explain? For example:\n\n• \"Explain atoms\" - for atomic structure\n• \"Explain cells\" - for cell biology\n• \"Explain energy\" - for energy concepts\n• \"Explain photosynthesis\" - for plant processes\n\nWhat specific topic would you like me to explain in detail?";
}

// Handle problem solving
function handleProblemSolving(message) {
    const lowerMessage = message.toLowerCase();
    
    // Math equation solving
    if (lowerMessage.includes('equation') || lowerMessage.includes('x') || lowerMessage.includes('=')) {
        return solveMathEquation(message);
    }
    
    // Physics problems
    if (lowerMessage.includes('force') || lowerMessage.includes('acceleration') || lowerMessage.includes('mass')) {
        return "🔬 **Physics Problem Solving:**\n\n**Key Formulas:**\n• Force: F = ma\n• Weight: W = mg (g = 9.8 m/s²)\n• Momentum: p = mv\n• Kinetic Energy: KE = ½mv²\n• Potential Energy: PE = mgh\n\n**Example Problem:**\nIf a 5kg object accelerates at 2 m/s²:\nF = ma = 5kg × 2 m/s² = 10N\n\nPlease provide the specific numbers and what you need to find, and I'll solve it step-by-step!";
    }
    
    return "I can help solve problems step-by-step! Please provide:\n\n• **Math Problems**: Give me the equation or numbers\n• **Physics Problems**: Include given values and what to find\n• **Chemistry Problems**: Show the reaction or concentrations\n\nExample: \"Solve 2x² + 5x - 3 = 0\" or \"Find force if mass = 5kg and acceleration = 2m/s²\"";
}

// Handle "how it works" questions
function handleHowItWorks(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('respiration')) {
        return "🫁 **Cellular Respiration:**\n\n**Process:** Converting glucose to ATP (energy)\n\n**Equation:** C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP\n\n**Steps:**\n1️⃣ **Glycolysis**: Glucose → Pyruvate (2 ATP)\n2️⃣ **Krebs Cycle**: Pyruvate → CO₂ (2 ATP)\n3️⃣ **Electron Transport**: Oxygen → Water (32 ATP)\n\n**Total**: ~36 ATP per glucose molecule\n\n**Importance**: Powers all cellular activities!\n\nNeed more details on any step?";
    }
    
    if (lowerMessage.includes('nervous system')) {
        return "🧠 **How the Nervous System Works:**\n\n**Basic Process:**\n1️⃣ **Stimulus** detected by receptors\n2️⃣ **Signal** travels through sensory neurons\n3️⃣ **Processing** in brain/spinal cord\n4️⃣ **Response** sent via motor neurons\n5️⃣ **Action** by muscles/glands\n\n**Key Components:**\n• **Neurons**: Signal transmission cells\n• **Synapses**: Connection points between neurons\n• **Neurotransmitters**: Chemical messengers\n• **Brain**: Central processing unit\n• **Spinal Cord**: Information highway\n\n**Speed**: Up to 120 m/s for myelinated neurons!\n\nWant to know more about neural transmission?";
    }
    
    return "I can explain how things work! Please specify what process or system you'd like me to explain, such as:\n\n• \"How does respiration work?\"\n• \"How does the nervous system work?\"\n• \"How do batteries work?\"\n• \"How does photosynthesis work?\"";
}

// Handle "why" questions
function handleWhyQuestion(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sky') && lowerMessage.includes('blue')) {
        return "🌍 **Why the Sky is Blue:**\n\n**Rayleigh Scattering:**\n1️⃣ Sunlight contains all colors (white light)\n2️⃣ Blue light has shorter wavelength (~450nm)\n3️⃣ Short wavelengths scatter more than long ones\n4️⃣ Blue light scatters in all directions\n5️⃣ We see blue from all directions\n\n**Why not violet?** \nViolet scatters even more, but:\n• Our eyes are less sensitive to violet\n• Sun emits less violet light\n• Some violet is absorbed by atmosphere\n\n**Sunset = Red/Orange** because:\n• Light travels through more atmosphere\n• Most blue light has scattered away\n• Only long wavelengths (red/orange) remain\n\nCool, right?";
    }
    
    if (lowerMessage.includes('gravity')) {
        return "🌍 **Why Gravity Exists:**\n\n**Einstein's Explanation:**\nGravity isn't a force, but the curvature of spacetime!\n\n**How it works:**\n1️⃣ Mass/energy warps the fabric of spacetime\n2️⃣ Objects follow the straightest path through curved space\n3️⃣ This curved path appears as \"gravity\" to us\n4️⃣ More mass = more curvature = stronger gravity\n\n**Example:**\n• Earth creates a \"dent\" in spacetime\n• Moon follows this curved path\n• We perceive this as orbital motion\n\n**Newton vs Einstein:**\n• Newton: Gravity is a mysterious force\n• Einstein: Gravity is geometry!\n\nMind-blowing, isn't it?";
    }
    
    return "I love explaining \"why\" questions! Please tell me what phenomenon you're curious about, such as:\n\n• \"Why is the sky blue?\"\n• \"Why do we have gravity?\"\n• \"Why do objects fall?\"\n• \"Why do we need to breathe?\"";
}

// Handle chemical equation balancing
function handleChemicalEquation(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('h2') && lowerMessage.includes('o2') && lowerMessage.includes('h2o')) {
        return "⚗️ **Balancing: H₂ + O₂ → H₂O**\n\n**Step 1:** Count atoms on both sides\n• Left: H=2, O=2\n• Right: H=2, O=1\n\n**Step 2:** Balance oxygen first\n• Add coefficient 2 to H₂O: H₂ + O₂ → 2H₂O\n• Now: Left H=2, O=2 | Right H=4, O=2\n\n**Step 3:** Balance hydrogen\n• Add coefficient 2 to H₂: 2H₂ + O₂ → 2H₂O\n• Final: Left H=4, O=2 | Right H=4, O=2 ✅\n\n**Balanced Equation:** 2H₂ + O₂ → 2H₂O\n\n**Check:** 4H + 2O → 4H + 2O (balanced!)\n\nNeed help with another equation?";
    }
    
    return "I can help balance chemical equations! Please provide the unbalanced equation, such as:\n\n• \"Balance: H₂ + O₂ → H₂O\"\n• \"Balance: CH₄ + O₂ → CO₂ + H₂O\"\n• \"Balance: Fe + O₂ → Fe₂O₃\"\n\nI'll show you the step-by-step balancing process!";
}

// Solve math equations
function solveMathEquation(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('2x') && lowerMessage.includes('5x') && lowerMessage.includes('3')) {
        return "📐 **Solving: 2x² + 5x - 3 = 0**\n\n**Method: Quadratic Formula**\nFor ax² + bx + c = 0, x = [-b ± √(b²-4ac)]/2a\n\n**Given:** a=2, b=5, c=-3\n\n**Step 1:** Calculate discriminant\nΔ = b² - 4ac = 5² - 4(2)(-3) = 25 + 24 = 49\n\n**Step 2:** Apply formula\nx = [-5 ± √49]/(2×2) = [-5 ± 7]/4\n\n**Step 3:** Find both solutions\nx₁ = (-5 + 7)/4 = 2/4 = 0.5\nx₂ = (-5 - 7)/4 = -12/4 = -3\n\n**Answer:** x = 0.5 or x = -3\n\n**Check:**\nFor x=0.5: 2(0.25) + 5(0.5) - 3 = 0.5 + 2.5 - 3 = 0 ✅\nFor x=-3: 2(9) + 5(-3) - 3 = 18 - 15 - 3 = 0 ✅\n\nNeed help with another equation?";
    }
    
    return "I can solve math equations step-by-step! Please provide the specific equation, such as:\n\n• \"Solve: 2x² + 5x - 3 = 0\"\n• \"Solve: 3x - 7 = 14\"\n• \"Solve: x² - 9 = 0\"\n\nI'll show you the complete solution process!";
}

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

// Library Functions
const books = [
    { id: 1, title: "NCERT Physics Class 11", author: "NCERT", price: 299, category: "physics", image: "physics11.jpg" },
    { id: 2, title: "Concepts of Physics", author: "H.C. Verma", price: 399, category: "physics", image: "hcverma.jpg" },
    { id: 3, title: "NCERT Chemistry Class 12", author: "NCERT", price: 299, category: "chemistry", image: "chemistry12.jpg" },
    { id: 4, title: "Organic Chemistry", author: "O.P. Tandon", price: 450, category: "chemistry", image: "organic.jpg" },
    { id: 5, title: "NCERT Biology Class 11", author: "NCERT", price: 299, category: "biology", image: "biology11.jpg" },
    { id: 6, title: "Biology for NEET", author: "Trueman", price: 550, category: "biology", image: "neetbio.jpg" },
    { id: 7, title: "Mathematics for Class 10", author: "R.D. Sharma", price: 350, category: "mathematics", image: "math10.jpg" },
    { id: 8, title: "IIT Mathematics", author: "M.L. Khanna", price: 499, category: "mathematics", image: "iitmath.jpg" }
];

function loadBooks(category = 'all') {
    const booksGrid = document.getElementById('books-grid');
    const filteredBooks = category === 'all' ? books : books.filter(book => book.category === category);
    
    booksGrid.innerHTML = filteredBooks.map(book => `
        <div class="book-card bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <i class="fas fa-book text-white text-4xl"></i>
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-1">${book.title}</h4>
                <p class="text-gray-600 text-sm mb-2">by ${book.author}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-green-600">₹${book.price}</span>
                    <button onclick="purchaseBook(${book.id})" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterBooks(category) {
    // Update button styles
    document.querySelectorAll('[onclick^="filterBooks"]').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200');
    });
    event.target.classList.remove('bg-gray-200');
    event.target.classList.add('bg-blue-500', 'text-white');
    
    loadBooks(category);
}

function purchaseBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        // In a real application, this would integrate with a payment system
        alert(`Thank you for purchasing "${book.title}"! In a real application, you would be redirected to payment.`);
    }
}

// Lab Simulation Functions (simplified versions)
function updatePendulum() {
    const length = document.getElementById('length-slider').value;
    const angle = document.getElementById('angle-slider').value;
    document.getElementById('length-value').textContent = length + ' m';
    document.getElementById('angle-value').textContent = angle + '°';
}

function runPendulumSimulation() {
    const length = parseFloat(document.getElementById('length-slider').value);
    const initialAngle = parseFloat(document.getElementById('angle-slider').value) * Math.PI / 180;
    
    // Calculate pendulum properties
    const period = 2 * Math.PI * Math.sqrt(length / 9.8);
    const frequency = 1 / period;
    const angularFrequency = 2 * Math.PI / period;
    const maxVelocity = angularFrequency * length * Math.sin(initialAngle);
    const maxKineticEnergy = 0.5 * 0.1 * Math.pow(maxVelocity, 2); // assuming 0.1 kg mass
    const maxPotentialEnergy = 0.1 * 9.8 * length * (1 - Math.cos(initialAngle));
    const totalEnergy = maxKineticEnergy + maxPotentialEnergy;
    
    // Add observation counter
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
            <p class="text-xs text-gray-600 mt-2">
                ${length < 1.0 ? 'Short pendulum: Higher frequency, lower period' : 
                  length > 1.5 ? 'Long pendulum: Lower frequency, higher period' : 
                  'Medium pendulum: Balanced properties'}
            </p>
        </div>
    `;
    
    // Add new observation to existing ones
    observationsDiv.innerHTML = currentContent.includes('Run the simulation') ? 
        newObservation : currentContent + newObservation;
    
    // Simple canvas animation
    const canvas = document.getElementById('pendulum-canvas');
    const ctx = canvas.getContext('2d');
    let angle = initialAngle;
    let angleVel = 0;
    let angleAcc = 0;
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Physics calculation
        angleAcc = -9.8 / (length * 100) * Math.sin(angle);
        angleVel += angleAcc * 0.05;
        angle += angleVel * 0.05;
        time += 0.05;
        
        // Draw pendulum
        const x = 200 + length * 100 * Math.sin(angle);
        const y = 50 + length * 100 * Math.cos(angle);
        
        // Draw support
        ctx.fillStyle = '#666';
        ctx.fillRect(190, 45, 20, 10);
        
        // Draw string
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw bob
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        ctx.strokeStyle = '#1E40AF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw trajectory trace
        ctx.beginPath();
        ctx.arc(200, 50, length * 100, Math.PI/2 - initialAngle, Math.PI/2 + initialAngle);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        requestAnimationFrame(animate);
    }
    animate();
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
    
    // Simple canvas animation
    const canvas = document.getElementById('projectile-canvas');
    const ctx = canvas.getContext('2d');
    let t = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const x = 50 + vx * t;
        const y = 250 - (vy * t - 0.5 * 9.8 * t * t);
        
        if (x < canvas.width && y > 0) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#EF4444';
            ctx.fill();
            
            // Draw trajectory
            ctx.beginPath();
            ctx.moveTo(50, 250);
            for (let i = 0; i <= t; i += 0.1) {
                const trajX = 50 + vx * i;
                const trajY = 250 - (vy * i - 0.5 * 9.8 * i * i);
                ctx.lineTo(trajX, trajY);
            }
            ctx.strokeStyle = '#3B82F6';
            ctx.stroke();
            
            t += 0.1;
            requestAnimationFrame(animate);
        }
    }
    animate();
}

// Chemistry lab functions
let baseVolume = 0;
let currentPH = 3.0;

function addBase(amount) {
    baseVolume += amount;
    currentPH = Math.min(11, 3.0 + baseVolume * 0.16);
    
    document.getElementById('base-volume').textContent = baseVolume.toFixed(1);
    document.getElementById('ph-value').textContent = currentPH.toFixed(1);
    
    // Update color based on pH
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
        
        // Draw simplified DNA double helix
        for (let i = 0; i < 20; i++) {
            const y = i * 15;
            const x1 = 200 + Math.sin(rotation + i * 0.3) * 50;
            const x2 = 200 - Math.sin(rotation + i * 0.3) * 50;
            
            // Draw backbone
            ctx.beginPath();
            ctx.arc(x1, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x2, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
            
            // Draw base pairs
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for chat
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add enter key support for community chat
    document.getElementById('community-message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendCommunityMessage();
        }
    });
    
    // Initialize marketplace
    initializeMarketplace();
    
    // Add sell book form handler
    document.getElementById('sell-book-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newBook = {
            id: Date.now(),
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            category: document.getElementById('book-category').value,
            condition: document.getElementById('book-condition').value,
            price: parseInt(document.getElementById('book-price').value),
            originalPrice: parseInt(document.getElementById('book-original-price').value) || 0,
            seller: "Student User", // Current user
            description: document.getElementById('book-description').value,
            contactMethod: document.getElementById('contact-method').value,
            listedDate: new Date()
        };
        
        // Add to marketplace
        marketplaceBooks.push(newBook);
        
        // Add to user's listings
        myListings.push(newBook);
        
        // Update UI
        loadMarketplace();
        updateMyListings();
        
        // Close modal and reset form
        closeSellBookModal();
        
        alert('Your book has been listed successfully!');
    });
});

// Solutions Lab Functions
function calculateSolution() {
    const mass = parseFloat(document.getElementById('solute-mass').value);
    const molarMass = parseFloat(document.getElementById('molar-mass').value);
    const volume = parseFloat(document.getElementById('solution-volume').value);
    const solventMass = parseFloat(document.getElementById('solvent-mass').value);
    
    // Calculate moles
    const moles = mass / molarMass;
    
    // Calculate molarity (moles/liter of solution)
    const molarity = moles / volume;
    
    // Calculate molality (moles/kg of solvent)
    const molality = moles / solventMass;
    
    // Calculate mass percent
    const totalMass = mass + solventMass * 1000; // Convert kg to g
    const massPercent = (mass / totalMass) * 100;
    
    // Calculate normality (for acids/bases, assuming monoprotic)
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
            <div class="bg-blue-50 p-3 rounded text-xs">
                <p><strong>Preparation Instructions:</strong></p>
                <p>• Dissolve ${mass.toFixed(2)} g of solute in approximately ${(volume * 0.8).toFixed(2)} L of solvent</p>
                <p>• Transfer to a ${volume.toFixed(2)} L volumetric flask</p>
                <p>• Add solvent to mark and mix thoroughly</p>
            </div>
        </div>
    `;
}

function calculateDilution() {
    const initialConc = parseFloat(document.getElementById('initial-conc').value);
    const finalVolume = parseFloat(document.getElementById('final-volume').value);
    const finalConc = parseFloat(document.getElementById('final-conc').value);
    
    // Calculate using C1V1 = C2V2
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
            <div class="bg-yellow-50 p-3 rounded text-xs">
                <p><strong>Dilution Procedure:</strong></p>
                <p>• Measure ${initialVolume.toFixed(3)} L of ${initialConc.toFixed(2)} M solution</p>
                <p>• Add ${waterToAdd.toFixed(3)} L of distilled water</p>
                <p>• Mix thoroughly to achieve ${finalConc.toFixed(2)} M concentration</p>
                <p class="text-red-600 mt-1">⚠️ Always add acid to water, never water to acid!</p>
            </div>
        </div>
    `;
}

function setCompound(compound, molarMass) {
    document.getElementById('molar-mass').value = molarMass;
    
    // Set typical values for this compound
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
    
    // Auto-calculate
    calculateSolution();
}

// Marketplace Functions
function loadMarketplace(category = 'all') {
    const marketplaceGrid = document.getElementById('marketplace-grid');
    const filteredBooks = category === 'all' ? marketplaceBooks : marketplaceBooks.filter(book => book.category === category);
    
    if (filteredBooks.length === 0) {
        marketplaceGrid.innerHTML = '<p class="text-gray-500 col-span-full text-center">No books available in this category.</p>';
        return;
    }
    
    marketplaceGrid.innerHTML = filteredBooks.map(book => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden book-card">
            <div class="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <i class="fas fa-book text-white text-4xl"></i>
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-1 truncate">${book.title}</h4>
                <p class="text-gray-600 text-sm mb-1">by ${book.author}</p>
                <div class="flex items-center mb-2">
                    <span class="bg-${getConditionColor(book.condition)}-100 text-${getConditionColor(book.condition)}-800 text-xs px-2 py-1 rounded">
                        ${book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
                    </span>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-1">
                        ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                    </span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <span class="text-xl font-bold text-green-600">${book.price} credits</span>
                        ${book.originalPrice > 0 ? `<span class="text-xs text-gray-500 line-through ml-1">₹${book.originalPrice}</span>` : ''}
                    </div>
                </div>
                <p class="text-xs text-gray-600 mb-3">Seller: ${book.seller}</p>
                <button onclick="buyBook(${book.id})" class="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm">
                    <i class="fas fa-shopping-cart mr-1"></i>Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

function getConditionColor(condition) {
    switch(condition) {
        case 'new': return 'green';
        case 'good': return 'blue';
        case 'fair': return 'yellow';
        case 'poor': return 'red';
        default: return 'gray';
    }
}

function filterMarketplace(category) {
    // Update button styles
    document.querySelectorAll('[onclick^="filterMarketplace"]').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200');
    });
    event.target.classList.remove('bg-gray-200');
    event.target.classList.add('bg-blue-500', 'text-white');
    
    loadMarketplace(category);
}

function showSellBookModal() {
    document.getElementById('sell-book-modal').classList.remove('hidden');
}

function closeSellBookModal() {
    document.getElementById('sell-book-modal').classList.add('hidden');
    document.getElementById('sell-book-form').reset();
}

function buyBook(bookId) {
    const book = marketplaceBooks.find(b => b.id === bookId);
    if (!book) return;
    
    if (userCredits < book.price) {
        alert('Insufficient credits! You need ' + (book.price - userCredits) + ' more credits to buy this book.');
        return;
    }
    
    if (confirm(`Are you sure you want to buy "${book.title}" for ${book.price} credits?`)) {
        // Process transaction
        userCredits -= book.price;
        
        // Add transaction record
        transactions.push({
            type: 'purchase',
            bookTitle: book.title,
            price: book.price,
            seller: book.seller,
            date: new Date(),
            status: 'completed'
        });
        
        // Remove book from marketplace
        marketplaceBooks = marketplaceBooks.filter(b => b.id !== bookId);
        
        // Update UI
        updateCreditsDisplay();
        loadMarketplace();
        updateTransactionHistory();
        
        alert(`Successfully purchased "${book.title}"! Contact the seller at their preferred method.`);
    }
}

// Profile and Credit Management Functions
function updateCreditsDisplay() {
    const creditsElement = document.getElementById('user-credits');
    if (creditsElement) {
        creditsElement.textContent = userCredits;
    }
}

function loadProfile() {
    updateCreditsDisplay();
    updateMyListings();
    updateTransactionHistory();
}

function updateMyListings() {
    const listingsDiv = document.getElementById('my-listings');
    if (myListings.length === 0) {
        listingsDiv.innerHTML = '<p class="text-gray-500">No active listings</p>';
        return;
    }
    
    listingsDiv.innerHTML = myListings.map(book => `
        <div class="border rounded p-3">
            <h5 class="font-semibold text-sm">${book.title}</h5>
            <p class="text-xs text-gray-600">Price: ${book.price} credits</p>
            <button onclick="removeListing(${book.id})" class="text-red-500 text-xs hover:text-red-700 mt-1">
                <i class="fas fa-trash mr-1"></i>Remove
            </button>
        </div>
    `).join('');
}

function updateTransactionHistory() {
    const historyDiv = document.getElementById('transaction-history');
    if (transactions.length === 0) {
        historyDiv.innerHTML = '<p class="text-gray-500">No transactions yet</p>';
        return;
    }
    
    historyDiv.innerHTML = transactions.slice(-5).reverse().map(transaction => `
        <div class="border rounded p-3">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold text-sm">${transaction.type === 'purchase' ? 'Bought' : 'Sold'}: ${transaction.bookTitle}</p>
                    <p class="text-xs text-gray-600">${transaction.type === 'purchase' ? 'From: ' + transaction.seller : 'To: ' + transaction.buyer}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-sm ${transaction.type === 'purchase' ? 'text-red-600' : 'text-green-600'}">
                        ${transaction.type === 'purchase' ? '-' : '+'}${transaction.price} credits
                    </p>
                    <p class="text-xs text-gray-500">${formatDate(transaction.date)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function addCredits() {
    const amount = prompt('Enter amount of credits to add (₹1 = 10 credits):');
    if (amount && !isNaN(amount) && amount > 0) {
        const creditsToAdd = parseInt(amount) * 10;
        userCredits += creditsToAdd;
        
        transactions.push({
            type: 'add_credits',
            amount: creditsToAdd,
            date: new Date(),
            status: 'completed'
        });
        
        updateCreditsDisplay();
        updateTransactionHistory();
        alert(`Successfully added ${creditsToAdd} credits to your account!`);
    }
}

function viewCreditHistory() {
    const creditTransactions = transactions.filter(t => t.type === 'add_credits' || t.type === 'sale');
    if (creditTransactions.length === 0) {
        alert('No credit transactions found.');
        return;
    }
    
    let history = 'Credit Transaction History:\n\n';
    creditTransactions.forEach(transaction => {
        history += `${formatDate(transaction.date)} - `;
        if (transaction.type === 'add_credits') {
            history += `Added: +${transaction.amount} credits\n`;
        } else {
            history += `Sold "${transaction.bookTitle}": +${transaction.price} credits\n`;
        }
    });
    
    alert(history);
}

function transferCredits() {
    const recipient = prompt('Enter recipient username:');
    const amount = prompt('Enter amount of credits to transfer:');
    
    if (recipient && amount && !isNaN(amount) && amount > 0) {
        const transferAmount = parseInt(amount);
        if (transferAmount > userCredits) {
            alert('Insufficient credits for transfer!');
            return;
        }
        
        if (confirm(`Transfer ${transferAmount} credits to ${recipient}?`)) {
            userCredits -= transferAmount;
            
            transactions.push({
                type: 'transfer',
                recipient: recipient,
                amount: transferAmount,
                date: new Date(),
                status: 'completed'
            });
            
            updateCreditsDisplay();
            updateTransactionHistory();
            alert(`Successfully transferred ${transferAmount} credits to ${recipient}!`);
        }
    }
}

function removeListing(bookId) {
    if (confirm('Are you sure you want to remove this listing?')) {
        myListings = myListings.filter(book => book.id !== bookId);
        updateMyListings();
        alert('Listing removed successfully!');
    }
}

// Community Chat Functions
function loadCommunity() {
    // Initialize community section
    updateOnlineUsers();
    // Auto-join general room if no room is selected
    if (!currentChatRoom) {
        joinChatRoom('general');
    }
}

function joinChatRoom(roomId) {
    currentChatRoom = roomId;
    const room = chatRooms[roomId];
    
    if (!room) return;
    
    // Update room header
    document.getElementById('current-room-name').textContent = room.name;
    document.getElementById('current-room-desc').textContent = room.description;
    document.getElementById('online-count').innerHTML = `<i class="fas fa-circle text-green-500 mr-2 text-xs"></i>${room.onlineCount} online`;
    
    // Update room icon
    const iconElement = document.getElementById('current-room-icon');
    iconElement.className = `w-12 h-12 bg-${room.color}-500 rounded-full flex items-center justify-center`;
    iconElement.innerHTML = `<i class="fas ${room.icon} text-white text-xl"></i>`;
    
    // Update active room styling
    document.querySelectorAll('.chat-room-item').forEach(item => {
        item.classList.remove('ring-2', 'ring-blue-500');
    });
    event.currentTarget.classList.add('ring-2', 'ring-blue-500');
    
    // Load messages
    loadChatMessages(roomId);
    
    // Enable input
    document.getElementById('community-message-input').disabled = false;
    document.getElementById('send-community-message').disabled = false;
    
    // Focus input
    document.getElementById('community-message-input').focus();
}

function loadChatMessages(roomId) {
    const messagesContainer = document.getElementById('community-messages');
    const room = chatRooms[roomId];
    
    if (!room || !room.messages) {
        messagesContainer.innerHTML = '<div class="text-center py-8"><p class="text-gray-500">No messages yet. Start the conversation!</p></div>';
        return;
    }
    
    messagesContainer.innerHTML = room.messages.map(msg => `
        <div class="flex items-start space-x-3 ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg">${msg.avatar}</span>
            </div>
            <div class="${msg.isOwn ? 'text-right' : ''}">
                <div class="flex items-center space-x-2 mb-1 ${msg.isOwn ? 'justify-end' : ''}">
                    <span class="font-semibold text-sm text-gray-800">${msg.user}</span>
                    <span class="text-xs text-gray-500">${formatMessageTime(msg.timestamp)}</span>
                </div>
                <div class="${msg.isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2 max-w-md inline-block">
                    <p class="text-sm">${msg.message}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendCommunityMessage() {
    const input = document.getElementById('community-message-input');
    const message = input.value.trim();
    
    if (!message || !currentChatRoom) return;
    
    // Add message to current room
    const newMessage = {
        id: Date.now(),
        user: currentUser.name,
        avatar: currentUser.avatar,
        message: message,
        timestamp: new Date(),
        isOwn: true
    };
    
    chatRooms[currentChatRoom].messages.push(newMessage);
    
    // Clear input
    input.value = '';
    
    // Reload messages
    loadChatMessages(currentChatRoom);
    
    // Simulate other users responding
    simulateChatResponse();
}

function simulateChatResponse() {
    const responses = [
        "That's a great point!",
        "I agree with you.",
        "Thanks for sharing!",
        "Can you explain more?",
        "Interesting perspective!",
        "I had the same question.",
        "Good explanation!",
        "Let me think about that..."
    ];
    
    const users = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Neha Singh"];
    const avatars = ["👨‍🎓", "👩‍🎓", "👨‍🏫", "👩‍🏫"];
    
    setTimeout(() => {
        if (currentChatRoom && Math.random() > 0.3) {
            const randomUser = Math.floor(Math.random() * users.length);
            const randomResponse = Math.floor(Math.random() * responses.length);
            
            const responseMessage = {
                id: Date.now() + 1,
                user: users[randomUser],
                avatar: avatars[randomUser],
                message: responses[randomResponse],
                timestamp: new Date(),
                isOwn: false
            };
            
            chatRooms[currentChatRoom].messages.push(responseMessage);
            loadChatMessages(currentChatRoom);
        }
    }, 2000 + Math.random() * 3000);
}

function formatMessageTime(timestamp) {
    const now = new Date();
    const msgTime = new Date(timestamp);
    const diffMs = now - msgTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
}

function createNewRoom() {
    const roomName = prompt('Enter room name:');
    if (!roomName) return;
    
    const roomDesc = prompt('Enter room description:');
    if (!roomDesc) roomDesc = 'Custom chat room';
    
    const roomId = 'custom_' + Math.random().toString(36).substr(2, 9);
    
    chatRooms[roomId] = {
        name: roomName,
        description: roomDesc,
        icon: 'fa-hashtag',
        color: 'indigo',
        onlineCount: 1,
        messages: []
    };
    
    alert(`Room "${roomName}" created successfully!`);
    // Refresh the community section to show new room
    loadCommunity();
}

function updateOnlineUsers() {
    // Simulate changing online counts
    setInterval(() => {
        Object.keys(chatRooms).forEach(roomId => {
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            chatRooms[roomId].onlineCount = Math.max(1, chatRooms[roomId].onlineCount + change);
        });
        
        // Update online counts in UI if in community section
        if (currentSection === 'community') {
            document.querySelectorAll('[onclick^="joinChatRoom"]').forEach(btn => {
                const roomId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                const room = chatRooms[roomId];
                if (room) {
                    const onlineSpan = btn.querySelector('.bg-green-100');
                    if (onlineSpan) {
                        onlineSpan.innerHTML = `<i class="fas fa-circle text-green-500 mr-1 text-xs"></i>${room.onlineCount} online`;
                    }
                }
            });
            
            // Update current room online count
            if (currentChatRoom && chatRooms[currentChatRoom]) {
                document.getElementById('online-count').innerHTML = `<i class="fas fa-circle text-green-500 mr-2 text-xs"></i>${chatRooms[currentChatRoom].onlineCount} online`;
            }
        }
    }, 10000); // Update every 10 seconds
}

// Physics Lab Modules
const physicsModules = {
    mechanics: {
        title: "Mechanics",
        icon: "fa-cog",
        color: "blue",
        description: "Study of forces, motion, and energy",
        experiments: [
            {
                id: "pendulum",
                title: "Simple Pendulum",
                description: "Study periodic motion and gravity effects",
                duration: "30 min",
                difficulty: "Beginner"
            },
            {
                id: "projectile",
                title: "Projectile Motion",
                description: "Analyze trajectory and parabolic paths",
                duration: "45 min",
                difficulty: "Intermediate"
            },
            {
                id: "collision",
                title: "Elastic Collisions",
                description: "Conservation of momentum and energy",
                duration: "40 min",
                difficulty: "Intermediate"
            }
        ]
    },
    thermodynamics: {
        title: "Thermodynamics",
        icon: "fa-temperature-high",
        color: "red",
        description: "Heat, temperature, and energy transfer",
        experiments: [
            {
                id: "gas-laws",
                title: "Gas Laws",
                description: "Pressure, volume, and temperature relationships",
                duration: "35 min",
                difficulty: "Beginner"
            },
            {
                id: "heat-transfer",
                title: "Heat Transfer",
                description: "Conduction, convection, and radiation",
                duration: "50 min",
                difficulty: "Intermediate"
            }
        ]
    },
    electromagnetism: {
        title: "Electromagnetism",
        icon: "fa-bolt",
        color: "yellow",
        description: "Electric and magnetic phenomena",
        experiments: [
            {
                id: "circuits",
                title: "Electric Circuits",
                description: "Series and parallel circuits analysis",
                duration: "45 min",
                difficulty: "Beginner"
            },
            {
                id: "magnetic-field",
                title: "Magnetic Fields",
                description: "Field lines and electromagnetic induction",
                duration: "40 min",
                difficulty: "Intermediate"
            }
        ]
    },
    optics: {
        title: "Optics",
        icon: "fa-lightbulb",
        color: "green",
        description: "Light and optical phenomena",
        experiments: [
            {
                id: "refraction",
                title: "Refraction of Light",
                description: "Snell's law and refractive index",
                duration: "30 min",
                difficulty: "Beginner"
            },
            {
                id: "interference",
                title: "Interference Patterns",
                description: "Wave nature of light",
                duration: "35 min",
                difficulty: "Intermediate"
            }
        ]
    },
    modern: {
        title: "Modern Physics",
        icon: "fa-atom",
        color: "purple",
        description: "Quantum and relativistic physics",
        experiments: [
            {
                id: "photoelectric",
                title: "Photoelectric Effect",
                description: "Quantum nature of light",
                duration: "40 min",
                difficulty: "Advanced"
            },
            {
                id: "radioactivity",
                title: "Radioactive Decay",
                description: "Half-life and nuclear stability",
                duration: "45 min",
                difficulty: "Advanced"
            }
        ]
    },
    waves: {
        title: "Waves & Sound",
        icon: "fa-wave-square",
        color: "indigo",
        description: "Wave properties and sound phenomena",
        experiments: [
            {
                id: "standing-waves",
                title: "Standing Waves",
                description: "Nodes and antinodes formation",
                duration: "35 min",
                difficulty: "Intermediate"
            },
            {
                id: "doppler",
                title: "Doppler Effect",
                description: "Frequency shifts and moving sources",
                duration: "30 min",
                difficulty: "Beginner"
            }
        ]
    }
};

// Physics Lab Functions
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
    
    // Create experiment container
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
                    <!-- Experiment content will be loaded here -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(experimentModal);
    
    // Load specific experiment based on experimentId
    loadExperimentContent(experimentId);
}

// Helper functions for experiment demo navigation
function closeExperimentDemo(moduleId, experimentId) {
    // Close current modal
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => modal.remove());
    
    // Open experiment details
    setTimeout(() => {
        openPhysicsExperiment(moduleId, experimentId);
    }, 100);
}

function closeExperimentDemoToLab() {
    // Close all modals
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => modal.remove());
    
    // Show physics lab section
    setTimeout(() => {
        showSection('physics-lab');
    }, 100);
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

function loadPendulumExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Formula</h4>
                    <div class="text-center">
                        <p class="text-lg font-mono">T = 2π√(L/g)</p>
                        <p class="text-xs text-gray-600 mt-2">Period = 2π × √(Length/Gravity)</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize pendulum animation
    initPendulumAnimation();
}

function loadProjectileExperiment(container) {
    container.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Key Equations</h4>
                    <div class="text-center space-y-1">
                        <p class="text-sm font-mono">H = (v²sin²θ)/(2g)</p>
                        <p class="text-sm font-mono">R = (v²sin2θ)/g</p>
                        <p class="text-xs text-gray-600">Height & Range formulas</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Conservation Laws</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'</p>
                        <p class="text-xs text-gray-600 mt-2">Momentum Conservation</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Ideal Gas Law</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">PV = nRT</p>
                        <p class="text-xs text-gray-600 mt-2">Pressure × Volume = n × R × Temperature</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Ohm's Law</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">V = IR</p>
                        <p class="text-xs text-gray-600 mt-2">Voltage = Current × Resistance</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Fourier's Law</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">q = -k∇T</p>
                        <p class="text-xs text-gray-600 mt-2">Heat flux = -k × Temperature gradient</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Decay Law</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">N(t) = N₀e^(-λt)</p>
                        <p class="text-xs text-gray-600 mt-2">N(t) = N₀ × e^(-decay constant × time)</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Standing Wave Equation</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">y = 2A sin(kx) cos(ωt)</p>
                        <p class="text-xs text-gray-600 mt-2">Amplitude = 2A × sin(kx) × cos(ωt)</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Doppler Formula</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">f' = f(v + v₀)/(v + vₛ)</p>
                        <p class="text-xs text-gray-600 mt-2">Observed freq = Source freq × (v + observer)/(v + source)</p>
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
            <!-- Simulation Area -->
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
            
            <!-- Controls & Data -->
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
                
                <div class="bg-yellow-50 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Snell's Law</h4>
                    <div class="text-center">
                        <p class="text-sm font-mono">n₁sin(θ₁) = n₂sin(θ₂)</p>
                        <p class="text-xs text-gray-600 mt-2">n₁sin(incident) = n₂sin(refracted)</p>
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
            <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h4 class="font-semibold mb-3">What you'll be able to do:</h4>
                <ul class="text-left text-sm space-y-2">
                    <li>• Adjust experimental parameters</li>
                    <li>• Run real-time simulations</li>
                    <li>• Collect and analyze data</li>
                    <li>• Compare theoretical vs experimental results</li>
                </ul>
            </div>
        </div>
    `;
}

// Animation functions for all experiments
let pendulumAnimation = null;
let projectileAnimation = null;
let collisionAnimation = null;
let gasAnimation = null;
let circuitAnimation = null;
let refractionAnimation = null;
let heatAnimation = null;
let radioactivityAnimation = null;
let standingWavesAnimation = null;
let dopplerAnimation = null;

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
        
        ctx.beginPath();
        ctx.moveTo(50, 200);
        for (let t = 0; t <= time; t += 0.1) {
            const x = 50 + velocityX * t * 10;
            const y = 200 + (velocityY * t * 10) + (0.5 * gravity * t * t * 10);
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 1;
        ctx.stroke();
        
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
            // Elastic collision physics
            const v1 = ((mass1 - mass2) * vel1 + 2 * mass2 * vel2) / (mass1 + mass2);
            const v2 = ((mass2 - mass1) * vel2 + 2 * mass1 * vel1) / (mass1 + mass2);
            vel1 = v1;
            vel2 = v2;
            hasCollided = true;
            updateCollisionResults(mass1, mass2, vel1, vel2);
        }
        
        ball1X += vel1;
        ball2X += vel2;
        
        // Draw balls
        ctx.beginPath();
        ctx.arc(ball1X, ball1Y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(ball2X, ball2Y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        
        // Stop if balls go off screen
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
    
    // Initialize molecules
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
        
        // Draw container
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Update and draw molecules
        molecules.forEach(mol => {
            mol.x += mol.vx * speedFactor;
            mol.y += mol.vy * speedFactor;
            
            // Bounce off walls
            if (mol.x <= 15 || mol.x >= canvas.width - 15) mol.vx *= -1;
            if (mol.y <= 15 || mol.y >= canvas.height - 15) mol.vy *= -1;
            
            // Draw molecule
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
        const R = 0.0821; // Gas constant
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
    
    // Initialize electrons
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
        
        // Calculate total resistance
        const totalRes = circuitType === 'series' ? res1 + res2 : (res1 * res2) / (res1 + res2);
        const current = voltage / totalRes;
        currentFlow = current;
        
        // Draw circuit components
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        
        // Battery
        ctx.strokeRect(20, 110, 30, 30);
        ctx.fillStyle = '#333';
        ctx.fillText('+', 25, 105);
        ctx.fillText('-', 25, 155);
        
        // Wires and resistors
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
        
        // Resistors
        ctx.strokeRect(150, 115, 30, 20);
        ctx.strokeRect(280, 115, 30, 20);
        
        // Draw electrons if current is flowing
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
        
        // Draw media boundary
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        
        // Draw incident ray
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(200 - 100 * Math.sin(angleRad), canvas.height / 2 - 100 * Math.cos(angleRad));
        ctx.stroke();
        
        // Draw refracted ray
        ctx.strokeStyle = '#3B82F6';
        ctx.beginPath();
        ctx.moveTo(200, canvas.height / 2);
        ctx.lineTo(200 + 100 * Math.sin(refractedAngle * Math.PI / 180), canvas.height / 2 + 100 * Math.cos(refractedAngle * Math.PI / 180));
        ctx.stroke();
        
        // Draw normal
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(200, 30);
        ctx.lineTo(200, canvas.height - 30);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Labels
        ctx.fillStyle = '#EF4444';
        ctx.fillText('Incident Ray', 210, 60);
        ctx.fillStyle = '#3B82F6';
        ctx.fillText('Refracted Ray', 210, canvas.height - 40);
        ctx.fillStyle = '#666';
        ctx.fillText('Normal', 210, canvas.height / 2 - 10);
        
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
    
    // Initialize heat particles
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
        
        // Draw temperature gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, `rgb(255, ${Math.round(255 - hotTemp)}, 0)`);
        gradient.addColorStop(0.5, `rgb(255, ${Math.round(255 - (hotTemp + coldTemp) / 2)}, 0)`);
        gradient.addColorStop(1, `rgb(0, ${Math.round(255 - coldTemp)}, 255)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            const distFromLeft = particle.x / canvas.width;
            particle.temp = hotTemp * (1 - distFromLeft) + coldTemp * distFromLeft;
            
            const speedFactor = conductivity * Math.sqrt(particle.temp / 100);
            particle.x += particle.vx * speedFactor;
            particle.y += particle.vy * speedFactor;
            
            // Bounce off walls
            if (particle.x <= 5 || particle.x >= canvas.width - 5) particle.vx *= -1;
            if (particle.y <= 5 || particle.y >= canvas.height - 5) particle.vy *= -1;
            
            // Draw particle with temperature-based color
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
        const tempGradient = (hot - cold) / 1.0; // Assuming 1m distance
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
        const decayProb = decayConstant * 0.01; // Small time step
        
        // Decay some nuclei
        for (let i = nuclei.length - 1; i >= 0; i--) {
            if (Math.random() < decayProb) {
                const nucleus = nuclei.splice(i, 1)[0];
                decayedNuclei.push(nucleus);
            }
        }
        
        // Draw remaining nuclei (stable)
        ctx.fillStyle = '#3B82F6';
        nuclei.forEach(nucleus => {
            ctx.beginPath();
            ctx.arc(nucleus.x, nucleus.y, nucleus.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw decayed nuclei
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
        
        // Draw standing wave
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
            const xPos = x / canvas.width * 2; // 2 wavelengths
            const y = canvas.height / 2 + amplitude * Math.sin(waveNumber * xPos) * Math.cos(angularFreq * time);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw nodes
        ctx.fillStyle = '#EF4444';
        for (let i = 0; i <= 4; i++) {
            const nodeX = (i / 4) * canvas.width;
            ctx.beginPath();
            ctx.arc(nodeX, canvas.height / 2, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Draw antinodes
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
        
        // Move source
        sourceX += sourceVelocity * 0.1;
        if (sourceX > canvas.width) sourceX = 0;
        
        // Emit new waves
        if (time % (1 / sourceFrequency * 100) < 1) {
            waves.push({
                x: sourceX,
                y: canvas.height / 2,
                radius: 0,
                maxRadius: 100
            });
        }
        
        // Update and draw waves
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
        
        // Draw source
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(sourceX, canvas.height / 2, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw velocity arrow
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
                
                <div class="space-y-6">
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Theory</h3>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p class="text-blue-800">Learn the fundamental concepts behind this experiment through interactive theory lessons.</p>
                            <button class="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                <i class="fas fa-book mr-2"></i>Study Theory
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Procedure</h3>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p class="text-green-800">Follow step-by-step instructions to conduct the virtual experiment safely.</p>
                            <button class="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                                <i class="fas fa-list-ol mr-2"></i>View Procedure
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Observations</h3>
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p class="text-yellow-800">Record your observations and analyze the results of your experiment.</p>
                            <button class="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
                                <i class="fas fa-clipboard mr-2"></i>Record Data
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Quiz</h3>
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <p class="text-purple-800">Test your understanding of the experiment concepts.</p>
                            <button class="mt-3 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                                <i class="fas fa-question-circle mr-2"></i>Take Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
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
                        "Explore law & judiciary opportunities",
                        "Check finance & commerce options",
                        "Review engineering & technology fields",
                        "Compare medical & healthcare paths"
                    ],
                    examples: [
                        "UPSC/PCS civil services",
                        "CA/CS finance careers",
                        "Software engineering roles",
                        "Medical practitioner paths",
                        "Business entrepreneurship"
                    ],
                    exercise: "Explore at least 3 different career categories"
                }
            },
            {
                id: "career-comparison",
                title: "Career Comparison Tool",
                duration: "20 min",
                difficulty: "Beginner",
                content: {
                    video: "Compare careers side-by-side to make informed decisions",
                    steps: [
                        "Select two careers to compare",
                        "Analyze salary potential",
                        "Compare education requirements",
                        "Evaluate work-life balance",
                        "Review future growth prospects"
                    ],
                    examples: [
                        "Doctor vs Engineer comparison",
                        "Government vs Private sector",
                        "CA vs Lawyer career paths",
                        "Startup vs Corporate jobs"
                    ],
                    exercise: "Compare two careers you're interested in"
                }
            },
            {
                id: "career-planning",
                title: "Personal Career Planning",
                duration: "35 min",
                difficulty: "Intermediate",
                content: {
                    video: "Create your personalized career development plan",
                    steps: [
                        "Set short and long-term goals",
                        "Identify required skills and education",
                        "Create timeline with milestones",
                        "Plan skill development activities",
                        "Build backup career options"
                    ],
                    examples: [
                        "5-year career roadmap",
                        "Skill acquisition plan",
                        "Education timeline",
                        "Career transition strategy"
                    ],
                    exercise: "Create your personalized 5-year career plan"
                }
            }
        ]
    },
    health: {
        title: "Health & Safety Basics",
        icon: "fa-heartbeat",
        color: "red",
        lessons: [
            {
                id: "first-aid-basics",
                title: "Basic First Aid",
                duration: "35 min",
                difficulty: "Beginner",
                content: {
                    video: "Essential first aid skills everyone should know",
                    steps: [
                        "Learn CPR basics",
                        "Treat minor cuts and burns",
                        "Handle sprains and strains",
                        "Recognize emergency symptoms",
                        "Know emergency contact numbers"
                    ],
                    examples: [
                        "Treating a paper cut",
                        "Helping someone who fainted",
                        "Dealing with nosebleeds",
                        "Responding to allergic reactions"
                    ],
                    exercise: "Create a personal first aid kit checklist"
                }
            },
            {
                id: "personal-safety",
                title: "Personal Safety Tips",
                duration: "25 min",
                difficulty: "Beginner",
                content: {
                    video: "Stay safe in various situations",
                    steps: [
                        "Be aware of your surroundings",
                        "Trust your instincts",
                        "Learn self-defense basics",
                        "Have emergency contacts ready",
                        "Avoid risky situations"
                    ],
                    examples: [
                        "Walking home alone",
                        "Online safety",
                        "Handling strangers",
                        "Emergency situations"
                    ],
                    exercise: "Create a personal safety plan for different scenarios"
                }
            }
        ]
    },
    "problem-solving": {
        title: "Life Problem-Solving Skills",
        icon: "fa-lightbulb",
        color: "teal",
        lessons: [
            {
                id: "decision-making",
                title: "Smart Decision Making",
                duration: "30 min",
                difficulty: "Intermediate",
                content: {
                    video: "Make better decisions using systematic approaches",
                    steps: [
                        "Identify the problem clearly",
                        "Gather relevant information",
                        "Consider all options",
                        "Evaluate pros and cons",
                        "Make and commit to your decision"
                    ],
                    examples: [
                        "Choosing study streams",
                        "Time management decisions",
                        "Friendship conflicts",
                        "Financial choices"
                    ],
                    exercise: "Use the decision-making framework for a real-life problem"
                }
            },
            {
                id: "time-management",
                title: "Effective Time Management",
                duration: "25 min",
                difficulty: "Intermediate",
                content: {
                    video: "Manage your time better for studies and personal life",
                    steps: [
                        "Set clear goals and priorities",
                        "Create a daily schedule",
                        "Avoid procrastination",
                        "Take regular breaks",
                        "Review and adjust your schedule"
                    ],
                    examples: [
                        "Study schedule creation",
                        "Balancing homework and hobbies",
                        "Exam preparation planning",
                        "Weekend time allocation"
                    ],
                    exercise: "Create your ideal weekly schedule"
                }
            }
        ]
    }
};

// Life Skills progress tracking
let lifeSkillsProgress = JSON.parse(localStorage.getItem('lifeSkillsProgress')) || {};

function openLifeSkillModule(moduleId) {
    const module = lifeSkillsModules[moduleId];
    if (!module) return;
    
    // Create modal for the module
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
                    <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
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
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer" onclick="openLifeSkillLesson('${moduleId}', '${lesson.id}')">
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <h3 class="font-semibold text-gray-800">${lesson.title}</h3>
                                    <div class="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                        <span><i class="fas fa-clock mr-1"></i>${lesson.duration}</span>
                                        <span class="px-2 py-1 bg-${lesson.difficulty === 'Beginner' ? 'green' : 'yellow'}-100 text-${lesson.difficulty === 'Beginner' ? 'green' : 'yellow'}-800 rounded-full text-xs">
                                            ${lesson.difficulty}
                                        </span>
                                    </div>
                                </div>
                                ${lifeSkillsProgress[`${moduleId}_${lesson.id}`] ? 
                                    '<i class="fas fa-check-circle text-green-500 text-xl"></i>' : 
                                    '<i class="fas fa-play-circle text-gray-400 text-xl"></i>'
                                }
                            </div>
                            <p class="text-sm text-gray-600 mb-3">${lesson.content.video}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    <i class="fas fa-book-open mr-1"></i>Interactive Lesson
                                </span>
                                <i class="fas fa-arrow-right text-blue-500"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function openLifeSkillLesson(moduleId, lessonId) {
    // Check if this is a career exploration lesson
    if (moduleId === 'career') {
        switch(lessonId) {
            case 'career-fit-test':
                careerExploration.startCareerFitTest();
                return;
            case 'career-categories':
                careerExploration.exploreCareerCategories();
                return;
            case 'career-comparison':
                careerExploration.startCareerComparison();
                return;
            case 'career-planning':
                careerExploration.startCareerPlanning();
                return;
        }
    }
    
    const module = lifeSkillsModules[moduleId];
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const progressKey = `${moduleId}_${lessonId}`;
    const isCompleted = lifeSkillsProgress[progressKey];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${lesson.title}</h2>
                    <div class="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <span><i class="fas fa-clock mr-1"></i>${lesson.duration}</span>
                        <span class="px-2 py-1 bg-${lesson.difficulty === 'Beginner' ? 'green' : 'yellow'}-100 text-${lesson.difficulty === 'Beginner' ? 'green' : 'yellow'}-800 rounded-full text-xs">
                            ${lesson.difficulty}
                        </span>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="this.closest('.fixed').remove(); openLifeSkillModule('${moduleId}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Module
                    </button>
                    <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
                        <i class="fas fa-home mr-2"></i>Life Skills
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <!-- Video Section -->
                <div class="bg-gray-100 rounded-lg p-8 mb-6 text-center">
                    <div class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i class="fas fa-play text-white text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Video Lesson</h3>
                    <p class="text-gray-600">${lesson.content.video}</p>
                    <button class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-play mr-2"></i>Play Video
                    </button>
                </div>
                
                <!-- Steps Section -->
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Step-by-Step Guide</h3>
                    <div class="space-y-3">
                        ${lesson.content.steps.map((step, index) => `
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                                    ${index + 1}
                                </div>
                                <p class="text-gray-700">${step}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Examples Section -->
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Real-Life Examples</h3>
                    <div class="grid md:grid-cols-2 gap-3">
                        ${lesson.content.examples.map(example => `
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p class="text-blue-800 text-sm">${example}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Exercise Section -->
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Practical Exercise</h3>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p class="text-green-800 mb-3">${lesson.content.exercise}</p>
                        <button onclick="completeLifeSkillExercise('${moduleId}', '${lessonId}')" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            <i class="fas fa-check mr-2"></i>Mark as Complete
                        </button>
                    </div>
                </div>
                
                <!-- Quiz Section -->
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Quick Quiz</h3>
                    <div id="quiz-container">
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p class="text-yellow-800 mb-3">Test your understanding with a quick quiz!</p>
                            <button onclick="startLifeSkillQuiz('${moduleId}', '${lessonId}')" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                                <i class="fas fa-question-circle mr-2"></i>Start Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function completeLifeSkillExercise(moduleId, lessonId) {
    const progressKey = `${moduleId}_${lessonId}`;
    lifeSkillsProgress[progressKey] = {
        completed: true,
        completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('lifeSkillsProgress', JSON.stringify(lifeSkillsProgress));
    
    // Show success message
    const modal = document.querySelector('.fixed');
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        Lesson completed successfully!
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
        modal.remove();
        // Refresh the module view
        openLifeSkillModule(moduleId);
    }, 2000);
}

function startLifeSkillQuiz(moduleId, lessonId) {
    const quizContainer = document.getElementById('quiz-container');
    
    // Sample quiz questions (in real implementation, these would be specific to each lesson)
    const quizQuestions = [
        {
            question: "What is the main benefit of this skill?",
            options: ["Save time", "Save money", "Stay safe", "All of the above"],
            correct: 3
        },
        {
            question: "When should you apply this skill?",
            options: ["Daily", "Weekly", "Monthly", "Never"],
            correct: 0
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            showQuizResults();
            return;
        }
        
        const q = quizQuestions[currentQuestion];
        quizContainer.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold mb-3">Question ${currentQuestion + 1} of ${quizQuestions.length}</h4>
                <p class="text-gray-700 mb-4">${q.question}</p>
                <div class="space-y-2">
                    ${q.options.map((option, index) => `
                        <button onclick="answerQuizQuestion(${index})" class="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    window.answerQuizQuestion = function(selectedIndex) {
        if (selectedIndex === quizQuestions[currentQuestion].correct) {
            score++;
        }
        currentQuestion++;
        showQuestion();
    };
    
    function showQuizResults() {
        const percentage = Math.round((score / quizQuestions.length) * 100);
        quizContainer.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div class="w-20 h-20 bg-${percentage >= 70 ? 'green' : percentage >= 50 ? 'yellow' : 'red'}-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-2xl font-bold text-${percentage >= 70 ? 'green' : percentage >= 50 ? 'yellow' : 'red'}-600">${percentage}%</span>
                </div>
                <h4 class="font-semibold mb-2">Quiz Completed!</h4>
                <p class="text-gray-600 mb-4">You scored ${score} out of ${quizQuestions.length}</p>
                <button onclick="this.closest('.fixed').remove()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Close Lesson
                </button>
            </div>
        `;
    }
    
    showQuestion();
}

// Career Exploration Hub - Comprehensive Career Database
const careerDatabase = {
    categories: {
        government: {
            title: "Government & Civil Services",
            icon: "fa-landmark",
            color: "blue",
            description: "Prestigious government jobs serving the nation",
            careers: [
                {
                    id: "upsc-ias",
                    title: "IAS/IPS/IFS Officer",
                    overview: {
                        description: "Top administrative positions in Indian government",
                        suitableFor: "Students with strong leadership, analytical skills, and desire to serve nation",
                        workStyle: "Administrative, decision-making, policy implementation",
                        personality: "Leader, analytical, disciplined, service-oriented"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Policy formulation and implementation",
                            "Administrative decision making",
                            "Public service delivery",
                            "Crisis management",
                            "Departmental supervision"
                        ],
                        tools: ["Government portals", "Legal documents", "Communication systems", "Data analysis tools"],
                        dayInLife: "Morning briefings → Administrative meetings → Field visits → Policy reviews → Public interactions"
                    },
                    roadmap: {
                        subjects: ["Any graduation", "General Studies", "Current Affairs", "Indian Polity"],
                        courses: ["Graduation (any stream)", "UPSC Coaching", "Mock Interviews"],
                        exams: ["UPSC Prelims", "UPSC Mains", "Interview"],
                        duration: "1-3 years preparation",
                        timeline: "Graduation → UPSC Prep → Prelims → Mains → Interview → Training"
                    },
                    skills: {
                        hard: ["Policy analysis", "Legal knowledge", "Administrative procedures", "Data interpretation"],
                        soft: ["Leadership", "Communication", "Decision making", "Stress management"],
                        exercises: ["Mock policy papers", "Debate practice", "Current affairs analysis", "Administrative case studies"]
                    },
                    exams: {
                        eligibility: "Graduate (21-32 years)",
                        syllabus: "GS, CSAT, Optional Subject, Essay",
                        pattern: "Prelims (Objective) → Mains (Descriptive) → Interview",
                        difficulty: "Very High (3% success rate)",
                        preparation: "12-18 months focused preparation"
                    },
                    salary: {
                        starting: "₹56,100/month (Junior Scale)",
                        midLevel: "₹1,23,100/month (Senior Scale)",
                        senior: "₹2,25,000/month (Apex Scale)",
                        growth: "Regular promotions, high job security",
                        benefits: "Government accommodation, vehicle, medical, pension"
                    },
                    practice: {
                        assignments: [
                            "Write a 150-word answer on: 'Impact of Digital India on Rural Development'",
                            "Analyze a case study: 'Handling communal tensions in a district'",
                            "Draft a policy brief: 'Improving primary education in your state'"
                        ]
                    },
                    quiz: [
                        {
                            question: "What is the minimum age to appear for UPSC?",
                            options: ["21 years", "23 years", "25 years", "27 years"],
                            correct: 0
                        },
                        {
                            question: "How many attempts are allowed for General category?",
                            options: ["4", "6", "8", "Unlimited"],
                            correct: 1
                        }
                    ]
                },
                {
                    id: "pcs-officer",
                    title: "State Civil Services (PCS)",
                    overview: {
                        description: "Administrative positions at state level",
                        suitableFor: "Students interested in state administration and regional development",
                        workStyle: "State-level administration, local governance",
                        personality: "Regional focus, administrative, people-oriented"
                    },
                    dailyWork: {
                        responsibilities: [
                            "State policy implementation",
                            "District administration",
                            "Local development projects",
                            "Public grievance redressal",
                            "Coordination with central schemes"
                        ],
                        tools: ["State government systems", "Local administrative tools", "Regional data"],
                        dayInLife: "State office work → District visits → Public meetings → Scheme monitoring"
                    },
                    roadmap: {
                        subjects: ["Regional studies", "State-specific knowledge", "General Studies"],
                        courses: ["Graduation", "State PCS Coaching"],
                        exams: ["State PCS Prelims", "State PCS Mains", "Interview"],
                        duration: "1-2 years preparation",
                        timeline: "Graduation → State PCS Prep → Prelims → Mains → Interview"
                    },
                    skills: {
                        hard: ["State administration", "Regional laws", "Local language", "Development planning"],
                        soft: ["Regional understanding", "Local coordination", "Public dealing"],
                        exercises: ["State policy analysis", "Regional development planning", "Local case studies"]
                    },
                    salary: {
                        starting: "₹44,900/month",
                        midLevel: "₹1,00,000/month",
                        senior: "₹2,05,400/month",
                        growth: "State-level promotions, departmental transfers"
                    }
                }
            ]
        },
        law: {
            title: "Law & Judiciary",
            icon: "fa-gavel",
            color: "purple",
            description: "Legal profession and judicial services",
            careers: [
                {
                    id: "judge",
                    title: "Judge (Judicial Services)",
                    overview: {
                        description: "Deliver justice and interpret laws",
                        suitableFor: "Students with strong ethics, analytical mind, and sense of justice",
                        workStyle: "Court proceedings, legal analysis, judgment writing",
                        personality: "Impartial, analytical, ethical, decisive"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Hear court cases",
                            "Analyze legal arguments",
                            "Write judgments",
                            "Legal research",
                            "Court administration"
                        ],
                        tools: ["Legal databases", "Court systems", "Legal reference materials"],
                        dayInLife: "Court hearings → Legal research → Judgment writing → Case review"
                    },
                    roadmap: {
                        subjects: ["Law (LLB)", "Constitutional Law", "Civil/Criminal Law"],
                        courses: ["LLB (3 years)", "LLM (optional)", "Judicial Services Coaching"],
                        exams: ["Judicial Services Exam", "Viva Voce"],
                        duration: "4-5 years total",
                        timeline: "Graduation → LLB → Judicial Services Prep → Exam → Appointment"
                    },
                    skills: {
                        hard: ["Legal knowledge", "Constitutional law", "Procedural law", "Legal writing"],
                        soft: ["Impartiality", "Decision making", "Communication", "Ethics"],
                        exercises: ["Case analysis", "Mock trials", "Judgment writing", "Legal research"]
                    },
                    salary: {
                        starting: "₹27,700/month (Junior Division)",
                        midLevel: "₹1,00,000/month (District Judge)",
                        senior: "₹2,25,000/month (High Court Judge)",
                        growth: "Regular promotions, judicial hierarchy"
                    },
                    practice: {
                        assignments: [
                            "Analyze case: 'Dispute over property ownership between brothers'",
                            "Write judgment: 'Contract breach case with damages'",
                            "Research legal precedent: 'Interpretation of new amendment'"
                        ]
                    }
                },
                {
                    id: "lawyer",
                    title: "Lawyer/Advocate",
                    overview: {
                        description: "Represent clients and provide legal advice",
                        suitableFor: "Students with strong communication skills and interest in justice",
                        workStyle: "Client consultation, case preparation, court representation",
                        personality: "Persuasive, analytical, communicative, ethical"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Client consultations",
                            "Case preparation",
                            "Legal research",
                            "Court appearances",
                            "Legal documentation"
                        ],
                        tools: ["Legal research tools", "Case management software", "Legal databases"],
                        dayInLife: "Client meetings → Research → Court appearances → Documentation"
                    },
                    roadmap: {
                        subjects: ["Law (LLB)", "Specialized laws", "Procedural laws"],
                        courses: ["LLB", "LLM (specialization)", "Bar Council enrollment"],
                        exams: ["Bar Council Exam", "Specialization certifications"],
                        duration: "3-6 years total",
                        timeline: "Graduation → LLB → Bar enrollment → Practice setup"
                    },
                    skills: {
                        hard: ["Legal expertise", "Research skills", "Documentation", "Argumentation"],
                        soft: ["Communication", "Persuasion", "Client management", "Ethics"],
                        exercises: ["Mock arguments", "Case briefs", "Client counseling", "Legal writing"]
                    },
                    salary: {
                        starting: "₹15,000-30,000/month (Junior)",
                        midLevel: "₹1,00,000-2,00,000/month (5-10 years)",
                        senior: "₹5,00,000+/month (Senior Partner)",
                        growth: "Based on practice, specialization, reputation"
                    }
                }
            ]
        },
        finance: {
            title: "Finance & Commerce",
            icon: "fa-chart-line",
            color: "green",
            description: "Financial services and commerce careers",
            careers: [
                {
                    id: "ca",
                    title: "Chartered Accountant (CA)",
                    overview: {
                        description: "Financial accounting, auditing, and taxation expert",
                        suitableFor: "Students with strong analytical skills and attention to detail",
                        workStyle: "Financial analysis, auditing, tax planning, compliance",
                        personality: "Analytical, detail-oriented, ethical, problem-solver"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Financial statement preparation",
                            "Tax planning and filing",
                            "Audit and assurance",
                            "Financial consulting",
                            "Compliance management"
                        ],
                        tools: ["Accounting software", "Tax tools", "Excel", "Financial databases"],
                        dayInLife: "Client meetings → Financial analysis → Audit work → Tax planning"
                    },
                    roadmap: {
                        subjects: ["Accounting", "Taxation", "Law", "Financial Management"],
                        courses: ["CA Foundation", "CA Intermediate", "CA Final"],
                        exams: ["CA Foundation", "CA Intermediate", "CA Final", "Articleship"],
                        duration: "4-5 years total",
                        timeline: "12th → CA Foundation → Intermediate → Articleship → Final → Practice"
                    },
                    skills: {
                        hard: ["Accounting", "Taxation", "Auditing", "Financial analysis"],
                        soft: ["Client management", "Attention to detail", "Ethics", "Communication"],
                        exercises: ["Balance sheet preparation", "Tax computation", "Audit procedures", "Financial analysis"]
                    },
                    salary: {
                        starting: "₹8,000-15,000/month (Articleship)",
                        midLevel: "₹40,000-80,000/month (2-5 years)",
                        senior: "₹2,00,000-10,00,000/month (Partner/Consultant)",
                        growth: "Practice growth, specialization, consulting"
                    },
                    practice: {
                        assignments: [
                            "Balance a company's ledger for one month",
                            "Calculate income tax for individual with multiple income sources",
                            "Audit findings: Identify discrepancies in financial statements"
                        ]
                    }
                },
                {
                    id: "cs",
                    title: "Company Secretary (CS)",
                    overview: {
                        description: "Corporate governance and compliance expert",
                        suitableFor: "Students interested in corporate law and governance",
                        workStyle: "Compliance management, corporate advisory, board meetings",
                        personality: "Detail-oriented, ethical, organized, corporate-focused"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Company law compliance",
                            "Board meeting management",
                            "Secretarial audits",
                            "Corporate governance",
                            "Regulatory filings"
                        ],
                        tools: ["Compliance software", "Legal databases", "Corporate law resources"],
                        dayInLife: "Compliance review → Board meetings → Filings → Advisory work"
                    },
                    roadmap: {
                        subjects: ["Company Law", "Corporate Governance", "Securities Law"],
                        courses: ["CS Foundation", "CS Executive", "CS Professional"],
                        exams: ["CS Foundation", "CS Executive", "CS Professional", "Training"],
                        duration: "3-4 years total",
                        timeline: "12th → CS Foundation → Executive → Professional → Practice"
                    },
                    skills: {
                        hard: ["Company law", "Compliance", "Corporate governance", "Secretarial practices"],
                        soft: ["Attention to detail", "Ethics", "Corporate communication"],
                        exercises: ["Board meeting procedures", "Compliance checklists", "Corporate filings"]
                    },
                    salary: {
                        starting: "₹12,000-25,000/month (Trainee)",
                        midLevel: "₹50,000-1,00,000/month (5-10 years)",
                        senior: "₹2,00,000-5,00,000/month (Company Secretary)",
                        growth: "Corporate positions, consulting, practice"
                    }
                }
            ]
        },
        engineering: {
            title: "Engineering & Technology",
            icon: "fa-microchip",
            color: "cyan",
            description: "Technical and engineering careers",
            careers: [
                {
                    id: "software-engineer",
                    title: "Software Engineer",
                    overview: {
                        description: "Design, develop, and maintain software systems",
                        suitableFor: "Students with logical thinking and problem-solving skills",
                        workStyle: "Coding, system design, problem-solving, collaboration",
                        personality: "Logical, creative, problem-solver, team player"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Software development",
                            "Code review and testing",
                            "System design",
                            "Bug fixing",
                            "Technical documentation"
                        ],
                        tools: ["Programming languages", "IDEs", "Version control", "Cloud platforms"],
                        dayInLife: "Coding → Team meetings → Code review → Testing → Documentation"
                    },
                    roadmap: {
                        subjects: ["Mathematics", "Physics", "Computer Science"],
                        courses: ["B.Tech Computer Science", "Bootcamps", "Certifications"],
                        exams: ["JEE", "State engineering exams", "Company interviews"],
                        duration: "4 years degree + continuous learning",
                        timeline: "12th → Engineering → Internships → Job → Specialization"
                    },
                    skills: {
                        hard: ["Programming", "Data structures", "Algorithms", "System design"],
                        soft: ["Teamwork", "Communication", "Problem-solving", "Learning ability"],
                        exercises: ["Coding challenges", "Project development", "System design", "Algorithm optimization"]
                    },
                    salary: {
                        starting: "₹4,00,000-8,00,000/year (Fresher)",
                        midLevel: "₹12,00,000-25,00,000/year (3-5 years)",
                        senior: "₹30,00,000-1,00,00,000/year (Senior/Lead)",
                        growth: "Technical leadership, architecture, management"
                    },
                    practice: {
                        assignments: [
                            "Solve: 'Design a URL shortening service'",
                            "Code: 'Implement a binary search algorithm'",
                            "Debug: 'Find and fix memory leak in given code'"
                        ]
                    }
                },
                {
                    id: "ai-engineer",
                    title: "AI/Machine Learning Engineer",
                    overview: {
                        description: "Build and deploy artificial intelligence systems",
                        suitableFor: "Students with strong math and programming skills",
                        workStyle: "Data analysis, model training, AI system development",
                        personality: "Analytical, innovative, research-oriented, detail-focused"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Data preprocessing",
                            "Model development",
                            "Algorithm optimization",
                            "AI system deployment",
                            "Performance monitoring"
                        ],
                        tools: ["Python", "TensorFlow/PyTorch", "Cloud AI platforms", "Data tools"],
                        dayInLife: "Data analysis → Model training → Testing → Deployment → Monitoring"
                    },
                    roadmap: {
                        subjects: ["Mathematics", "Statistics", "Computer Science", "Machine Learning"],
                        courses: ["B.Tech/M.Tech AI", "Online certifications", "Specialized training"],
                        exams: ["Engineering entrance", "Company technical interviews"],
                        duration: "4-6 years education + continuous learning",
                        timeline: "12th → Engineering → AI specialization → Research/Job"
                    },
                    skills: {
                        hard: ["Machine Learning", "Deep Learning", "Statistics", "Programming"],
                        soft: ["Research", "Innovation", "Analytical thinking", "Problem-solving"],
                        exercises: ["ML projects", "Algorithm implementation", "Data analysis", "Model optimization"]
                    },
                    salary: {
                        starting: "₹6,00,000-12,00,000/year",
                        midLevel: "₹15,00,000-30,00,000/year",
                        senior: "₹40,00,000-1,50,00,000/year",
                        growth: "AI research, product development, consulting"
                    }
                }
            ]
        },
        medical: {
            title: "Medical & Healthcare",
            icon: "fa-stethoscope",
            color: "red",
            description: "Healthcare and medical careers",
            careers: [
                {
                    id: "doctor",
                    title: "Doctor (MBBS)",
                    overview: {
                        description: "Diagnose and treat illnesses, promote health",
                        suitableFor: "Students with empathy, scientific aptitude, and service mindset",
                        workStyle: "Patient care, diagnosis, treatment, continuous learning",
                        personality: "Empathetic, scientific, patient, responsible"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Patient consultation",
                            "Diagnosis and treatment",
                            "Medical procedures",
                            "Health education",
                            "Emergency care"
                        ],
                        tools: ["Medical equipment", "Diagnostic tools", "EMR systems", "Medical references"],
                        dayInLife: "Rounds → OPD → Surgeries → Emergencies → Documentation"
                    },
                    roadmap: {
                        subjects: ["Biology", "Chemistry", "Physics", "English"],
                        courses: ["MBBS (5.5 years)", "MD/MS specialization", "Super-specialty"],
                        exams: ["NEET UG", "NEET PG", "Super-specialty exams"],
                        duration: "5.5 years basic + 3-6 years specialization",
                        timeline: "12th → NEET → MBBS → Internship → PG → Specialization"
                    },
                    skills: {
                        hard: ["Medical knowledge", "Diagnostic skills", "Treatment protocols", "Research"],
                        soft: ["Empathy", "Communication", "Patience", "Decision making"],
                        exercises: ["Case diagnosis", "Treatment planning", "Patient communication", "Medical research"]
                    },
                    salary: {
                        starting: "₹60,000-1,20,000/month (Junior Resident)",
                        midLevel: "₹1,50,000-3,00,000/month (Specialist)",
                        senior: "₹5,00,000-15,00,000/month (Senior Consultant)",
                        growth: "Specialization, private practice, hospital positions"
                    },
                    practice: {
                        assignments: [
                            "Diagnose: 'Patient with fever, cough, and fatigue'",
                            "Treatment plan: 'Manage diabetes type 2 patient'",
                            "Emergency: 'Handle trauma case with multiple injuries'"
                        ]
                    }
                },
                {
                    id: "nurse",
                    title: "Nursing Professional",
                    overview: {
                        description: "Provide patient care and medical support",
                        suitableFor: "Students with caring nature and medical interest",
                        workStyle: "Patient care, medical assistance, health monitoring",
                        personality: "Caring, patient, responsible, detail-oriented"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Patient care",
                            "Medication administration",
                            "Health monitoring",
                            "Medical assistance",
                            "Patient education"
                        ],
                        tools: ["Medical equipment", "Monitoring devices", "EMR systems"],
                        dayInLife: "Patient care → Medication → Monitoring → Assistance → Documentation"
                    },
                    roadmap: {
                        subjects: ["Biology", "Chemistry", "English"],
                        courses: ["B.Sc Nursing (4 years)", "M.Sc Nursing", "Specializations"],
                        exams: ["Nursing entrance exams", "State nursing exams"],
                        duration: "4 years basic + 2 years specialization",
                        timeline: "12th → Nursing course → Registration → Specialization"
                    },
                    skills: {
                        hard: ["Medical procedures", "Patient care", "Medication knowledge", "Emergency response"],
                        soft: ["Empathy", "Patience", "Communication", "Teamwork"],
                        exercises: ["Patient care simulation", "Medication administration", "Emergency response"]
                    },
                    salary: {
                        starting: "₹20,000-40,000/month",
                        midLevel: "₹40,000-80,000/month",
                        senior: "₨80,000-1,50,000/month (Nursing Supervisor)",
                        growth: "Specialization, teaching, hospital administration"
                    }
                }
            ]
        },
        business: {
            title: "Business & Entrepreneurship",
            icon: "fa-briefcase",
            color: "orange",
            description: "Business management and entrepreneurship",
            careers: [
                {
                    id: "entrepreneur",
                    title: "Entrepreneur",
                    overview: {
                        description: "Start and run your own business",
                        suitableFor: "Students with innovative ideas and risk-taking ability",
                        workStyle: "Business development, innovation, team leadership",
                        personality: "Innovative, risk-taker, leader, resilient"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Business planning",
                            "Team management",
                            "Product development",
                            "Marketing",
                            "Financial management"
                        ],
                        tools: ["Business software", "Analytics tools", "Communication platforms"],
                        dayInLife: "Planning → Team meetings → Product work → Marketing → Financial review"
                    },
                    roadmap: {
                        subjects: ["Business Studies", "Economics", "Mathematics"],
                        courses: ["BBA/MBA", "Entrepreneurship programs", "Business incubators"],
                        exams: ["Business school entrance", "Funding pitches"],
                        duration: "3-4 years education + continuous learning",
                        timeline: "12th → Business education → Experience → Startup"
                    },
                    skills: {
                        hard: ["Business planning", "Financial management", "Marketing", "Product knowledge"],
                        soft: ["Leadership", "Risk-taking", "Innovation", "Resilience"],
                        exercises: ["Business plan creation", "Pitch deck", "Market analysis", "Financial projections"]
                    },
                    salary: {
                        starting: "Variable (depends on business)",
                        midLevel: "₹10,00,000-50,00,000/year (successful startup)",
                        senior: "₹1,00,00,000+/year (established business)",
                        growth: "Business scaling, diversification, expansion"
                    },
                    practice: {
                        assignments: [
                            "Create business plan for 'Eco-friendly products startup'",
                            "Design pitch deck for investors",
                            "Market analysis: 'Competitive landscape for food delivery app'"
                        ]
                    }
                }
            ]
        },
        creative: {
            title: "Creative & Media",
            icon: "fa-palette",
            color: "pink",
            description: "Creative and media careers",
            careers: [
                {
                    id: "graphic-designer",
                    title: "Graphic Designer",
                    overview: {
                        description: "Create visual content for brands and media",
                        suitableFor: "Students with artistic skills and creativity",
                        workStyle: "Design creation, client collaboration, visual communication",
                        personality: "Creative, artistic, detail-oriented, collaborative"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Visual design creation",
                            "Brand identity development",
                            "Client collaboration",
                            "Design software work",
                            "Creative brainstorming"
                        ],
                        tools: ["Design software", "Creative tools", "Collaboration platforms"],
                        dayInLife: "Client brief → Design creation → Revisions → Final delivery"
                    },
                    roadmap: {
                        subjects: ["Art", "Design", "Computer Graphics"],
                        courses: ["BFA/Design degree", "Design school", "Online courses"],
                        exams: ["Design school entrance", "Portfolio review"],
                        duration: "3-4 years education + portfolio building",
                        timeline: "12th → Design education → Portfolio → Freelance/Job"
                    },
                    skills: {
                        hard: ["Design software", "Color theory", "Typography", "Brand design"],
                        soft: ["Creativity", "Client communication", "Time management", "Collaboration"],
                        exercises: ["Design projects", "Portfolio building", "Client projects", "Brand development"]
                    },
                    salary: {
                        starting: "₹3,00,000-6,00,000/year",
                        midLevel: "₹8,00,000-15,00,000/year",
                        senior: "₹20,00,000-50,00,000/year (Creative Director)",
                        growth: "Specialization, freelance, agency work, creative direction"
                    }
                }
            ]
        },
        skilled: {
            title: "Skilled Trades",
            icon: "fa-tools",
            color: "yellow",
            description: "Technical and skilled trade careers",
            careers: [
                {
                    id: "electrician",
                    title: "Professional Electrician",
                    overview: {
                        description: "Install and maintain electrical systems",
                        suitableFor: "Students with technical aptitude and problem-solving skills",
                        workStyle: "Technical work, installation, maintenance, troubleshooting",
                        personality: "Technical, detail-oriented, safety-conscious, problem-solver"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Electrical installation",
                            "Maintenance work",
                            "Troubleshooting",
                            "Safety inspections",
                            "Client consultation"
                        ],
                        tools: ["Electrical tools", "Testing equipment", "Safety gear"],
                        dayInLife: "Installation work → Maintenance → Troubleshooting → Safety checks"
                    },
                    roadmap: {
                        subjects: ["Physics", "Mathematics", "Technical drawing"],
                        courses: ["ITI Electrician", "Diploma in Electrical", "Apprenticeship"],
                        exams: ["Trade certification", "Safety certifications"],
                        duration: "2-3 years training + apprenticeship",
                        timeline: "10th → ITI → Apprenticeship → Certification → Practice"
                    },
                    skills: {
                        hard: ["Electrical knowledge", "Installation skills", "Safety procedures", "Troubleshooting"],
                        soft: ["Safety consciousness", "Customer service", "Problem-solving"],
                        exercises: ["Installation practice", "Safety protocols", "Troubleshooting scenarios"]
                    },
                    salary: {
                        starting: "₹15,000-25,000/month",
                        midLevel: "₹30,000-50,000/month",
                        senior: "₹60,000-1,00,000/month (Contractor/Business)",
                        growth: "Specialization, business ownership, industrial work"
                    }
                }
            ]
        },
        digital: {
            title: "Digital Careers",
            icon: "fa-laptop-code",
            color: "indigo",
            description: "Modern digital and tech careers",
            careers: [
                {
                    id: "ui-ux-designer",
                    title: "UI/UX Designer",
                    overview: {
                        description: "Design user interfaces and experiences for digital products",
                        suitableFor: "Students with design sense and user empathy",
                        workStyle: "Design research, interface design, user testing",
                        personality: "Empathetic, creative, analytical, user-focused"
                    },
                    dailyWork: {
                        responsibilities: [
                            "User research",
                            "Interface design",
                            "User testing",
                            "Prototyping",
                            "Design systems"
                        ],
                        tools: ["Design tools", "Prototyping software", "Analytics platforms"],
                        dayInLife: "Research → Design → Testing → Iteration → Documentation"
                    },
                    roadmap: {
                        subjects: ["Design", "Psychology", "Computer Science"],
                        courses: ["Design bootcamp", "UX courses", "Self-learning"],
                        exams: ["Portfolio review", "Design challenges"],
                        duration: "6 months - 2 years learning + portfolio",
                        timeline: "Education → Portfolio building → Internship → Job"
                    },
                    skills: {
                        hard: ["Design tools", "User research", "Prototyping", "Design systems"],
                        soft: ["Empathy", "User focus", "Communication", "Analytical thinking"],
                        exercises: ["Design projects", "User research", "Prototyping", "Usability testing"]
                    },
                    salary: {
                        starting: "₹4,00,000-8,00,000/year",
                        midLevel: "₹10,00,000-20,00,000/year",
                        senior: "₹25,00,000-50,00,000/year (Design Lead)",
                        growth: "Specialization, leadership, product design"
                    }
                },
                {
                    id: "digital-marketer",
                    title: "Digital Marketing Specialist",
                    overview: {
                        description: "Plan and execute digital marketing campaigns",
                        suitableFor: "Students with creativity and analytical skills",
                        workStyle: "Campaign planning, analytics, content creation",
                        personality: "Creative, analytical, strategic, results-oriented"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Campaign planning",
                            "Content creation",
                            "Analytics review",
                            "SEO/SEM management",
                            "Social media management"
                        ],
                        tools: ["Marketing platforms", "Analytics tools", "Content creation tools"],
                        dayInLife: "Campaign work → Analytics → Content creation → Strategy review"
                    },
                    roadmap: {
                        subjects: ["Marketing", "Communication", "Analytics"],
                        courses: ["Digital marketing courses", "Certifications", "Workshops"],
                        exams: ["Google certifications", "Platform certifications"],
                        duration: "3-12 months learning + practical experience",
                        timeline: "Education → Certifications → Internship → Specialization"
                    },
                    skills: {
                        hard: ["SEO/SEM", "Analytics", "Content creation", "Campaign management"],
                        soft: ["Creativity", "Strategic thinking", "Communication", "Analysis"],
                        exercises: ["Campaign planning", "Content creation", "Analytics projects", "SEO optimization"]
                    },
                    salary: {
                        starting: "₹3,00,000-6,00,000/year",
                        midLevel: "₹8,00,000-15,00,000/year",
                        senior: "₹20,00,000-40,00,000/year (Marketing Manager)",
                        growth: "Specialization, management, consulting"
                    }
                }
            ]
        },
        education: {
            title: "Education & Research",
            icon: "fa-graduation-cap",
            color: "teal",
            description: "Teaching and research careers",
            careers: [
                {
                    id: "teacher",
                    title: "Teacher/Educator",
                    overview: {
                        description: "Educate and inspire future generations",
                        suitableFor: "Students with passion for teaching and subject expertise",
                        workStyle: "Teaching, mentoring, curriculum development",
                        personality: "Patient, knowledgeable, inspiring, empathetic"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Classroom teaching",
                            "Lesson planning",
                            "Student assessment",
                            "Parent communication",
                            "Professional development"
                        ],
                        tools: ["Teaching aids", "Educational technology", "Assessment tools"],
                        dayInLife: "Teaching → Planning → Assessment → Meetings → Development"
                    },
                    roadmap: {
                        subjects: ["Education", "Subject specialization", "Psychology"],
                        courses: ["B.Ed", "M.Ed", "Subject specialization", "Ph.D"],
                        exams: ["Teaching eligibility exams", "Subject exams", "Ph.D entrance"],
                        duration: "3-5 years education + continuous learning",
                        timeline: "Graduation → B.Ed → Teaching → Specialization → Higher education"
                    },
                    skills: {
                        hard: ["Subject knowledge", "Teaching methods", "Assessment techniques", "Educational technology"],
                        soft: ["Patience", "Communication", "Empathy", "Leadership"],
                        exercises: ["Lesson planning", "Teaching practice", "Assessment design", "Educational research"]
                    },
                    salary: {
                        starting: "₹25,000-40,000/month (School Teacher)",
                        midLevel: "₹50,000-80,000/month (Senior Teacher)",
                        senior: "₨1,00,000-2,00,000/month (Principal/Professor)",
                        growth: "Higher education, administration, research"
                    }
                },
                {
                    id: "researcher",
                    title: "Research Scientist",
                    overview: {
                        description: "Conduct research and advance knowledge",
                        suitableFor: "Students with curiosity and analytical skills",
                        workStyle: "Research, analysis, experimentation, publication",
                        personality: "Curious, analytical, persistent, innovative"
                    },
                    dailyWork: {
                        responsibilities: [
                            "Research design",
                            "Experimentation",
                            "Data analysis",
                            "Publication",
                            "Collaboration"
                        ],
                        tools: ["Research equipment", "Statistical software", "Academic databases"],
                        dayInLife: "Research → Analysis → Writing → Collaboration → Publication"
                    },
                    roadmap: {
                        subjects: ["Science", "Mathematics", "Research methodology"],
                        courses: ["M.Sc/M.Tech", "Ph.D", "Post-doc"],
                        exams: ["Research entrance", "Ph.D qualifying", "Publications"],
                        duration: "6-10 years education + research",
                        timeline: "Graduation → Masters → Ph.D → Research career"
                    },
                    skills: {
                        hard: ["Research methods", "Data analysis", "Technical knowledge", "Writing"],
                        soft: ["Curiosity", "Persistence", "Collaboration", "Critical thinking"],
                        exercises: ["Research projects", "Data analysis", "Academic writing", "Conference presentations"]
                    },
                    salary: {
                        starting: "₹40,000-60,000/month (Junior Researcher)",
                        midLevel: "₹80,000-1,50,000/month (Senior Researcher)",
                        senior: "₹2,00,000-5,00,000/month (Principal Investigator)",
                        growth: "Academic positions, industry research, consulting"
                    }
                }
            ]
        }
    }
};

// Career Exploration System
const careerExploration = {
    userProgress: JSON.parse(localStorage.getItem('careerProgress')) || {},
    savedCareers: JSON.parse(localStorage.getItem('savedCareers')) || [],
    careerComparison: [],
    aiRecommendations: JSON.parse(localStorage.getItem('aiRecommendations')) || null,
    
    // AI Career Fit Test
    startCareerFitTest: function() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <h2 class="text-2xl font-bold text-gray-800">AI Career Fit Test</h2>
                    <p class="text-gray-600 mt-2">Discover your perfect career match with AI analysis</p>
                </div>
                
                <div class="p-6">
                    <div id="test-content">
                        <div class="text-center py-8">
                            <div class="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <i class="fas fa-brain text-indigo-600 text-3xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-4">Let's Find Your Perfect Career</h3>
                            <p class="text-gray-600 mb-6">Answer these questions to get personalized AI-powered career recommendations</p>
                            <button onclick="careerExploration.startPersonalityTest()" class="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors">
                                Start Assessment <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="border-t p-4 flex justify-between">
                    <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fas fa-home mr-2"></i>Back to Life Skills
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    startPersonalityTest: function() {
        const testContent = document.getElementById('test-content');
        const questions = [
            {
                id: 'work_style',
                question: 'What work environment do you prefer?',
                options: [
                    { text: 'Structured office environment', value: 'structured' },
                    { text: 'Flexible remote work', value: 'flexible' },
                    { text: 'Field work / travel', value: 'field' },
                    { text: 'Creative studio', value: 'creative' }
                ]
            },
            {
                id: 'interest_area',
                question: 'Which area interests you most?',
                options: [
                    { text: 'Technology & Innovation', value: 'tech' },
                    { text: 'Helping people', value: 'service' },
                    { text: 'Business & Finance', value: 'business' },
                    { text: 'Creative & Arts', value: 'creative' }
                ]
            },
            {
                id: 'problem_solving',
                question: 'How do you prefer to solve problems?',
                options: [
                    { text: 'Analytical approach', value: 'analytical' },
                    { text: 'Creative solutions', value: 'creative' },
                    { text: 'Team collaboration', value: 'collaborative' },
                    { text: 'Step-by-step method', value: 'systematic' }
                ]
            },
            {
                id: 'leadership',
                question: 'What\'s your leadership style?',
                options: [
                    { text: 'Natural leader', value: 'leader' },
                    { text: 'Team player', value: 'team' },
                    { text: 'Independent worker', value: 'independent' },
                    { text: 'Supportive role', value: 'support' }
                ]
            },
            {
                id: 'learning_preference',
                question: 'How do you prefer to learn?',
                options: [
                    { text: 'Hands-on practice', value: 'practical' },
                    { text: 'Theoretical study', value: 'theoretical' },
                    { text: 'Visual learning', value: 'visual' },
                    { text: 'Interactive discussion', value: 'interactive' }
                ]
            }
        ];
        
        let currentQuestion = 0;
        let answers = {};
        
        function showQuestion() {
            if (currentQuestion >= questions.length) {
                showResults();
                return;
            }
            
            const q = questions[currentQuestion];
            testContent.innerHTML = `
                <div class="max-w-2xl mx-auto">
                    <div class="mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-sm text-gray-600">Question ${currentQuestion + 1} of ${questions.length}</span>
                            <div class="w-32 bg-gray-200 rounded-full h-2">
                                <div class="bg-indigo-500 h-2 rounded-full transition-all duration-300" style="width: ${((currentQuestion + 1) / questions.length) * 100}%"></div>
                            </div>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">${q.question}</h3>
                    </div>
                    <div class="space-y-3">
                        ${q.options.map((option, index) => `
                            <button onclick="selectAnswer('${q.id}', '${option.value}')" class="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                                <span class="text-lg font-medium text-gray-700">${String.fromCharCode(65 + index)}.</span> ${option.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        window.selectAnswer = function(questionId, value) {
            answers[questionId] = value;
            currentQuestion++;
            showQuestion();
        };
        
        function showResults() {
            // AI-powered analysis (simplified for demo)
            const careerMatches = careerExploration.analyzeAnswers(answers);
            careerExploration.aiRecommendations = careerMatches;
            localStorage.setItem('aiRecommendations', JSON.stringify(careerMatches));
            
            testContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i class="fas fa-check text-green-600 text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Your Career Matches</h3>
                    <p class="text-gray-600 mb-6">Based on your responses, here are your top career recommendations:</p>
                    
                    <div class="grid md:grid-cols-2 gap-4 mb-8">
                        ${careerMatches.slice(0, 4).map((match, index) => `
                            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-semibold text-gray-800">${match.career}</h4>
                                    <span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium">
                                        ${match.percentage}% match
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 mb-3">${match.description}</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                        ${match.category}
                                    </span>
                                    <button onclick="careerExploration.viewCareerDetails('${match.careerId}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                        View Details <i class="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-blue-800 mb-2">Skill Gap Analysis</h4>
                        <p class="text-blue-700 text-sm mb-3">Focus on developing these skills for your top careers:</p>
                        <div class="flex flex-wrap gap-2">
                            ${careerMatches[0].skillGaps.map(skill => `
                                <span class="bg-white text-blue-800 px-3 py-1 rounded-full text-sm">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex justify-center space-x-4">
                        <button onclick="careerExploration.saveCareerMatches()" class="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors">
                            Save Results <i class="fas fa-save ml-2"></i>
                        </button>
                        <button onclick="careerExploration.startCareerComparison()" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                            Compare Careers <i class="fas fa-balance-scale ml-2"></i>
                        </button>
                    </div>
                </div>
            `;
        }
        
        showQuestion();
    },
    
    analyzeAnswers: function(answers) {
        // Simplified AI analysis - in real implementation, this would use ML algorithms
        const careerMatches = [];
        
        // Map answers to career categories
        const categoryMapping = {
            'tech': ['engineering', 'digital'],
            'service': ['medical', 'education', 'government'],
            'business': ['finance', 'business'],
            'creative': ['creative', 'digital']
        };
        
        const personalityMapping = {
            'analytical': ['engineering', 'finance', 'medical'],
            'creative': ['creative', 'digital', 'business'],
            'leader': ['government', 'business', 'education'],
            'team': ['medical', 'education', 'engineering']
        };
        
        // Generate matches based on answers
        const allCareers = [];
        Object.values(careerDatabase.categories).forEach(category => {
            category.careers.forEach(career => {
                allCareers.push({
                    ...career,
                    category: category.title
                });
            });
        });
        
        // Calculate match scores
        allCareers.forEach(career => {
            let score = Math.floor(Math.random() * 30) + 70; // Base score 70-100
            
            // Adjust score based on answers
            if (answers.interest_area && categoryMapping[answers.interest_area].includes(career.category.toLowerCase())) {
                score += 10;
            }
            
            careerMatches.push({
                careerId: career.id,
                career: career.title,
                category: career.category,
                description: career.overview.description,
                percentage: Math.min(score, 100),
                skillGaps: this.generateSkillGaps(career),
                roadmap: career.roadmap
            });
        });
        
        return careerMatches.sort((a, b) => b.percentage - a.percentage);
    },
    
    generateSkillGaps: function(career) {
        const commonGaps = ['Communication Skills', 'Time Management', 'Technical Knowledge'];
        const specificGaps = career.skills.hard.slice(0, 2);
        return [...specificGaps, ...commonGaps.slice(0, 2)];
    },
    
    // Career Categories Explorer
    exploreCareerCategories: function() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <h2 class="text-2xl font-bold text-gray-800">Explore Career Categories</h2>
                    <p class="text-gray-600 mt-2">Discover detailed information about various career paths</p>
                </div>
                
                <div class="p-6">
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${Object.entries(careerDatabase.categories).map(([key, category]) => `
                            <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onclick="careerExploration.showCategoryDetails('${key}')">
                                <div class="flex items-center mb-4">
                                    <div class="w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mr-3">
                                        <i class="fas ${category.icon} text-${category.color}-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-800">${category.title}</h3>
                                        <p class="text-sm text-gray-600">${category.careers.length} careers</p>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-700 mb-4">${category.description}</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs bg-${category.color}-100 text-${category.color}-800 px-2 py-1 rounded-full">
                                        Explore Careers
                                    </span>
                                    <i class="fas fa-arrow-right text-${category.color}-500"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="border-t p-4 flex justify-between">
                    <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fas fa-home mr-2"></i>Back to Life Skills
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    showCategoryDetails: function(categoryKey) {
        const category = careerDatabase.categories[categoryKey];
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fas ${category.icon} text-${category.color}-600 text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">${category.title}</h2>
                            <p class="text-gray-600">${category.description}</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        ${category.careers.map(career => `
                            <div class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 class="text-lg font-semibold text-gray-800">${career.title}</h3>
                                        <p class="text-sm text-gray-600 mt-1">${career.overview.description}</p>
                                    </div>
                                    ${careerExploration.isCareerSaved(career.id) ? 
                                        '<i class="fas fa-bookmark text-indigo-500"></i>' : 
                                        '<i class="far fa-bookmark text-gray-400"></i>'
                                    }
                                </div>
                                
                                <div class="space-y-3 mb-4">
                                    <div class="flex items-center text-sm">
                                        <i class="fas fa-user text-gray-400 mr-2"></i>
                                        <span class="text-gray-700">${career.overview.suitableFor}</span>
                                    </div>
                                    <div class="flex items-center text-sm">
                                        <i class="fas fa-briefcase text-gray-400 mr-2"></i>
                                        <span class="text-gray-700">${career.overview.workStyle}</span>
                                    </div>
                                    <div class="flex items-center text-sm">
                                        <i class="fas fa-rupee-sign text-gray-400 mr-2"></i>
                                        <span class="text-gray-700">${career.salary.starting}</span>
                                    </div>
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <button onclick="careerExploration.viewCareerDetails('${career.id}')" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                                        View Details <i class="fas fa-arrow-right ml-1"></i>
                                    </button>
                                    <button onclick="careerExploration.toggleSaveCareer('${career.id}')" class="text-gray-600 hover:text-indigo-600">
                                        <i class="${careerExploration.isCareerSaved(career.id) ? 'fas' : 'far'} fa-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="border-t p-4 flex justify-between">
                    <button onclick="careerExploration.exploreCareerCategories()" class="text-gray-600 hover:text-gray-800">
                        <i class="fas fa-arrow-left mr-2"></i> Back to Categories
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    // Career Comparison Tool
    startCareerComparison: function() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <h2 class="text-2xl font-bold text-gray-800">Career Comparison Tool</h2>
                    <p class="text-gray-600 mt-2">Compare two careers side-by-side to make informed decisions</p>
                </div>
                
                <div class="p-6">
                    <div id="comparison-content">
                        <div class="text-center py-8">
                            <div class="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <i class="fas fa-balance-scale text-blue-600 text-3xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-4">Select Careers to Compare</h3>
                            <p class="text-gray-600 mb-6">Choose two careers from your saved list or explore new ones</p>
                            
                            <div class="grid md:grid-cols-2 gap-6 mb-8">
                                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <i class="fas fa-plus-circle text-gray-400 text-3xl mb-3"></i>
                                    <p class="text-gray-600 mb-3">Select First Career</p>
                                    <button onclick="careerExploration.selectCareerForComparison(1)" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                        Choose Career
                                    </button>
                                </div>
                                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <i class="fas fa-plus-circle text-gray-400 text-3xl mb-3"></i>
                                    <p class="text-gray-600 mb-3">Select Second Career</p>
                                    <button onclick="careerExploration.selectCareerForComparison(2)" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                        Choose Career
                                    </button>
                                </div>
                            </div>
                            
                            ${careerExploration.savedCareers.length > 0 ? `
                                <div class="bg-gray-50 rounded-lg p-4">
                                    <h4 class="font-semibold text-gray-800 mb-3">Your Saved Careers</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${careerExploration.savedCareers.map(careerId => {
                                            const career = careerExploration.findCareerById(careerId);
                                            return career ? `
                                                <button onclick="careerExploration.addCareerToComparison('${careerId}')" class="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-100">
                                                    ${career.title}
                                                </button>
                                            ` : '';
                                        }).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="border-t p-4 flex justify-between">
                    <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fas fa-home mr-2"></i>Back to Life Skills
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    // Career Details View
    viewCareerDetails: function(careerId) {
        const career = this.findCareerById(careerId);
        if (!career) return;
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">${career.title}</h2>
                            <p class="text-gray-600">${career.overview.description}</p>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <i class="fas fa-times text-gray-600"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6">
                    <!-- Career Overview -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Career Overview</h3>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div class="bg-blue-50 rounded-lg p-4">
                                <h4 class="font-semibold text-blue-800 mb-2">Who It's For</h4>
                                <p class="text-blue-700 text-sm">${career.overview.suitableFor}</p>
                            </div>
                            <div class="bg-green-50 rounded-lg p-4">
                                <h4 class="font-semibold text-green-800 mb-2">Work Style</h4>
                                <p class="text-green-700 text-sm">${career.overview.workStyle}</p>
                            </div>
                            <div class="bg-purple-50 rounded-lg p-4">
                                <h4 class="font-semibold text-purple-800 mb-2">Personality Match</h4>
                                <p class="text-purple-700 text-sm">${career.overview.personality}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Daily Work -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Daily Work Life</h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-3">Responsibilities</h4>
                                <ul class="space-y-2">
                                    ${career.dailyWork.responsibilities.map(resp => `
                                        <li class="flex items-start">
                                            <i class="fas fa-check text-green-500 mr-2 mt-1"></i>
                                            <span class="text-gray-700 text-sm">${resp}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-3">Tools & Technology</h4>
                                <div class="flex flex-wrap gap-2">
                                    ${career.dailyWork.tools.map(tool => `
                                        <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">${tool}</span>
                                    `).join('')}
                                </div>
                                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <h4 class="font-semibold text-gray-700 mb-2">Day in Life</h4>
                                    <p class="text-gray-600 text-sm">${career.dailyWork.dayInLife}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Roadmap -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Career Roadmap</h3>
                        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="font-semibold text-gray-700 mb-3">Education Path</h4>
                                    <div class="space-y-3">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</div>
                                            <div>
                                                <p class="font-medium text-gray-800">Required Subjects</p>
                                                <p class="text-sm text-gray-600">${career.roadmap.subjects.join(', ')}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</div>
                                            <div>
                                                <p class="font-medium text-gray-800">Courses & Degrees</p>
                                                <p class="text-sm text-gray-600">${career.roadmap.courses.join(', ')}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</div>
                                            <div>
                                                <p class="font-medium text-gray-800">Entrance Exams</p>
                                                <p class="text-sm text-gray-600">${career.roadmap.exams.join(', ')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-700 mb-3">Timeline</h4>
                                    <div class="space-y-2">
                                        <p class="text-sm text-gray-600"><strong>Duration:</strong> ${career.roadmap.duration}</p>
                                        <p class="text-sm text-gray-600"><strong>Path:</strong> ${career.roadmap.timeline}</p>
                                    </div>
                                    <div class="mt-4 bg-white rounded-lg p-3">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-sm font-medium text-gray-700">Progress Timeline</span>
                                            <span class="text-xs text-gray-500">${career.roadmap.duration}</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="bg-blue-500 h-2 rounded-full" style="width: 75%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Skills Required -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Required Skills</h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-3">Hard Skills</h4>
                                <div class="space-y-2">
                                    ${career.skills.hard.map(skill => `
                                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span class="text-sm text-gray-700">${skill}</span>
                                            <div class="flex space-x-1">
                                                ${[1,2,3,4,5].map(level => `
                                                    <div class="w-2 h-2 bg-${level <= 3 ? 'blue' : 'gray'}-300 rounded-full"></div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-3">Soft Skills</h4>
                                <div class="space-y-2">
                                    ${career.skills.soft.map(skill => `
                                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span class="text-sm text-gray-700">${skill}</span>
                                            <div class="flex space-x-1">
                                                ${[1,2,3,4,5].map(level => `
                                                    <div class="w-2 h-2 bg-${level <= 4 ? 'green' : 'gray'}-300 rounded-full"></div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Salary & Growth -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Salary & Growth</h3>
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                            <div class="grid md:grid-cols-4 gap-4 mb-4">
                                <div class="text-center">
                                    <p class="text-sm text-gray-600 mb-1">Starting</p>
                                    <p class="text-lg font-bold text-green-700">${career.salary.starting}</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-sm text-gray-600 mb-1">Mid-Level</p>
                                    <p class="text-lg font-bold text-green-700">${career.salary.midLevel}</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-sm text-gray-600 mb-1">Senior</p>
                                    <p class="text-lg font-bold text-green-700">${career.salary.senior}</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-sm text-gray-600 mb-1">Growth</p>
                                    <p class="text-lg font-bold text-green-700">${career.salary.growth}</p>
                                </div>
                            </div>
                            <div class="bg-white rounded-lg p-3">
                                <p class="text-sm text-gray-600"><strong>Additional Benefits:</strong> ${career.salary.benefits || 'Standard benefits as per industry norms'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Practice Assignments -->
                    ${career.practice ? `
                        <div class="mb-8">
                            <h3 class="text-xl font-semibold text-gray-800 mb-4">Practice Assignments</h3>
                            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <p class="text-yellow-800 mb-4">Try these hands-on exercises to experience this career:</p>
                                <div class="space-y-3">
                                    ${career.practice.assignments.map((assignment, index) => `
                                        <div class="bg-white rounded-lg p-4">
                                            <div class="flex items-start">
                                                <div class="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                                    ${index + 1}
                                                </div>
                                                <div class="flex-1">
                                                    <p class="text-gray-700 text-sm">${assignment}</p>
                                                    <button onclick="careerExploration.startPracticeAssignment('${career.id}', ${index})" class="mt-2 text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                                                        Start Assignment <i class="fas fa-arrow-right ml-1"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Quiz Section -->
                    ${career.quiz ? `
                        <div class="mb-8">
                            <h3 class="text-xl font-semibold text-gray-800 mb-4">Test Your Knowledge</h3>
                            <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                <p class="text-purple-800 mb-4">Quick quiz about ${career.title} career:</p>
                                <button onclick="careerExploration.startCareerQuiz('${career.id}')" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                                    <i class="fas fa-question-circle mr-2"></i>Start Quiz
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="border-t p-4 flex justify-between">
                    <div class="flex space-x-4">
                        <button onclick="careerExploration.toggleSaveCareer('${career.id}')" class="flex items-center text-gray-600 hover:text-indigo-600">
                            <i class="${careerExploration.isCareerSaved(career.id) ? 'fas' : 'far'} fa-bookmark mr-2"></i>
                            ${careerExploration.isCareerSaved(career.id) ? 'Saved' : 'Save Career'}
                        </button>
                        <button onclick="careerExploration.addToComparison('${career.id}')" class="flex items-center text-gray-600 hover:text-indigo-600">
                            <i class="fas fa-balance-scale mr-2"></i>
                            Compare
                        </button>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    // Helper functions
    findCareerById: function(careerId) {
        for (const category of Object.values(careerDatabase.categories)) {
            const career = category.careers.find(c => c.id === careerId);
            if (career) return career;
        }
        return null;
    },
    
    isCareerSaved: function(careerId) {
        return this.savedCareers.includes(careerId);
    },
    
    toggleSaveCareer: function(careerId) {
        const index = this.savedCareers.indexOf(careerId);
        if (index > -1) {
            this.savedCareers.splice(index, 1);
        } else {
            this.savedCareers.push(careerId);
        }
        localStorage.setItem('savedCareers', JSON.stringify(this.savedCareers));
        
        // Refresh the modal if open
        const modal = document.querySelector('.fixed');
        if (modal) {
            const career = this.findCareerById(careerId);
            if (career) {
                this.viewCareerDetails(careerId);
            }
        }
    },
    
    // Additional methods would be implemented here...
    
    startCareerPlanning: function() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <h2 class="text-2xl font-bold text-gray-800">Personal Career Planning</h2>
                    <p class="text-gray-600 mt-2">Create your personalized career development plan</p>
                </div>
                
                <div class="p-6">
                    <div class="space-y-6">
                        <!-- Goal Setting -->
                        <div class="bg-blue-50 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-blue-800 mb-4">
                                <i class="fas fa-bullseye mr-2"></i>Set Your Career Goals
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-2">Short-term Goal (1-2 years)</label>
                                    <textarea id="short-term-goal" class="w-full p-3 border border-blue-200 rounded-lg" rows="2" placeholder="e.g., Complete graduation with first class, learn programming basics"></textarea>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-2">Long-term Goal (5+ years)</label>
                                    <textarea id="long-term-goal" class="w-full p-3 border border-blue-200 rounded-lg" rows="2" placeholder="e.g., Become a software engineer at top tech company"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Skill Development -->
                        <div class="bg-green-50 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-green-800 mb-4">
                                <i class="fas fa-chart-line mr-2"></i>Skill Development Plan
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-green-700 mb-2">Skills to Develop</label>
                                    <div class="grid md:grid-cols-2 gap-3">
                                        <div class="flex items-center">
                                            <input type="checkbox" id="skill-comm" class="mr-2">
                                            <label for="skill-comm" class="text-sm">Communication Skills</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="skill-tech" class="mr-2">
                                            <label for="skill-tech" class="text-sm">Technical Skills</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="skill-leadership" class="mr-2">
                                            <label for="skill-leadership" class="text-sm">Leadership</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="skill-analytical" class="mr-2">
                                            <label for="skill-analytical" class="text-sm">Analytical Thinking</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-green-700 mb-2">Learning Resources</label>
                                    <textarea id="learning-resources" class="w-full p-3 border border-green-200 rounded-lg" rows="2" placeholder="e.g., Online courses, workshops, books, mentorship"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Timeline -->
                        <div class="bg-purple-50 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-purple-800 mb-4">
                                <i class="fas fa-calendar-alt mr-2"></i>5-Year Career Timeline
                            </h3>
                            <div class="space-y-3">
                                <div class="flex items-center">
                                    <div class="w-16 text-sm font-medium text-purple-700">Year 1:</div>
                                    <input type="text" class="flex-1 ml-3 p-2 border border-purple-200 rounded" placeholder="Focus on foundation skills">
                                </div>
                                <div class="flex items-center">
                                    <div class="w-16 text-sm font-medium text-purple-700">Year 2:</div>
                                    <input type="text" class="flex-1 ml-3 p-2 border border-purple-200 rounded" placeholder="Gain practical experience">
                                </div>
                                <div class="flex items-center">
                                    <div class="w-16 text-sm font-medium text-purple-700">Year 3:</div>
                                    <input type="text" class="flex-1 ml-3 p-2 border border-purple-200 rounded" placeholder="Specialization focus">
                                </div>
                                <div class="flex items-center">
                                    <div class="w-16 text-sm font-medium text-purple-700">Year 4:</div>
                                    <input type="text" class="flex-1 ml-3 p-2 border border-purple-200 rounded" placeholder="Career advancement">
                                </div>
                                <div class="flex items-center">
                                    <div class="w-16 text-sm font-medium text-purple-700">Year 5:</div>
                                    <input type="text" class="flex-1 ml-3 p-2 border border-purple-200 rounded" placeholder="Leadership role">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Backup Plans -->
                        <div class="bg-orange-50 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-orange-800 mb-4">
                                <i class="fas fa-shield-alt mr-2"></i>Backup Career Options
                            </h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-sm font-medium text-orange-700 mb-2">Alternative Career 1</label>
                                    <input type="text" class="w-full p-3 border border-orange-200 rounded-lg" placeholder="e.g., Data Analysis if Software Engineering doesn't work out">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-orange-700 mb-2">Alternative Career 2</label>
                                    <input type="text" class="w-full p-3 border border-orange-200 rounded-lg" placeholder="e.g., Teaching if industry roles don't fit">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between space-x-4 mt-8">
                        <button onclick="this.closest('.fixed').remove(); showSection('life-skills')" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                            <i class="fas fa-home mr-2"></i>Back to Life Skills
                        </button>
                        <div class="flex space-x-4">
                            <button onclick="careerExploration.saveCareerPlan()" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                                <i class="fas fa-save mr-2"></i>Save Career Plan
                            </button>
                            <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    saveCareerPlan: function() {
        const plan = {
            shortTermGoal: document.getElementById('short-term-goal').value,
            longTermGoal: document.getElementById('long-term-goal').value,
            skills: [],
            learningResources: document.getElementById('learning-resources').value,
            timeline: {},
            backupCareers: []
        };
        
        // Collect skills
        ['skill-comm', 'skill-tech', 'skill-leadership', 'skill-analytical'].forEach(skillId => {
            if (document.getElementById(skillId).checked) {
                plan.skills.push(document.getElementById(skillId).nextElementSibling.textContent);
            }
        });
        
        // Collect timeline
        for (let i = 1; i <= 5; i++) {
            const input = document.querySelector(`input[placeholder*="Year ${i}"]`);
            if (input) {
                plan.timeline[`year${i}`] = input.value;
            }
        }
        
        // Save to localStorage
        localStorage.setItem('careerPlan', JSON.stringify(plan));
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            Career plan saved successfully!
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
            document.querySelector('.fixed').remove();
        }, 2000);
    },
    
    saveCareerMatches: function() {
        // Save AI recommendations to user progress
        if (this.aiRecommendations) {
            this.userProgress.aiMatches = this.aiRecommendations;
            localStorage.setItem('careerProgress', JSON.stringify(this.userProgress));
        }
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            Career matches saved successfully!
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 2000);
    },
    
    selectCareerForComparison: function(position) {
        // This would open career selection modal
        this.exploreCareerCategories();
    },
    
    addCareerToComparison: function(careerId) {
        if (this.careerComparison.length < 2) {
            this.careerComparison.push(careerId);
            if (this.careerComparison.length === 2) {
                this.showComparisonResults();
            }
        }
    },
    
    showComparisonResults: function() {
        const career1 = this.findCareerById(this.careerComparison[0]);
        const career2 = this.findCareerById(this.careerComparison[1]);
        
        if (!career1 || !career2) return;
        
        const comparisonContent = document.getElementById('comparison-content');
        comparisonContent.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-blue-50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-blue-800 mb-4">${career1.title}</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Starting Salary</span>
                            <span class="text-sm font-medium">${career1.salary.starting}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Education Duration</span>
                            <span class="text-sm font-medium">${career1.roadmap.duration}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Difficulty</span>
                            <div class="flex">
                                ${[1,2,3,4,5].map(level => `
                                    <div class="w-2 h-2 bg-${level <= 4 ? 'blue' : 'gray'}-300 rounded-full ml-1"></div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Growth Potential</span>
                            <span class="text-sm font-medium text-green-600">High</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-green-800 mb-4">${career2.title}</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Starting Salary</span>
                            <span class="text-sm font-medium">${career2.salary.starting}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Education Duration</span>
                            <span class="text-sm font-medium">${career2.roadmap.duration}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Difficulty</span>
                            <div class="flex">
                                ${[1,2,3,4,5].map(level => `
                                    <div class="w-2 h-2 bg-${level <= 3 ? 'green' : 'gray'}-300 rounded-full ml-1"></div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Growth Potential</span>
                            <span class="text-sm font-medium text-green-600">Very High</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-800 mb-3">Key Differences</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>${career1.title}:</strong> Better for ${career1.overview.suitableFor.toLowerCase()}
                    </div>
                    <div>
                        <strong>${career2.title}:</strong> Better for ${career2.overview.suitableFor.toLowerCase()}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-center space-x-4 mt-6">
                <button onclick="careerExploration.compareNewCareers()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Compare Different Careers
                </button>
                <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    Close
                </button>
            </div>
        `;
    },
    
    compareNewCareers: function() {
        this.careerComparison = [];
        this.startCareerComparison();
    },
    
    startPracticeAssignment: function(careerId, assignmentIndex) {
        const career = this.findCareerById(careerId);
        if (!career || !career.practice) return;
        
        const assignment = career.practice.assignments[assignmentIndex];
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <h2 class="text-2xl font-bold text-gray-800">Practice Assignment</h2>
                    <p class="text-gray-600 mt-2">${career.title} - Hands-on Experience</p>
                </div>
                
                <div class="p-6">
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                        <h3 class="text-lg font-semibold text-yellow-800 mb-4">Assignment Task</h3>
                        <p class="text-yellow-700 mb-4">${assignment}</p>
                        <div class="bg-white rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-3">Instructions:</p>
                            <ul class="text-sm text-gray-700 space-y-1">
                                <li>• Read the assignment carefully</li>
                                <li>• Complete the task to the best of your ability</li>
                                <li>• This is practice - focus on learning</li>
                                <li>• Take your time to understand the concepts</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                            <textarea class="w-full p-3 border border-gray-300 rounded-lg" rows="8" placeholder="Write your response here..."></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Reflection</label>
                            <textarea class="w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="What did you learn from this assignment?"></textarea>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-4 mt-6">
                        <button onclick="careerExploration.submitAssignment('${careerId}', ${assignmentIndex})" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                            <i class="fas fa-paper-plane mr-2"></i>Submit Assignment
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    submitAssignment: function(careerId, assignmentIndex) {
        // Mark assignment as completed
        const key = `assignment_${careerId}_${assignmentIndex}`;
        this.userProgress[key] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        localStorage.setItem('careerProgress', JSON.stringify(this.userProgress));
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            Assignment submitted successfully!
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
            document.querySelector('.fixed').remove();
        }, 2000);
    },
    
    startCareerQuiz: function(careerId) {
        const career = this.findCareerById(careerId);
        if (!career || !career.quiz) return;
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b p-6">
                    <h2 class="text-2xl font-bold text-gray-800">${career.title} Quiz</h2>
                    <p class="text-gray-600 mt-2">Test your knowledge about this career</p>
                </div>
                
                <div class="p-6">
                    <div id="career-quiz-content">
                        <div class="text-center py-8">
                            <div class="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <i class="fas fa-question-circle text-purple-600 text-3xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-4">Ready to Test Your Knowledge?</h3>
                            <p class="text-gray-600 mb-6">Answer questions about ${career.title} career</p>
                            <button onclick="careerExploration.startQuizQuestions('${careerId}')" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors">
                                Start Quiz <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="border-t p-4 flex justify-end">
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    startQuizQuestions: function(careerId) {
        const career = this.findCareerById(careerId);
        if (!career || !career.quiz) return;
        
        const quizContent = document.getElementById('career-quiz-content');
        let currentQuestion = 0;
        let score = 0;
        
        function showQuestion() {
            if (currentQuestion >= career.quiz.length) {
                showResults();
                return;
            }
            
            const q = career.quiz[currentQuestion];
            quizContent.innerHTML = `
                <div class="max-w-2xl mx-auto">
                    <div class="mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-sm text-gray-600">Question ${currentQuestion + 1} of ${career.quiz.length}</span>
                            <div class="w-32 bg-gray-200 rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full transition-all duration-300" style="width: ${((currentQuestion + 1) / career.quiz.length) * 100}%"></div>
                            </div>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">${q.question}</h3>
                    </div>
                    <div class="space-y-3">
                        ${q.options.map((option, index) => `
                            <button onclick="careerExploration.answerQuizQuestion(${index})" class="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
                                <span class="text-lg font-medium text-gray-700">${String.fromCharCode(65 + index)}.</span> ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        window.careerExploration.answerQuizQuestion = function(selectedIndex) {
            if (selectedIndex === career.quiz[currentQuestion].correct) {
                score++;
            }
            currentQuestion++;
            showQuestion();
        };
        
        function showResults() {
            const percentage = Math.round((score / career.quiz.length) * 100);
            quizContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-20 h-20 bg-${percentage >= 70 ? 'green' : percentage >= 50 ? 'yellow' : 'red'}-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span class="text-2xl font-bold text-${percentage >= 70 ? 'green' : percentage >= 50 ? 'yellow' : 'red'}-600">${percentage}%</span>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h3>
                    <p class="text-gray-600 mb-6">You scored ${score} out of ${career.quiz.length}</p>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-blue-800 mb-2">Career Knowledge Level</h4>
                        <p class="text-blue-700 text-sm">
                            ${percentage >= 80 ? 'Excellent! You have great knowledge about this career.' :
                              percentage >= 60 ? 'Good! You understand the basics well.' :
                              'Keep learning! This career has many interesting aspects to explore.'}
                        </p>
                    </div>
                    
                    <div class="flex justify-center space-x-4">
                        <button onclick="careerExploration.viewCareerDetails('${careerId}')" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                            Review Career Details
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            `;
        }
        
        showQuestion();
    }
};
