# Bharat Education Portal

A web-based educational platform for students with AI chat assistance, virtual labs, digital library, marketplace, and community features.

## Features

- **AI Chat Assistant** - Get help with physics, chemistry, biology, and math questions
- **Virtual Physics Lab** - Interactive simulations for experiments
- **Digital Library** - Browse and access educational books
- **Student Marketplace** - Buy and sell used textbooks
- **Community Chat** - Connect with other students in subject-specific chat rooms
- **Life Skills** - Learn practical skills like financial management and communication

## How to Run

1. Open `index.html` in your web browser, or
2. Run a local server:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit http://localhost:8000

## Project Structure

```
BHARAT-EDUCATION-PORTAL-main/
├── index.html          # Main application
├── js/
│   └── script.js       # All JavaScript code
├── pages/
│   ├── login.html      # Login page
│   ├── signup.html     # Signup page
│   └── API_SETUP.html  # AI API setup guide
└── README.md
```

## Demo Login

- Email: student@bharat.edu
- Password: password123

## AI Chat Setup (Optional)

To use real AI responses instead of mock responses:
1. Get an OpenAI API key from https://platform.openai.com
2. In the AI Chat section, click "Configure"
3. Enter your API key

## Tech Stack

- HTML5, CSS3, JavaScript
- Tailwind CSS for styling
- Font Awesome for icons
- Canvas API for lab simulations