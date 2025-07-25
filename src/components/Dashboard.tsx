'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StudentManagement from './StudentManagement'
import AttendanceSystem from './AttendanceSystem'
import AssignmentTracker from './AssignmentTracker'
import TestTracker from './TestTracker'
import ClassSchedule from './ClassSchedule'
import LeaveRequest from './LeaveRequest'

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dayOrder, setDayOrder] = useState(1)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Calculate day order based on current date
    const today = new Date()
    const dayOfWeek = today.getDay()
    setDayOrder(dayOfWeek === 0 ? 6 : dayOfWeek)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const quickStats = [
    { label: 'Total Students', value: '156', color: 'bg-blue-500' },
    { label: 'Pending Assignments', value: '8', color: 'bg-orange-500' },
    { label: 'Tests This Week', value: '3', color: 'bg-green-500' },
    { label: 'Attendance Rate', value: '94%', color: 'bg-purple-500' }
  ]

  const upcomingTasks = [
    { task: 'Grade Assignment 3', due: 'Today, 5:00 PM', priority: 'high' },
    { task: 'Prepare Test Questions', due: 'Tomorrow, 10:00 AM', priority: 'medium' },
    { task: 'Faculty Meeting', due: 'Friday, 2:00 PM', priority: 'low' },
    { task: 'Submit Attendance Report', due: 'Monday, 9:00 AM', priority: 'medium' }
  ]

  if (activeTab !== 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-200">
          <div className="flex items-center justify-between p-4">
            <Button
              onClick={() => setActiveTab('dashboard')}
              variant="ghost"
              className="text-purple-700 hover:text-purple-800 hover:bg-purple-100"
            >
              ← Back to Dashboard
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Logout
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'attendance' && <AttendanceSystem />}
          {activeTab === 'assignments' && <AssignmentTracker />}
          {activeTab === 'tests' && <TestTracker />}
          {activeTab === 'schedule' && <ClassSchedule />}
          {activeTab === 'leave' && <LeaveRequest />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-purple-800">Faculty Dashboard</h1>
            <p className="text-sm text-purple-600">{formatDate(currentTime)}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-lg font-semibold text-purple-800">{formatTime(currentTime)}</p>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                Day {dayOrder}
              </Badge>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Morning Reminder */}
        <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg animate-pulse-slow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div>
                <h3 className="font-semibold">Daily Reminder</h3>
                <p className="text-sm opacity-90">You have 3 classes today and 2 pending assignments to review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Tasks */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-800">Upcoming Tasks</CardTitle>
            <CardDescription>Your schedule for the next few days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
              >
                <div>
                  <p className="font-medium text-gray-800">{task.task}</p>
                  <p className="text-sm text-gray-600">{task.due}</p>
                </div>
                <Badge
                  className={`${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setActiveTab('students')}
            className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              <p className="font-semibold">Students</p>
              <p className="text-xs opacity-90">Manage student data</p>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveTab('attendance')}
            className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              <p className="font-semibold">Attendance</p>
              <p className="text-xs opacity-90">Mark attendance</p>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveTab('assignments')}
            className="h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              <p className="font-semibold">Assignments</p>
              <p className="text-xs opacity-90">Track submissions</p>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveTab('tests')}
            className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              <p className="font-semibold">Tests</p>
              <p className="text-xs opacity-90">Manage test scores</p>
            </div>
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 gap-4">
          <Button
            onClick={() => setActiveTab('schedule')}
            variant="outline"
            className="h-12 border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            Class Schedule & Reminders
          </Button>
          
          <Button
            onClick={() => setActiveTab('leave')}
            variant="outline"
            className="h-12 border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            Leave Requests
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
