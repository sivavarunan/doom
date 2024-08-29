'use client'
import { useParams } from 'next/navigation';
import SidebarComp from '@/app/pages/Chat/chat'; 

const ChatPage = () => {
    const params = useParams();
    console.log('Chat Page Params:', params);
    
    return (
        <div>
            <SidebarComp />
        </div>
    );
};

export default ChatPage;
