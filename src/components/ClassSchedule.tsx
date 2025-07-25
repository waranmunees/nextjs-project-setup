'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface ClassSession {
  id: string
  subject: string
  topic: string
  startTime: string
  endTime: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  classroom: string
  type: 'Theory' | 'Lab' | 'Tutorial'
  reminderEnabled: boolean
  reminderMinutes: number
}

interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'Faculty Meeting' | 'Department Meeting' | 'Committee Meeting' | 'Other'
  reminderEnabled: boolean
}

export default function ClassSchedule() {
  const [classes, setClasses] = useState<ClassSession[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false)
  const [isAddMeetingDialogOpen, setIsAddMeetingDialogOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'schedule' | 'meetings'>('schedule')

  const [newClass, setNewClass] = useState({
    subject: 'Computer Science',
    topic: '',
    startTime: '09:00',
    endTime: '10:00',
    dayOfWeek: 1,
    classroom: 'Room 101',
    type: 'Theory' as const,
    reminderEnabled: true,
    reminderMinutes: 15
  })

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00',
    location: 'Conference Room',
    type: 'Faculty Meeting' as const,
    reminderEnabled: true
  })

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Load sample data
    const sampleClasses: ClassSession[] = [
      {
        id: '1',
        subject: 'Computer Science',
        topic: 'Data Structures',
        startTime: '09:00',
        endTime: '10:00',
        dayOfWeek: 1, // Monday
        classroom: 'Room 101',
        type: 'Theory',
        reminderEnabled: true,
        reminderMinutes: 15
      },
      {
        id: '2',
        subject: 'Computer Science',
        topic: 'Programming Lab',
        startTime: '10:30',
        endTime: '12:30',
        dayOfWeek: 1, // Monday
        classroom: 'Lab 1',
        type: 'Lab',
        reminderEnabled: true,
        reminderMinutes: 10
      },
      {
        id: '3',
        subject: 'Mathematics',
        topic: 'Calculus',
        startTime: '14:00',
        endTime: '15:00',
        dayOfWeek: 1, // Monday
        classroom: 'Room 203',
        type: 'Theory',
        reminderEnabled: false,
        reminderMinutes: 15
      },
      {
        id: '4',
        subject: 'Computer Science',
        topic: 'Algorithms',
        startTime: '09:00',
        endTime: '10:00',
        dayOfWeek: 2, // Tuesday
        classroom: 'Room 101',
        type: 'Theory',
        reminderEnabled: true,
        reminderMinutes: 15
      },
      {
        id: '5',
        subject: 'Physics',
        topic: 'Quantum Mechanics',
        startTime: '11:00',
        endTime: '12:00',
        dayOfWeek: 2, // Tuesday
        classroom: 'Room 301',
        type: 'Theory',
        reminderEnabled: true,
        reminderMinutes: 20
      }
    ]

    const sampleMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Department Faculty Meeting',
        description: 'Monthly department meeting to discuss curriculum updates and student progress.',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:00',
        location: 'Conference Room A',
        type: 'Department Meeting',
        reminderEnabled: true
      },
      {
        id: '2',
        title: 'Academic Committee Review',
        description: 'Review of academic policies and examination procedures.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:30',
        location: 'Main Hall',
        type: 'Committee Meeting',
        reminderEnabled: true
      }
    ]

    setClasses(sampleClasses)
    setMeetings(sampleMeetings)

    return () => clearInterval(timer)
  }, [])

  const handleAddClass = () => {
    if (newClass.topic && newClass.startTime && newClass.endTime) {
      const classSession: ClassSession = {
        id: Date.now().toString(),
        subject: newClass.subject,
        topic: newClass.topic,
        startTime: newClass.startTime,
        endTime: newClass.endTime,
        dayOfWeek: newClass.dayOfWeek,
        classroom: newClass.classroom,
        type: newClass.type,
        reminderEnabled: newClass.reminderEnabled,
        reminderMinutes: newClass.reminderMinutes
      }
      
      setClasses([...classes, classSession])
      setNewClass({
        subject: 'Computer Science',
        topic: '',
        startTime: '09:00',
        endTime: '10:00',
        dayOfWeek: 1,
        classroom: 'Room 101',
        type: 'Theory',
        reminderEnabled: true,
        reminderMinutes: 15
      })
      setIsAddClassDialogOpen(false)
    }
  }

  const handleAddMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        time: newMeeting.time,
        location: newMeeting.location,
        type: newMeeting.type,
        reminderEnabled: newMeeting.reminderEnabled
      }
      
      setMeetings([...meetings, meeting])
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '10:00',
        location: 'Conference Room',
        type: 'Faculty Meeting',
        reminderEnabled: true
      })
      setIsAddMeetingDialogOpen(false)
    }
  }

  const toggleClassReminder = (classId: string) => {
    setClasses(classes.map(cls => 
      cls.id === classId 
        ? { ...cls, reminderEnabled: !cls.reminderEnabled }
        : cls
    ))
  }

  const toggleMeetingReminder = (meetingId: string) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, reminderEnabled: !meeting.reminderEnabled }
        : meeting
    ))
  }

  const getClassesForDay = (day: number) => {
    return classes
      .filter(cls => cls.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getCurrentClass = () => {
    const now = currentTime
    const currentDay = now.getDay()
    const currentTimeStr = now.toTimeString().slice(0, 5) // HH:MM format
    
    return classes.find(cls => 
      cls.dayOfWeek === currentDay &&
      cls.startTime <= currentTimeStr &&
      cls.endTime > currentTimeStr
    )
  }

  const getNextClass = () => {
    const now = currentTime
    const currentDay = now.getDay()
    const currentTimeStr = now.toTimeString().slice(0, 5)
    
    // Find next class today
    const todayClasses = getClassesForDay(currentDay)
    const nextToday = todayClasses.find(cls => cls.startTime > currentTimeStr)
    
    if (nextToday) return nextToday
    
    // Find next class in upcoming days
    for (let i = 1; i <= 7; i++) {
      const nextDay = (currentDay + i) % 7
      const nextDayClasses = getClassesForDay(nextDay)
      if (nextDayClasses.length > 0) {
        return nextDayClasses[0]
      }
    }
    
    return null
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const currentClass = getCurrentClass()
  const nextClass = getNextClass()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Class Schedule & Meetings</h2>
        <p className="text-purple-600">Manage your daily schedule and meeting reminders</p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 gap-4">
        {currentClass && (
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold">Currently Teaching</h3>
                  <p className="text-sm opacity-90">
                    {currentClass.subject} - {currentClass.topic} ({currentClass.classroom})
                  </p>
                  <p className="text-xs opacity-75">
                    {formatTime(currentClass.startTime)} - {formatTime(currentClass.endTime)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {nextClass && !currentClass && (
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div>
                  <h3 className="font-semibold">Next Class</h3>
                  <p className="text-sm opacity-90">
                    {nextClass.subject} - {nextClass.topic} ({nextClass.classroom})
                  </p>
                  <p className="text-xs opacity-75">
                    {daysOfWeek[nextClass.dayOfWeek]} at {formatTime(nextClass.startTime)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          onClick={() => setActiveTab('schedule')}
          variant={activeTab === 'schedule' ? 'default' : 'outline'}
          className={activeTab === 'schedule' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-300 text-purple-700'}
        >
          Class Schedule
        </Button>
        <Button
          onClick={() => setActiveTab('meetings')}
          variant={activeTab === 'meetings' ? 'default' : 'outline'}
          className={activeTab === 'meetings' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-300 text-purple-700'}
        >
          Meetings
        </Button>
      </div>

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Day Selector and Add Button */}
          <div className="flex items-center justify-between">
            <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>Schedule a new class session</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={newClass.subject} onValueChange={(value) => setNewClass({...newClass, subject: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={newClass.topic}
                      onChange={(e) => setNewClass({...newClass, topic: e.target.value})}
                      placeholder="Enter class topic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dayOfWeek">Day</Label>
                    <Select value={newClass.dayOfWeek.toString()} onValueChange={(value) => setNewClass({...newClass, dayOfWeek: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newClass.startTime}
                        onChange={(e) => setNewClass({...newClass, startTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newClass.endTime}
                        onChange={(e) => setNewClass({...newClass, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="classroom">Classroom</Label>
                    <Input
                      id="classroom"
                      value={newClass.classroom}
                      onChange={(e) => setNewClass({...newClass, classroom: e.target.value})}
                      placeholder="Enter classroom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newClass.type} onValueChange={(value) => setNewClass({...newClass, type: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theory">Theory</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reminder"
                      checked={newClass.reminderEnabled}
                      onCheckedChange={(checked) => setNewClass({...newClass, reminderEnabled: checked})}
                    />
                    <Label htmlFor="reminder">Enable reminder</Label>
                  </div>
                  {newClass.reminderEnabled && (
                    <div>
                      <Label htmlFor="reminderMinutes">Reminder (minutes before)</Label>
                      <Input
                        id="reminderMinutes"
                        type="number"
                        value={newClass.reminderMinutes}
                        onChange={(e) => setNewClass({...newClass, reminderMinutes: parseInt(e.target.value)})}
                      />
                    </div>
                  )}
                  <Button onClick={handleAddClass} className="w-full bg-purple-600 hover:bg-purple-700">
                    Add Class
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Classes for Selected Day */}
          <div className="space-y-3">
            {getClassesForDay(selectedDay).map((classSession, index) => (
              <Card
                key={classSession.id}
                className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{classSession.subject}</h3>
                        <Badge className={`${
                          classSession.type === 'Theory' ? 'bg-blue-100 text-blue-800' :
                          classSession.type === 'Lab' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {classSession.type}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-1">{classSession.topic}</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(classSession.startTime)} - {formatTime(classSession.endTime)}
                      </p>
                      <p className="text-sm text-gray-600">{classSession.classroom}</p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Reminder</span>
                        <Switch
                          checked={classSession.reminderEnabled}
                          onCheckedChange={() => toggleClassReminder(classSession.id)}
                        />
                      </div>
                      {classSession.reminderEnabled && (
                        <span className="text-xs text-gray-500">
                          {classSession.reminderMinutes} min before
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getClassesForDay(selectedDay).length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No classes scheduled for {daysOfWeek[selectedDay]}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="space-y-6">
          {/* Add Meeting Button */}
          <div className="flex justify-end">
            <Dialog open={isAddMeetingDialogOpen} onOpenChange={setIsAddMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule New Meeting</DialogTitle>
                  <DialogDescription>Add a new meeting to your calendar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input
                      id="title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      placeholder="Enter meeting title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMeeting.description}
                      onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                      placeholder="Enter meeting description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newMeeting.time}
                        onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newMeeting.location}
                      onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                      placeholder="Enter meeting location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Meeting Type</Label>
                    <Select value={newMeeting.type} onValueChange={(value) => setNewMeeting({...newMeeting, type: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Faculty Meeting">Faculty Meeting</SelectItem>
                        <SelectItem value="Department Meeting">Department Meeting</SelectItem>
                        <SelectItem value="Committee Meeting">Committee Meeting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="meetingReminder"
                      checked={newMeeting.reminderEnabled}
                      onCheckedChange={(checked) => setNewMeeting({...newMeeting, reminderEnabled: checked})}
                    />
                    <Label htmlFor="meetingReminder">Enable reminder</Label>
                  </div>
                  <Button onClick={handleAddMeeting} className="w-full bg-purple-600 hover:bg-purple-700">
                    Schedule Meeting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Upcoming Meetings */}
          <div className="space-y-4">
            {meetings
              .filter(meeting => meeting.date >= new Date().toISOString().split('T')[0])
              .sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date)
                if (dateCompare === 0) {
                  return a.time.localeCompare(b.time)
                }
                return dateCompare
              })
              .map((meeting, index) => (
                <Card
                  key={meeting.id}
                  className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{meeting.title}</h3>
                          <Badge className={`${
                            meeting.type === 'Faculty Meeting' ? 'bg-blue-100 text-blue-800' :
                            meeting.type === 'Department Meeting' ? 'bg-green-100 text-green-800' :
                            meeting.type === 'Committee Meeting' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {meeting.type}
                          </Badge>
                        </div>
                        {meeting.description && (
                          <p className="text-gray-700 mb-2">{meeting.description}</p>
                        )}
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>{formatDate(meeting.date)} at {formatTime(meeting.time)}</p>
                          <p>{meeting.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Reminder</span>
                        <Switch
                          checked={meeting.reminderEnabled}
                          onCheckedChange={() => toggleMeetingReminder(meeting.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {meetings.filter(meeting => meeting.date >= new Date().toISOString().split('T')[0]).length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No upcoming meetings scheduled</p>
                <p className="text-sm text-gray-400 mt-2">Click "Schedule Meeting" to add a new meeting</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out both;
        }
      `}</style>
    </div>
  )
}
