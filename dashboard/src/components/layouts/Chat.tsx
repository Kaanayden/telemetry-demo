'use client';

import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';
import { ScrollArea } from '../ui/scroll-area';
import Markdown from 'react-markdown'

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, addToolResult } =
        useChat({
            api: '/api/chat',
            maxSteps: 15,
        });

    return (
        <>
            <ScrollArea className="flex-grow p-4 space-y-4">
       
                    {messages?.map((m: Message) => (
                        <div key={m.id}>
                            <strong>{m.role}:</strong>
                            <Markdown>
                            {m.content}
                            </Markdown>
                            {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                                const toolCallId = toolInvocation.toolCallId;
                                const addResult = (result: string) =>
                                    addToolResult({ toolCallId, result });

                                // other tools:
                                return 'result' in toolInvocation ? (
                                    <div key={toolCallId}>
                                        Performing {`${toolInvocation.toolName}: `}
                                    </div>
                                ) : (
                                    <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
                                );
                            })}
                            <br />
                        </div>
                    ))}

            </ScrollArea>

            <form className='text-black' onSubmit={handleSubmit}>
                <input className='text-black' value={input} onChange={handleInputChange} />
            </form>
        </>
    );
}