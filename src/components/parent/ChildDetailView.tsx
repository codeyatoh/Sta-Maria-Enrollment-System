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
  TableRow } from
'../ui/Table';
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  XCircle,
  AlertCircle } from
'lucide-react';
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
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Enrolled
          </Badge>);

      case 'Pending':
        return (
          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 border-none">
            <CircleDashed className="w-3 h-3 mr-1" /> Pending
          </Badge>);

      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>);

      default:
        return null;
    }
  };
  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <Badge className="bg-green-100 text-green-700 border-none font-normal">
            Present
          </Badge>);

      case 'Absent':
        return (
          <Badge className="bg-red-100 text-red-700 border-none font-normal">
            Absent
          </Badge>);

      case 'Late':
        return (
          <Badge className="bg-orange-100 text-orange-700 border-none font-normal">
            Late
          </Badge>);

      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-auto sm:h-16 py-4 sm:py-0 flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-4 w-fit -ml-2 sm:ml-0">
          
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">
            {child.firstName} {child.lastName}
          </h1>
          {getStatusBadge(child.status)}
          <Badge variant="outline">Grade {child.gradeLevel}</Badge>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {child.status === 'Pending' &&
          <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-orange-600" />
              <div>
                <h4 className="font-semibold">
                  Enrollment is pending approval
                </h4>
                <p className="text-sm mt-1">
                  Your child's enrollment is currently being reviewed by the
                  school administration. You will be notified once it is
                  approved.
                </p>
                {child.requirements !== 'Complete' &&
              <p className="text-sm mt-2 font-medium text-red-600">
                    Action required: {child.requirements}
                  </p>
              }
              </div>
            </div>
          }

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full sm:max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="personal" className="text-xs sm:text-sm">
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="medical" className="text-xs sm:text-sm">
                Medical
              </TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs sm:text-sm">
                Attendance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="p-4 sm:p-6 bg-card border-border shadow-sm rounded-xl space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        First Name
                      </p>
                      <p className="font-medium">{child.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Middle Name
                      </p>
                      <p className="font-medium">{child.middleName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Last Name
                      </p>
                      <p className="font-medium">{child.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Birth Date
                      </p>
                      <p className="font-medium">{child.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Gender
                      </p>
                      <p className="font-medium">{child.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">LRN</p>
                      <p className="font-medium font-mono">
                        {child.lrn || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">
                        Street
                      </p>
                      <p className="font-medium">{child.address.street}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Barangay
                      </p>
                      <p className="font-medium">{child.address.barangay}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        City/Municipality
                      </p>
                      <p className="font-medium">{child.address.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Province
                      </p>
                      <p className="font-medium">{child.address.province}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Zip Code
                      </p>
                      <p className="font-medium">{child.address.zipCode}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="medical">
              <Card className="p-4 sm:p-6 bg-card border-border shadow-sm rounded-xl space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                    Physical Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Height (cm)
                      </p>
                      <p className="font-medium">{child.medical.height}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Weight (kg)
                      </p>
                      <p className="font-medium">{child.medical.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Blood Type
                      </p>
                      <p className="font-medium">{child.medical.bloodType}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                    Health Conditions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Allergies
                      </p>
                      <p className="font-medium">
                        {child.medical.allergies || 'None'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Medical Conditions
                      </p>
                      <p className="font-medium">
                        {child.medical.conditions || 'None'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Contact Name
                      </p>
                      <p className="font-medium">
                        {child.medical.emergencyContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Contact Phone
                      </p>
                      <p className="font-medium">
                        {child.medical.emergencyPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card className="bg-card border-border shadow-sm rounded-xl overflow-hidden">
                {child.status !== 'Enrolled' ?
                <div className="p-8 text-center text-muted-foreground">
                    Attendance records will be available once the child is
                    officially enrolled.
                  </div> :
                child.attendance.length === 0 ?
                <div className="p-8 text-center text-muted-foreground">
                    No attendance records found.
                  </div> :

                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/50 border-b border-border">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="font-semibold text-foreground pl-4 sm:pl-6 whitespace-nowrap">
                            Date
                          </TableHead>
                          <TableHead className="font-semibold text-foreground whitespace-nowrap">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {child.attendance.map((record, i) =>
                      <TableRow
                        key={i}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        
                            <TableCell className="font-medium text-foreground pl-4 sm:pl-6 whitespace-nowrap">
                              {new Date(record.date).toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }
                          )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {getAttendanceBadge(record.status)}
                            </TableCell>
                          </TableRow>
                      )}
                      </TableBody>
                    </Table>
                  </div>
                }
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>);

}