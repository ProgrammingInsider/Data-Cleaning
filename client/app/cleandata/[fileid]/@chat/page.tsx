"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, ArrowUp } from "lucide-react";

export default function Chat() {
    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const [input, setInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { text: input, sender: "user" }]);
        setInput("");

        // Simulated bot response
        setTimeout(() => {
            setMessages((prev) => [...prev, { text: "This is a bot reply!", sender: "bot" }]);
        }, 1000);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Card className="w-full max-w-lg h-full flex border-none flex-col relative">
            <CardHeader className="text-lg font-semibold border-b border-gray-800 p-4">Chat</CardHeader>

            <CardContent className="flex-1 overflow-hidden border-none mt-4">
                <ScrollArea className="h-full w-full">
                    <div className="space-y-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                                    msg.sender === "user"
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "mr-auto bg-secondary text-secondary-foreground"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {/* Invisible div to scroll to */}
                        <div ref={messagesEndRef} />
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


// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Paperclip, ArrowUp } from "lucide-react";

// export default function Chat() {
//     const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
//     const [input, setInput] = useState("");
//     const fileInputRef = useRef<HTMLInputElement | null>(null);
//     const messagesEndRef = useRef<HTMLDivElement | null>(null);

//     const sendMessage = () => {
//         if (!input.trim()) return;

//         setMessages((prev) => [...prev, { text: input, sender: "user" }]);
//         setInput("");

//         // Simulated bot response
//         setTimeout(() => {
//             setMessages((prev) => [...prev, { text: "This is a bot reply!", sender: "bot" }]);
//         }, 1000);
//     };

//     const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             console.log("Selected file:", file.name);
//         }
//     };

//     // Auto-scroll to bottom when messages change
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <Card className="w-full max-w-lg h-screen flex flex-col border relative">
//             <CardHeader className="text-lg font-semibold border-b p-4">Chat</CardHeader>

//             <CardContent className="flex-1 overflow-hidden mb-12">
//                 <ScrollArea className="h-full w-full">
//                     <div className="space-y-3">
//                         {messages.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`p-2 rounded-lg text-sm max-w-[80%] ${
//                                     msg.sender === "user"
//                                         ? "ml-auto bg-primary text-primary-foreground"
//                                         : "mr-auto bg-secondary text-secondary-foreground"
//                                 }`}
//                             >
//                                 {msg.text}
//                             </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                     </div>
//                 </ScrollArea>
//             </CardContent>

//             {/* Chat Input Section */}
//             <div className="p-4 border-t flex items-center relative">

//                 {/* Attach File Button */}
//                 <button
//                     type="button"
//                     className="absolute bottom-6 left-4 text-gray-600 hover:text-gray-800"
//                     onClick={() => fileInputRef.current?.click()}
//                 >
//                     <Paperclip className="w-5 h-5" />
//                 </button>

//                 {/* Hidden File Input */}
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept=".csv,.txt,.xlsx,.json"
//                     className="hidden"
//                     onChange={handleFileSelect}
//                 />

//                 <Textarea
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 resize-none border border-gray-500 rounded-lg focus:outline-none pr-12 pb-10"
//                 />

//                 {/* Send Button */}
//                 <button
//                     type="button"
//                     className="absolute bottom-6 right-4 text-primary hover:text-primary-dark"
//                     onClick={sendMessage}
//                 >
//                     <ArrowUp className="w-5 h-5" />
//                 </button>
//             </div>
//         </Card>
//     );
// }
