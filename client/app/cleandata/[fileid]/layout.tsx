import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default async function CleanDataLayout({
    sidemenu,
    chat,
    table,
}: {
    sidemenu: React.ReactNode;
    chat: React.ReactNode;
    table: React.ReactNode;
}) {
        
    return (
        <div className="w-screen h-[calc(100vh-70px)] flex border-t border-b border-gray-800">
            <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                <ResizablePanel defaultSize={15} className="border-r border-gray-800">
                    {sidemenu}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={20} className="border-r border-gray-800">
                    {chat}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65}>
                    {table}
                    {/* <Suspense fallback={<p>Loading table...</p>}>{table}</Suspense> */}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
