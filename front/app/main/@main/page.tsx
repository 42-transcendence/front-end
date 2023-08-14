"use client"

import { ByteBuffer } from '../../../utils/libs/byte-buffer'
import { useEffect, useRef, useState } from 'react'
import { acceptChatOpCode, sendChat, sendConnectMessage, sendCreateRoom, sendEnter, sendInvite, sendJoinRoom, sendKick, sendPart } from '@/utils/clientUtils';
import { Account, ChatMembers, ChatMessages, ChatRoom, CreateChat, NowChatRoom, CreateChatMessaage } from '@/utils/utils';
import { CreateGameButton, QuickMatchButton } from './GameButton';
import { Game_Ghost3 } from '@/components/ImageLibrary';
import { create } from 'domain';
import { SocketContext } from './SocketContext';

export function HelloWorldPaper() {
    return (
        <div className="min-w-max">
            <div className="flex flex-row gap-[25px] pt-[10px]">
                <Game_Ghost3 width="80" height="80" color="#00FFD1" />
                <div className="flex flex-col pb-[59px] text-center text-[32px] font-bold italic leading-[45px] text-[#00FFD1]">
                    <div>HELLO, IT&lsquo;S</div>
                    <div>DOUBLE SHARP!</div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="pb-[46px] text-center text-[24px] font-bold not-italic leading-[45px] text-white">
                    <div>안녕하세요! 당신을 위한 핑퐁 게임,</div>
                    <div>[더블샵]에 오신 것을 환영합니다!</div>
                </div>
                <div className="text-center text-base font-bold not-italic leading-[28px] text-white">
                    <p>새 게임 만들기 - Create Game</p>
                    <p>빠른 대전 - Quick Match</p>
                </div>
                <div className="pt-[20px] text-center text-base font-normal italic leading-5 text-white text-white/30">
                    @42-transendence
                </div>
            </div>
        </div>
    );
}

function sendMessage(ws: WebSocket, msg: string) {
    if (msg == 'create') {
        const createRoom: CreateChat = {
            chat: {
                title: 'kiki',
                modeFlags: 1,
                password: '',
                limit: 3
            },
            members: ['2fa545d1-c11c-468e-b458-122f9badc6c2', 'a8c5b90a-077b-4871-af93-803579447e33']
        }
        sendCreateRoom(ws, createRoom);
    }
    else if (msg == 'join') {
        sendJoinRoom(ws, { uuid: 'a63fcbe4-ef94-42dd-bf73-41555a6cd2ae', password: '2222' })
    }
    else if (msg == 'enter') {
        sendEnter(ws, 'a63fcbe4-ef94-42dd-bf73-41555a6cd2ae')
    }
    else if (msg == 'invite') {
        sendInvite(ws, { chatUUID: 'a63fcbe4-ef94-42dd-bf73-41555a6cd2ae', members: ['51b65155-c8da-43dc-be9b-572101a37a07', '0b265762-f519-4af2-983f-17ebacd52a0a'] })
    }
    else if (msg == 'part') {
        sendPart(ws, '70dfc81f-2c2a-445f-b095-15a7766f0d99')
    }
    else if (msg == 'kick') {
        sendKick(ws, { chatUUID: '3f358e0c-4ffa-401d-ac70-cc044d869c0f', members: ['2fa545d1-c11c-468e-b458-122f9badc6c2', '51b65155-c8da-43dc-be9b-572101a37a07'] })
    }
    else if (msg == 'chat') {
        const msg: CreateChatMessaage = {
            chatUUID: 'a63fcbe4-ef94-42dd-bf73-41555a6cd2ae',
            content: 'hello!!',
            modeFalgs: 0
        }
        sendChat(ws, msg);
    }
}

export default function Home() {
    const [text, setText] = useState<string>("");

    return (
        <div className="flex h-full w-full items-center justify-center bg-black/30 lg:backdrop-blur-[3px]">
            <div className="flex flex-[1_0_0] flex-col items-center justify-center gap-2.5 self-stretch px-[700px] py-[147px] lg:flex-row">
                <div className="flex flex-col items-start">
                    <HelloWorldPaper />
                </div>

                <div className="flex h-[300px] flex-col items-center justify-center gap-[30px] px-[75px] py-[69px]">
                    <QuickMatchButton />
                    <CreateGameButton />
                </div>
            </div>
        </div>

    );
}
