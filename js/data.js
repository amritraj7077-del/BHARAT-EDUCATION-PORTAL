// ============================================
// DATA MODULE
// Contains all data structures and global variables
// ============================================

// Global variables
let currentSection = 'home';
let aiApiKey = '';
let aiApiEndpoint = 'https://api.openai.com/v1/chat/completions';
let useRealAI = false;
let chatHistory = [];

// Marketplace and Credit System
let userCredits = 500;
let marketplaceBooks = [];
let myListings = [];
let transactions = [];

// Community Chat System
let currentUser = {
    name: 'Student',
    avatar: '👨‍🎓'
};

let chatRooms = {
    general: {
        name: 'General Discussion',
        description: 'Talk about anything related to studies',
        icon: 'fa-comments',
        color: 'blue',
        onlineCount: 25,
        messages: [
            {
                id: 1,
                user: 'Rahul Sharma',
                avatar: '👨‍🎓',
                message: 'Has anyone started preparing for JEE?',
                timestamp: new Date(Date.now() - 3600000),
                isOwn: false
            },
            {
                id: 2,
                user: 'Priya Patel',
                avatar: '👩‍🎓',
                message: 'Yes! I\'m focusing on Physics first',
                timestamp: new Date(Date.now() - 3000000),
                isOwn: false
            },
            {
                id: 3,
                user: 'Amit Kumar',
                avatar: '👨‍🏫',
                message: 'Good strategy! Don\'t forget Chemistry though',
                timestamp: new Date(Date.now() - 2400000),
                isOwn: false
            }
        ]
    },
    physics: {
        name: 'Physics Help',
        description: 'Get help with physics problems',
        icon: 'fa-atom',
        color: 'green',
        onlineCount: 15,
        messages: [
            {
                id: 1,
                user: 'Neha Singh',
                avatar: '👩‍🎓',
                message: 'Can someone explain Newton\'s laws?',
                timestamp: new Date(Date.now() - 1800000),
                isOwn: false
            }
        ]
    },
    mathematics: {
        name: 'Mathematics Hub',
        description: 'Discuss math problems and solutions',
        icon: 'fa-calculator',
        color: 'purple',
        onlineCount: 20,
        messages: []
    },
    chemistry: {
        name: 'Chemistry Lab',
        description: 'Chemistry doubts and discussions',
        icon: 'fa-flask',
        color: 'orange',
        onlineCount: 12,
        messages: []
    }
};

let currentChatRoom = null;

// Digital Library Books
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

// Chemistry lab variables
let baseVolume = 0;
let currentPH = 3.0;

// Animation variables
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
