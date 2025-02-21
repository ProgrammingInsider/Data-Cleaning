// ChatLoader.tsx
const ChatLoader = () => (
    <div className="p-2 rounded-lg flex items-center gap-1 text-sm mr-auto text-secondary-foreground w-full animate-pulse mt-2">
        AI is processing your request<span className="dot-flash">...</span>
    </div>
);

export default ChatLoader;
