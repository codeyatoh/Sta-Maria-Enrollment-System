import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Users,
  AlertCircle,
  BarChart,
  Calendar } from
'lucide-react';
import { useParentData } from '../../lib/parentData';
export function ParentDashboardView({
  onNavigate


}: {onNavigate: (view: string) => void;}) {
  const { children } = useParentData();
  const enrolledCount = children.filter((c) => c.status === 'Enrolled').length;
  const pendingCount = children.filter((c) => c.status === 'Pending').length;
  let totalDays = 0;
  let presentDays = 0;
  children.
  filter((c) => c.status === 'Enrolled').
  forEach((child) => {
    totalDays += child.attendance.length;
    presentDays += child.attendance.filter(
      (a) => a.status === 'Present' || a.status === 'Late'
    ).length;
  });
  const attendanceRate =
  totalDays > 0 ? Math.round(presentDays / totalDays * 100) : 0;
  const stats = [
  {
    label: 'Enrolled Children',
    value: enrolledCount.toString(),
    change: 'Active enrollments',
    icon: Users,
    positive: true
  },
  {
    label: 'Pending Actions',
    value: pendingCount.toString(),
    change: pendingCount > 0 ? 'Requires attention' : 'All clear',
    icon: AlertCircle,
    positive: pendingCount === 0
  },
  {
    label: 'Average Grade',
    value: '91.2%',
    change: '+2.5% from last quarter',
    icon: BarChart,
    positive: true
  },
  {
    label: 'Attendance Rate',
    value: `${attendanceRate}%`,
    change: 'Meets requirements',
    icon: Calendar,
    positive: true
  }];

  const recentUpdates = [
  {
    initials: 'JD',
    name: 'Juan Dela Cruz',
    detail: 'Attendance recorded',
    value: 'Present',
    color: 'bg-green-100 text-green-700'
  },
  {
    initials: 'AD',
    name: 'Ana Dela Cruz',
    detail: 'Enrollment pending',
    value: 'Pending',
    color: 'bg-orange-100 text-orange-700'
  },
  {
    initials: 'JD',
    name: 'Juan Dela Cruz',
    detail: 'Grade updated - Math',
    value: '85',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    initials: 'JD',
    name: 'Juan Dela Cruz',
    detail: 'BMI recorded',
    value: 'Normal',
    color: 'bg-green-100 text-green-700'
  }];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <Button
            className="w-full sm:w-auto"
            onClick={() => onNavigate('enrollment')}>
            
            Enroll New Child
          </Button>
        </div>

        {/* Stats Grid - render directly without Tabs wrapper */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) =>
          <Card key={i} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p
                className={`text-xs ${stat.positive ? 'text-green-600' : 'text-muted-foreground'}`}>
                
                  {stat.change}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-4 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Academic Progress</h3>
              <p className="text-sm text-muted-foreground">
                Average grades across subjects
              </p>
            </div>
            <div className="h-[300px] w-full">
              <svg
                viewBox="0 0 1000 250"
                preserveAspectRatio="none"
                className="w-full h-full">
                
                <defs>
                  <linearGradient id="pg1" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="rgb(234 88 12)"
                      stopOpacity="0.2" />
                    
                    <stop
                      offset="100%"
                      stopColor="rgb(234 88 12)"
                      stopOpacity="0" />
                    
                  </linearGradient>
                </defs>
                <path
                  d="M0,180 C200,250 300,80 500,160 C700,240 800,80 1000,120 L1000,250 L0,250 Z"
                  fill="url(#pg1)" />
                
                <path
                  d="M0,180 C200,250 300,80 500,160 C700,240 800,80 1000,120"
                  fill="none"
                  stroke="rgb(234 88 12)"
                  strokeWidth="2"
                  opacity="0.8" />
                
              </svg>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                <span>Q1</span>
                <span>Q2</span>
                <span>Q3</span>
                <span>Q4</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-3 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Recent Updates</h3>
              <p className="text-sm text-muted-foreground">
                Latest activity for your children.
              </p>
            </div>
            <div className="space-y-4">
              {recentUpdates.map((item, i) =>
              <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                    {item.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.detail}
                    </p>
                  </div>
                  <Badge className={`${item.color} border-none text-xs`}>
                    {item.value}
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>);

}