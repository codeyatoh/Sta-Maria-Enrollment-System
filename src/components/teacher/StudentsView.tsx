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
  TableRow } from
'../ui/Table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
'../ui/Dialog';
import { Eye } from 'lucide-react';
import { useTeacherData } from '../../lib/teacherData';
export function StudentsView() {
  const { students, updateStudentBmi } = useTeacherData();
  const enrolled = students.filter((s) => s.status === 'Enrolled');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [editBmi, setEditBmi] = useState({
    height: '',
    weight: ''
  });
  const student = selectedStudent ?
  students.find((s) => s.id === selectedStudent) :
  null;
  const openProfile = (id: string) => {
    const s = students.find((st) => st.id === id);
    if (s) {
      setEditBmi({
        height: s.bmi.height,
        weight: s.bmi.weight
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
  const calcBmi = (h: string, w: string) => {
    const hm = parseFloat(h) / 100;
    const wk = parseFloat(w);
    if (hm > 0 && wk > 0) return (wk / (hm * hm)).toFixed(1);
    return '--';
  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-tight">
          Student Profiles
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
                    Gender
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Height
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Weight
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    BMI
                  </TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolled.length === 0 ?
                <TableRow>
                    <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground">
                    
                      No enrolled students.
                    </TableCell>
                  </TableRow> :

                enrolled.map((s) =>
                <TableRow
                  key={s.id}
                  className="border-b border-border/50 hover:bg-muted/30">
                  
                      <TableCell className="font-medium pl-4 sm:pl-6 whitespace-nowrap">
                        {s.firstName} {s.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                        {s.lrn}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {s.gender}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {s.bmi.height} cm
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {s.bmi.weight} kg
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {calcBmi(s.bmi.height, s.bmi.weight)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openProfile(s.id)}>
                      
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                )
                }
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}>
        
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {student?.firstName} {student?.lastName}
            </DialogTitle>
          </DialogHeader>
          {student &&
          <div className="space-y-6 pt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">LRN</p>
                  <p className="font-mono">{student.lrn}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Gender</p>
                  <p>{student.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Birth Date
                  </p>
                  <p>{student.birthDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Grade Level
                  </p>
                  <p>Grade {student.gradeLevel}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Update BMI Data</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                    type="number"
                    value={editBmi.height}
                    onChange={(e) =>
                    setEditBmi({
                      ...editBmi,
                      height: e.target.value
                    })
                    } />
                  
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                    type="number"
                    value={editBmi.weight}
                    onChange={(e) =>
                    setEditBmi({
                      ...editBmi,
                      weight: e.target.value
                    })
                    } />
                  
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Calculated BMI:{' '}
                  <span className="font-semibold">
                    {calcBmi(editBmi.height, editBmi.weight)}
                  </span>
                </p>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                variant="outline"
                onClick={() => setSelectedStudent(null)}
                className="w-full sm:w-auto">
                
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto" onClick={handleSaveBmi}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

}