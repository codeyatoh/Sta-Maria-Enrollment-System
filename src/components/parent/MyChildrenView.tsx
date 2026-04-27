import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../ui/Table';
import { CheckCircle2, CircleDashed, XCircle, ChevronRight } from 'lucide-react';
import { useParentData } from '../../lib/parentData';
export function MyChildrenView({
  onSelectChild


}: {onSelectChild: (id: string) => void;}) {
  const { children } = useParentData();
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-200 border-none rounded-full px-2.5 font-normal flex w-fit items-center">
            
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Enrolled
          </Badge>);

      case 'Pending':
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground hover:bg-muted/80 border-none rounded-full px-2.5 font-normal flex w-fit items-center">
            
            <CircleDashed className="w-3 h-3 mr-1.5" /> Pending
          </Badge>);

      case 'Rejected':
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-700 hover:bg-red-200 border-none rounded-full px-2.5 font-normal flex w-fit items-center">
            
            <XCircle className="w-3 h-3 mr-1.5" /> Rejected
          </Badge>);

      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col h-full">
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-tight">My Children</h1>
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
                    Grade Level
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">
                    Requirements
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {children.length === 0 ?
                <TableRow>
                    <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground">
                    
                      No children enrolled yet.
                    </TableCell>
                  </TableRow> :

                children.map((child) =>
                <TableRow
                  key={child.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onSelectChild(child.id)}>
                  
                      <TableCell className="font-medium text-foreground pl-4 sm:pl-6 whitespace-nowrap">
                        {child.firstName} {child.lastName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                      variant="outline"
                      className="bg-transparent border-border text-muted-foreground font-normal rounded-full px-3">
                      
                          Grade {child.gradeLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getStatusBadge(child.status)}
                      </TableCell>
                      <TableCell
                    className={`whitespace-nowrap ${child.requirements === 'Complete' ? 'text-green-600' : 'text-red-600 font-medium'}`}>
                    
                        {child.requirements}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
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