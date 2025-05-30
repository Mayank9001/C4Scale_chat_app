import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Settings, Plus, ArrowUp, Menu, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastChat");
    const allChats = JSON.parse(localStorage.getItem("savedChats")) || [];
    if (saved) setMessages(JSON.parse(saved));
    setSavedChats(allChats);
  }, []);

  useEffect(() => {
    localStorage.setItem("lastChat", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleUnload = () =>
      localStorage.setItem("lastChat", JSON.stringify(messages));
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [messages]);
  // MayankVishwakarma
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
  
    try {
      const res = await fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });
  
      const data = await res.json();
      const reply = data.reply || "No reply";
  
      const systemMessage = { sender: "system", text: reply };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Error getting reply." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const createNewChat = () => {
    if (messages.length) {
      const updated = [...savedChats, messages];
      setSavedChats(updated);
      localStorage.setItem("savedChats", JSON.stringify(updated));
    }
    setMessages([]);
  };

  const loadChat = (index) => {
    setMessages(savedChats[index]);
    setSidebarOpen(false);
  };

  const deleteChat = (index) => {
    const updated = [...savedChats];
    updated.splice(index, 1);
    setSavedChats(updated);
    localStorage.setItem("savedChats", JSON.stringify(updated));
  };
  // NarutoUzumaki
  const getChatSummary = (chat, idx) => {
    const firstUserMsg = chat.find((m) => m.sender === "user");
    return firstUserMsg
      ? `${firstUserMsg.text.slice(0, 30)}${
          firstUserMsg.text.length > 30 ? "..." : ""
        }`
      : `Chat #${idx + 1}`;
  };

  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row h-screen overflow-hidden",
        darkMode && "bg-slate-700 text-white"
      )}
    >
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex justify-between items-center p-4 bg-white dark:bg-slate-800 shadow-md">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Menu />
        </button>
        <h2 className="text-lg font-bold truncate max-w-[60%]">
          {messages.length > 0 ? getChatSummary(messages, 0) : "New Chat"}
        </h2>
        <div className="w-10" />
      </div>
      {/* MadaraUchiha */}
      <aside
        className={clsx(
          "fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 p-4 transition-transform duration-300 transform md:relative md:translate-x-0 md:flex md:flex-col md:w-72 pt-16 md:pt-4",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Chats</h2>
          <button
            onClick={createNewChat}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
            title="New Chat"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[70vh]">
          {savedChats.length === 0 ? (
            <div className="text-gray-500">No saved chats yet</div>
          ) : (
            savedChats.map((chat, idx) => (
              <div
                key={`chat-${idx}`}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded"
              >
                <button
                  onClick={() => loadChat(idx)}
                  className="flex-1 text-left text-sm truncate hover:underline cursor-pointer"
                >
                  {getChatSummary(chat, idx)}
                </button>
                <button
                  onClick={() => deleteChat(idx)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))
          )}
          {/* HashiramaSenju */}
        </div>
        <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700 mt-auto fixed bottom-4 md:static w-56 md:w-auto">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer">
            <Settings />
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col items-center pt-20 md:pt-4 pb-20 md:pb-4 px-4 w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto w-full max-w-3xl space-y-4 mb-10">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={clsx(
                "flex",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={clsx(
                  "max-w-xs md:max-w-md p-3 rounded-lg",
                  msg.sender === "user"
                    ? "bg-blue-500 text-white text-right"
                    : "bg-gray-300 text-black text-left"
                )}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 pl-4">System is typing...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="w-full max-w-2xl flex items-center fixed bottom-2 px-4">
          <input
            className="flex-1 border-none rounded-2xl pl-5 pr-12 h-12 bg-gray-600 font-manrope placeholder:text-white text-white focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className={clsx(
              "absolute right-6 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer",
              loading
                ? "bg-white opacity-50 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            )}
            disabled={loading}
          >
            <ArrowUp className="text-black w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
