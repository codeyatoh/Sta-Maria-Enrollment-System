import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../ui/Table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter } from
'../ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../ui/Select';
import { Badge } from '../ui/Badge';
import { Plus, BookOpen, GraduationCap, Layers, Edit, Trash2, Eye, Calendar, Filter } from 'lucide-react';
import { useAdminData, Subject } from '../../lib/adminData';
import { cn } from '../ui/utils';
export function SubjectsView() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);
  const [selectedYear, setSelectedYear] = useState('2024-2025');

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    gradeLevel: '1',
    units: 3,
    status: 'Active' as 'Active' | 'Inactive',
    academicYear: '2024-2025'
  });
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addSubject(newSubject);
    setIsOpen(false);
    setNewSubject({
      name: '',
      code: '',
      gradeLevel: '1',
      units: 3,
      status: 'Active',
      academicYear: '2024-2025'
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      updateSubject(editingSubject.id, editingSubject);
      setIsEditOpen(false);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-auto sm:h-20 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Subjects Management
          </h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            Managing subjects for Academic Year {selectedYear}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <div className="pl-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[140px] text-xs font-bold">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-5 h-9 shadow-sm w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject Name</Label>
                  <Input
                    required
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="e.g. Mathematics" />
                </div>
                <div className="space-y-2">
                  <Label>Subject Code</Label>
                  <Input
                    required
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    placeholder="e.g. MATH101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Select
                    value={newSubject.gradeLevel}
                    onValueChange={(v) => setNewSubject({ ...newSubject, gradeLevel: v })}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Grade" /></SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                        <SelectItem key={level} value={level.toString()}>Grade {level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject Units</Label>
                  <Input
                    type="number"
                    required
                    value={newSubject.units}
                    onChange={(e) => setNewSubject({ ...newSubject, units: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 3"
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Initial Status</Label>
                <Select
                  value={newSubject.status}
                  onValueChange={(v: any) => setNewSubject({ ...newSubject, status: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select
                  value={newSubject.academicYear}
                  onValueChange={(v) => setNewSubject({ ...newSubject, academicYear: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select Year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4 flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto">
                  
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Save Subject
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Card className="bg-card border-border rounded-xl overflow-hidden shadow-sm max-w-4xl mx-auto sm:mx-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-12 text-center font-bold text-slate-400">#</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Subject Name
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Subject Code
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Grade Level
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Initial Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Date Created
                  </TableHead>
                  <TableHead className="text-right pr-6 font-semibold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.filter(s => s.academicYear === selectedYear).length === 0 ?
                <TableRow>
                    <TableCell
                    colSpan={7}
                    className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="w-8 h-8 text-slate-200" />
                        <p className="text-sm text-slate-400 font-medium">No subjects found for A.Y. {selectedYear}</p>
                      </div>
                    </TableCell>
                  </TableRow> :

                subjects
                  .filter(s => s.academicYear === selectedYear)
                  .map((subject, index) =>
                <TableRow
                  key={subject.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                  
                      <TableCell className="text-center font-medium text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">
                        {subject.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        {subject.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                          Grade {subject.gradeLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            subject.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                          )}>
                          {subject.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {subject.createdAt ? new Date(subject.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg"
                            onClick={() => { setViewingSubject(subject); setIsViewOpen(true); }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                            onClick={() => { setEditingSubject(subject); setIsEditOpen(true); }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => deleteSubject(subject.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                )
                }
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          {editingSubject && (
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject Name</Label>
                  <Input
                    required
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject Code</Label>
                  <Input
                    required
                    value={editingSubject.code}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Select
                    value={editingSubject.gradeLevel}
                    onValueChange={(v) => setEditingSubject({ ...editingSubject, gradeLevel: v })}>
                    <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                        <SelectItem key={level} value={level.toString()}>Grade {level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Units</Label>
                  <Input
                    type="number"
                    value={editingSubject.units}
                    onChange={(e) => setEditingSubject({ ...editingSubject, units: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select
                  value={editingSubject.academicYear}
                  onValueChange={(v) => setEditingSubject({ ...editingSubject, academicYear: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select Year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingSubject.status}
                  onValueChange={(v: any) => setEditingSubject({ ...editingSubject, status: v })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit">Update Subject</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Subject Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Subject Details</DialogTitle>
          </DialogHeader>
          {viewingSubject && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{viewingSubject.name}</h3>
                  <p className="text-sm font-mono text-slate-400 font-semibold">{viewingSubject.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grade Level</p>
                  <p className="font-bold text-slate-700">Grade {viewingSubject.gradeLevel}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Units</p>
                  <p className="font-bold text-slate-700">{viewingSubject.units} Units</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1",
                      viewingSubject.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                    )}>
                    {viewingSubject.status}
                  </Badge>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">A.Y.</p>
                  <p className="font-bold text-slate-700">{viewingSubject.academicYear}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Created At</p>
                  <p className="font-bold text-slate-700">
                    {viewingSubject.createdAt ? new Date(viewingSubject.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewOpen(false)} className="w-full">Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>);

}