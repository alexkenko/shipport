'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { getCurrentUser, AuthUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { 
  PaperAirplaneIcon, 
  FaceSmileIcon, 
  PaperClipIcon,
  UserGroupIcon,
  CheckIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  user_id: string
  message: string
  message_type: string
  file_url?: string
  file_name?: string
  reply_to_message_id?: string
  edited_at?: string
  created_at: string
  updated_at: string
  name: string
  surname: string
  photo_url?: string
  email: string
  reply_message?: string
  reply_user_name?: string
  reply_user_surname?: string
}

interface OnlineUser {
  user_id: string
  last_seen_at: string
  is_typing: boolean
  name: string
  surname: string
  photo_url?: string
}

interface Reaction {
  id: string
  message_id: string
  user_id: string
  reaction: string
  created_at: string
}

export default function SuperintendentChatPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({})
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    checkUser()
    fetchMessages()
    fetchOnlineUsers()
    subscribeToMessages()
    subscribeToOnlineUsers()
    subscribeToReactions()

    // Update online status every 30 seconds
    const onlineInterval = setInterval(updateOnlineStatus, 30000)
    
    // Clean up on unmount
    return () => {
      clearInterval(onlineInterval)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== 'superintendent' || !currentUser.email_verified) {
        toast.error('Access denied. Only verified superintendents can access the chat.')
        window.location.href = '/dashboard/superintendent'
        return
      }
      setUser(currentUser)
      updateOnlineStatus()
    } catch (error) {
      console.error('Error checking user:', error)
      toast.error('Authentication error')
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages_with_users')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      // First get online users
      const { data: onlineData, error: onlineError } = await supabase
        .from('superintendent_chat_online')
        .select('user_id, last_seen_at, is_typing')
        .gt('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 minutes

      if (onlineError) throw onlineError

      if (!onlineData || onlineData.length === 0) {
        setOnlineUsers([])
        return
      }

      // Then get user details for online users
      const userIds = onlineData.map(item => item.user_id)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, surname, photo_url')
        .in('id', userIds)

      if (usersError) throw usersError

      // Combine the data
      const formattedUsers = onlineData.map(onlineItem => {
        const userData = usersData?.find(user => user.id === onlineItem.user_id)
        return {
          user_id: onlineItem.user_id,
          last_seen_at: onlineItem.last_seen_at,
          is_typing: onlineItem.is_typing,
          name: userData?.name || '',
          surname: userData?.surname || '',
          photo_url: userData?.photo_url
        }
      })

      setOnlineUsers(formattedUsers)
    } catch (error) {
      console.error('Error fetching online users:', error)
    }
  }

  const updateOnlineStatus = async () => {
    if (!user) return

    try {
      await supabase
        .from('superintendent_chat_online')
        .upsert({
          user_id: user.id,
          last_seen_at: new Date().toISOString(),
          is_typing: false,
          typing_updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error updating online status:', error)
    }
  }

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'superintendent_chat_messages' 
        }, 
        (payload) => {
          fetchMessages() // Refresh messages to get user data
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'superintendent_chat_messages'
        },
        (payload) => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  const subscribeToOnlineUsers = () => {
    const subscription = supabase
      .channel('online_users')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'superintendent_chat_online'
        },
        (payload) => {
          fetchOnlineUsers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  const subscribeToReactions = () => {
    const subscription = supabase
      .channel('reactions')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'superintendent_chat_reactions'
        },
        (payload) => {
          fetchReactions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('superintendent_chat_reactions')
        .select('*')

      if (error) throw error

      const reactionsByMessage: Record<string, Reaction[]> = {}
      data?.forEach(reaction => {
        if (!reactionsByMessage[reaction.message_id]) {
          reactionsByMessage[reaction.message_id] = []
        }
        reactionsByMessage[reaction.message_id].push(reaction)
      })

      setReactions(reactionsByMessage)
    } catch (error) {
      console.error('Error fetching reactions:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || isSending) return

    setIsSending(true)
    try {
      const messageData = {
        user_id: user.id,
        message: newMessage.trim(),
        message_type: 'text',
        reply_to_message_id: replyTo?.id || null
      }

      const { error } = await supabase
        .from('superintendent_chat_messages')
        .insert([messageData])

      if (error) throw error

      setNewMessage('')
      setReplyTo(null)
      updateTypingStatus(false)
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)
    
    if (!isTyping) {
      setIsTyping(true)
      updateTypingStatus(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      updateTypingStatus(false)
    }, 1000)
  }

  const updateTypingStatus = async (typing: boolean) => {
    if (!user) return

    try {
      await supabase
        .from('superintendent_chat_online')
        .upsert({
          user_id: user.id,
          last_seen_at: new Date().toISOString(),
          is_typing: typing,
          typing_updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error updating typing status:', error)
    }
  }

  const addReaction = async (messageId: string, reaction: string) => {
    if (!user) return

    try {
      // Check if user already reacted with this emoji
      const { data: existing, error: checkError } = await supabase
        .from('superintendent_chat_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('reaction', reaction)
        .single()

      if (existing) {
        // Remove reaction
        const { error: deleteError } = await supabase
          .from('superintendent_chat_reactions')
          .delete()
          .eq('id', existing.id)

        if (deleteError) throw deleteError
      } else {
        // Add reaction
        const { error: insertError } = await supabase
          .from('superintendent_chat_reactions')
          .insert([{
            message_id: messageId,
            user_id: user.id,
            reaction: reaction
          }])

        if (insertError) throw insertError
      }
    } catch (error) {
      console.error('Error managing reaction:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏']

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="superintendent">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="superintendent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
          
          {/* Online Users Sidebar */}
          <Card className="lg:w-80 p-4">
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="h-5 w-5 text-primary-400" />
              <h3 className="font-semibold text-white">
                Online Superintendents ({onlineUsers.length})
              </h3>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {onlineUsers.map((onlineUser) => (
                <div key={onlineUser.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-dark-700/50">
                  <div className="relative">
                    {onlineUser.photo_url ? (
                      <img
                        src={onlineUser.photo_url}
                        alt={`${onlineUser.name} ${onlineUser.surname}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                        {onlineUser.name.charAt(0)}{onlineUser.surname.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {onlineUser.name} {onlineUser.surname}
                    </p>
                    {onlineUser.is_typing && (
                      <p className="text-xs text-primary-400">Typing...</p>
                    )}
                  </div>
                </div>
              ))}
              
              {onlineUsers.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No superintendents online
                </p>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-dark-700">
              <h2 className="text-xl font-bold text-white">Superintendent Chat</h2>
              <p className="text-sm text-gray-400">Connect with fellow marine superintendents worldwide</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-message-in ${
                    message.user_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.user_id !== user?.id && (
                    <div className="flex-shrink-0">
                      {message.photo_url ? (
                        <img
                          src={message.photo_url}
                          alt={`${message.name} ${message.surname}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                          {message.name.charAt(0)}{message.surname.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`max-w-xs lg:max-w-md ${message.user_id === user?.id ? 'order-first' : ''}`}>
                    {/* Reply reference */}
                    {message.reply_to_message_id && (
                      <div className="mb-2 p-2 bg-dark-700/50 rounded-lg border-l-2 border-primary-400">
                        <p className="text-xs text-primary-400">
                          Replying to {message.reply_user_name} {message.reply_user_surname}
                        </p>
                        <p className="text-sm text-gray-300 truncate">
                          {message.reply_message}
                        </p>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`p-3 rounded-lg ${
                        message.user_id === user?.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-700 text-gray-100'
                      }`}
                    >
                      {message.user_id !== user?.id && (
                        <p className="text-xs font-medium mb-1 opacity-80">
                          {message.name} {message.surname}
                        </p>
                      )}
                      
                      <p className="text-sm break-words">{message.message}</p>
                      
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="text-xs opacity-70">
                          {formatTime(message.created_at)}
                          {message.edited_at && ' (edited)'}
                        </span>
                        
                        {message.user_id === user?.id && (
                          <CheckIcon className="h-3 w-3 opacity-70" />
                        )}
                      </div>
                    </div>

                    {/* Reactions */}
                    {reactions[message.id] && reactions[message.id].length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(
                          reactions[message.id].reduce((acc, reaction) => {
                            acc[reaction.reaction] = (acc[reaction.reaction] || 0) + 1
                            return acc
                          }, {} as Record<string, number>)
                        ).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(message.id, emoji)}
                            className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                              reactions[message.id].some(r => r.user_id === user?.id && r.reaction === emoji)
                                ? 'bg-primary-600 border-primary-400 text-white'
                                : 'bg-dark-700 border-dark-600 text-gray-300 hover:border-primary-400'
                            }`}
                          >
                            {emoji} {count}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Quick reactions */}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {commonReactions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(message.id, emoji)}
                          className="text-sm hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                      <button
                        onClick={() => setReplyTo(message)}
                        className="text-xs text-gray-400 hover:text-primary-400 ml-2"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicators */}
              {onlineUsers.filter(u => u.is_typing && u.user_id !== user?.id).map(typingUser => (
                <div key={`typing-${typingUser.user_id}`} className="flex items-center gap-2 text-primary-400">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse typing-dot"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse typing-dot"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse typing-dot"></div>
                  </div>
                  <span className="text-xs">
                    {typingUser.name} {typingUser.surname} is typing...
                  </span>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Reply preview */}
            {replyTo && (
              <div className="px-4 py-2 bg-dark-800/50 border-t border-dark-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-primary-400">
                      Replying to {replyTo.name} {replyTo.surname}
                    </p>
                    <p className="text-sm text-gray-300 truncate">{replyTo.message}</p>
                  </div>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-gray-400 hover:text-white ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-dark-700">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message to superintendents..."
                    className="bg-dark-700 border-dark-600"
                    disabled={isSending}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="px-4"
                >
                  {isSending ? (
                    <ClockIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
