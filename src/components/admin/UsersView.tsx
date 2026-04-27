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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import {
  Plus,
  CheckCircle2,
  CircleDashed,
  Trash2 } from
'lucide-react';
import { useAdminData } from '../../lib/adminData';
export function UsersView() {
  const { users, addUser, deleteUser } = useAdminData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Teacher' as 'Teacher' | 'Parent',
    status: 'Active' as 'Active' | 'Pending'
  });
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newUser);
    setIsAddOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'Teacher',
      status: 'Active'
    });
  };
  const renderTable = (role: 'Teacher' | 'Parent') => {
    const filteredUsers = users.filter((u) => u.role === role);
    return (
      <Card className="bg-card border-border rounded-xl overflow-hidden shadow-sm mt-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-foreground pl-4 sm:pl-6 whitespace-nowrap">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-foreground whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ?
              <TableRow>
                  <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground">
                  
                    No {role.toLowerCase()}s found.
                  </TableCell>
                </TableRow> :

              filteredUsers.map((user) =>
              <TableRow
                key={user.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                
                    <TableCell className="font-medium text-foreground pl-4 sm:pl-6 whitespace-nowrap">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {user.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.status === 'Active' ?
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-200 border-none rounded-full px-2.5 font-normal flex w-fit items-center">
                    
                          <CheckCircle2 className="w-3 h-3 mr-1.5" />{' '}
                          {user.status}
                        </Badge> :

                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground hover:bg-muted/80 border-none rounded-full px-2.5 font-normal flex w-fit items-center">
                    
                          <CircleDashed className="w-3 h-3 mr-1.5" />{' '}
                          {user.status}
                        </Badge>
                  }
                    </TableCell>
                    <TableCell>
                      <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteUser(user.id)}>
                    
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
              )
              }
            </TableBody>
          </Table>
        </div>
      </Card>);

  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-auto sm:h-16 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm gap-4">
        <h1 className="text-lg font-semibold tracking-tight">
          User Management
        </h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-5 h-9 shadow-sm w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  required
                  value={newUser.name}
                  onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    name: e.target.value
                  })
                  }
                  placeholder="e.g. Maria Santos" />
                
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value
                  })
                  }
                  placeholder="name@school.edu" />
                
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(v: string) =>
                  setNewUser({
                    ...newUser,
                    role: v as 'Teacher' | 'Parent'
                  })
                  }>
                  
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(v: string) =>
                  setNewUser({
                    ...newUser,
                    status: v as 'Active' | 'Pending'
                  })
                  }>
                  
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  className="w-full sm:w-auto">
                  
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto mt-2 sm:mt-0">
                  Save User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="teachers" className="w-full">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
          </TabsList>
          <TabsContent value="teachers">{renderTable('Teacher')}</TabsContent>
          <TabsContent value="parents">{renderTable('Parent')}</TabsContent>
        </Tabs>
      </div>
    </div>);

}