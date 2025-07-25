'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Student {
  id: string
  name: string
  age: number
  registerNumber: string
  rollNumber: string
  year: '1st Year' | '2nd Year' | '3rd Year'
  class: string
  status: 'Day Scholar' | 'Hosteller'
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    age: 18,
    registerNumber: '',
    rollNumber: '',
    year: '1st Year',
    class: 'B.Sc Computer Science',
    status: 'Day Scholar'
  })

  // Sample data
  useEffect(() => {
    const sampleStudents: Student[] = [
      {
        id: '1',
        name: 'John Doe',
        age: 20,
        registerNumber: 'R001',
        rollNumber: '01',
        year: '1st Year',
        class: 'B.Sc Computer Science',
        status: 'Day Scholar'
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 21,
        registerNumber: 'R002',
        rollNumber: '02',
        year: '2nd Year',
        class: 'B.Sc Computer Science',
        status: 'Hosteller'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        age: 22,
        registerNumber: 'R003',
        rollNumber: '03',
        year: '3rd Year',
        class: 'B.Sc Computer Science',
        status: 'Day Scholar'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        age: 19,
        registerNumber: 'R004',
        rollNumber: '04',
        year: '1st Year',
        class: 'B.Sc Computer Science',
        status: 'Hosteller'
      },
      {
        id: '5',
        name: 'David Brown',
        age: 20,
        registerNumber: 'R005',
        rollNumber: '05',
        year: '2nd Year',
        class: 'B.Sc Computer Science',
        status: 'Day Scholar'
      },
      {
        id: '6',
        name: 'Emily Davis',
        age: 21,
        registerNumber: 'R006',
        rollNumber: '06',
        year: '3rd Year',
        class: 'B.Sc Computer Science',
        status: 'Hosteller'
      }
    ]
    setStudents(sampleStudents)
    setFilteredStudents(sampleStudents)
  }, [])

  // Filter students based on year and search term
  useEffect(() => {
    let filtered = students

    if (selectedYear !== 'all') {
      filtered = filtered.filter(student => student.year === selectedYear)
    }

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.includes(searchTerm) ||
        student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredStudents(filtered)
  }, [students, selectedYear, searchTerm])

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.registerNumber && newStudent.rollNumber) {
      const student: Student = {
        id: Date.now().toString(),
        name: newStudent.name!,
        age: newStudent.age || 18,
        registerNumber: newStudent.registerNumber!,
        rollNumber: newStudent.rollNumber!,
        year: newStudent.year || '1st Year',
        class: newStudent.class || 'B.Sc Computer Science',
        status: newStudent.status || 'Day Scholar'
      }
      
      setStudents([...students, student])
      setNewStudent({
        name: '',
        age: 18,
        registerNumber: '',
        rollNumber: '',
        year: '1st Year',
        class: 'B.Sc Computer Science',
        status: 'Day Scholar'
      })
      setIsAddDialogOpen(false)
    }
  }

  const getYearStats = () => {
    const stats = {
      '1st Year': students.filter(s => s.year === '1st Year').length,
      '2nd Year': students.filter(s => s.year === '2nd Year').length,
      '3rd Year': students.filter(s => s.year === '3rd Year').length,
      'Day Scholar': students.filter(s => s.status === 'Day Scholar').length,
      'Hosteller': students.filter(s => s.status === 'Hosteller').length
    }
    return stats
  }

  const stats = getYearStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Student Management</h2>
        <p className="text-purple-600">Manage student information by academic year</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-sm opacity-90">Total Students</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{filteredStudents.length}</p>
            <p className="text-sm opacity-90">Filtered Results</p>
          </CardContent>
        </Card>
      </div>

      {/* Year Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-800">Year Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{stats['1st Year']}</p>
              <p className="text-sm text-gray-600">1st Year</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{stats['2nd Year']}</p>
              <p className="text-sm text-gray-600">2nd Year</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{stats['3rd Year']}</p>
              <p className="text-sm text-gray-600">3rd Year</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600">{stats['Day Scholar']}</p>
              <p className="text-sm text-gray-600">Day Scholars</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-orange-600">{stats['Hosteller']}</p>
              <p className="text-sm text-gray-600">Hostellers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Add Button */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1st Year">1st Year</SelectItem>
              <SelectItem value="2nd Year">2nd Year</SelectItem>
              <SelectItem value="3rd Year">3rd Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter student information below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newStudent.name || ''}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Student name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newStudent.age || 18}
                    onChange={(e) => setNewStudent({...newStudent, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="registerNumber">Register Number</Label>
                  <Input
                    id="registerNumber"
                    value={newStudent.registerNumber || ''}
                    onChange={(e) => setNewStudent({...newStudent, registerNumber: e.target.value})}
                    placeholder="R007"
                  />
                </div>
                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={newStudent.rollNumber || ''}
                    onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                    placeholder="07"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select value={newStudent.year} onValueChange={(value) => setNewStudent({...newStudent, year: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newStudent.status} onValueChange={(value) => setNewStudent({...newStudent, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                      <SelectItem value="Hosteller">Hosteller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddStudent} className="w-full bg-purple-600 hover:bg-purple-700">
                  Add Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Input
          placeholder="Search by name, roll number, or register number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {filteredStudents.map((student, index) => (
          <Card
            key={student.id}
            className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">Age: {student.age}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={`${
                    student.year === '1st Year' ? 'bg-green-100 text-green-800' :
                    student.year === '2nd Year' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {student.year}
                  </Badge>
                  <Badge className={`${
                    student.status === 'Day Scholar' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {student.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Register No:</p>
                  <p className="font-medium">{student.registerNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Roll No:</p>
                  <p className="font-medium">{student.rollNumber}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-600 text-sm">Class:</p>
                <p className="font-medium text-sm">{student.class}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No students found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out both;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  )
}
