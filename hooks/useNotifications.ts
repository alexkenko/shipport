'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser } from '@/lib/auth'

export interface Notification {
  id: string
  type: 'application_accepted' | 'application_rejected'
  title: string
  message: string
  job_title: string
  company_name: string
  created_at: string
  read: boolean
}

export function useNotifications(user: AuthUser | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'superintendent') {
      setIsLoading(false)
      return
    }

    fetchNotifications()
    
    // Set up real-time subscription for application updates
    const channel = supabase
      .channel('application_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `superintendent_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Application update received:', payload)
          // Check if status changed to accepted or rejected
          if (payload.new.status === 'accepted' || payload.new.status === 'rejected') {
            fetchNotifications()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user || user.role !== 'superintendent') return

    try {
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          jobs!inner (
            title,
            users!inner (
              company
            )
          )
        `)
        .eq('superintendent_id', user.id)
        .in('status', ['accepted', 'rejected'])
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      // Convert applications to notifications
      const notificationData: Notification[] = applications?.map(app => ({
        id: `app_${app.id}`,
        type: app.status === 'accepted' ? 'application_accepted' : 'application_rejected',
        title: app.status === 'accepted' ? 'Application Accepted!' : 'Application Not Selected',
        message: app.status === 'accepted' 
          ? `Congratulations! Your application for ${app.jobs.title} has been accepted by ${app.jobs.users.company}.`
          : `Your application for ${app.jobs.title} was not selected by ${app.jobs.users.company}.`,
        job_title: app.jobs.title,
        company_name: app.jobs.users.company,
        created_at: app.updated_at,
        read: false // In a real app, you'd track this in a separate notifications table
      })) || []

      setNotifications(notificationData)
      setUnreadCount(notificationData.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  }
}
