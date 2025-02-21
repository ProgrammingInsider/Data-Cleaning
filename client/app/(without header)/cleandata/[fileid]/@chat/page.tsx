// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Paperclip, ArrowUp, Edit } from "lucide-react";
// import { useGlobalContext } from "@/context/context";

// export default function Chat() {
//     // const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
//     const [input, setInput] = useState("");
//     const fileInputRef = useRef<HTMLInputElement | null>(null);
//     const {insertMessage, chat, isCleanDataLoading, actions, responseWarning} = useGlobalContext();

//     const messagesEndRef = useRef<HTMLDivElement | null>(null);

//     const sendMessage = () => {
//         if (!input.trim()) return;

//         insertMessage(input);
//         setInput("");
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
//     }, [chat, isCleanDataLoading]);

//     return (
//         <Card className="w-full h-full flex border-none flex-col relative">
//             <CardHeader className="text-lg font-semibold border-b border-gray-800 p-1">Chat</CardHeader>

//             <CardContent className="h-full overflow-hidden border-none mt-4 relative">
//                 <ScrollArea className="w-full h-full">
//                     <div className="space-y-2">
//                     {
//                         actions?.length > 0 ? actions.map((action, index) => (
//                             <div className="flex flex-col gap-1"  key={index}>
//                                 <div className="flex gap-1 max-w-4/5 w-48 ml-auto items-center">
//                                     <span className="mr-auto bg-secondary text-secondary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xl cursor-pointer" onClick={()=>setInput(action.chat)}><Edit/></span>
//                                     <div
//                                         className={`p-1 rounded-lg flex items-center break-all text-sm w-auto  bg-primary text-primary-foreground`}
//                                     >
//                                         {action.chat}
//                                     </div>
//                                 </div>
//                                 {/* {responseWarning || <div className="text-xs ">Warning: {}</div>} */}
//                                 <div
//                                     className={`p-1 rounded-lg flex items-center gap-1 text-sm mr-auto bg-secondary text-secondary-foreground w-4/5 break-all`}
//                                 >
//                                     {action.response}
//                                 </div>

//                             </div>
//                         ))
//                         : <div className={`p-2 rounded-lg text-wrap text-sm max-w-[80%]mr-auto bg-secondary text-secondary-foreground"
//                         }`}
//                         >
//                             {isCleanDataLoading || "No Messages"}
//                         </div>
//                     }
//                         {responseWarning && (
//                             <div
//                                 className={`p-1 rounded-lg flex items-center gap-1 text-sm mr-auto text-secondary-foreground w-4/5 bg-red-600/70 font-medium`}
//                             >
//                                 {responseWarning}
//                             </div>
//                         )}
//                     {isCleanDataLoading && (
//                         <div
//                             className={`p-2 rounded-lg flex items-center gap-1 text-sm mr-auto text-secondary-foreground w-full animate-pulse mt-2`}
//                         >
//                             AI is processing your request<span className="dot-flash">...</span>
//                         </div>
//                     )}

//                         {/* Invisible div to scroll to  */}
//                         <div ref={messagesEndRef} />
//                     </div>
//                 </ScrollArea>
//             </CardContent>

//             <div className="flex sticky bottom-0 border-t border-gray-800 z-10">
//                 <div className="secondaryBg m-1 p-2 rounded-lg flex items-start gap-1 w-full">
//                     {/* Attach File Button */}
//                     <button
//                         type="button"
//                         className="text-gray-600 hover:text-gray-800"
//                         onClick={() => fileInputRef.current?.click()}
//                     >
//                         <Paperclip className="w-5 h-5" />
//                     </button>

//                     {/* Hidden File Input */}
//                     <input
//                         type="file"
//                         ref={fileInputRef}
//                         accept=".csv,.txt,.xlsx,.json"
//                         className="hidden"
//                         onChange={handleFileSelect}
//                     />

//                     <Textarea
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter" && !e.ctrlKey) {
//                                 e.preventDefault(); // Prevent new line
//                                 sendMessage(); // Send message
//                             } else if (e.key === "Enter" && e.ctrlKey) {
//                               // Allow new line with Ctrl + Enter
//                                 setInput((prev) => prev + "\n");
//                             }
//                         }}
//                         placeholder="Ask a follow up..."
//                         className="flex-1 resize-none border-none focus:outline-none custom-scrollbar break-all"
//                     />

//                     {/* Send Button */}
//                     <button
//                         type="button"
//                         className="text-primary hover:text-primary-dark"
//                         onClick={sendMessage}
//                     >
//                         <ArrowUp className="w-5 h-5" />
//                     </button>
//                 </div>
//             </div>
//         </Card>
//     );
// }


// Chat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalContext } from "@/context/context";
import ChatMessage from "@/components/workstationUi/ChatMessage";
import ChatInput from "@/components/workstationUi/ChatInput";
import ChatWarning from "@/components/workstationUi/ChatWarning";
import ChatLoader from "@/components/workstationUi/ChatLoader";

const Chat = () => {
    const [input, setInput] = useState("");
    const { insertMessage, chat, isCleanDataLoading, actions, responseWarning } = useGlobalContext();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = () => {
        if (!input.trim()) return;
        insertMessage(input);
        setInput("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, isCleanDataLoading]);

    return (
        <Card className="w-full h-full flex border-none flex-col relative">
            <CardHeader className="text-lg font-semibold border-b border-gray-800 p-1">Chat</CardHeader>
            <CardContent className="h-full overflow-hidden border-none mt-4 relative">
                <ScrollArea className="w-full h-full">
                    <div className="space-y-2">
                        {actions?.length > 0 ? (
                            actions.map((action, index) => (
                                <ChatMessage key={index} action={action} setInput={setInput} />
                            ))
                        ) : (
                            <div className="p-2 rounded-lg text-wrap text-sm max-w-[80%] mr-auto bg-secondary text-secondary-foreground">
                                {isCleanDataLoading || "No Messages"}
                            </div>
                        )}

                        {responseWarning && <ChatWarning message={responseWarning} />}
                        {isCleanDataLoading && <ChatLoader />}

                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
            </CardContent>
            <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
        </Card>
    );
};

export default Chat;
