"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, ArrowUp } from "lucide-react";
import { useGlobalContext } from "@/context/context";
import Loading from "./loading";


export default function Chat() {
    // const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const [input, setInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const {insertMessage, isCleanDataLoading,} = useGlobalContext();

    // const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = () => {
        if (!input.trim()) return;

        insertMessage(input);
        setInput("");
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };
    // Auto-scroll to bottom when messages change
    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [chat]);

    return (
        <Card className="w-full h-full flex border-none flex-col relative">
            <CardHeader className="text-lg font-semibold border-b border-gray-800 p-1">Chat</CardHeader>

            <CardContent className="h-full overflow-hidden border-none mt-4 relative">
                        {isCleanDataLoading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-transparent backdrop-blur-sm">
                                <Loading />
                            </div>
                            )}
                <ScrollArea className="w-full h-full">
                    <div className="space-y-2">
                        {/* Invisible div to scroll to */}
                        {/* <div ref={messagesEndRef} /> */}
                    </div>
                </ScrollArea>
            </CardContent>

            <div className="flex sticky bottom-0 border-t border-gray-800 z-10">
                <div className="secondaryBg m-1 p-2 rounded-lg flex items-start gap-1 w-full">
                    {/* Attach File Button */}
                    <button
                        type="button"
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv,.txt,.xlsx,.json"
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a follow up..."
                        className="flex-1 resize-none border-none focus:outline-none"
                    />

                    {/* Send Button */}
                    <button
                        type="button"
                        className="text-primary hover:text-primary-dark"
                        onClick={sendMessage}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Card>
    );
}