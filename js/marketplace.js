// ============================================
// MARKETPLACE MODULE
// Handles book marketplace functionality
// ============================================

// Marketplace Functions
function loadMarketplace(category = 'all') {
    const marketplaceGrid = document.getElementById('marketplace-grid');
    if (!marketplaceGrid) return;
    
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
