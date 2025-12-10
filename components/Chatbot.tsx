'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { BookOpen } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import StudyPortalModal from './StudyPortalModal'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Chatbot({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showStudyPortal, setShowStudyPortal] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: prefs } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single()
          
          setUserInfo({
            id: user.id,
            user_id: userId,
            email: user.email,
            ...prefs
          })
        }
      } catch (error) {
        console.error('Error loading user info:', error)
        setUserInfo({ id: userId, user_id: userId })
      }
    }
    loadUserInfo()
  }, [userId])

  useEffect(() => {
    const storageKey = `chatHistory_${userId}`
    const savedMessages = localStorage.getItem(storageKey)
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(messagesWithDates)
      } catch (error) {
        console.error('Error loading chat history:', error)
        setMessages([{
          id: '1',
          role: 'assistant',
          content: "Hi! I'm your PlanItIU assistant. I can help you with course planning, schedule questions, and degree requirements. What would you like to know?",
          timestamp: new Date()
        }])
      }
    } else {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your PlanItIU assistant. I can help you with course planning, schedule questions, and degree requirements. What would you like to know?",
        timestamp: new Date()
      }])
    }
  }, [userId])

  // Save conversation history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = `chatHistory_${userId}`
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages))
      } catch (error) {
        console.error('Error saving chat history:', error)
      }
    }
  }, [messages, userId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      const messagesForAPI = messages
        .map(msg => ({ role: msg.role, content: msg.content }))
        .concat({ role: 'user', content: currentInput })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesForAPI, userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      if (data._debug) {
        console.log('✅ OpenAI API Response:', {
          tokensUsed: data._debug.tokensUsed,
          promptTokens: data._debug.promptTokens,
          completionTokens: data._debug.completionTokens,
          responseLength: data.message.length
        })
      } else {
        console.log('✅ Chatbot: Received response from OpenAI API')
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling chat API:', error)
      console.log('Chatbot: Falling back to rule-based response')
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(currentInput),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    if (lowerInput.includes('schedule') || lowerInput.includes('class')) {
      return "I can help you with scheduling! You can generate a schedule in the Schedules tab. The system will automatically select courses with the highest GPAs and ensure no time conflicts. Would you like to know more about how scheduling works?"
    }
    
    if (lowerInput.includes('requirement') || lowerInput.includes('degree')) {
      return "You can view all your degree requirements and track your progress in the Course Progress tab. It shows which requirements you've completed and which ones are still pending. Is there a specific requirement you'd like to know about?"
    }
    
    if (lowerInput.includes('gpa') || lowerInput.includes('grade')) {
      return "The schedule generator prioritizes courses with higher historical GPAs to help you succeed. You can see GPA ratings for each course in your generated schedule. Would you like tips on maintaining a good GPA?"
    }
    
    if (lowerInput.includes('course') || lowerInput.includes('class')) {
      return "I can help you find information about courses! You can see available courses in the Schedules tab when you generate a schedule. Each course shows its GPA rating, instructor, meeting times, and location. What specific course information do you need?"
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return "I'm here to help! Here's what I can assist with:\n\n• Course scheduling and time conflicts\n• Degree requirements and progress tracking\n• GPA information and course recommendations\n• General questions about PlanItIU\n\nWhat would you like to know?"
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! How can I help you with your course planning today?"
    }
    return "I understand you're asking about: \"" + userInput + "\". I'm still learning, but I can help you with:\n\n• Generating schedules\n• Tracking degree progress\n• Finding courses with high GPAs\n• Answering questions about requirements\n\nCould you rephrase your question or ask about one of these topics?"
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <rect x="8" y="10" width="8" height="8" rx="1" stroke="white" fill="none" />
                <rect x="9.5" y="12" width="2" height="2" fill="white" />
                <rect x="12.5" y="12" width="2" height="2" fill="white" />
                <path d="M11 10 L11 8 M11 8 L10 7 M11 8 L12 7" stroke="white" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hoosier AI</h1>
                <p className="text-sm text-gray-600">Your AI academic advisor.</p>
              </div>
            </div>
            <button
              onClick={() => setShowStudyPortal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              Study Portal
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold mb-1.5 mt-2 first:mt-0" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2" {...props} />,
                        li: ({node, ...props}) => <li className="ml-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        code: ({node, ...props}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-sm" {...props} />,
                        pre: ({node, ...props}) => <pre className="bg-gray-200 p-2 rounded mb-2 overflow-x-auto" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-red-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
      <AnimatePresence>
        {showStudyPortal && userInfo && (
          <StudyPortalModal
            userInfo={userInfo}
            onClose={() => setShowStudyPortal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

