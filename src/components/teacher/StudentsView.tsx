import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/Table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../ui/Dialog';
import { Eye, Users, Activity, Scale, Ruler } from 'lucide-react';
import { useTeacherData } from '../../lib/teacherData';

export function StudentsView() {
  const { students, updateStudentBmi, loading } = useTeacherData();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [editBmi, setEditBmi] = useState({ height: '', weight: '' });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const enrolled = students.filter((s) => s.status === 'Enrolled');
  const student = selectedStudent ? students.find((s) => s.id === selectedStudent) : null;

  const openProfile = (id: string) => {
    const s = students.find((st) => st.id === id);
    if (s) {
      setEditBmi({
        height: s.medical?.height || '',
        weight: s.medical?.weight || ''
      });
      setSelectedStudent(id);
    }
  };

  const handleSaveBmi = () => {
    if (selectedStudent) {
      updateStudentBmi(selectedStudent, editBmi.height, editBmi.weight);
      setSelectedStudent(null);
    }
  };

  const calcBmi = (h?: string, w?: string) => {
    if (!h || !w) return '--';
    const hm = parseFloat(h) / 100;
    const wk = parseFloat(w);
    if (hm > 0 && wk > 0) return (wk / (hm * hm)).toFixed(1);
    return '--';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="px-6 py-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Users className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Student Profiles</h1>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              View and manage your enrolled students' profiles, including their physical health records and BMI.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto bg-card p-3 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center px-4 space-x-2 text-sm font-semibold text-slate-600">
              <Activity className="w-4 h-4 text-primary" />
              <span>{enrolled.filter(s => s.medical?.height && s.medical?.weight).length} / {enrolled.length} Health Records</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        <Card className="bg-card border-border rounded-2xl overflow-hidden shadow-md">
          <div className="p-5 border-b border-border flex items-center justify-between bg-white">
            <h3 className="font-bold text-lg text-slate-800">Enrolled Students</h3>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
              {enrolled.length} Total
            </span>
          </div>
          <div className="overflow-x-auto bg-white/50">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-bold text-slate-700 pl-6">Learner Name</TableHead>
                  <TableHead className="font-bold text-slate-700">LRN</TableHead>
                  <TableHead className="font-bold text-slate-700">Gender</TableHead>
                  <TableHead className="font-bold text-slate-700">Height</TableHead>
                  <TableHead className="font-bold text-slate-700">Weight</TableHead>
                  <TableHead className="font-bold text-slate-700">BMI</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolled.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No enrolled students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrolled.map((s) => (
                    <TableRow key={s.id} className="border-b border-border/40 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center text-xs font-bold">
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
                      <TableCell>
                        <Badge variant="outline" className={`font-medium border-0 ${s.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                          {s.gender}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium text-slate-600">
                        {s.medical?.height ? `${s.medical.height} cm` : <span className="text-slate-400">N/A</span>}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium text-slate-600">
                        {s.medical?.weight ? `${s.medical.weight} kg` : <span className="text-slate-400">N/A</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-mono text-sm px-2.5 py-0.5 border border-slate-200 shadow-sm rounded-lg">
                          {calcBmi(s.medical?.height, s.medical?.weight)}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg"
                          onClick={() => openProfile(s.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 pb-4 border-b border-border/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm border border-primary/30">
                  {student?.firstName?.charAt(0) || ''}{student?.lastName?.charAt(0) || ''}
                </div>
                {student?.firstName} {student?.lastName}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          {student && (
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">LRN</p>
                  <p className="font-mono font-bold text-slate-800">{student.lrn}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Gender</p>
                  <p className="font-medium text-slate-800">{student.gender}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Birth Date</p>
                  <p className="font-medium text-slate-800">{student.birthDate}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Grade Level</p>
                  <p className="font-medium text-slate-800">Grade {student.gradeLevel}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-slate-800 text-lg">Update Health Data</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-600 font-semibold">
                      <Ruler className="w-4 h-4" /> Height (cm)
                    </Label>
                    <Input
                      type="number"
                      value={editBmi.height}
                      onChange={(e) => setEditBmi({ ...editBmi, height: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-primary/20"
                      placeholder="e.g. 150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-600 font-semibold">
                      <Scale className="w-4 h-4" /> Weight (kg)
                    </Label>
                    <Input
                      type="number"
                      value={editBmi.weight}
                      onChange={(e) => setEditBmi({ ...editBmi, weight: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-primary/20"
                      placeholder="e.g. 45"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Calculated BMI</span>
                  <Badge variant="secondary" className="bg-white border border-slate-200 text-lg px-3 py-1 shadow-sm font-mono text-primary">
                    {calcBmi(editBmi.height, editBmi.weight)}
                  </Badge>
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setSelectedStudent(null)} className="w-full sm:w-auto rounded-xl">
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto rounded-xl shadow-md" onClick={handleSaveBmi}>
                  Save Health Data
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}