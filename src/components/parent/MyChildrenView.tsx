import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

import { CheckCircle2, CircleDashed, XCircle, ChevronRight, Users } from 'lucide-react';
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
        {children.length === 0 ? (
          <Card className="bg-card border-border rounded-xl p-12 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No children enrolled yet</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              Start your enrollment process by clicking "New Enrollment" in the sidebar.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {children.map((child) => (
              <Card 
                key={child.id} 
                className="group relative bg-card hover:bg-muted/30 border-border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden"
                onClick={() => onSelectChild(child.id)}
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                  </div>
                  {getStatusBadge(child.status)}
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {child.firstName} {child.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none rounded-md px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider">
                        Grade {child.gradeLevel}
                      </Badge>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {child.gender}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Birthday</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(child.birthDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Requirements</p>
                      <p className={`text-sm font-semibold truncate ${child.requirements === 'Complete' ? 'text-green-600' : 'text-orange-500'}`}>
                        {child.requirements}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>);

}