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

            // run client-side tools that are automatically executed:
            async onToolCall({ toolCall }) {
                if (toolCall.toolName === 'getLocation') {
                    const cities = [
                        'New York',
                        'Los Angeles',
                        'Chicago',
                        'San Francisco',
                    ];
                    return cities[Math.floor(Math.random() * cities.length)];
                }
            },
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

                                // render confirmation tool (client-side tool with user interaction)
                                if (toolInvocation.toolName === 'askForConfirmation') {
                                    return (
                                        <div key={toolCallId}>
                                            {toolInvocation.args.message}
                                            <div>
                                                {'result' in toolInvocation ? (
                                                    <b>{toolInvocation.result}</b>
                                                ) : (
                                                    <>
                                                        <button onClick={() => addResult('Yes')}>Yes</button>
                                                        <button onClick={() => addResult('No')}>No</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }

                                // other tools:
                                return 'result' in toolInvocation ? (
                                    <div key={toolCallId}>
                                        Tool call {`${toolInvocation.toolName}: `}
                                        {toolInvocation.result}
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