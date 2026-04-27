import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../ui/Table';
import { Save, CheckCircle2 } from 'lucide-react';
import { useTeacherData } from '../../lib/teacherData';
const subjects = [
{
  code: 'MATH101',
  name: 'Mathematics'
},
{
  code: 'SCI101',
  name: 'Science'
},
{
  code: 'ENG101',
  name: 'English'
}];

export function GradesView() {
  const { students, updateStudentGrade } = useTeacherData();
  const enrolled = students.filter((s) => s.status === 'Enrolled');
  const [localGrades, setLocalGrades] = useState<
    Record<string, Record<string, string>>>(
    () => {
      const map: Record<string, Record<string, string>> = {};
      enrolled.forEach((s) => {
        map[s.id] = {};
        subjects.forEach((sub) => {
          map[s.id][sub.code] = s.grades[sub.code]?.toString() || '';
        });
      });
      return map;
    });
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    Object.entries(localGrades).forEach(([studentId, grades]) => {
      Object.entries(grades).forEach(([code, val]) => {
        const num = parseFloat(val);
        if (!isNaN(num)) updateStudentGrade(studentId, code, num);
      });
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const getAvg = (studentId: string) => {
    const vals = Object.values(localGrades[studentId] || {}).
    map((v) => parseFloat(v)).
    filter((v) => !isNaN(v));
    return vals.length > 0 ?
    (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) :
    '--';
  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-auto sm:h-16 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm gap-4">
        <h1 className="text-lg font-semibold tracking-tight">Grade Encoding</h1>
        <Button
          className="rounded-full px-5 h-9 shadow-sm w-full sm:w-auto"
          onClick={handleSave}>
          
          {saved ?
          <>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Saved!
            </> :

          <>
              <Save className="w-4 h-4 mr-2" /> Save All Grades
            </>
          }
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Card className="bg-card border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-foreground pl-4 sm:pl-6 whitespace-nowrap">
                    Student
                  </TableHead>
                  {subjects.map((sub) =>
                  <TableHead
                    key={sub.code}
                    className="font-semibold text-foreground text-center whitespace-nowrap">
                    
                      {sub.name}
                    </TableHead>
                  )}
                  <TableHead className="font-semibold text-foreground text-center whitespace-nowrap">
                    Average
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolled.map((s) =>
                <TableRow
                  key={s.id}
                  className="border-b border-border/50 hover:bg-muted/30">
                  
                    <TableCell className="font-medium pl-4 sm:pl-6 whitespace-nowrap">
                      {s.firstName} {s.lastName}
                    </TableCell>
                    {subjects.map((sub) =>
                  <TableCell key={sub.code} className="text-center">
                        <Input
                      type="number"
                      min="0"
                      max="100"
                      className="w-20 h-8 text-center mx-auto text-sm"
                      value={localGrades[s.id]?.[sub.code] || ''}
                      onChange={(e) => {
                        setLocalGrades({
                          ...localGrades,
                          [s.id]: {
                            ...localGrades[s.id],
                            [sub.code]: e.target.value
                          }
                        });
                        setSaved(false);
                      }} />
                    
                      </TableCell>
                  )}
                    <TableCell className="text-center">
                      <Badge
                      variant="secondary"
                      className="bg-muted font-mono text-sm">
                      
                        {getAvg(s.id)}
                      </Badge>
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