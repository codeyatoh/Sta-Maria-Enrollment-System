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
import { Plus, Home, Users, Layout, Shield, Info, Edit, Trash2, MoreHorizontal, UserMinus } from 'lucide-react';
import { useAdminData, Classroom, Section, Assignment } from '../../lib/adminData';
import { cn } from '../ui/utils';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
export function ClassroomsView() {
  const {
    classrooms,
    sections,
    users,
    assignments,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    addSection,
    updateSection,
    deleteSection,
    addAssignment,
    deleteAssignment
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
  const [isEditClassroomOpen, setIsEditClassroomOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [realClassrooms, setRealClassrooms] = useState<Classroom[]>([]);
  const [realSections, setRealSections] = useState<Section[]>([]);
  const [realAssignments, setRealAssignments] = useState<Assignment[]>([]);
  const [realUsers, setRealUsers] = useState<any[]>([]); // Need to fetch users for the teachers dropdown
  
  // Fetch real data from Firestore
  React.useEffect(() => {
    const unsubClassrooms = onSnapshot(query(collection(db, 'classrooms')), (snap) => {
      setRealClassrooms(snap.docs.map(d => ({ id: d.id, ...d.data() } as Classroom)));
    });
    
    const unsubSections = onSnapshot(query(collection(db, 'sections')), (snap) => {
      setRealSections(snap.docs.map(d => ({ id: d.id, ...d.data() } as Section)));
    });

    const unsubAssignments = onSnapshot(query(collection(db, 'assignments')), (snap) => {
      setRealAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Assignment)));
    });

    const unsubUsers = onSnapshot(query(collection(db, 'users')), (snap) => {
      setRealUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubClassrooms();
      unsubSections();
      unsubAssignments();
      unsubUsers();
    };
  }, []);

  const teachers = realUsers.filter((u) => u.role === 'teacher' || u.role === 'Teacher');

  const handleAddClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'classrooms'), {
        ...newClassroom,
        createdAt: new Date().toISOString()
      });
      setIsAddClassroomOpen(false);
      setNewClassroom({ roomName: '', roomType: 'Lecture', status: 'Available', gradeLevel: '' });
    } catch (err) {
      console.error("Error adding classroom", err);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'sections'), newSection);
      setIsAddSectionOpen(false);
      setNewSection({ name: '', classroomId: '', gradeLevel: '', status: 'Active' });
    } catch (err) {
      console.error("Error adding section", err);
    }
  };

  const handleUpdateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClassroom) {
      try {
        const { id, ...dataToUpdate } = editingClassroom;
        await updateDoc(doc(db, 'classrooms', id), dataToUpdate);
        setIsEditClassroomOpen(false);
      } catch (err) {
        console.error("Error updating classroom", err);
      }
    }
  };

  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      try {
        const { id, ...dataToUpdate } = editingSection;
        await updateDoc(doc(db, 'sections', id), dataToUpdate);
        setIsEditSectionOpen(false);
      } catch (err) {
        console.error("Error updating section", err);
      }
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'assignments'), newAssign);
      setIsAssignOpen(false);
      setNewAssign({ teacherId: '', classroomId: '', sectionId: '' });
    } catch (err) {
      console.error("Error assigning teacher", err);
    }
  };

  const deleteClassroomFromDb = async (id: string) => {
    try { await deleteDoc(doc(db, 'classrooms', id)); } catch(e) { console.error(e); }
  };

  const deleteSectionFromDb = async (id: string) => {
    try { await deleteDoc(doc(db, 'sections', id)); } catch(e) { console.error(e); }
  };

  const deleteAssignmentFromDb = async (id: string) => {
    try { await deleteDoc(doc(db, 'assignments', id)); } catch(e) { console.error(e); }
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
                      <SelectValue placeholder="Select teacher">
                        {newAssign.teacherId ? (() => { const t = teachers.find(t => t.id === newAssign.teacherId); return t ? `${t.firstName} ${t.lastName}` : undefined; })() : undefined}
                      </SelectValue>
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
                      <SelectValue placeholder="Select classroom">
                        {newAssign.classroomId ? realClassrooms.find(c => c.id === newAssign.classroomId)?.roomName : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {realClassrooms.map((c) =>
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
                      <SelectValue placeholder="Select section">
                        {newAssign.sectionId ? realSections.find(s => s.id === newAssign.sectionId)?.name : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {realSections.
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
                      <SelectTrigger><SelectValue placeholder="Grade">
                        {newSection.gradeLevel ? `Grade ${newSection.gradeLevel}` : undefined}
                      </SelectValue></SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
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
                      <SelectValue placeholder="Select classroom">
                        {newSection.classroomId ? realClassrooms.find(c => c.id === newSection.classroomId)?.roomName : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {realClassrooms
                        .filter(c => c.status === 'Available')
                        .map((c) =>
                        <SelectItem key={c.id} value={c.id}>
                          {c.roomName || 'Unnamed Room'}
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

          {/* Edit Classroom Dialog */}
          <Dialog open={isEditClassroomOpen} onOpenChange={setIsEditClassroomOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Classroom</DialogTitle>
              </DialogHeader>
              {editingClassroom && (
                <form onSubmit={handleUpdateClassroom} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Room Name</Label>
                    <Input
                      required
                      value={editingClassroom.roomName}
                      onChange={(e) => setEditingClassroom({ ...editingClassroom, roomName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select
                        value={editingClassroom.roomType}
                        onValueChange={(v: any) => setEditingClassroom({ ...editingClassroom, roomType: v })}>
                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
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
                        value={editingClassroom.status}
                        onValueChange={(v: any) => setEditingClassroom({ ...editingClassroom, status: v })}>
                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Full">Full</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditClassroomOpen(false)}>Cancel</Button>
                    <Button type="submit">Update Classroom</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Section Dialog */}
          <Dialog open={isEditSectionOpen} onOpenChange={setIsEditSectionOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Section</DialogTitle>
              </DialogHeader>
              {editingSection && (
                <form onSubmit={handleUpdateSection} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Section Name</Label>
                    <Input
                      required
                      value={editingSection.name}
                      onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Grade Level</Label>
                      <Select
                        value={editingSection.gradeLevel}
                        onValueChange={(v) => setEditingSection({ ...editingSection, gradeLevel: v })}>
                        <SelectTrigger><SelectValue placeholder="Grade">
                          {editingSection.gradeLevel ? `Grade ${editingSection.gradeLevel}` : undefined}
                        </SelectValue></SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                            <SelectItem key={level} value={level.toString()}>Grade {level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={editingSection.status}
                        onValueChange={(v: any) => setEditingSection({ ...editingSection, status: v })}>
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
                      value={editingSection.classroomId}
                      onValueChange={(v) => setEditingSection({ ...editingSection, classroomId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select Classroom">
                        {editingSection.classroomId ? realClassrooms.find(c => c.id === editingSection.classroomId)?.roomName : undefined}
                      </SelectValue></SelectTrigger>
                      <SelectContent>
                        {realClassrooms.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.roomName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditSectionOpen(false)}>Cancel</Button>
                    <Button type="submit">Update Section</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {realClassrooms.map((classroom) => {
            const classSections = realSections.filter(
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
                        {classroom.roomName || 'Standard Classroom'}
                      </h3>

                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
                        onClick={() => { setEditingClassroom(classroom); setIsEditClassroomOpen(true); }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => deleteClassroomFromDb(classroom.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                          classroom.status === 'Available' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          classroom.status === 'Full' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-rose-50 text-rose-600 border border-rose-100"
                        )}>
                        {classroom.status || 'Available'}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {classroom.roomType || 'Lecture'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 mb-4 border-y border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created Date</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {classroom.createdAt ? new Date(classroom.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
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
                    const assignment = realAssignments.find(
                      (a) => a.sectionId === section.id
                    );
                    const teacher = assignment ?
                    teachers.find((t) => t.id === assignment.teacherId) :
                    null;
                    return (
                      <div
                        key={section.id}
                        className="group flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 hover:border-primary/20 transition-all duration-200">
                        
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-slate-900 leading-tight">
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
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
                                onClick={() => { setEditingSection(section); setIsEditSectionOpen(true); }}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                                onClick={() => deleteSectionFromDb(section.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            {teacher ?
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center text-xs text-slate-600 font-medium">
                                  <Users className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                  {teacher.firstName} {teacher.lastName}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100"
                                  onClick={() => assignment && deleteAssignmentFromDb(assignment.id)}
                                  title="Remove Assignment"
                                >
                                  <UserMinus className="w-3 h-3" />
                                </Button>
                              </div> :

                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold uppercase tracking-wider text-orange-600 border-orange-100 bg-orange-50/50 px-2 py-0.5 rounded-md">
                                Unassigned
                              </Badge>
                            }
                          </div>
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