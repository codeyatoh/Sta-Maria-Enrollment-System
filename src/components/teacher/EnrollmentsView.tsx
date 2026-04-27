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
  TableRow } from
'../ui/Table';
import { CheckCircle2, XCircle, CircleDashed } from 'lucide-react';
import { useTeacherData } from '../../lib/teacherData';
export function EnrollmentsView() {
  const { students, updateStudentStatus } = useTeacherData();
  const pending = students.filter((s) => s.status === 'Pending');
  const processed = students.filter(
    (s) => s.status === 'Enrolled' || s.status === 'Rejected'
  );
  return (
    <div className="flex flex-col h-full">
      <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-tight">
          Review Enrollments
        </h1>
        {pending.length > 0 &&
        <Badge className="ml-3 bg-orange-100 text-orange-700 border-none">
            {pending.length} pending
          </Badge>
        }
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {pending.length > 0 &&
        <div>
            <h2 className="text-base font-semibold mb-4">
              Pending Enrollments
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pending.map((student) =>
            <Card
              key={student.id}
              className="bg-card border-border p-4 sm:p-5 shadow-sm rounded-xl">
              
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        LRN: {student.lrn} · Grade {student.gradeLevel} ·{' '}
                        {student.gender}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Born: {student.birthDate}
                      </p>
                    </div>
                    <Badge className="bg-muted text-muted-foreground border-none w-fit">
                      <CircleDashed className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground text-xs mb-1">
                        Height
                      </p>
                      <p className="font-medium">{student.bmi.height} cm</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground text-xs mb-1">
                        Weight
                      </p>
                      <p className="font-medium">{student.bmi.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                  className="flex-1"
                  onClick={() =>
                  updateStudentStatus(student.id, 'Enrolled')
                  }>
                  
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() =>
                  updateStudentStatus(student.id, 'Rejected')
                  }>
                  
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </Card>
            )}
            </div>
          </div>
        }

        {pending.length === 0 &&
        <Card className="bg-card border-border p-8 shadow-sm rounded-xl text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">All Caught Up</h3>
            <p className="text-muted-foreground">
              No pending enrollments to review.
            </p>
          </Card>
        }

        <div>
          <h2 className="text-base font-semibold mb-4">Recently Processed</h2>
          <Card className="bg-card border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50 border-b border-border">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="font-semibold text-foreground pl-4 sm:pl-6 whitespace-nowrap">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      LRN
                    </TableHead>
                    <TableHead className="font-semibold text-foreground whitespace-nowrap">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processed.map((s) =>
                  <TableRow
                    key={s.id}
                    className="border-b border-border/50 hover:bg-muted/30">
                    
                      <TableCell className="font-medium pl-4 sm:pl-6 whitespace-nowrap">
                        {s.firstName} {s.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                        {s.lrn}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {s.status === 'Enrolled' ?
                      <Badge className="bg-green-100 text-green-700 border-none">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Enrolled
                          </Badge> :

                      <Badge className="bg-red-100 text-red-700 border-none">
                            <XCircle className="w-3 h-3 mr-1" /> Rejected
                          </Badge>
                      }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}