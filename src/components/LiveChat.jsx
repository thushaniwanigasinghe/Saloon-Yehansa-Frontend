import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { X, Send } from 'lucide-react';

const socket = io(`${import.meta.env.VITE_FRONTEND_URL}`);

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const room = user ? user._id : 'guest_' + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    socket.emit('join_room', room);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      const messageData = {
        room,
        author: user ? user.name : 'Guest',
        message: input,
        time: new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0')
      };
      
      socket.emit('send_message', messageData);
      setInput('');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-1.5 rounded-full bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:scale-110 transition-all duration-300 z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <img src="/chatbot_avatar.png" alt="Chat Support" className="w-12 h-12 rounded-full object-cover border border-stone-300 dark:border-white/20 bg-white dark:bg-neutral-900" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transform transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-stone-50 dark:bg-neutral-950 p-4 border-b border-stone-200 dark:border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/chatbot_avatar.png" alt="Chat Support" className="w-10 h-10 rounded-full object-cover border border-stone-300 dark:border-white/20" />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-neutral-950 animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-stone-900 dark:text-white font-medium">Live Support</h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-900/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                Send us a message and we'll reply shortly.
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.author === (user ? user.name : 'Guest') ? 'items-end' : 'items-start'}`}>
                <div className="text-xs text-gray-500 mb-1 px-1">{msg.author}</div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.author === (user ? user.name : 'Guest') ? 'bg-yellow-500 text-black rounded-tr-sm' : 'bg-stone-100 dark:bg-white/10 text-stone-900 dark:text-white rounded-tl-sm'}`}>
                  {msg.message}
                </div>
                <div className="text-[10px] text-gray-600 mt-1 px-1">{msg.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-stone-50 dark:bg-neutral-950 border-t border-stone-200 dark:border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white dark:bg-white/5 shadow-sm dark:shadow-none text-stone-900 dark:text-white border border-stone-200 dark:border-white/10 rounded-full px-4 py-2 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
            />
            <button type="submit" className="bg-yellow-500 text-black p-2 rounded-full hover:bg-neutral-800 dark:hover:bg-yellow-400 transition-colors flex-shrink-0">
              <Send size={20} className="ml-[-2px] mt-[1px]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default LiveChat;
