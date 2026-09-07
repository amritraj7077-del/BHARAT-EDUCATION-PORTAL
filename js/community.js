// ============================================
// COMMUNITY MODULE
// Handles community chat functionality
// ============================================

// Community Chat Functions
function loadCommunity() {
    const roomsContainer = document.getElementById('chat-rooms');
    if (!roomsContainer) return;
    
    roomsContainer.innerHTML = Object.entries(chatRooms).map(([roomId, room]) => `
        <div class="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer" onclick="joinChatRoom('${roomId}')">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-${room.color}-500 to-${room.color}-600 rounded-full flex items-center justify-center">
                        <i class="fas ${room.icon} text-white"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800">${room.name}</h4>
                        <p class="text-sm text-gray-600">${room.description}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-600"><i class="fas fa-users mr-1"></i>${room.onlineCount} online</p>
                    <p class="text-xs text-gray-500">${room.messageCount} messages</p>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-xs bg-${room.color}-100 text-${room.color}-800 px-2 py-1 rounded-full">
                    ${room.category}
                </span>
                <button class="text-${room.color}-500 hover:text-${room.color}-600 text-sm font-semibold">
                    Join Room <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function joinChatRoom(roomId) {
    const room = chatRooms[roomId];
    if (!room) return;
    
    currentChatRoom = roomId;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div class="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-${room.color}-500 to-${room.color}-600 rounded-full flex items-center justify-center">
                        <i class="fas ${room.icon} text-white"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">${room.name}</h2>
                        <p class="text-sm text-gray-600">${room.onlineCount} members online</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="leaveChatRoom()" class="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>Leave
                    </button>
                    <button onclick="leaveChatRoom()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
            </div>
            
            <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            </div>
            
            <div class="sticky bottom-0 bg-white border-t p-4">
                <div class="flex space-x-3">
                    <input type="text" id="chat-input" placeholder="Type your message..." 
                           class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           onkeypress="if(event.key === 'Enter') sendCommunityMessage()">
                    <button onclick="sendCommunityMessage()" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-paper-plane mr-2"></i>Send
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    loadChatMessages(roomId);
}

function leaveChatRoom() {
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => modal.remove());
    currentChatRoom = null;
}

function loadChatMessages(roomId) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const room = chatRooms[roomId];
    if (!room || !room.messages) return;
    
    messagesContainer.innerHTML = room.messages.map(msg => `
        <div class="flex ${msg.isMine ? 'justify-end' : 'justify-start'}">
            <div class="max-w-xs lg:max-w-md ${msg.isMine ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg p-3 shadow">
                ${!msg.isMine ? `<p class="text-xs text-gray-600 mb-1">${msg.sender}</p>` : ''}
                <p class="text-sm">${msg.text}</p>
                <p class="text-xs ${msg.isMine ? 'text-blue-100' : 'text-gray-500'} mt-1">${formatMessageTime(msg.time)}</p>
            </div>
        </div>
    `).join('');
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendCommunityMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || !currentChatRoom) return;
    
    const room = chatRooms[currentChatRoom];
    if (!room) return;
    
    // Add user message
    room.messages.push({
        sender: 'You',
        text: message,
        time: new Date(),
        isMine: true
    });
    
    room.messageCount++;
    input.value = '';
    
    loadChatMessages(currentChatRoom);
    
    // Simulate response after delay
    setTimeout(() => {
        simulateChatResponse(currentChatRoom);
    }, 1000 + Math.random() * 2000);
}

function simulateChatResponse(roomId) {
    const room = chatRooms[roomId];
    if (!room) return;
    
    const responses = [
        "That's a great question! Let me think about it...",
        "I agree with you on that point.",
        "Has anyone tried the new physics lab experiment?",
        "Can someone help me with the chemistry homework?",
        "The AI tutor is really helpful for math problems!",
        "I just finished the pendulum simulation, it was cool!",
        "Does anyone have notes for the upcoming exam?",
        "The marketplace has some great deals on textbooks!",
        "I'm struggling with projectile motion, any tips?",
        "The digital library has excellent resources for this topic."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomUser = room.members[Math.floor(Math.random() * room.members.length)];
    
    room.messages.push({
        sender: randomUser,
        text: randomResponse,
        time: new Date(),
        isMine: false
    });
    
    room.messageCount++;
    
    if (currentChatRoom === roomId) {
        loadChatMessages(roomId);
    }
}

function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function createNewRoom() {
    const roomName = prompt('Enter room name:');
    if (!roomName) return;
    
    const roomDescription = prompt('Enter room description:');
    const roomCategory = prompt('Enter category (study, general, help):');
    
    const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
    
    chatRooms[roomId] = {
        name: roomName,
        description: roomDescription || 'General discussion',
        category: roomCategory || 'general',
        icon: 'fa-comments',
        color: 'purple',
        onlineCount: 1,
        messageCount: 0,
        members: ['You', 'Student1', 'Student2', 'Student3'],
        messages: []
    };
    
    loadCommunity();
    alert(`Room "${roomName}" created successfully!`);
}

function updateOnlineUsers() {
    // Simulate online user count changes
    Object.keys(chatRooms).forEach(roomId => {
        const room = chatRooms[roomId];
        const change = Math.floor(Math.random() * 5) - 2;
        room.onlineCount = Math.max(1, room.onlineCount + change);
    });
    
    loadCommunity();
}
