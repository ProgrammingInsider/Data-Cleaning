"use client"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGlobalContext } from "@/context/context";
import { useEffect } from "react";

export default function CleanDataLayout({
    sidemenu,
    chat,
    table,
}: {
    sidemenu: React.ReactNode;
    chat: React.ReactNode;
    table: React.ReactNode;
}) {        
    const {expand} = useGlobalContext();

    useEffect(() => {
        if (expand) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [expand]);


    return (
        // ${expand || 'h-[calc(100vh-70px)]'}
        <div className={`w-screen flex border-t border-b border-gray-800 h-screen`}>
            {expand ? (
                <div className="fixed inset-0 z-50">{table}</div>
            ) : (
                // Normal layout when not expanded
                <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                    <ResizablePanel defaultSize={15} className="border-r border-gray-800">
                        {sidemenu}
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={20} className="border-r border-gray-800">
                        {chat}
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={65} className="sticky right-0 overflow-x-hidden">
                        {table}
                    </ResizablePanel>
                </ResizablePanelGroup>
            )}
        </div>
    );
}
