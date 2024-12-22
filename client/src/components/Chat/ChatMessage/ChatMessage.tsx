import React, {useState} from 'react';
import './ChatMessage.css';
import {useSettingsChanger, useChatMessage} from "../../../hooks";
import { Button } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

import {EditOutlined, DeleteOutlined} from "@mui/icons-material";
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

interface ChatMessageProps {
    message_id: string;
    message: string;
    isMyMessage: boolean;
    is_edited: boolean;
    time: string;
}

export function ChatMessage(props: ChatMessageProps) {
    const navigate = useNavigate();
    const {message_id, message, isMyMessage, time, is_edited} = props;

    const isMessageLink = message.startsWith('https://fuchsia');
    const isNftBought = Boolean(window.localStorage.getItem(message));
    const {text_size} = useSettingsChanger();

    const {deleteWindowMessage, setDeleteWindow} = useChatMessage();
    const {setEditingMessage, setDeletionMessage} = useChatMessage();

    function handleContextMenuClick(event: React.MouseEvent<HTMLDivElement>): void {
        event.preventDefault();
        if (deleteWindowMessage != message_id) {
            setDeleteWindow(message_id);
        }
    }

    const handleByeNft = () => {
        const assetId = message.split(' ')[2];
        window.localStorage.setItem(message, 'true');
        window.location.reload();
    }

    function handleEditClick(): void {
        setEditingMessage({id: message_id, text: message});
    }

    function handleDeleteCLick(): void {
        setDeletionMessage(message_id);
    }

    const { setVisible } = useWalletModal();
    const { wallet } = useWallet();
    console.log(wallet);

    // Display the connection modal
    const onRequestConnectWallet = () => {
        navigate('/wallet');
    };
  
    return (

        <div
            className={`chat-message${isMyMessage ? " right" : " left"}`}
            onContextMenu={handleContextMenuClick}>
            {isMessageLink ? (
                <div>
                    <img src={message.split(' ')[0]}/>
                    {!isNftBought && !isMyMessage && <Button view='action' onClick={handleByeNft}>{`${message.split(' ')[1]} SOL`}</Button>}
                    {isNftBought && !isMyMessage && <div>{'Sold out!'}</div>}
                    {!wallet && !isMyMessage && <button onClick={onRequestConnectWallet}>{'ПОДКЛЮЧИТЬ КОШЕЛЕК'}</button>}
                </div>
            ) : <p style={{fontSize: `${text_size}px`}}>{message}</p>}

            <span className="message-time">{is_edited ? "edited " : ""}{time}</span>

            {deleteWindowMessage == message_id &&
                <div className={`delete-menu-down ${isMyMessage ? " right": " left"}`}>
                    <ul>
                        {isMyMessage &&
                            <li className='menu-item' onClick={handleEditClick}>
                                <EditOutlined className='menu-item-icon'/>
                                <p>Edit</p>
                            </li>
                        }
                        <li className='menu-item' style={{color: "#e53935"}} onClick={handleDeleteCLick}>
                            <DeleteOutlined className='menu-item-icon'/>
                            <p>Delete</p>
                        </li>
                    </ul>
                </div>
            }

        </div>
    );
}
