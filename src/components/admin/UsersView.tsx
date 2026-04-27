import React, { useState } from 'react';
import { cn } from '../ui/utils';
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
  EyeOff,
  Search,
  Filter,
  Edit,
  Eye,
  Eye as ViewIcon,
  ChevronDown,
  Plus,
  CheckCircle2,
  CircleDashed,
  Trash2,
  Users,
  GraduationCap,
  UserCheck,
  Heart
} from 'lucide-react';
import { useAdminData, User } from '../../lib/adminData';
export function UsersView() {
  const { users, addUser, updateUser, deleteUser } = useAdminData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    role: 'Teacher' as 'Teacher' | 'Parent',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    status: 'Active' as 'Active' | 'Pending'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError(null);
    
    // Create a user object for storage (omitting confirmPassword and password if not needed in DB)
    const userToSave = { ...newUser };
    // @ts-ignore - explicitly omitting for storage
    delete userToSave.confirmPassword;
    addUser(userToSave);
    
    setIsAddOpen(false);
    setNewUser({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      role: 'Teacher',
      gender: 'Male',
      email: '',
      contactNumber: '',
      password: '',
      confirmPassword: '',
      status: 'Active'
    });
  };
  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUser(selectedUser.id, selectedUser);
      setIsEditOpen(false);
      setSelectedUser(null);
    }
  };

  const [roleFilter, setRoleFilter] = useState('All');
  
  const totalUsers = users.length;
  const teacherCount = users.filter(u => u.role === 'Teacher').length;
  const parentCount = users.filter(u => u.role === 'Parent').length;
  const activeCount = users.filter(u => u.status === 'Active').length;

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const renderTable = () => {
    return (
      <Card className="border-none shadow-sm ring-1 ring-slate-200/60 overflow-hidden rounded-2xl bg-white mt-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent border-none h-12">
                <TableHead className="w-16 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 pl-4">#</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">User Information</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">Role</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">Joined Date</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                        <Search className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-base font-semibold text-slate-900">No records found</p>
                      <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id} className="border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors h-16">
                    <TableCell className="text-center text-slate-400 font-medium pl-4">{index + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-primary/5">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm leading-tight">{user.firstName} {user.lastName}</span>
                          <span className="text-xs text-slate-400 font-medium mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                        user.role === 'Teacher' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.status === 'Active' ? (
                        <div className="inline-flex items-center text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                          {user.status}
                        </div>
                      ) : (
                        <div className="inline-flex items-center text-amber-600 bg-amber-50/50 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                          {user.status}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500 text-[13px] font-medium whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                          onClick={() => { setSelectedUser(user); setIsViewOpen(true); }}
                        >
                          <ViewIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                          onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  };
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-10 bg-slate-50/30">
        {/* Header & Stats Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Users</h2>
              <p className="text-sm text-slate-500 mt-1">Manage and monitor all school personnel and parent accounts.</p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl px-6 h-11 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Plus className="w-4 h-4 mr-2" /> Add New Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Create System Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-6 pt-4">
                  {/* ... reusing the existing form fields from the original DialogContent ... */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} placeholder="e.g. Maria" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} placeholder="e.g. Santos" className="rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name (Optional)</Label>
                      <Input id="middleName" value={newUser.middleName} onChange={(e) => setNewUser({ ...newUser, middleName: e.target.value })} placeholder="e.g. Garcia" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suffix">Suffix (Optional)</Label>
                      <Select value={newUser.suffix} onValueChange={(v: string) => setNewUser({ ...newUser, suffix: v === "none" ? "" : v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select suffix" /></SelectTrigger>
                        <SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="Jr.">Jr.</SelectItem><SelectItem value="Sr.">Sr.</SelectItem><SelectItem value="II">II</SelectItem><SelectItem value="III">III</SelectItem><SelectItem value="IV">IV</SelectItem><SelectItem value="V">V</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={newUser.gender} onValueChange={(v: string) => setNewUser({ ...newUser, gender: v as 'Male' | 'Female' | 'Other' })}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>User Role</Label>
                      <Select value={newUser.role} onValueChange={(v: string) => setNewUser({ ...newUser, role: v as 'Teacher' | 'Parent' })}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent><SelectItem value="Teacher">Teacher</SelectItem><SelectItem value="Parent">Parent</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" required type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="name@school.edu" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input id="contactNumber" required type="tel" maxLength={11} pattern="[0-9]{11}" value={newUser.contactNumber} onChange={(e) => setNewUser({ ...newUser, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 11) })} placeholder="e.g. 09123456789" className="rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input id="password" required type={showPassword ? "text" : "password"} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="pr-10 rounded-xl" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input id="confirmPassword" required type={showConfirmPassword ? "text" : "password"} value={newUser.confirmPassword} onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })} className="pr-10 rounded-xl" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      </div>
                    </div>
                  </div>

                  {passwordError && <p className="text-sm font-medium text-destructive">{passwordError}</p>}

                  <DialogFooter className="pt-4 border-t gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button type="submit" className="rounded-xl px-8 bg-primary hover:bg-primary/90 transition-all">Save Account</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Accounts', value: totalUsers, icon: Users, color: 'indigo' },
              { label: 'Teaching Staff', value: teacherCount, icon: GraduationCap, color: 'blue' },
              { label: 'Registered Parents', value: parentCount, icon: Heart, color: 'rose' },
              { label: 'Active Sessions', value: activeCount, icon: UserCheck, color: 'emerald' },
            ].map((stat, i) => (
              <Card key={i} className="relative group overflow-hidden border-none shadow-sm ring-1 ring-slate-200/60 bg-white p-0">
                <div className="p-5 flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 transition-transform group-hover:scale-110`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 w-full bg-${stat.color}-500/10`} />
                <div className={`absolute bottom-0 left-0 h-1 w-0 bg-${stat.color}-500 transition-all duration-500 group-hover:w-full`} />
              </Card>
            ))}
          </div>
        </div>

        {/* Data Management Section */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search by name, email, or role..." 
                  className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] h-11 rounded-xl border-slate-200 bg-white">
                    <Filter className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Teacher">Teachers</SelectItem>
                    <SelectItem value="Parent">Parents</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] h-11 rounded-xl border-slate-200 bg-white">
                    <CircleDashed className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="hidden lg:block h-8 w-px bg-slate-200" />
            
            <div className="flex items-center gap-4 px-2">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Database</p>
                <p className="text-sm font-semibold text-slate-600 mt-1">{filteredUsers.length} records</p>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-sm ring-1 ring-slate-200/60 overflow-hidden rounded-2xl bg-white">
            {renderTable()}
          </Card>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleEditUser} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    required
                    value={selectedUser.firstName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    required
                    value={selectedUser.lastName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    required
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact Number</Label>
                  <Input
                    id="edit-contact"
                    required
                    maxLength={11}
                    value={selectedUser.contactNumber}
                    onChange={(e) => setSelectedUser({ ...selectedUser, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={selectedUser.gender}
                    onValueChange={(v: any) => setSelectedUser({ ...selectedUser, gender: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(v: any) => setSelectedUser({ ...selectedUser, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit">Update User</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Information</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                </div>
                <Badge className="ml-auto" variant={selectedUser.status === 'Active' ? 'secondary' : 'outline'}>
                  {selectedUser.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedUser.contactNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedUser.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="font-medium">{selectedUser.createdAt}</p>
                </div>
              </div>
              
              <DialogFooter className="pt-4 border-t">
                <Button onClick={() => setIsViewOpen(false)} className="w-full">Close Profile</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>);

}