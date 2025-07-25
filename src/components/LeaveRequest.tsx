'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface LeaveRequest {
  id: string
  facultyID: string
  fromDate: string
  toDate: string
  reason: string
  type: 'Sick Leave' | 'Casual Leave' | 'Emergency Leave' | 'Personal Leave' | 'Other'
  status: 'Pending' | 'Approved' | 'Rejected'
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectionReason?: string
  documents?: string[]
}

export default function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()

  const [newRequest, setNewRequest] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    type: 'Casual Leave' as const
  })

  useEffect(() => {
    // Load sample leave requests
    const sampleRequests: LeaveRequest[] = [
      {
        id: '1',
        facultyID: 'F001',
        fromDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        toDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 9 days from now
        reason: 'Family wedding ceremony',
        type: 'Personal Leave',
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        facultyID: 'F001',
        fromDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days ago
        toDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days ago
        reason: 'Medical checkup and treatment',
        type: 'Sick Leave',
        status: 'Approved',
        appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        approvedBy: 'Dr. Smith (HOD)',
        approvedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: '3',
        facultyID: 'F001',
        fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        toDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 25 days ago
        reason: 'Personal vacation - insufficient notice',
        type: 'Casual Leave',
        status: 'Rejected',
        appliedDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rejectionReason: 'Insufficient advance notice. Please apply at least 7 days in advance for casual leave.'
      },
      {
        id: '4',
        facultyID: 'F001',
        fromDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days ago
        toDate: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 58 days ago
        reason: 'Conference attendance - International AI Symposium',
        type: 'Other',
        status: 'Approved',
        appliedDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        approvedBy: 'Dr. Johnson (Principal)',
        approvedDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]
    setLeaveRequests(sampleRequests)
  }, [])

  const handleSubmitRequest = () => {
    if (newRequest.fromDate && newRequest.toDate && newRequest.reason) {
      const request: LeaveRequest = {
        id: Date.now().toString(),
        facultyID: 'F001',
        fromDate: newRequest.fromDate,
        toDate: newRequest.toDate,
        reason: newRequest.reason,
        type: newRequest.type,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      }
      
      setLeaveRequests([request, ...leaveRequests])
      setNewRequest({
        fromDate: '',
        toDate: '',
        reason: '',
        type: 'Casual Leave'
      })
      setIsAddDialogOpen(false)
    }
  }

  const getFilteredRequests = () => {
    let filtered = leaveRequests

    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status.toLowerCase() === filterStatus)
    }

    return filtered.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
  }

  const getStatusStats = () => {
    const stats = {
      total: leaveRequests.length,
      pending: leaveRequests.filter(r => r.status === 'Pending').length,
      approved: leaveRequests.filter(r => r.status === 'Approved').length,
      rejected: leaveRequests.filter(r => r.status === 'Rejected').length
    }
    return stats
  }

  const calculateLeaveDays = (fromDate: string, toDate: string) => {
    const start = new Date(fromDate)
    const end = new Date(toDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sick Leave':
        return 'bg-red-100 text-red-800'
      case 'Casual Leave':
        return 'bg-blue-100 text-blue-800'
      case 'Emergency Leave':
        return 'bg-orange-100 text-orange-800'
      case 'Personal Leave':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = getStatusStats()
  const filteredRequests = getFilteredRequests()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Leave Requests</h2>
          <p className="text-purple-600">Apply for leave and track your request status</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>
                Submit a new leave request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Leave Type</Label>
                <Select value={newRequest.type} onValueChange={(value) => setNewRequest({...newRequest, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromDate">From Date</Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={newRequest.fromDate}
                    onChange={(e) => setNewRequest({...newRequest, fromDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="toDate">To Date</Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={newRequest.toDate}
                    onChange={(e) => setNewRequest({...newRequest, toDate: e.target.value})}
                  />
                </div>
              </div>
              {newRequest.fromDate && newRequest.toDate && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Duration: {calculateLeaveDays(newRequest.fromDate, newRequest.toDate)} day(s)
                </div>
              )}
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                  placeholder="Enter reason for leave"
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitRequest} className="w-full bg-purple-600 hover:bg-purple-700">
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm opacity-90">Total Requests</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm opacity-90">Pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p className="text-sm opacity-90">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.rejected}</p>
            <p className="text-sm opacity-90">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="filter">Filter by status:</Label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <Card
            key={request.id}
            className="shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(request.type)}>
                    {request.type}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  Applied: {formatDate(request.appliedDate)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="text-gray-600">
                    {formatDate(request.fromDate)} to {formatDate(request.toDate)}
                    <span className="ml-2 text-sm text-purple-600">
                      ({calculateLeaveDays(request.fromDate, request.toDate)} days)
                    </span>
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Reason:</span>
                  <p className="text-gray-600 mt-1">{request.reason}</p>
                </div>

                {request.status === 'Approved' && request.approvedBy && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Approved by:</span> {request.approvedBy}
                    </p>
                    {request.approvedDate && (
                      <p className="text-sm text-green-700">
                        <span className="font-medium">Approved on:</span> {formatDate(request.approvedDate)}
                      </p>
                    )}
                  </div>
                )}

                {request.status === 'Rejected' && request.rejectionReason && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Rejection Reason:</span>
                    </p>
                    <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
                  </div>
                )}

                {request.status === 'Pending' && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Your leave request is under review. You will be notified once it's processed.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => {
                    setSelectedRequest(request)
                    setIsViewDialogOpen(true)
                  }}
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">
              {filterStatus === 'all' 
                ? 'No leave requests found' 
                : `No ${filterStatus} leave requests found`
              }
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Click "Apply for Leave" to submit your first request
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Complete information about your leave request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Request ID:</span>
                <span className="text-gray-600">#{selectedRequest.id}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Type:</span>
                <Badge className={getTypeColor(selectedRequest.type)}>
                  {selectedRequest.type}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status}
                </Badge>
              </div>
              
              <div>
                <span className="font-medium">Duration:</span>
                <p className="text-gray-600 mt-1">
                  {formatDate(selectedRequest.fromDate)} to {formatDate(selectedRequest.toDate)}
                  <span className="ml-2 text-purple-600">
                    ({calculateLeaveDays(selectedRequest.fromDate, selectedRequest.toDate)} days)
                  </span>
                </p>
              </div>
              
              <div>
                <span className="font-medium">Reason:</span>
                <p className="text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                  {selectedRequest.reason}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Applied Date:</span>
                <span className="text-gray-600">{formatDate(selectedRequest.appliedDate)}</span>
              </div>
              
              {selectedRequest.approvedBy && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Approved By:</span>
                  <span className="text-gray-600">{selectedRequest.approvedBy}</span>
                </div>
              )}
              
              {selectedRequest.approvedDate && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Approved Date:</span>
                  <span className="text-gray-600">{formatDate(selectedRequest.approvedDate)}</span>
                </div>
              )}
              
              {selectedRequest.rejectionReason && (
                <div>
                  <span className="font-medium text-red-700">Rejection Reason:</span>
                  <p className="text-red-600 mt-1 bg-red-50 p-2 rounded">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
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
