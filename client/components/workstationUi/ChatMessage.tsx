// ChatMessage.tsx
import { Edit } from "lucide-react";
import { FC } from "react";

type ChatMessageProps = {
    action: { chat: string; response: string };
    setInput: (value: string) => void;
};

const ChatMessage: FC<ChatMessageProps> = ({ action, setInput }) => (
    <div className="flex flex-col gap-1">
        <div className="flex gap-1 max-w-4/5 w-48 ml-auto items-center">
            <span className="mr-auto bg-secondary text-secondary-foreground w-4 h-4 rounded-full flex justify-center items-center text-xl cursor-pointer" onClick={() => setInput(action.chat)}>
                <Edit />
            </span>
            <div className="p-1 rounded-lg flex items-center break-all text-sm w-auto bg-primary text-primary-foreground">
                {action.chat}
            </div>
        </div>
        <div className="p-1 rounded-lg flex items-center gap-1 text-sm mr-auto bg-secondary text-secondary-foreground w-4/5 break-all">
            {action.response}
        </div>
    </div>
);

export default ChatMessage;