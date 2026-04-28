import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/Table';
import { CheckCircle2, XCircle, CircleDashed, ClipboardCheck, Clock, Check, X } from 'lucide-react';
import { useTeacherData } from '../../lib/teacherData';

export function EnrollmentsView() {
  const { students, updateStudentStatus, loading } = useTeacherData();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const pending = students.filter((s) => s.status === 'Pending');
  const processed = students.filter((s) => s.status === 'Enrolled' || s.status === 'Rejected');

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="px-6 py-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <ClipboardCheck className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Review Enrollments</h1>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Review and approve pending student enrollments for your assigned section.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto bg-card p-3 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center px-4 space-x-2 text-sm font-semibold">
              {pending.length > 0 ? (
                <>
                  <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-amber-600">{pending.length} Pending Approvals</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600">All Caught Up</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {pending.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Pending Enrollments</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pending.map((student) => (
                <Card key={student.id} className="bg-white border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-lg">
                        {student.firstName?.charAt(0) || ''}{student.lastName?.charAt(0) || ''}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">
                          {student.lastName}, {student.firstName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            LRN: {student.lrn}
                          </span>
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {student.gender}
                          </span>
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Grade {student.gradeLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 w-fit shrink-0">
                      <CircleDashed className="w-3 h-3 mr-1.5 animate-spin-slow" /> Pending
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Height</p>
                      <p className="font-bold text-slate-700">{student.medical?.height || 'N/A'} cm</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Weight</p>
                      <p className="font-bold text-slate-700">{student.medical?.weight || 'N/A'} kg</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                    <Button
                      className="flex-1 rounded-xl shadow-sm hover:shadow-md transition-all bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                      onClick={() => updateStudentStatus(student.id, 'Enrolled')}
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve & Enroll
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      onClick={() => updateStudentStatus(student.id, 'Rejected')}
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && (
          <Card className="bg-white border-dashed border-2 border-emerald-200 p-12 shadow-sm rounded-3xl text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="font-bold text-2xl text-slate-800 mb-2">All Caught Up!</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              You have no pending enrollments to review at this time. When parents submit new enrollments for your section, they will appear here.
            </p>
          </Card>
        )}

        {processed.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-slate-200/60">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recently Processed</h2>
            <Card className="bg-white border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80 border-b border-border">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="font-bold text-slate-700 pl-6">Name</TableHead>
                      <TableHead className="font-bold text-slate-700">LRN</TableHead>
                      <TableHead className="font-bold text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processed.map((student) => (
                      <TableRow key={student.id} className="border-b border-border/40 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 font-semibold text-slate-800">
                          {student.lastName}, {student.firstName}
                        </TableCell>
                        <TableCell className="text-slate-500 font-mono text-sm font-medium">
                          {student.lrn}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-medium border-0 ${
                              student.status === 'Enrolled'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {student.status === 'Enrolled' ? (
                              <><CheckCircle2 className="w-3 h-3 mr-1.5" /> Enrolled</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1.5" /> Rejected</>
                            )}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}