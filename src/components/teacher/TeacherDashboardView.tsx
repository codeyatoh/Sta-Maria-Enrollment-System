import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Users, CheckCircle, XCircle, BarChart } from 'lucide-react';
import { useTeacherData } from '../../lib/teacherData';
export function TeacherDashboardView() {
  const { students, attendance, todayDate } = useTeacherData();
  const enrolled = students.filter((s) => s.status === 'Enrolled');
  const pending = students.filter((s) => s.status === 'Pending');
  const todayAttendance = attendance.filter((a) => a.date === todayDate);
  const presentToday = todayAttendance.filter(
    (a) => a.status === 'Present' || a.status === 'Late'
  ).length;
  const absentToday = todayAttendance.filter(
    (a) => a.status === 'Absent'
  ).length;
  const allGrades = enrolled.flatMap((s) => Object.values(s.grades));
  const avgGrade =
  allGrades.length > 0 ?
  (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1) :
  '0';
  const stats = [
  {
    label: 'Total Students',
    value: enrolled.length.toString(),
    change:
    pending.length > 0 ?
    `${pending.length} pending approval` :
    'All enrolled',
    icon: Users,
    positive: true
  },
  {
    label: 'Present Today',
    value: todayAttendance.length > 0 ? presentToday.toString() : '--',
    change:
    todayAttendance.length > 0 ? 'Attendance recorded' : 'Not taken yet',
    icon: CheckCircle,
    positive: todayAttendance.length > 0
  },
  {
    label: 'Absent Today',
    value: todayAttendance.length > 0 ? absentToday.toString() : '--',
    change: absentToday > 0 ? 'Follow up required' : 'All present',
    icon: XCircle,
    positive: absentToday === 0
  },
  {
    label: 'Average Grade',
    value: `${avgGrade}%`,
    change: 'Steady performance',
    icon: BarChart,
    positive: true
  }];

  const recentActivity = [
  {
    initials: 'JD',
    name: 'Juan Dela Cruz',
    detail: 'Grade updated - Math',
    value: '85',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    initials: 'MS',
    name: 'Maria Santos',
    detail: 'Attendance - Present',
    value: 'Today',
    color: 'bg-green-100 text-green-700'
  },
  {
    initials: 'PG',
    name: 'Pedro Garcia',
    detail: 'Absent - 5 days',
    value: 'Alert',
    color: 'bg-red-100 text-red-700'
  },
  {
    initials: 'AR',
    name: 'Ana Reyes',
    detail: 'BMI recorded',
    value: 'Normal',
    color: 'bg-green-100 text-green-700'
  }];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
        </div>

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

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-4 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Attendance Trends</h3>
              <p className="text-sm text-muted-foreground">
                Class attendance over the last 30 days
              </p>
            </div>
            <div className="h-[300px] w-full">
              <svg
                viewBox="0 0 1000 250"
                preserveAspectRatio="none"
                className="w-full h-full">
                
                <defs>
                  <linearGradient id="tg1" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#tg1)" />
                
                <path
                  d="M0,180 C200,250 300,80 500,160 C700,240 800,80 1000,120"
                  fill="none"
                  stroke="rgb(234 88 12)"
                  strokeWidth="2"
                  opacity="0.8" />
                
              </svg>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-3 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">
                Latest classroom updates.
              </p>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, i) =>
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