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
import { Plus, BookOpen } from 'lucide-react';
import { useAdminData } from '../../lib/adminData';
export function SubjectsView() {
  const { subjects, addSubject } = useAdminData();
  const [isOpen, setIsOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: ''
  });
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addSubject(newSubject);
    setIsOpen(false);
    setNewSubject({
      name: '',
      code: ''
    });
  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-auto sm:h-16 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm gap-4">
        <h1 className="text-lg font-semibold tracking-tight">
          Subjects Management
        </h1>
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
              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input
                  required
                  value={newSubject.name}
                  onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    name: e.target.value
                  })
                  }
                  placeholder="e.g. Mathematics" />
                
              </div>
              <div className="space-y-2">
                <Label>Subject Code</Label>
                <Input
                  required
                  value={newSubject.code}
                  onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    code: e.target.value
                  })
                  }
                  placeholder="e.g. MATH101" />
                
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
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Card className="bg-card border-border rounded-xl overflow-hidden shadow-sm max-w-4xl mx-auto sm:mx-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-16 pl-4 sm:pl-6"></TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Subject Name
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Code
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.length === 0 ?
                <TableRow>
                    <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground">
                    
                      No subjects found.
                    </TableCell>
                  </TableRow> :

                subjects.map((subject) =>
                <TableRow
                  key={subject.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  
                      <TableCell className="pl-4 sm:pl-6">
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground whitespace-nowrap">
                        {subject.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                        {subject.code}
                      </TableCell>
                    </TableRow>
                )
                }
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>);

}