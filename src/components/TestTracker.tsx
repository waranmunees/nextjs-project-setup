'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface Test {
  id: string
  subject: string
  title: string
  date: string
  maxMarks: number
  duration: string
  type: 'Quiz' | 'Mid-term' | 'Final' | 'Assignment Test'
  studentMarks: StudentMark[]
}

interface StudentMark {
  studentId: string
  studentName: string
  rollNumber: string
  marks?: number
  grade?: string
  remarks?: string
}

export default function TestTracker() {
  const [tests, setTests] = useState<Test[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isGradingDialogOpen, setIsGradingDialogOpen] = useState(false)
  const [newTest, setNewTest] = useState({
    subject: 'Computer Science',
    title: '',
    date: '',
    maxMarks: 100,
    duration: '60',
    type: 'Quiz' as const
  })

  // Sample students
  const sampleStudents = [
    { id: '1', name: 'John Doe', rollNumber: '01' },
    { id: '2', name: 'Jane Smith', rollNumber: '02' },
    { id: '3', name: 'Mike Johnson', rollNumber: '03' },
    { id: '4', name: 'Sarah Wilson', rollNumber: '04' },
    { id: '5', name: 'David Brown', rollNumber: '05' },
    { id: '6', name: 'Emily Davis', rollNumber: '06' },
    { id: '7', name: 'Alex Turner', rollNumber: '07' },
    { id: '8', name: 'Lisa Chen', rollNumber: '08' }
  ]

  useEffect(() => {
    // Load sample tests
    const sampleTests: Test[] = [
      {
        id: '1',
        subject: 'Computer Science',
        title: 'Data Structures Quiz',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        maxMarks: 50,
        duration: '45 minutes',
        type: 'Quiz',
        studentMarks: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          marks: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 30 : undefined,
          grade: Math.random() > 0.3 ? getGrade(Math.floor(Math.random() * 20) + 30, 50) : undefined
        }))
      },
      {
        id: '2',
        subject: 'Mathematics',
        title: 'Calculus Mid-term',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        maxMarks: 100,
        duration: '2 hours',
        type: 'Mid-term',
        studentMarks: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          marks: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 60 : undefined,
          grade: Math.random() > 0.5 ? getGrade(Math.floor(Math.random() * 30) + 60, 100) : undefined
        }))
      },
      {
        id: '3',
        subject: 'Computer Science',
        title: 'Algorithm Analysis Test',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
        maxMarks: 75,
        duration: '90 minutes',
        type: 'Assignment Test',
        studentMarks: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          marks: Math.floor(Math.random() * 25) + 50,
          grade: getGrade(Math.floor(Math.random() * 25) + 50, 75)
        }))
      }
    ]
    setTests(sampleTests)
  }, [])

  function getGrade(marks: number, maxMarks: number): string {
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C+'
    if (percentage >= 40) return 'C'
    return 'F'
  }

  const handleAddTest = () => {
    if (newTest.title && newTest.date) {
      const test: Test = {
        id: Date.now().toString(),
        subject: newTest.subject,
        title: newTest.title,
        date: newTest.date,
        maxMarks: newTest.maxMarks,
        duration: newTest.duration + ' minutes',
        type: newTest.type,
        studentMarks: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber
        }))
      }
      
      setTests([test, ...tests])
      setNewTest({
        subject: 'Computer Science',
        title: '',
        date: '',
        maxMarks: 100,
        duration: '60',
        type: 'Quiz'
      })
      setIsAddDialogOpen(false)
    }
  }

  const updateStudentMark = (testId: string, studentId: string, marks: number) => {
    setTests(tests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          studentMarks: test.studentMarks.map(studentMark => {
            if (studentMark.studentId === studentId) {
              return {
                ...studentMark,
                marks,
                grade: getGrade(marks, test.maxMarks)
              }
            }
            return studentMark
          })
        }
      }
      return test
    }))
  }

  const getTestStats = (test: Test) => {
    const gradedStudents = test.studentMarks.filter(s => s.marks !== undefined)
    const totalStudents = test.studentMarks.length
    const averageMarks = gradedStudents.length > 0 
      ? Math.round(gradedStudents.reduce((sum, s) => sum + (s.marks || 0), 0) / gradedStudents.length)
      : 0
    const highestMarks = gradedStudents.length > 0 
      ? Math.max(...gradedStudents.map(s => s.marks || 0))
      : 0
    const lowestMarks = gradedStudents.length > 0 
      ? Math.min(...gradedStudents.map(s => s.marks || 0))
      : 0
    
    return {
      gradedCount: gradedStudents.length,
      totalCount: totalStudents,
      averageMarks,
      highestMarks,
      lowestMarks,
      gradingProgress: Math.round((gradedStudents.length / totalStudents) * 100)
    }
  }

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getGradeDistribution = (test: Test) => {
    const grades = test.studentMarks.filter(s => s.grade).map(s => s.grade!)
    const distribution = {
      'A+': grades.filter(g => g === 'A+').length,
      'A': grades.filter(g => g === 'A').length,
      'B+': grades.filter(g => g === 'B+').length,
      'B': grades.filter(g => g === 'B').length,
      'C+': grades.filter(g => g === 'C+').length,
      'C': grades.filter(g => g === 'C').length,
      'F': grades.filter(g => g === 'F').length
    }
    return distribution
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Test Tracker</h2>
          <p className="text-purple-600">Schedule tests and manage student performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Schedule Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Test</DialogTitle>
              <DialogDescription>
                Create a new test for students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={newTest.subject} onValueChange={(value) => setNewTest({...newTest, subject: value})}>
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
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  value={newTest.title}
                  onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                  placeholder="Enter test title"
                />
              </div>
              <div>
                <Label htmlFor="date">Test Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTest.date}
                  onChange={(e) => setNewTest({...newTest, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxMarks">Max Marks</Label>
                  <Input
                    id="maxMarks"
                    type="number"
                    value={newTest.maxMarks}
                    onChange={(e) => setNewTest({...newTest, maxMarks: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newTest.duration}
                    onChange={(e) => setNewTest({...newTest, duration: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="type">Test Type</Label>
                <Select value={newTest.type} onValueChange={(value) => setNewTest({...newTest, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quiz">Quiz</SelectItem>
                    <SelectItem value="Mid-term">Mid-term</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                    <SelectItem value="Assignment Test">Assignment Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTest} className="w-full bg-purple-600 hover:bg-purple-700">
                Schedule Test
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{tests.length}</p>
            <p className="text-sm opacity-90">Total Tests</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{tests.filter(t => isUpcoming(t.date)).length}</p>
            <p className="text-sm opacity-90">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {tests.map((test, index) => {
          const stats = getTestStats(test)
          const upcoming = isUpcoming(test.date)
          
          return (
            <Card
              key={test.id}
              className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg text-gray-800">{test.title}</CardTitle>
                      <Badge className={`${
                        test.type === 'Quiz' ? 'bg-blue-100 text-blue-800' :
                        test.type === 'Mid-term' ? 'bg-orange-100 text-orange-800' :
                        test.type === 'Final' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {test.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {test.subject} • {test.duration} • {test.maxMarks} marks
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${
                      upcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {upcoming ? 'Upcoming' : 'Completed'}
                    </Badge>
                    <span className="text-sm text-gray-600">{formatDate(test.date)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!upcoming && (
                    <>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Grading Progress</span>
                          <span>{stats.gradedCount} / {stats.totalCount}</span>
                        </div>
                        <Progress value={stats.gradingProgress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="font-semibold text-purple-600">{stats.averageMarks}</p>
                          <p className="text-gray-600">Average</p>
                        </div>
                        <div>
                          <p className="font-semibold text-green-600">{stats.highestMarks}</p>
                          <p className="text-gray-600">Highest</p>
                        </div>
                        <div>
                          <p className="font-semibold text-red-600">{stats.lowestMarks}</p>
                          <p className="text-gray-600">Lowest</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setSelectedTest(test)
                        setIsViewDialogOpen(true)
                      }}
                      variant="outline"
                      className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      View Results
                    </Button>
                    {!upcoming && (
                      <Button
                        onClick={() => {
                          setSelectedTest(test)
                          setIsGradingDialogOpen(true)
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Grade Test
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tests.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No tests scheduled yet</p>
            <p className="text-sm text-gray-400 mt-2">Click "Schedule Test" to create your first test</p>
          </CardContent>
        </Card>
      )}

      {/* View Results Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTest?.title} - Results</DialogTitle>
            <DialogDescription>
              Student performance and grade distribution
            </DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-6">
              {/* Grade Distribution */}
              <div>
                <h3 className="font-semibold mb-3">Grade Distribution</h3>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(getGradeDistribution(selectedTest)).map(([grade, count]) => (
                    <div key={grade} className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-bold text-lg">{count}</p>
                      <p className="text-sm text-gray-600">{grade}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Student Results */}
              <div>
                <h3 className="font-semibold mb-3">Student Results</h3>
                <div className="space-y-2">
                  {selectedTest.studentMarks
                    .sort((a, b) => (b.marks || 0) - (a.marks || 0))
                    .map((studentMark) => (
                    <div
                      key={studentMark.studentId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{studentMark.studentName}</p>
                        <p className="text-sm text-gray-600">Roll: {studentMark.rollNumber}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {studentMark.marks !== undefined ? (
                          <>
                            <span className="font-semibold">
                              {studentMark.marks}/{selectedTest.maxMarks}
                            </span>
                            <Badge className={`${
                              studentMark.grade === 'A+' || studentMark.grade === 'A' ? 'bg-green-100 text-green-800' :
                              studentMark.grade === 'B+' || studentMark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              studentMark.grade === 'C+' || studentMark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {studentMark.grade}
                            </Badge>
                          </>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Not Graded
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Grading Dialog */}
      <Dialog open={isGradingDialogOpen} onOpenChange={setIsGradingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Grade Test: {selectedTest?.title}</DialogTitle>
            <DialogDescription>
              Enter marks for each student
            </DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-4">
              {selectedTest.studentMarks.map((studentMark) => (
                <div
                  key={studentMark.studentId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{studentMark.studentName}</p>
                    <p className="text-sm text-gray-600">Roll: {studentMark.rollNumber}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      min="0"
                      max={selectedTest.maxMarks}
                      value={studentMark.marks || ''}
                      onChange={(e) => {
                        const marks = parseInt(e.target.value)
                        if (!isNaN(marks)) {
                          updateStudentMark(selectedTest.id, studentMark.studentId, marks)
                        }
                      }}
                      placeholder="Marks"
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">/ {selectedTest.maxMarks}</span>
                    {studentMark.grade && (
                      <Badge className="bg-purple-100 text-purple-800">
                        {studentMark.grade}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
