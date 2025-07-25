'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  createdDate: string
  submissions: StudentSubmission[]
}

interface StudentSubmission {
  studentId: string
  studentName: string
  rollNumber: string
  isSubmitted: boolean
  submissionDate?: string
  grade?: number
  feedback?: string
}

export default function AssignmentTracker() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: ''
  })

  // Sample students for submissions
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
    // Load sample assignments
    const sampleAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Data Structures Implementation',
        description: 'Implement basic data structures including Stack, Queue, and Linked List in your preferred programming language.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        createdDate: new Date().toISOString().split('T')[0],
        submissions: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          isSubmitted: Math.random() > 0.4,
          submissionDate: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
          grade: Math.random() > 0.4 ? Math.floor(Math.random() * 40) + 60 : undefined
        }))
      },
      {
        id: '2',
        title: 'Database Design Project',
        description: 'Design and implement a database schema for a library management system with proper normalization.',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
        createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        submissions: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          isSubmitted: Math.random() > 0.6,
          submissionDate: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
          grade: Math.random() > 0.6 ? Math.floor(Math.random() * 35) + 65 : undefined
        }))
      },
      {
        id: '3',
        title: 'Algorithm Analysis Report',
        description: 'Write a comprehensive report analyzing the time and space complexity of sorting algorithms.',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago (overdue)
        createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        submissions: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          isSubmitted: Math.random() > 0.2,
          submissionDate: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
          grade: Math.random() > 0.2 ? Math.floor(Math.random() * 30) + 70 : undefined
        }))
      }
    ]
    setAssignments(sampleAssignments)
  }, [])

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      const assignment: Assignment = {
        id: Date.now().toString(),
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate,
        createdDate: new Date().toISOString().split('T')[0],
        submissions: sampleStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          isSubmitted: false
        }))
      }
      
      setAssignments([assignment, ...assignments])
      setNewAssignment({ title: '', description: '', dueDate: '' })
      setIsAddDialogOpen(false)
    }
  }

  const toggleSubmission = (assignmentId: string, studentId: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          submissions: assignment.submissions.map(submission => {
            if (submission.studentId === studentId) {
              return {
                ...submission,
                isSubmitted: !submission.isSubmitted,
                submissionDate: !submission.isSubmitted ? new Date().toISOString().split('T')[0] : undefined
              }
            }
            return submission
          })
        }
      }
      return assignment
    }))
  }

  const getSubmissionStats = (assignment: Assignment) => {
    const submitted = assignment.submissions.filter(s => s.isSubmitted).length
    const total = assignment.submissions.length
    const percentage = Math.round((submitted / total) * 100)
    return { submitted, total, percentage }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Assignment Tracker</h2>
          <p className="text-purple-600">Manage assignments and track student submissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Add a new assignment for students to complete
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="Enter assignment description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                />
              </div>
              <Button onClick={handleAddAssignment} className="w-full bg-purple-600 hover:bg-purple-700">
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignment Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{assignments.length}</p>
            <p className="text-sm opacity-90">Total Assignments</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{assignments.filter(a => isOverdue(a.dueDate)).length}</p>
            <p className="text-sm opacity-90">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((assignment, index) => {
          const stats = getSubmissionStats(assignment)
          const daysUntilDue = getDaysUntilDue(assignment.dueDate)
          const overdue = isOverdue(assignment.dueDate)
          
          return (
            <Card
              key={assignment.id}
              className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-800">{assignment.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {assignment.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${
                      overdue 
                        ? 'bg-red-100 text-red-800' 
                        : daysUntilDue <= 3 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {overdue 
                        ? `Overdue by ${Math.abs(daysUntilDue)} days`
                        : daysUntilDue === 0
                        ? 'Due Today'
                        : `${daysUntilDue} days left`
                      }
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {stats.percentage}% submitted
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Submission Progress</span>
                      <span>{stats.submitted} / {stats.total}</span>
                    </div>
                    <Progress value={stats.percentage} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                    <span>Created: {formatDate(assignment.createdDate)}</span>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setSelectedAssignment(assignment)
                      setIsViewDialogOpen(true)
                    }}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    View Submissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {assignments.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No assignments created yet</p>
            <p className="text-sm text-gray-400 mt-2">Click "Add Assignment" to create your first assignment</p>
          </CardContent>
        </Card>
      )}

      {/* View Assignment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              Student submission status and grades
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedAssignment.submissions.filter(s => s.isSubmitted).length}
                  </p>
                  <p className="text-sm text-gray-600">Submitted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedAssignment.submissions.filter(s => !s.isSubmitted).length}
                  </p>
                  <p className="text-sm text-gray-600">Not Submitted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {getSubmissionStats(selectedAssignment).percentage}%
                  </p>
                  <p className="text-sm text-gray-600">Completion</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {selectedAssignment.submissions.map((submission) => (
                  <div
                    key={submission.studentId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      submission.isSubmitted
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        submission.isSubmitted ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{submission.studentName}</p>
                        <p className="text-sm text-gray-600">Roll: {submission.rollNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {submission.submissionDate && (
                        <span className="text-xs text-gray-500">
                          {formatDate(submission.submissionDate)}
                        </span>
                      )}
                      {submission.grade && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {submission.grade}/100
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={submission.isSubmitted ? "outline" : "default"}
                        onClick={() => toggleSubmission(selectedAssignment.id, submission.studentId)}
                        className={submission.isSubmitted 
                          ? "border-red-300 text-red-700 hover:bg-red-50" 
                          : "bg-green-600 hover:bg-green-700"
                        }
                      >
                        {submission.isSubmitted ? 'Mark Unsubmitted' : 'Mark Submitted'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
