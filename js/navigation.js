// ============================================
// NAVIGATION MODULE
// Handles section switching and navigation
// ============================================

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
