import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPersonaReply } from "./util/gemini";

type PersonaName = "Hitesh" | "Piyush";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const personas : {
  name: PersonaName;
  avatar: string;
  intro: string;
}[]= [
  { name: "Hitesh", avatar: "/hitesh.jpg", intro: "Start a conversation with Hitesh Choudhary" },
  { name: "Piyush", avatar: "/piyush.jpg", intro: "Start a conversation with Piyush Garg" }
];

export default function PersonaChat() {
  const [activePersona, setActivePersona] = useState(0);
  const [chats, setChats] = useState<{ [key: number]: Message[] }>({ 0: [], 1: [] });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedChats = { ...chats };
    updatedChats[activePersona] = [
      ...updatedChats[activePersona],
      { sender: "user", text: input }
    ];
    setChats(updatedChats);
    setInput("");
    setLoading(true);

    try {
      const reply = await getPersonaReply(personas[activePersona].name, updatedChats[activePersona]);
      updatedChats[activePersona] = [
        ...updatedChats[activePersona],
        { sender: "bot", text: reply }
      ];
      setChats(updatedChats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ Option 1: Quick question suggestions for user
  const quickOptions = [
    "Tell me about yourself",
    "What’s your top tip for beginners?",
    "Explain a concept in simple words",
    "Share something interesting"
  ];

  const handleQuickOptionClick = (text: string) => {
    setInput(text);
    sendMessageWithPreset(text);
  };

  const sendMessageWithPreset = async (preset: string) => {
    if (!preset.trim()) return;

    const updatedChats = { ...chats };
    updatedChats[activePersona] = [
      ...updatedChats[activePersona],
      { sender: "user", text: preset }
    ];
    setChats(updatedChats);
    setLoading(true);

    try {
      const reply = await getPersonaReply(personas[activePersona].name, updatedChats[activePersona]);
      updatedChats[activePersona] = [
        ...updatedChats[activePersona],
        { sender: "bot", text: reply }
      ];
      setChats(updatedChats);
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
        <ScrollArea className="flex-1 p-4">
          {chats[activePersona].length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <img src={personas[activePersona].avatar} className="w-20 h-20 rounded-full mb-4 border-2 border-gray-600" />
              <p className="font-medium text-white">{personas[activePersona].intro}</p>
              <span className="text-sm">Ask anything you'd like to know!</span>
              {/* ⬇️ Option 1 buttons */}
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
            chats[activePersona].map((msg, idx) => (
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
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                    U
                  </div>
                )}
              </div>
            ))
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
