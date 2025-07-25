'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Student {
  id: string
  name: string
  rollNumber: string
  year: string
  isPresent: boolean
}

interface AttendanceRecord {
  date: string
  classType: string
  presentCount: number
  totalCount: number
  students: { id: string; name: string; rollNumber: string; isPresent: boolean }[]
}

export default function AttendanceSystem() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedClass, setSelectedClass] = useState('Computer Science - Theory')
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Sample students data
  useEffect(() => {
    const sampleStudents: Student[] = [
      { id: '1', name: 'John Doe', rollNumber: '01', year: '1st Year', isPresent: true },
      { id: '2', name: 'Jane Smith', rollNumber: '02', year: '2nd Year', isPresent: true },
      { id: '3', name: 'Mike Johnson', rollNumber: '03', year: '3rd Year', isPresent: false },
      { id: '4', name: 'Sarah Wilson', rollNumber: '04', year: '1st Year', isPresent: true },
      { id: '5', name: 'David Brown', rollNumber: '05', year: '2nd Year', isPresent: true },
      { id: '6', name: 'Emily Davis', rollNumber: '06', year: '3rd Year', isPresent: false },
      { id: '7', name: 'Alex Turner', rollNumber: '07', year: '1st Year', isPresent: true },
      { id: '8', name: 'Lisa Chen', rollNumber: '08', year: '2nd Year', isPresent: true },
    ]
    setStudents(sampleStudents)

    // Load sample attendance records
    const sampleRecords: AttendanceRecord[] = [
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        classType: 'Computer Science - Theory',
        presentCount: 6,
        totalCount: 8,
        students: sampleStudents.map(s => ({ ...s, isPresent: Math.random() > 0.3 }))
      },
      {
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
        classType: 'Computer Science - Lab',
        presentCount: 7,
        totalCount: 8,
        students: sampleStudents.map(s => ({ ...s, isPresent: Math.random() > 0.2 }))
      }
    ]
    setAttendanceRecords(sampleRecords)
  }, [])

  const toggleAttendance = (studentId: string) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, isPresent: !student.isPresent }
        : student
    ))
  }

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, isPresent: true })))
  }

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, isPresent: false })))
  }

  const saveAttendance = async () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      const newRecord: AttendanceRecord = {
        date: selectedDate.toISOString().split('T')[0],
        classType: selectedClass,
        presentCount: students.filter(s => s.isPresent).length,
        totalCount: students.length,
        students: students.map(s => ({
          id: s.id,
          name: s.name,
          rollNumber: s.rollNumber,
          isPresent: s.isPresent
        }))
      }
      
      setAttendanceRecords([newRecord, ...attendanceRecords])
      setIsSaving(false)
      
      // Show success message (you could use a toast here)
      alert('Attendance saved successfully!')
    }, 1000)
  }

  const getPresentCount = () => students.filter(s => s.isPresent).length
  const getAttendancePercentage = () => Math.round((getPresentCount() / students.length) * 100)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (showHistory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-800">Attendance History</h2>
            <p className="text-purple-600">View past attendance records</p>
          </div>
          <Button
            onClick={() => setShowHistory(false)}
            variant="outline"
            className="border-purple-300 text-purple-700"
          >
            Back to Current
          </Button>
        </div>

        <div className="space-y-4">
          {attendanceRecords.map((record, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{record.classType}</CardTitle>
                    <CardDescription>{new Date(record.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={`${
                    (record.presentCount / record.totalCount) >= 0.8 
                      ? 'bg-green-100 text-green-800' 
                      : (record.presentCount / record.totalCount) >= 0.6
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {Math.round((record.presentCount / record.totalCount) * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    Present: {record.presentCount} / {record.totalCount}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {record.students.map((student) => (
                    <div
                      key={student.id}
                      className={`p-2 rounded text-sm ${
                        student.isPresent 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{student.name}</span>
                        <span className="font-mono">{student.rollNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {attendanceRecords.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500">No attendance records found</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Attendance System</h2>
        <p className="text-purple-600">Mark student attendance for today's class</p>
      </div>

      {/* Date and Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-800">Class Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  {formatDate(selectedDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Class Type</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science - Theory">Computer Science - Theory</SelectItem>
                <SelectItem value="Computer Science - Lab">Computer Science - Lab</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{getPresentCount()}</p>
            <p className="text-sm opacity-90">Present</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{students.length - getPresentCount()}</p>
            <p className="text-sm opacity-90">Absent</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{getAttendancePercentage()}%</p>
            <p className="text-sm opacity-90">Attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Button
          onClick={markAllPresent}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Mark All Present
        </Button>
        <Button
          onClick={markAllAbsent}
          variant="outline"
          className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
        >
          Mark All Absent
        </Button>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-purple-800">Student List</CardTitle>
            <Button
              onClick={() => setShowHistory(true)}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700"
            >
              View History
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {students.map((student, index) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 animate-fade-in ${
                student.isPresent
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    student.isPresent ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      Roll: {student.rollNumber} • {student.year}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge className={`${
                  student.isPresent 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {student.isPresent ? 'Present' : 'Absent'}
                </Badge>
                <Switch
                  checked={student.isPresent}
                  onCheckedChange={() => toggleAttendance(student.id)}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={saveAttendance}
        disabled={isSaving}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg"
      >
        {isSaving ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Saving Attendance...</span>
          </div>
        ) : (
          'Save Attendance'
        )}
      </Button>

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
