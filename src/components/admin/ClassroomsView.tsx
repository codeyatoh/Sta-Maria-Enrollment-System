import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Badge } from '../ui/Badge';
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
import { Plus, Home, Users, Layout, Shield, Info } from 'lucide-react';
import { useAdminData } from '../../lib/adminData';
import { cn } from '../ui/utils';
export function ClassroomsView() {
  const {
    classrooms,
    sections,
    users,
    assignments,
    addClassroom,
    addSection,
    addAssignment
  } = useAdminData();
  const [isAddClassroomOpen, setIsAddClassroomOpen] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    roomName: '',
    roomType: 'Lecture' as 'Lecture' | 'Laboratory' | 'Multipurpose',
    status: 'Available' as 'Available' | 'Full' | 'Maintenance',
    gradeLevel: ''
  });
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSection, setNewSection] = useState({
    name: '',
    classroomId: '',
    gradeLevel: '',
    status: 'Active' as 'Active' | 'Inactive'
  });
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [newAssign, setNewAssign] = useState({
    teacherId: '',
    classroomId: '',
    sectionId: ''
  });
  const teachers = users.filter((u) => u.role === 'Teacher');
  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    addClassroom(newClassroom);
    setIsAddClassroomOpen(false);
    setNewClassroom({
      roomName: '',
      roomType: 'Lecture',
      status: 'Available',
      gradeLevel: ''
    });
  };
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    addSection(newSection);
    setIsAddSectionOpen(false);
    setNewSection({
      name: '',
      classroomId: '',
      gradeLevel: '',
      status: 'Active'
    });
  };
  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    addAssignment(newAssign);
    setIsAssignOpen(false);
    setNewAssign({
      teacherId: '',
      classroomId: '',
      sectionId: ''
    });
  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-auto sm:h-16 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm gap-4">
        <h1 className="text-lg font-semibold tracking-tight">
          Classrooms & Sections
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-5 h-9 w-full sm:w-auto">
                
                Assign Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Assign Teacher to Section</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAssign} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select
                    value={newAssign.teacherId}
                    onValueChange={(v) =>
                    setNewAssign({
                      ...newAssign,
                      teacherId: v
                    })
                    }>
                    
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((t) =>
                      <SelectItem key={t.id} value={t.id}>
                          {t.firstName} {t.lastName}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Classroom</Label>
                  <Select
                    value={newAssign.classroomId}
                    onValueChange={(v) =>
                    setNewAssign({
                      ...newAssign,
                      classroomId: v,
                      sectionId: ''
                    })
                    }>
                    
                    <SelectTrigger>
                      <SelectValue placeholder="Select classroom" />
                    </SelectTrigger>
                    <SelectContent>
                      {classrooms.map((c) =>
                        <SelectItem key={c.id} value={c.id}>
                          {c.roomName}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select
                    value={newAssign.sectionId}
                    onValueChange={(v) =>
                    setNewAssign({
                      ...newAssign,
                      sectionId: v
                    })
                    }
                    disabled={!newAssign.classroomId}>
                    
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.
                      filter((s) => s.classroomId === newAssign.classroomId).
                      map((s) =>
                      <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAssignOpen(false)}
                    className="w-full sm:w-auto">
                    
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Assign
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-5 h-9 w-full sm:w-auto">
                
                <Plus className="w-4 h-4 mr-2" /> Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSection} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Section Name</Label>
                  <Input
                    required
                    value={newSection.name}
                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                    placeholder="e.g. Section A" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Select
                      value={newSection.gradeLevel}
                      onValueChange={(v) => setNewSection({ ...newSection, gradeLevel: v })}>
                      <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6].map(level => (
                          <SelectItem key={level} value={level.toString()}>Grade {level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newSection.status}
                      onValueChange={(v: any) => setNewSection({ ...newSection, status: v })}>
                      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Classroom</Label>
                  <Select
                    value={newSection.classroomId}
                    onValueChange={(v) =>
                    setNewSection({
                      ...newSection,
                      classroomId: v
                    })
                    }>
                    
                    <SelectTrigger>
                      <SelectValue placeholder="Select classroom" />
                    </SelectTrigger>
                    <SelectContent>
                      {classrooms
                        .filter(c => !newSection.gradeLevel || c.gradeLevel === newSection.gradeLevel)
                        .map((c) =>
                        <SelectItem key={c.id} value={c.id}>
                          {c.roomName}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddSectionOpen(false)}
                    className="w-full sm:w-auto">
                    
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Section
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAddClassroomOpen}
            onOpenChange={setIsAddClassroomOpen}>
            
            <DialogTrigger asChild>
              <Button className="rounded-full px-5 h-9 shadow-sm w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Add Classroom
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Classroom</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddClassroom} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input
                    required
                    value={newClassroom.roomName}
                    onChange={(e) => setNewClassroom({ ...newClassroom, roomName: e.target.value })}
                    placeholder="e.g. Grade 1 - Room 101" />
                </div>
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Input
                    required
                    value={newClassroom.gradeLevel}
                    onChange={(e) => setNewClassroom({ ...newClassroom, gradeLevel: e.target.value })}
                    placeholder="e.g. 1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <Select
                      value={newClassroom.roomType}
                      onValueChange={(v: any) => setNewClassroom({ ...newClassroom, roomType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lecture">Lecture</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Multipurpose">Multipurpose</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newClassroom.status}
                      onValueChange={(v: any) => setNewClassroom({ ...newClassroom, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Full">Full</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddClassroomOpen(false)}
                    className="w-full sm:w-auto">
                    
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Classroom
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {classrooms.map((classroom) => {
            const classSections = sections.filter(
              (s) => s.classroomId === classroom.id
            );
            return (
              <Card
                key={classroom.id}
                className="bg-card border-border p-6 shadow-sm rounded-xl flex flex-col">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">
                        {classroom.roomName}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Grade {classroom.gradeLevel}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                        classroom.status === 'Available' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        classroom.status === 'Full' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-rose-50 text-rose-600 border border-rose-100"
                      )}>
                      {classroom.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {classroom.roomType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 mb-4 border-y border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created Date</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {new Date(classroom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sections</span>
                    <span className="text-xs font-bold text-primary">{classSections.length} Active</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {classSections.length === 0 ?
                  <p className="text-sm text-muted-foreground italic">
                      No sections added yet.
                    </p> :

                  classSections.map((section) => {
                    const assignment = assignments.find(
                      (a) => a.sectionId === section.id
                    );
                    const teacher = assignment ?
                    teachers.find((t) => t.id === assignment.teacherId) :
                    null;
                    return (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                        
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {section.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                section.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                              )} />
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{section.status}</span>
                            </div>
                          </div>
                          {teacher ?
                        <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="w-3 h-3 mr-1.5" />
                              {teacher.firstName} {teacher.lastName}
                            </div> :

                        <Badge
                          variant="outline"
                          className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                          
                              Unassigned
                            </Badge>
                        }
                        </div>);

                  })
                  }
                </div>
              </Card>);

          })}
        </div>
      </div>
    </div>);

}