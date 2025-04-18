# 🧠 Groq Chatbot UI

A responsive, minimal AI chatbot built with **React**, **Vite**, and **Tailwind CSS**, powered by **Groq's LLaMA 3.3 70B Versatile** model. It features persistent chat history, dark mode toggle, and multi-chat session support.

---

## ✨ Features

- ✅ Chat with the Groq LLaMA-3.3-70B model
- ✅ Chat history saved in `localStorage`
- ✅ Start new conversations
- ✅ Load and delete saved chats
- ✅ Dark / Light mode toggle
- ✅ Mobile responsive layout
- ✅ Markdown rendering for AI responses

---

## ⚙️ Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq SDK](https://www.npmjs.com/package/groq-sdk)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Lucide Icons](https://lucide.dev/icons)

---

## 💠 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Mayank9001/c4scale_chat_app
cd c4scale_chat_app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your API Key

Create a `.env` file in the root folder:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> 🔐 You can get your API key from [Here](https://console.groq.com/keys)

---

## 🧪 Running the App

### Development Mode

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
```

### Preview Production Build Locally

```bash
npm run preview
```

---

## 🗂️ Project Structure

```
groq-chatbot-ui/
├── public/                  # Static assets
├── src/
    ├──pages/
        ├──Home.jsx          # Main Chat App Component
│   ├── main.jsx             # App entry point
│   ├── App.jsx              # Uses the Home.jsx to render the App
│   └── index.css            # Tailwind and custom styles
├── .env                     # API key config
├── package.json
└── vite.config.js
```

---

## 🧑‍💻 Author

Developed by [Mayank Vishwakarma](https://github.com/Mayank9001)

---

## 📸 Preview

![alt text](<Screenshot (25).png>) ![alt text](<Screenshot (21).png>) ![alt text](<Screenshot (22).png>) ![alt text](<Screenshot (23).png>) ![alt text](<Screenshot (24).png>)
