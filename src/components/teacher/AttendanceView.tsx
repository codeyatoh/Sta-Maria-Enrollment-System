import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../ui/Table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../ui/Select';
import { CheckCircle2, Save } from 'lucide-react';
import { useTeacherData, AttendanceEntry } from '../../lib/teacherData';
export function AttendanceView() {
  const {
    students,
    submitAttendance,
    getAttendanceForDate,
    todayDate
  } = useTeacherData();
  const enrolled = students.filter((s) => s.status === 'Enrolled');
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [localAttendance, setLocalAttendance] = useState<
    Record<string, 'Present' | 'Absent' | 'Late'>>(
    {});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const existing = getAttendanceForDate(selectedDate);
    const map: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    existing.forEach((e) => {
      map[e.studentId] = e.status;
    });
    // Default to Present for students without records
    enrolled.forEach((s) => {
      if (!map[s.id]) map[s.id] = 'Present';
    });
    setLocalAttendance(map);
    setSaved(existing.length > 0);
  }, [selectedDate, enrolled, getAttendanceForDate]);
  const handleSave = () => {
    const entries: AttendanceEntry[] = enrolled.map((s) => ({
      studentId: s.id,
      date: selectedDate,
      status: localAttendance[s.id] || 'Present'
    }));
    submitAttendance(entries);
    setSaved(true);
  };
  const presentCount = Object.values(localAttendance).filter(
    (s) => s === 'Present'
  ).length;
  const absentCount = Object.values(localAttendance).filter(
    (s) => s === 'Absent'
  ).length;
  const lateCount = Object.values(localAttendance).filter(
    (s) => s === 'Late'
  ).length;
  return (
    <div className="flex flex-col h-full">
      <header className="h-auto sm:h-16 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <h1 className="text-lg font-semibold tracking-tight">
            Daily Attendance
          </h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-1.5 bg-background w-full sm:w-auto" />
          
        </div>
        <Button
          className="rounded-full px-5 h-9 shadow-sm w-full sm:w-auto"
          onClick={handleSave}>
          
          <Save className="w-4 h-4 mr-2" /> Save Attendance
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-card border-border p-4 shadow-sm rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Present</p>
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          </Card>
          <Card className="bg-card border-border p-4 shadow-sm rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Absent</p>
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          </Card>
          <Card className="bg-card border-border p-4 shadow-sm rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Late</p>
            <p className="text-2xl font-bold text-orange-600">{lateCount}</p>
          </Card>
          <Card className="bg-card border-border p-4 shadow-sm rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <p className="text-sm font-semibold mt-1">
              {saved ?
              <span className="text-green-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Saved
                </span> :

              <span className="text-orange-600">Unsaved</span>
              }
            </p>
          </Card>
        </div>

        <Card className="bg-card border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-foreground pl-4 sm:pl-6 w-8">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    LRN
                  </TableHead>
                  <TableHead className="font-semibold text-foreground w-48 whitespace-nowrap">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolled.map((s, idx) =>
                <TableRow
                  key={s.id}
                  className="border-b border-border/50 hover:bg-muted/30">
                  
                    <TableCell className="pl-4 sm:pl-6 text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {s.firstName} {s.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                      {s.lrn}
                    </TableCell>
                    <TableCell>
                      <Select
                      value={localAttendance[s.id] || 'Present'}
                      onValueChange={(v: string) => {
                        setLocalAttendance({
                          ...localAttendance,
                          [s.id]: v as 'Present' | 'Absent' | 'Late'
                        });
                        setSaved(false);
                      }}>
                      
                        <SelectTrigger
                        className={`w-36 h-8 text-sm ${localAttendance[s.id] === 'Present' ? 'text-green-700' : localAttendance[s.id] === 'Absent' ? 'text-red-700' : 'text-orange-700'}`}>
                        
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>);

}