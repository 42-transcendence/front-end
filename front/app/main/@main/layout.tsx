"use client"
import React from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { useEffect, useState } from 'react'
import { acceptChatOpCode, sendConnectMessage } from '@/utils/clientUtils';
import { ByteBuffer } from '../../../utils/libs/byte-buffer'
import { Account, ChatMembers, ChatMessages, ChatRoom, CreateChat, NowChatRoom, CreateChatMessaage } from '@/utils/utils';
import { SocketContext } from './SocketContext';

function firstSendMessage(ws: WebSocket) {
    sendConnectMessage(ws);
}


export default function Layout({ children }: { children: React.ReactNode }) {
    const [webSocket, setWebSocket] = useState<WebSocket>();
    useEffect(() => {
        const webSocket = new WebSocket("ws://localhost:3001/chat");
        // 웹 소켓 연결 이벤트
        webSocket.onopen = function () {
            window.localStorage.removeItem('chatRooms');
            window.localStorage.removeItem('friends');
            window.localStorage.removeItem('chatMembersList');
            window.localStorage.removeItem('chatMessagesList');
            window.localStorage.removeItem('nowChatRoom');
            console.log("웹소켓 서버와 연결에 성공했습니다.");
            firstSendMessage(webSocket);
        };

        webSocket.binaryType = "arraybuffer";
        // 웹 소켓 메세지 수신
        webSocket.onmessage = function (event) {
            const buf = ByteBuffer.from(event.data);
            console.log(buf.toDumpString());
            acceptChatOpCode(buf, webSocket)
            const chatRooms: ChatRoom[] = JSON.parse(String(window.localStorage.getItem('chatRooms')));
            const friends: Account[] = JSON.parse(String(window.localStorage.getItem('friends')));
            const chatMembersList: ChatMembers[] = JSON.parse(String(window.localStorage.getItem('chatMembersList')));
            const chatMessagesList: ChatMessages[] = JSON.parse(String(window.localStorage.getItem('chatMessagesList')), (key, value) => { if (key === "id") { return BigInt(value); } return value; });
            const nowChatRoom: NowChatRoom = JSON.parse(String(window.localStorage.getItem('nowChatRoom')), (key, value) => { if (key === "id") { return BigInt(value); } return value; });
            console.log(chatRooms);
            console.log(friends);
            console.log(chatMembersList);
            console.log(chatMessagesList);
            console.log(nowChatRoom);
        };

        // 웹 소켓 연결 종료
        webSocket.onclose = function () {
            console.log("웹소켓 서버와 연결이 종료되었습니다.");
        };

        // 오류 발생
        webSocket.onerror = function (error) {
            console.log(error);
        };

        setWebSocket(webSocket);
        console.log("hello");
    }, [])
    return (
        <SocketContext.Provider value={webSocket}>
            <div className="flex h-[100dvh] flex-shrink-0 flex-col">
                <NavigationBar />
                <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
                    {children}
                </main>
            </div>
        </SocketContext.Provider>
    );
}
