// ============================================
// PROFILE MODULE
// Handles user profile and credit management
// ============================================

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
    if (!listingsDiv) return;
    
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
    if (!historyDiv) return;
    
    if (transactions.length === 0) {
        historyDiv.innerHTML = '<p class="text-gray-500">No transactions yet</p>';
        return;
    }
    
    historyDiv.innerHTML = transactions.slice(-5).reverse().map(transaction => `
        <div class="border rounded p-3">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold text-sm">${transaction.type === 'purchase' ? 'Bought' : transaction.type === 'sale' ? 'Sold' : transaction.type === 'add_credits' ? 'Added Credits' : 'Transaction'}: ${transaction.bookTitle || transaction.type}</p>
                    <p class="text-xs text-gray-600">${transaction.type === 'purchase' ? 'From: ' + transaction.seller : transaction.type === 'sale' ? 'To: ' + transaction.buyer : ''}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-semibold ${transaction.type === 'purchase' ? 'text-red-600' : 'text-green-600'}">
                        ${transaction.type === 'purchase' ? '-' : '+'}${transaction.price || transaction.amount || 0} credits
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
            history += `Added ${transaction.amount} credits\n`;
        } else {
            history += `Sold "${transaction.bookTitle}" for ${transaction.price} credits\n`;
        }
    });
    
    alert(history);
}

function transferCredits() {
    const recipient = prompt('Enter recipient username:');
    if (!recipient) return;
    
    const amount = prompt('Enter amount of credits to transfer:');
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Invalid amount');
        return;
    }
    
    const creditsToTransfer = parseInt(amount);
    
    if (creditsToTransfer > userCredits) {
        alert('Insufficient credits');
        return;
    }
    
    if (confirm(`Transfer ${creditsToTransfer} credits to ${recipient}?`)) {
        userCredits -= creditsToTransfer;
        
        transactions.push({
            type: 'transfer',
            recipient: recipient,
            amount: creditsToTransfer,
            date: new Date(),
            status: 'completed'
        });
        
        updateCreditsDisplay();
        updateTransactionHistory();
        alert(`Successfully transferred ${creditsToTransfer} credits to ${recipient}!`);
    }
}

function removeListing(bookId) {
    if (confirm('Are you sure you want to remove this listing?')) {
        myListings = myListings.filter(book => book.id !== bookId);
        updateMyListings();
        alert('Listing removed successfully!');
    }
}
