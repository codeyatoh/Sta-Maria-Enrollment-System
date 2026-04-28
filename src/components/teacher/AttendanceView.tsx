import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/Table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/Select';
import { CheckCircle2, Save, CalendarDays, UserCheck, UserX, Clock, AlertCircle } from 'lucide-react';
import { useTeacherData } from '../../lib/teacherData';

export function AttendanceView() {
  const {
    students,
    attendance,
    updateAttendance,
    loading
  } = useTeacherData();
  
  const todayDate = new Date().toISOString().split('T')[0];
  const enrolled = React.useMemo(() => students.filter((s) => s.status === 'Enrolled'), [students]);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [localAttendance, setLocalAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const existing = attendance.filter((a) => a.date === selectedDate);
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
  }, [selectedDate, enrolled, attendance]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const s of enrolled) {
        const status = localAttendance[s.id] || 'Present';
        await updateAttendance(s.id, selectedDate, status);
      }
      setSaved(true);
    } catch (error) {
      console.error("Error saving attendance", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const presentCount = Object.values(localAttendance).filter((s) => s === 'Present').length;
  const absentCount = Object.values(localAttendance).filter((s) => s === 'Absent').length;
  const lateCount = Object.values(localAttendance).filter((s) => s === 'Late').length;

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="px-6 py-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Daily Attendance</h1>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Manage and track student attendance. Select a date below to view or modify records for that specific day.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto bg-card p-2 rounded-2xl shadow-sm border border-border">
            <div className="relative flex-1 md:w-48">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-sm font-medium border-none bg-transparent py-2 pl-9 pr-3 outline-none focus:ring-0 text-slate-700 cursor-pointer"
              />
            </div>
            <div className="w-px h-8 bg-border"></div>
            <Button
              className="rounded-xl px-6 shadow-md transition-all active:scale-95"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </div>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50 p-5 sm:p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Present</p>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-600">{presentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-200/50 flex items-center justify-center text-emerald-600 shadow-inner">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-200/50 p-5 sm:p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-rose-800 uppercase tracking-wider">Absent</p>
                <p className="text-3xl sm:text-4xl font-bold text-rose-600">{absentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-200/50 flex items-center justify-center text-rose-600 shadow-inner">
                <UserX className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50 p-5 sm:p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Late</p>
                <p className="text-3xl sm:text-4xl font-bold text-amber-600">{lateCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-200/50 flex items-center justify-center text-amber-600 shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className={`p-5 sm:p-6 rounded-2xl shadow-sm relative overflow-hidden border ${saved ? 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200' : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50'}`}>
            <div className="flex flex-col justify-between h-full space-y-3">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Sync Status</p>
              <div className="flex items-center gap-2 mt-auto">
                {saved ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span className="text-xl font-bold text-slate-700 tracking-tight">Saved</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-blue-500 animate-pulse" />
                    <span className="text-xl font-bold text-blue-700 tracking-tight">Unsaved</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-card border-border rounded-2xl overflow-hidden shadow-md">
          <div className="p-5 border-b border-border flex items-center justify-between bg-white">
            <h3 className="font-bold text-lg text-slate-800">Student Roster</h3>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
              {enrolled.length} Enrolled
            </span>
          </div>
          <div className="overflow-x-auto bg-white/50">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-bold text-slate-700 pl-6 w-16">#</TableHead>
                  <TableHead className="font-bold text-slate-700">Learner Name</TableHead>
                  <TableHead className="font-bold text-slate-700">LRN</TableHead>
                  <TableHead className="font-bold text-slate-700 w-56 text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolled.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No students currently enrolled in this section.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrolled.map((s, idx) => {
                    const status = localAttendance[s.id] || 'Present';
                    const rowColors = {
                      Present: 'hover:bg-emerald-50/40',
                      Absent: 'bg-rose-50/40 hover:bg-rose-50/60',
                      Late: 'bg-amber-50/40 hover:bg-amber-50/60'
                    };
                    const avatarColors = {
                      Present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                      Absent: 'bg-rose-100 text-rose-700 border-rose-200',
                      Late: 'bg-amber-100 text-amber-700 border-amber-200'
                    };

                    return (
                      <TableRow
                        key={s.id}
                        className={`border-b border-border/40 transition-colors ${rowColors[status]}`}
                      >
                        <TableCell className="pl-6 text-slate-400 font-semibold w-16">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${avatarColors[status]}`}>
                              {s.firstName?.charAt(0) || ''}{s.lastName?.charAt(0) || ''}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">
                              {s.lastName}, {s.firstName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500 font-mono text-sm font-medium">
                          {s.lrn}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Select
                            value={status}
                            onValueChange={(v: string) => {
                              setLocalAttendance({
                                ...localAttendance,
                                [s.id]: v as 'Present' | 'Absent' | 'Late'
                              });
                              setSaved(false);
                            }}
                          >
                            <SelectTrigger
                              className={`w-[140px] ml-auto h-9 font-semibold transition-colors focus:ring-0 focus:ring-offset-0 ${
                                status === 'Present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' :
                                status === 'Absent' ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' :
                                'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                              }`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="font-medium">
                              <SelectItem value="Present" className="text-emerald-700 focus:text-emerald-800 focus:bg-emerald-50">Present</SelectItem>
                              <SelectItem value="Late" className="text-amber-700 focus:text-amber-800 focus:bg-amber-50">Late</SelectItem>
                              <SelectItem value="Absent" className="text-rose-700 focus:text-rose-800 focus:bg-rose-50">Absent</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );

}