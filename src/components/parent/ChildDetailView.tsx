import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/Table';
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  XCircle,
  AlertCircle,
  User,
  HeartPulse,
  CalendarCheck
} from 'lucide-react';
import { useParentData } from '../../lib/parentData';

export function ChildDetailView({
  childId,
  onBack
}: {childId: string;onBack: () => void;}) {
  const { children } = useParentData();
  const child = children.find((c) => c.id === childId);
  
  if (!child) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 font-semibold shadow-sm rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Enrolled
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-3 py-1 font-semibold shadow-sm rounded-full">
            <CircleDashed className="w-3.5 h-3.5 mr-1.5 animate-spin-slow" /> Pending
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none px-3 py-1 font-semibold shadow-sm rounded-full">
            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-none font-semibold px-2.5 py-0.5 rounded-md shadow-sm">
            Present
          </Badge>
        );
      case 'Absent':
        return (
          <Badge className="bg-rose-100 text-rose-700 border-none font-semibold px-2.5 py-0.5 rounded-md shadow-sm">
            Absent
          </Badge>
        );
      case 'Late':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-none font-semibold px-2.5 py-0.5 rounded-md shadow-sm">
            Late
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="h-auto sm:h-20 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 lg:px-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent shrink-0 gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-4 w-fit -ml-2 sm:ml-0 hover:bg-primary/10 hover:text-primary transition-colors rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Children
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shadow-inner border border-primary/20">
            {child.firstName.charAt(0)}{child.lastName.charAt(0)}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {child.firstName} {child.lastName}
          </h1>
          {getStatusBadge(child.status)}
          <Badge variant="outline" className="border-slate-300 text-slate-600 bg-white/60 font-semibold px-3 py-1 rounded-full shadow-sm">
            Grade {child.gradeLevel}
          </Badge>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {child.status === 'Pending' && (
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 text-amber-800 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-amber-200/50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-bold text-amber-900">
                  Enrollment is pending approval
                </h4>
                <p className="text-sm mt-1 text-amber-700 leading-relaxed">
                  Your child's enrollment is currently being reviewed by the
                  school administration. You will be notified once it is approved.
                </p>
                {child.requirements !== 'Complete' && (
                  <div className="mt-3 bg-white/60 p-3 rounded-xl border border-amber-200/60 inline-block">
                    <p className="text-sm font-bold text-rose-600">
                      Action required: {child.requirements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full sm:max-w-md grid-cols-3 mb-8 p-1.5 bg-slate-200/50 rounded-2xl shadow-inner border border-slate-200">
              <TabsTrigger value="personal" className="text-xs sm:text-sm font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                <User className="w-3.5 h-3.5 mr-2 hidden sm:inline" /> Personal Info
              </TabsTrigger>
              <TabsTrigger value="medical" className="text-xs sm:text-sm font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                <HeartPulse className="w-3.5 h-3.5 mr-2 hidden sm:inline" /> Medical
              </TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs sm:text-sm font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                <CalendarCheck className="w-3.5 h-3.5 mr-2 hidden sm:inline" /> Attendance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-0 outline-none">
              <Card className="p-6 sm:p-8 bg-white border-slate-200/60 shadow-sm rounded-3xl space-y-10 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Basic Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">First Name</p>
                      <p className="font-bold text-slate-800">{child.firstName}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Middle Name</p>
                      <p className="font-bold text-slate-800">{child.middleName || '-'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Name</p>
                      <p className="font-bold text-slate-800">{child.lastName}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Birth Date</p>
                      <p className="font-bold text-slate-800">{child.birthDate}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gender</p>
                      <p className="font-bold text-slate-800">{child.gender}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">LRN</p>
                      <p className="font-bold font-mono text-slate-800">{child.lrn || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Address
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Street</p>
                      <p className="font-bold text-slate-800">{child.address.street}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Barangay</p>
                      <p className="font-bold text-slate-800">{child.address.barangay}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">City/Municipality</p>
                      <p className="font-bold text-slate-800">{child.address.city}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Province</p>
                      <p className="font-bold text-slate-800">{child.address.province}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Zip Code</p>
                      <p className="font-bold text-slate-800">{child.address.zipCode}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="mt-0 outline-none">
              <Card className="p-6 sm:p-8 bg-white border-slate-200/60 shadow-sm rounded-3xl space-y-10 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Physical Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Height (cm)</p>
                      <p className="font-bold text-slate-800 text-lg">{child.medical.height}</p>
                    </div>
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Weight (kg)</p>
                      <p className="font-bold text-slate-800 text-lg">{child.medical.weight}</p>
                    </div>
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Blood Type</p>
                      <p className="font-bold text-rose-700 text-lg">{child.medical.bloodType}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Health Conditions
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Allergies</p>
                      <p className="font-bold text-slate-800">
                        {child.medical.allergies || 'None reported'}
                      </p>
                    </div>
                    <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Medical Conditions</p>
                      <p className="font-bold text-slate-800">
                        {child.medical.diagnoses?.join(', ') || 'None reported'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Emergency Contact
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Contact Name</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {child.medical.emergencyContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Contact Phone</p>
                      <p className="font-bold font-mono text-indigo-700 text-lg">
                        {child.medical.emergencyPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0 outline-none">
              <Card className="bg-white border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                {child.status !== 'Enrolled' ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CalendarCheck className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Not Enrolled Yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      Attendance records will be available once the child is officially enrolled in a class.
                    </p>
                  </div>
                ) : !child.attendance || child.attendance.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CalendarCheck className="w-10 h-10 text-emerald-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Records Yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      There are no attendance records logged for this student yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="font-bold text-slate-700 pl-6 sm:pl-8 py-4 whitespace-nowrap">
                            Date
                          </TableHead>
                          <TableHead className="font-bold text-slate-700 py-4 whitespace-nowrap">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {child.attendance.map((record, i) => (
                          <TableRow
                            key={i}
                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="font-bold text-slate-800 pl-6 sm:pl-8 py-4 whitespace-nowrap">
                              {new Date(record.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="py-4 whitespace-nowrap">
                              {getAttendanceBadge(record.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}