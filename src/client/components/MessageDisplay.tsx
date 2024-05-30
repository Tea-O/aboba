// MessageDisplay.tsx
import React from 'react';
import { MessageData } from '../Type/Type'; // Предполагаем, что эти типы экспортируются из файла types.ts

interface MessageDisplayProps {
    messages: MessageData[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
    return (
        <div>
            {messages.map((msg, index) => (
                <p key={index}>
                    {msg.sender}: {msg.text}
                </p>
            ))}
        </div>
    );
}

export default MessageDisplay;
