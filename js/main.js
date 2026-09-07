// ============================================
// MAIN ENTRY POINT
// Loads all modules and initializes the application
// ============================================

// Global animation variables
let pendulumAnimation = null;
let projectileAnimation = null;
let collisionAnimation = null;
let gasAnimation = null;
let circuitAnimation = null;
let heatAnimation = null;
let radioactivityAnimation = null;
let standingWavesAnimation = null;
let dopplerAnimation = null;

// Lab variables
let baseVolume = 0;
let currentPH = 3.0;

// Chat variables
let currentChatRoom = null;

// Current section tracking
let currentSection = 'home';

// DOM Content Loaded - Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize marketplace
    loadMarketplace();
    
    // Initialize community
    loadCommunity();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update online users periodically
    setInterval(updateOnlineUsers, 30000);
});

function setupEventListeners() {
    // Chat input event listener
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendCommunityMessage();
            }
        });
    }
    
    // Marketplace form submission
    const sellBookForm = document.getElementById('sell-book-form');
    if (sellBookForm) {
        sellBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('book-title').value;
            const author = document.getElementById('book-author').value;
            const category = document.getElementById('book-category').value;
            const condition = document.getElementById('book-condition').value;
            const price = parseInt(document.getElementById('book-price').value);
            const originalPrice = parseInt(document.getElementById('book-original-price').value) || 0;
            
            if (title && author && category && condition && price) {
                const newBook = {
                    id: Date.now(),
                    title: title,
                    author: author,
                    category: category,
                    condition: condition,
                    price: price,
                    originalPrice: originalPrice,
                    seller: 'You'
                };
                
                marketplaceBooks.push(newBook);
                myListings.push(newBook);
                
                transactions.push({
                    type: 'sale',
                    bookTitle: title,
                    price: price,
                    date: new Date(),
                    status: 'listed'
                });
                
                loadMarketplace();
                updateMyListings();
                updateTransactionHistory();
                closeSellBookModal();
                
                alert('Book listed successfully!');
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // AI Chat input event listener
    const aiChatInput = document.getElementById('ai-chat-input');
    if (aiChatInput) {
        aiChatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Export functions to global scope for HTML onclick handlers
window.showSection = showSection;
window.loadMarketplace = loadMarketplace;
window.filterMarketplace = filterMarketplace;
window.showSellBookModal = showSellBookModal;
window.closeSellBookModal = closeSellBookModal;
window.buyBook = buyBook;
window.loadBooks = loadBooks;
window.filterBooks = filterBooks;
window.viewBook = viewBook;
window.loadCommunity = loadCommunity;
window.joinChatRoom = joinChatRoom;
window.sendCommunityMessage = sendCommunityMessage;
window.createNewRoom = createNewRoom;
window.loadProfile = loadProfile;
window.addCredits = addCredits;
window.viewCreditHistory = viewCreditHistory;
window.transferCredits = transferCredits;
window.removeListing = removeListing;
window.startPhysicsLab = startPhysicsLab;
window.startChemistryLab = startChemistryLab;
window.startBiologyLab = startBiologyLab;
window.closeLabModal = closeLabModal;
window.openPhysicsModule = openPhysicsModule;
window.openLifeSkillsModule = openLifeSkillsModule;
window.sendMessage = sendMessage;
window.configureAI = configureAI;
window.updateAIStatus = updateAIStatus;

// Lab animation functions
window.startPendulumAnimation = startPendulumAnimation;
window.pausePendulumAnimation = pausePendulumAnimation;
window.resetPendulumAnimation = resetPendulumAnimation;
window.updatePendulumParams = updatePendulumParams;
window.startProjectileAnimation = startProjectileAnimation;
window.pauseProjectileAnimation = pauseProjectileAnimation;
window.resetProjectileAnimation = resetProjectileAnimation;
window.updateProjectileParams = updateProjectileParams;
window.startCollisionAnimation = startCollisionAnimation;
window.pauseCollisionAnimation = pauseCollisionAnimation;
window.resetCollisionAnimation = resetCollisionAnimation;
window.updateCollisionParams = updateCollisionParams;
window.startGasAnimation = startGasAnimation;
window.pauseGasAnimation = pauseGasAnimation;
window.resetGasAnimation = resetGasAnimation;
window.updateGasParams = updateGasParams;
window.startCircuitAnimation = startCircuitAnimation;
window.pauseCircuitAnimation = pauseCircuitAnimation;
window.resetCircuitAnimation = resetCircuitAnimation;
window.updateCircuitParams = updateCircuitParams;
window.startRefractionAnimation = startRefractionAnimation;
window.resetRefractionAnimation = resetRefractionAnimation;
window.updateRefractionParams = updateRefractionParams;
window.startHeatAnimation = startHeatAnimation;
window.pauseHeatAnimation = pauseHeatAnimation;
window.resetHeatAnimation = resetHeatAnimation;
window.updateHeatParams = updateHeatParams;
window.startRadioactivityAnimation = startRadioactivityAnimation;
window.pauseRadioactivityAnimation = pauseRadioactivityAnimation;
window.resetRadioactivityAnimation = resetRadioactivityAnimation;
window.updateRadioactivityParams = updateRadioactivityParams;
window.startStandingWavesAnimation = startStandingWavesAnimation;
window.pauseStandingWavesAnimation = pauseStandingWavesAnimation;
window.resetStandingWavesAnimation = resetStandingWavesAnimation;
window.updateStandingWavesParams = updateStandingWavesParams;
window.startDopplerAnimation = startDopplerAnimation;
window.pauseDopplerAnimation = pauseDopplerAnimation;
window.resetDopplerAnimation = resetDopplerAnimation;
window.updateDopplerParams = updateDopplerParams;

// Chemistry lab functions
window.addBase = addBase;
window.resetTitration = resetTitration;
window.showReaction = showReaction;
window.showCellDivision = showCellDivision;
window.animateDNA = animateDNA;
window.calculateSolution = calculateSolution;
window.calculateDilution = calculateDilution;
window.setCompound = setCompound;

// Experiment functions
window.openPhysicsExperiment = openPhysicsExperiment;
window.startPhysicsExperiment = startPhysicsExperiment;
window.loadExperimentContent = loadExperimentContent;
window.closeExperimentDemo = closeExperimentDemo;
window.closeExperimentDemoToLab = closeExperimentDemoToLab;
window.openLifeSkillsLesson = openLifeSkillsLesson;
