import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Settings, Plus, ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const chatEndRef = useRef(null);

  // Load chats on mount
  useEffect(() => {
    const saved = localStorage.getItem("lastChat");
    const allChats = JSON.parse(localStorage.getItem("savedChats")) || [];
    if (saved) {
      setMessages(JSON.parse(saved));
    }
    setSavedChats(allChats);
    setHasLoaded(true);
  }, []);

  // Save current chat whenever messages change
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("lastChat", JSON.stringify(messages));
    }
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasLoaded]);

  // Save chat on unload (page close)
  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem("lastChat", JSON.stringify(messages));
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [messages]);

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

      if (res.status === 200) {
        const data = await res.json();
        const systemMessage = {
          sender: "system",
          text: data.reply,
        };
        setMessages((prev) => [...prev, systemMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "system", text: "Error fetching response." },
        ]);
      }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = () => {
    if (messages.length) {
      const updatedChats = [...savedChats, messages];
      setSavedChats(updatedChats);
      localStorage.setItem("savedChats", JSON.stringify(updatedChats));
    }
    setMessages([]);
  };

  const loadChat = (index) => {
    setMessages(savedChats[index]);
  };

  return (
    <div
      className={clsx("flex h-screen", darkMode && "bg-slate-700 text-white")}
    >
      {/* Sidebar */}
      <div className="w-72 p-4 flex flex-col justify-between bg-white dark:bg-slate-800">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Chats</h2>
            <button
              onClick={createNewChat}
              className="p-1 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-700 rounded"
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
                <button
                  key={idx}
                  onClick={() => loadChat(idx)}
                  className="w-full cursor-pointer text-left text-sm p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700"
                >
                  Chat #{idx + 1} ({chat.length / 2} msgs)
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
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
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center h-11/12">
        <div className="flex-1 overflow-y-auto pt-4 pb-4 w-xl space-y-4">
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
                  "max-w-xl p-3 rounded-lg",
                  msg.sender === "user"
                    ? "bg-blue-500 text-white text-right w-sm"
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
        {/* Input */}
        <div className="w-xl flex flex-row h-16 fixed bottom-3 ">
          <input
            className="border-none rounded-2xl pl-5 pr-15 w-full bg-gray-600 h-full font-manrope placeholder:text-white placeholder:font-manrope text-white focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className={clsx(
              "w-10 h-10 absolute right-2 top-3 flex items-center justify-center cursor-pointer rounded-full bg-white border border-gray-300",
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"
            )}
            disabled={loading}
          >
            <ArrowUp className="text-black w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
