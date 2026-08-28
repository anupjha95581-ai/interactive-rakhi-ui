# 🎁 Interactive Virtual Rakhi UI

An over-engineered, highly interactive web application built to celebrate Raksha Bandhan (and roast your siblings). 

This project combines complex 3D CSS illusions, physics-based animations, and artificial intelligence to create a memorable, personalized digital gifting experience.

![Preview Image](https://via.placeholder.com/800x400?text=Drop+a+screenshot+of+your+app+here!)

## ✨ Key Features

*   📜 **3D Physics Scroll:** A realistic unrolling parchment effect using Flexbox and Framer Motion, complete with dynamic inner shadows that mimic paper curving around wooden rollers.
*   🤖 **AI Sibling Bot:** Integrated with the Google Gemini 3.5-flash API to generate custom "roasts" or "toasts" based on classic sibling rivalry.
*   💸 **Interactive Shagun Transfer:** A state-managed, comic animation sequence simulating a virtual money transfer, complete with audio triggers and confetti.
*   🎭 **The Grand Finale:** A dynamic, heavy velvet curtain drop featuring realistic spring physics, swaying fabric gradients, and gravity-affected firecracker particle effects.
*   📱 **Fully Responsive:** Beautifully framed "premium paper" UI that scales perfectly across mobile devices and desktop screens.

## 🛠️ Tech Stack

*   **Framework:** React + Vite
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **AI Integration:** Google Gemini API (3.5-flash)

---

## 🚀 Getting Started

Want to customize this for your own sibling? Follow these steps to get the project running locally.

### 1. Clone the Repository
`git clone https://github.com/anupjha95581-ai/interactive-rakhi-ui.git`
`cd interactive-rakhi-ui`

### 2. Install Dependencies
`npm install`

### 3. Set Up Your Environment Variables
This app uses the Google Gemini API for the sibling bot. You will need to get a free API key from Google AI Studio.

Create a file named `.env` in the root of your project and add your key:
`VITE_GEMINI_API_KEY="your_actual_api_key_here"`

### 4. Run the Development Server
`npm run dev`

Open `http://localhost:5173` in your browser to view the app!

---

## 🎨 How to Customize

You can easily repurpose this app for different siblings or friends without changing the core logic:

1.  **Text & Inside Jokes:** Open `src/App.jsx` and modify the text within the `<motion.div>` content blocks to personalize the messaging.
2.  **Images:** Swap out the default images in the `public/images` (or `src/assets`) folder. Make sure to keep the same file names (e.g., `rakhi-art.png`) to avoid breaking the image paths, or update the paths in the code accordingly.
3.  **App Title & Icon:** Update the `<title>` and `<link rel="icon">` tags inside the `index.html` file to customize the browser tab.

## 📦 Deployment

This project is optimized for easy deployment on platforms like Netlify or Vercel. 

`npm run build`

Upload the newly generated `dist` folder to your hosting provider, and your app is live! 

*(Note: Because the API key is handled on the client side, do not share your live URL publicly if you want to protect your Gemini API quota. Keep it in the family!)*

---

*Built with ❤️ (and a little sibling rivalry).*
