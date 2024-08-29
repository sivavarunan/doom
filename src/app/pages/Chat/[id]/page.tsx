'use client'
import { useParams } from 'next/navigation';
import { SidebarComp } from '../chat';

const ChatPage = () => {
    const params = useParams();
    console.log('Chat Page Params:', params);
    
    return (
            <SidebarComp />
    );
};

export default ChatPage;
