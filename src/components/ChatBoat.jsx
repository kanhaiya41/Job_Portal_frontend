import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { FaComments, FaCircle } from "react-icons/fa";
import { toast } from "sonner";
import { Send, X } from "lucide-react";
import axios from "axios";
import './ChatBot.css';
import { BASE_URL } from "@/utils/constant";

// Mistral AI API integration via backend
const API_URL = `${BASE_URL}/chatboat/ask`;
const ChatBot = () => {
    const [chatBotOpen, setChatBotOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi there! How can I help you today?" },
        { sender: "bot", text: "I can answer questions about jobs and career growth." },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([
        "Job Opportunities",
        "Application Tips",
        "Interview Prep",
        "Resume Help",
        "Salary Advice",
        "Career Growth",
    ]);

    const messagesEndRef = useRef(null);

    const generateMistralResponse = async (userInput) => {
        try {
            const response = await axios.post(
                API_URL,
                {
                    message: userInput
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    timeout: 15000,
                }
            );

            const aiResponse = response.data.message;

            return aiResponse;
        } catch (error) {
            console.error("Error:", error);
            return "Sorry, I couldn't process that. Please try again.";
        }
    };

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: message }]);
        setNewMessage("");
        setLoading(true);

        try {
            const botResponse = await generateMistralResponse(message);
            simulateTypingEffect(botResponse);
        } catch (error) {
            toast.error("Connection error");
            setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't connect. Try again later." }]);
            setLoading(false);
        }
    };

    const simulateTypingEffect = (fullMessage) => {
        const words = fullMessage.split(" ");
        let currentMessage = "";
        let index = 0;

        setMessages((prev) => [...prev, { sender: "bot", text: "..." }]);

        const typingInterval = setInterval(() => {
            if (index < words.length) {
                currentMessage += (index > 0 ? " " : "") + words[index];
                index++;

                setMessages((prev) =>
                    prev.map((msg, idx) =>
                        idx === prev.length - 1
                            ? { sender: "bot", text: currentMessage }
                            : msg
                    )
                );
            } else {
                clearInterval(typingInterval);
                setLoading(false);
            }
        }, 50); // Even faster typing for short messages
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Check if categories should be shown
    const shouldShowCategories = messages.length === 2 && messages[0].sender === "bot" && messages[1].sender === "bot";

    return (
        <div className="fixed bottom-4 right-4 z-50">
            { chatBotOpen ? (
                <Card className="w-72 max-w-xs p-3 flex flex-col space-y-3 shadow-lg bg-white border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <h2 className="font-bold text-sm text-slate-900">
                                Hire Hub Chat
                            </h2>
                            <FaCircle className="text-green-500 text-xs" />
                        </div>
                        <Button
                            variant="ghost"
                            onClick={ () => setChatBotOpen(false) }
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-1 h-8 w-8"
                        >
                            <X size={ 16 } />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 bg-slate-50 rounded-md p-2 max-h-56">
                        { messages.map((message, index) => (
                            <div
                                key={ index }
                                className={ `flex ${message.sender === "user" ? "justify-end" : "justify-start"}` }
                            >
                                <div
                                    className={ `p-2 rounded-lg max-w-full text-sm ${message.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-100 text-slate-900"
                                        }` }
                                >
                                    { message.text }
                                </div>
                            </div>
                        )) }
                        { loading && (
                            <div className="flex justify-start ml-1">
                                <div className="loader"></div>
                            </div>
                        ) }
                        <div ref={ messagesEndRef } />
                    </div>
                    { shouldShowCategories && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            { categories.map((category, idx) => (
                                <Button
                                    key={ idx }
                                    className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs"
                                    onClick={ () => handleSendMessage(category) }
                                >
                                    { category }
                                </Button>
                            )) }
                        </div>
                    ) }
                    <div className="flex items-center space-x-1 mt-2">
                        <Input
                            placeholder="Type a message..."
                            value={ newMessage }
                            onChange={ (e) => setNewMessage(e.target.value) }
                            onKeyPress={ (e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage(newMessage);
                                }
                            } }
                            className="flex-1 border-slate-300 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 h-8"
                        />
                        <Button
                            onClick={ () => handleSendMessage(newMessage) }
                            className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8 p-1"
                            disabled={ loading }
                        >
                            <Send size={ 16 } />
                        </Button>
                    </div>
                </Card>
            ) : (
                <Button
                    onClick={ () => setChatBotOpen(true) }
                    className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 bounce"
                >
                    <FaComments className="text-lg" />
                    <span className="text-sm">ASK ME</span>
                </Button>
            ) }
        </div>
    );
};

export default ChatBot;