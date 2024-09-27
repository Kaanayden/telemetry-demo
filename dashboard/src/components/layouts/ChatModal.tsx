'use client'

import { useState } from 'react'
import { useAssistant } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Send, Bot, User, MessageCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import remarkmath from 'remark-math';
import rehypeKatex from 'rehype-katex'

import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';
import Markdown from 'react-markdown'

import "katex/dist/katex.min.css"
import ContentRenderer from '../ui/ContentRenderer'

export default function ChatModal() {

  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      api: '/api/chat',
      maxSteps: 15,
    });

    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-full md:min-w-[800px] lg:min-w-[1200px] bg-gray-900 text-gray-100 border-l border-gray-800">
            <SheetHeader>
              <SheetTitle className="text-gray-100">AI Assistant</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-grow p-4 space-y-4 break-words">

                {messages?.map((m: Message) => (
                  <div key={m.id}>
                    <strong>{m.role}:</strong>
                    <ContentRenderer content={m.content} />

                  {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                    const toolCallId = toolInvocation.toolCallId;
                    const addResult = (result: string) =>
                      addToolResult({ toolCallId, result });

                    // other tools:
                    return 'result' in toolInvocation ? (
                      <div key={toolCallId}>
                        Performing {`${toolInvocation.toolName == 'makeQuery' ? "analysis" : toolInvocation.toolName }... `}
                      </div>
                    ) : (
                      <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
                    );
                  })}
                  <br />
                </div>
              ))}

            </ScrollArea>
            <form onSubmit={handleSubmit} className="py-4 px-2 border-t border-gray-700 ">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 space-x-4 justify-center items-center">
                <Input
                  value={input}
                  
                  onChange={(e) => {
                    handleInputChange(e)
                  }}
                  placeholder="Type your message..."
                  className="flex-grow bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-4 h-4" />
                  <span >Send</span>
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-6 h-6 mr-2" />
        Ask AI Assistant
      </Button>
    </>
  )
}