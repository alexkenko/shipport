'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Card } from './Card'
import { supabase } from '@/lib/supabase'
import { AuthUser } from '@/lib/auth'
import { 
  PaperAirplaneIcon, 
  FaceSmileIcon, 
  PaperClipIcon,
  UserGroupIcon,
  CheckIcon,
  CheckBadgeIcon,
  ClockIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
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

interface ChatPopupProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
}

export function ChatPopup({ isOpen, onClose, user }: ChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({})
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages()
      fetchOnlineUsers()
      updateOnlineStatus()

      // Update online status every 30 seconds
      const onlineInterval = setInterval(updateOnlineStatus, 30000)
      
      // Fallback polling every 5 seconds as backup to real-time subscriptions
      const messagePollingInterval = setInterval(() => {
        console.log('ChatPopup: Fallback polling for new messages...')
        fetchMessages()
        fetchOnlineUsers()
      }, 5000)
      
      // Set up subscriptions and get cleanup functions
      const unsubscribeMessages = subscribeToMessages()
      const unsubscribeOnlineUsers = subscribeToOnlineUsers()
      const unsubscribeReactions = subscribeToReactions()
      
      // Clean up on unmount
      return () => {
        clearInterval(onlineInterval)
        clearInterval(messagePollingInterval)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        // Clean up subscriptions
        if (unsubscribeMessages) unsubscribeMessages()
        if (unsubscribeOnlineUsers) unsubscribeOnlineUsers()
        if (unsubscribeReactions) unsubscribeReactions()
      }
    }
  }, [isOpen, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      console.log('ChatPopup: Fetching messages...')
      // First fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('superintendent_chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)

      console.log('ChatPopup: Messages query result:', { messagesData, messagesError })
      if (messagesError) throw messagesError

      if (!messagesData || messagesData.length === 0) {
        setMessages([])
        return
      }

      // Then fetch user details for all unique user IDs
      const userIds = Array.from(new Set(messagesData.map(msg => msg.user_id)))
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, surname, photo_url, email')
        .in('id', userIds)

      console.log('ChatPopup: Users query result:', { usersData, usersError })
      if (usersError) throw usersError

      // Combine the data
      const transformedData = messagesData.map(msg => {
        const userData = usersData?.find(user => user.id === msg.user_id)
        return {
          ...msg,
          name: userData?.name || '',
          surname: userData?.surname || '',
          photo_url: userData?.photo_url || '',
          email: userData?.email || '',
          reply_message: undefined,
          reply_user_name: undefined,
          reply_user_surname: undefined
        }
      })
      
      console.log('ChatPopup: Transformed data:', transformedData)
      setMessages(transformedData)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      console.log('ChatPopup: Fetching online users...')
      // First get online users
      const { data: onlineData, error: onlineError } = await supabase
        .from('superintendent_chat_online')
        .select('user_id, last_seen_at, is_typing')
        .gt('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 minutes

      console.log('ChatPopup: Online users query result:', { onlineData, onlineError })
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
    console.log('ChatPopup: Setting up message subscription...')
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'superintendent_chat_messages' 
        }, 
        async (payload) => {
          console.log('ChatPopup: New message received via subscription:', payload)
          // Optimize: Only fetch the new message with user data instead of all messages
          if (payload.new) {
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('name, surname, photo_url, email')
                .eq('id', payload.new.user_id)
                .single()

              if (!userError && userData) {
                const newMessage: ChatMessage = {
                  id: payload.new.id,
                  user_id: payload.new.user_id,
                  message: payload.new.message,
                  message_type: payload.new.message_type,
                  file_url: payload.new.file_url,
                  file_name: payload.new.file_name,
                  reply_to_message_id: payload.new.reply_to_message_id,
                  edited_at: payload.new.edited_at,
                  created_at: payload.new.created_at,
                  updated_at: payload.new.updated_at,
                  name: userData.name || '',
                  surname: userData.surname || '',
                  photo_url: userData.photo_url || '',
                  email: userData.email || '',
                  reply_message: undefined,
                  reply_user_name: undefined,
                  reply_user_surname: undefined
                }
                
                setMessages(prev => [...prev, newMessage])
              } else {
                // Fallback to full refresh if user data fetch fails
                fetchMessages()
              }
            } catch (error) {
              console.error('Error fetching user data for new message:', error)
              fetchMessages()
            }
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'superintendent_chat_messages'
        },
        (payload) => {
          // Update specific message instead of refreshing all
          if (payload.new) {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            ))
          }
        }
      )
      .subscribe((status) => {
        console.log('ChatPopup: Message subscription status:', status)
      })

    return () => {
      console.log('ChatPopup: Cleaning up message subscription')
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
        async (payload) => {
          // Optimize: Update online users state directly instead of full refresh
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id, name, surname, photo_url')
                .eq('id', payload.new.user_id)
                .single()

              if (!userError && userData) {
                const newOnlineUser: OnlineUser = {
                  user_id: payload.new.user_id,
                  last_seen_at: payload.new.last_seen_at,
                  is_typing: payload.new.is_typing,
                  name: userData.name || '',
                  surname: userData.surname || '',
                  photo_url: userData.photo_url
                }

                setOnlineUsers(prev => {
                  const existing = prev.find(u => u.user_id === newOnlineUser.user_id)
                  if (existing) {
                    return prev.map(u => u.user_id === newOnlineUser.user_id ? newOnlineUser : u)
                  } else {
                    return [...prev, newOnlineUser]
                  }
                })
              } else {
                fetchOnlineUsers() // Fallback to full refresh
              }
            } catch (error) {
              console.error('Error updating online user:', error)
              fetchOnlineUsers()
            }
          } else if (payload.eventType === 'DELETE') {
            setOnlineUsers(prev => prev.filter(u => u.user_id !== payload.old.user_id))
          }
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

    const messageText = newMessage.trim()
    setIsSending(true)
    
    // Optimistically add message to UI immediately for better UX
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: ChatMessage = {
      id: tempId,
      user_id: user.id,
      message: messageText,
      message_type: 'text',
      file_url: undefined,
      file_name: undefined,
      reply_to_message_id: replyTo?.id || undefined,
      edited_at: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: user.name || '',
      surname: user.surname || '',
      photo_url: user.photo_url || '',
      email: user.email || '',
      reply_message: undefined,
      reply_user_name: undefined,
      reply_user_surname: undefined
    }

    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage('')
    setReplyTo(null)
    updateTypingStatus(false)

    try {
      const messageData = {
        user_id: user.id,
        message: messageText,
        message_type: 'text',
        reply_to_message_id: replyTo?.id || null
      }

      const { data, error } = await supabase
        .from('superintendent_chat_messages')
        .insert([messageData])
        .select()

      if (error) throw error

      // Replace optimistic message with real message
      if (data && data[0]) {
        const realMessage: ChatMessage = {
          ...data[0],
          name: user.name || '',
          surname: user.surname || '',
          photo_url: user.photo_url || '',
          email: user.email || '',
          reply_message: undefined,
          reply_user_name: undefined,
          reply_user_surname: undefined
        }

        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? realMessage : msg
        ))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId))
      
      // Restore message text
      setNewMessage(messageText)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-dark-800 rounded-none sm:rounded-2xl w-full h-full sm:w-full sm:max-w-4xl sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-4 border-b border-dark-700 bg-dark-800">
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Superintendent Chat</h2>
              <p className="text-sm text-gray-400 hidden sm:block">
                Connect with fellow superintendents • Messages auto-delete after 24h
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="sm:hidden p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
            >
              <UserGroupIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-3 text-white hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 border border-gray-600 hover:border-red-400"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Online Users Sidebar */}
          <div className={`${showSidebar ? 'fixed inset-0 z-10 sm:relative sm:inset-auto' : 'hidden sm:block'} w-full sm:w-64 border-r border-dark-700 p-4 bg-dark-800 sm:bg-transparent`}>
            {showSidebar && (
              <div className="sm:hidden flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Online Users</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="h-5 w-5 text-primary-400" />
              <h3 className="font-semibold text-white">
                Online ({onlineUsers.length})
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
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                        {onlineUser.name.charAt(0)}{onlineUser.surname.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-dark-800"></div>
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
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No messages yet</p>
                  <p className="text-sm text-gray-500">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
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
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                            {message.name.charAt(0)}{message.surname.charAt(0)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`max-w-xs sm:max-w-sm lg:max-w-md ${message.user_id === user?.id ? 'order-first' : ''}`}>
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
                        className={`p-3 sm:p-4 rounded-lg ${
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
                ))
              )}
              
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
            <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-dark-700 bg-dark-800">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message to superintendents..."
                    className="bg-dark-700 border-dark-600 text-base"
                    disabled={isSending}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  {isSending ? (
                    <ClockIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
