import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPersonaReply } from "./util/gemini";
import TypingIndicator from "./components/ui/typing";
import { personas } from "./util/data";
type PersonaName = "Hitesh" | "Piyush";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string
}

// const personas: {
//   name: PersonaName;
//   avatar: string;
//   intro: string;
// }[] = [
//   { name: "Hitesh", avatar: "/hitesh.jpg", intro: "Start a conversation with Hitesh Choudhary" },
//   { name: "Piyush", avatar: "/piyush.jpg", intro: "Start a conversation with Piyush Garg" }
// ];

export default function PersonaChat() {
  const [activePersona, setActivePersona] = useState(0);
  const [chats, setChats] = useState<{ [key: number]: Message[] }>({ 0: [], 1: [] });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  

  //  Invisible marker to scroll into view
  const bottomRef = useRef<HTMLDivElement | null>(null);

  //  Auto-scroll to bottom when chats change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activePersona]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedChats = { ...chats };
    updatedChats[activePersona] = [
      ...updatedChats[activePersona],
      { sender: "user", text: input, timestamp: new Date().toISOString()}
    ];
    setChats(updatedChats);
    setInput("");
    setLoading(true);

    try {
      const reply = await getPersonaReply(activePersona, personas[activePersona].id, updatedChats[activePersona]);
      updatedChats[activePersona] = [
        ...updatedChats[activePersona],
        { sender: "bot", text: reply, timestamp: new Date().toISOString()}
      ];
      setChats({ ...updatedChats });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickOptions = [
    "Tell me about yourself",
    "What's your top tip for beginners?",
    "Explain a concept in simple words",
    "Share something interesting"
  ];

  const handleQuickOptionClick = (text: string) => {
    sendMessageWithPreset(text);
  };

  const sendMessageWithPreset = async (preset: string) => {
    if (!preset.trim()) return;

    const updatedChats = { ...chats };
    updatedChats[activePersona] = [
      ...updatedChats[activePersona],
      { sender: "user", text: preset, timestamp: new Date().toISOString()}
    ];
    setChats(updatedChats);
    setLoading(true);

    try {
      const reply = await getPersonaReply(activePersona, personas[activePersona].id, updatedChats[activePersona]);
      updatedChats[activePersona] = [
        ...updatedChats[activePersona],
        { sender: "bot", text: reply, timestamp: new Date().toISOString()}
      ];
      setChats({ ...updatedChats });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="w-full max-w-3xl p-4 flex items-center justify-between rounded-2xl bg-gray-800 shadow-lg">
        <div className="flex items-center gap-3">
          <img src={personas[activePersona].avatar} alt="" className="w-10 h-10 rounded-full border border-gray-600" />
          <div>
            <h2 className="font-bold text-lg">Persona Chat</h2>
            <p className="text-sm text-gray-400">Chatting with {personas[activePersona].name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {personas.map((p, i) => (
            <Button
              key={i}
              className={
                i === activePersona
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-black"
              }
              onClick={() => setActivePersona(i)}
            >
              {p.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full max-w-3xl flex flex-col flex-1 mt-4 rounded-2xl bg-gray-800 shadow-lg overflow-hidden">
        <ScrollArea className="p-4 h-[calc(100vh-250px)]">
          {chats[activePersona].length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <img src={personas[activePersona].avatar} className="w-20 h-20 rounded-full mb-4 border-2 border-gray-600" />
              <p className="font-medium text-white">{personas[activePersona].intro}</p>
              <span className="text-sm">Ask anything you'd like to know!</span>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {quickOptions.map((opt, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleQuickOptionClick(opt)}
                    className="bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white text-sm"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chats[activePersona].map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 my-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <img src={personas[activePersona].avatar} className="w-8 h-8 rounded-full border border-gray-600" />
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
                    }`}
                  >
                     <div>{msg.text}</div>
                      <div className={`text-xs mt-1 ${
                        msg.sender === "user" ? "text-right text-gray-200" : "text-right text-gray-400"
                      }`}>
                        {new Date(msg.timestamp).toLocaleString([], {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        </div>

                  </div>
                  {msg.sender === "user" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                      U
                    </div>
                  )}

                </div>
              ))}

             {/* Typing indicator for bot */}
              {loading && (
                <div className="flex items-start gap-2 my-3 justify-start px-4">
                  <img
                    src={personas[activePersona].avatar}
                    className="w-8 h-8 rounded-full border border-gray-600"
                  />
                  <div className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-gray-700 bg-gray-800/50 shadow-sm">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms]"></span>
                  </div>
                </div>
              )}             
              {/*  Invisible marker for scroll */}
              <div ref={bottomRef} />
            </>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="flex p-4 border-t border-gray-700 bg-gray-900">
          <Input
            placeholder={`Message ${personas[activePersona].name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="bg-gray-800 text-white border-gray-600 placeholder-gray-400"
          />
          <Button
            onClick={sendMessage}
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
