// ============================================
// LIBRARY MODULE
// Handles digital library functionality
// ============================================

// Library Functions
function loadBooks() {
    const libraryGrid = document.getElementById('library-grid');
    if (!libraryGrid) return;
    
    if (books.length === 0) {
        libraryGrid.innerHTML = '<p class="text-gray-500 col-span-full text-center">No books available in the library.</p>';
        return;
    }
    
    libraryGrid.innerHTML = books.map(book => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden book-card">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <i class="fas fa-book-open text-white text-4xl"></i>
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-1 truncate">${book.title}</h4>
                <p class="text-gray-600 text-sm mb-1">by ${book.author}</p>
                <div class="flex items-center mb-2">
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                    </span>
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-1">
                        ${book.type.charAt(0).toUpperCase() + book.type.slice(1)}
                    </span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-600">Rating: ${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</span>
                </div>
                <p class="text-xs text-gray-600 mb-3">${book.description.substring(0, 80)}...</p>
                <button onclick="viewBook(${book.id})" class="w-full bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 text-sm">
                    <i class="fas fa-eye mr-1"></i>View Details
                </button>
            </div>
        </div>
    `).join('');
}

function filterBooks(category) {
    const libraryGrid = document.getElementById('library-grid');
    if (!libraryGrid) return;
    
    const filteredBooks = category === 'all' ? books : books.filter(book => book.category === category);
    
    if (filteredBooks.length === 0) {
        libraryGrid.innerHTML = '<p class="text-gray-500 col-span-full text-center">No books available in this category.</p>';
        return;
    }
    
    libraryGrid.innerHTML = filteredBooks.map(book => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden book-card">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <i class="fas fa-book-open text-white text-4xl"></i>
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-1 truncate">${book.title}</h4>
                <p class="text-gray-600 text-sm mb-1">by ${book.author}</p>
                <div class="flex items-center mb-2">
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        ${book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                    </span>
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-1">
                        ${book.type.charAt(0).toUpperCase() + book.type.slice(1)}
                    </span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-600">Rating: ${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</span>
                </div>
                <p class="text-xs text-gray-600 mb-3">${book.description.substring(0, 80)}...</p>
                <button onclick="viewBook(${book.id})" class="w-full bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 text-sm">
                    <i class="fas fa-eye mr-1"></i>View Details
                </button>
            </div>
        </div>
    `).join('');
}

function viewBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-800">${book.title}</h2>
                <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <i class="fas fa-times text-gray-600"></i>
                </button>
            </div>
            
            <div class="p-6">
                <div class="flex items-start space-x-4 mb-6">
                    <div class="w-32 h-44 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-book-open text-white text-3xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2">${book.title}</h3>
                        <p class="text-gray-600 mb-2">by ${book.author}</p>
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-yellow-500">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</span>
                            <span class="text-gray-600 text-sm">(${book.rating}/5)</span>
                        </div>
                        <div class="flex space-x-2">
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${book.category}</span>
                            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${book.type}</span>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold mb-2">Description</h4>
                        <p class="text-gray-600">${book.description}</p>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold mb-2">Available Formats</h4>
                        <div class="flex space-x-2">
                            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                                <i class="fas fa-file-pdf mr-1"></i>PDF
                            </button>
                            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
                                <i class="fas fa-book mr-1"></i>ePub
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold mb-2">Related Books</h4>
                        <div class="grid grid-cols-3 gap-2">
                            ${books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 3).map(relatedBook => `
                                <div class="border rounded p-2 text-center cursor-pointer hover:bg-gray-50" onclick="viewBook(${relatedBook.id}); this.closest('.fixed').remove();">
                                    <div class="h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded mb-1 flex items-center justify-center">
                                        <i class="fas fa-book text-white"></i>
                                    </div>
                                    <p class="text-xs font-semibold truncate">${relatedBook.title}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
