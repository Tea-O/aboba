import {Avatar, List, message} from "antd";
import React, {FC, useEffect, useState} from "react";
import VirtualList from 'rc-virtual-list';
import {UserItem, Message as M} from "../../Type/Type";
import {$userInput} from "../../models/init";
import { useStore } from 'effector-react';



const Message: FC<{messages: M[]}> = ({messages}) => {
    console.log(messages);
    const userInput = useStore($userInput);
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

    const fakeDataUrl =
        'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
    const [data, setData] = useState<UserItem[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setViewportHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        // appendData();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - viewportHeight + 52) <= 1) {
            //    appendData();
        }
    };

    // const appendData = () => {
    //     fetch(fakeDataUrl)
    //         .then((res) => res.json())
    //         .then((body) => {
    //             setData(data.concat(body.results));
    //             // message.success(`${body.results.length} more items loaded!`);
    //         });
    // };

    // const currentUserId = $userInput;

    return (
        <div style={{ width: '100%', listStyleType: 'none'}}>
            <VirtualList
                data={messages.map(x => ({
                    text: x.message,
                    userId: x.userId,
                    timestamp: x.createdAt,
                    isCurrentUser: x.userId === userInput
                }))}
                // data={messages.map(x => x['text'] + " - " + x["userId"])}
                height={viewportHeight - 52}
                itemHeight={47}
                itemKey="email"
                onScroll={onScroll}
            >
                {(item: { text: string, userId: string, timestamp: string, isCurrentUser: boolean }) => (
                    <List.Item key={item.text}
                               style={{
                                   display: 'flex',
                                   justifyContent: item.isCurrentUser ? 'flex-end' : 'flex-start',
                                   margin: '5px'
                               }}>
                        <div style={{
                            backgroundColor: item.isCurrentUser ? '#e6f7ff' : '#f0f2f5',
                            padding: '10px',
                            borderRadius: '10px',
                        }}>
                            <List.Item.Meta
                                description={
                                    <>
                                        <div>{item.text}</div>
                                        <div style={{ fontSize: 'small', color: 'gray' }}>
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </div>
                                    </>
                                }
                            />
                        </div>
                    </List.Item>
                )}
            </VirtualList>
        </div>
    );
}

export default Message;