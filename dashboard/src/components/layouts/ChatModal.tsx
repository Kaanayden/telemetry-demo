'use client'

import { useState } from 'react'
import { useAssistant } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Send, Bot, User, MessageCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import Chat from './Chat'

export default function ChatModal() {
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input: assistantInput, handleInputChange, handleSubmit } = useAssistant({
    api: '/api/assistant',
  })

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
    setInput('')
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-gray-900 text-gray-100 border-l border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-gray-100">AI Assistant</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <Chat/>
            <ScrollArea className="flex-grow p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Bot className="w-6 h-6 mt-1 text-blue-400" />
                  )}
                  <div
                    className={`p-2 rounded-lg ${
                      message.role === 'assistant'
                        ? 'bg-gray-800 text-blue-200'
                        : 'bg-blue-600 text-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <User className="w-6 h-6 mt-1 text-gray-400" />
                  )}
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="py-4 px-2 border-t border-gray-700">
              <div className="flex space-x-4 justify-center items-center">
                <Textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
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