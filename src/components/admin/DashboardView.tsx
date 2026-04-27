import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Users,
  GraduationCap,
  Heart,
  Home } from
'lucide-react';
import { useAdminData } from '../../lib/adminData';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { initialChildren } from '../../lib/parentData';

export function DashboardView() {
  const { setSetupComplete } = useAdminData();
  
  const [statsData, setStatsData] = useState({
    students: initialChildren.length,
    teachers: 0,
    parents: 0,
    classrooms: 0
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const getDate = (ts: any) => {
    if (!ts) return new Date();
    if (ts.toDate) return ts.toDate();
    return new Date(ts);
  };

  useEffect(() => {
    const usersUnsub = onSnapshot(query(collection(db, 'users')), (snapshot) => {
      let teachers = 0;
      let parents = 0;
      let userActs: any[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.role && data.role.toLowerCase() === 'teacher' && data.status === 'Active') teachers++;
        if (data.role && data.role.toLowerCase() === 'parent') parents++;
        
        userActs.push({
          id: doc.id,
          initials: (data.firstName?.[0] || '') + (data.lastName?.[0] || ''),
          name: `${data.firstName || ''} ${data.lastName || ''}`,
          detail: `New ${data.role || 'User'} added`,
          value: data.status || 'Active',
          color: data.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700',
          createdAt: getDate(data.createdAt),
          type: 'user'
        });
      });
      setStatsData(prev => ({ ...prev, teachers, parents }));
      
      setRecentActivities(prev => {
        const others = prev.filter(a => a.type !== 'user');
        return [...others, ...userActs]
          .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 4);
      });
    });

    const classroomsUnsub = onSnapshot(query(collection(db, 'classrooms')), (snapshot) => {
      let classActs: any[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        classActs.push({
          id: doc.id,
          initials: data.roomName?.substring(0, 2).toUpperCase() || 'CR',
          name: data.roomName || 'Classroom',
          detail: `New Classroom added`,
          value: data.status || 'Available',
          color: 'bg-blue-100 text-blue-700',
          createdAt: getDate(data.createdAt),
          type: 'classroom'
        });
      });
      setStatsData(prev => ({ ...prev, classrooms: snapshot.size }));

      setRecentActivities(prev => {
        const others = prev.filter(a => a.type !== 'classroom');
        return [...others, ...classActs]
          .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 4);
      });
    });

    return () => {
      usersUnsub();
      classroomsUnsub();
    };
  }, []);

  const stats = [
  {
    label: 'Total Students',
    value: statsData.students.toString(),
    change: 'enrolled in system',
    icon: Users,
    positive: true
  },
  {
    label: 'Active Teachers',
    value: statsData.teachers.toString(),
    change: 'live from firestore',
    icon: GraduationCap,
    positive: true
  },
  {
    label: 'Enrolled Parents',
    value: statsData.parents.toString(),
    change: 'live from firestore',
    icon: Heart,
    positive: true
  },
  {
    label: 'Active Classrooms',
    value: statsData.classrooms.toString(),
    change: 'live from firestore',
    icon: Home,
    positive: true
  }];

  const today = new Date();
  const currentMonthName = today.toLocaleString('default', { month: 'long' });
  const recentCountThisMonth = recentActivities.filter(a => a.createdAt.getMonth() === today.getMonth() && a.createdAt.getFullYear() === today.getFullYear()).length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <Button
            variant="outline"
            onClick={() => setSetupComplete(false)}
            className="w-full sm:w-auto">
            
            Rerun Setup
          </Button>
        </div>

        {/* Stats Grid */}
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
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="text-sm text-muted-foreground">
                Historical enrollment trends
              </p>
            </div>
            <div className="h-[300px] w-full relative">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-lg">
                <Badge variant="outline" className="mb-2 bg-background">System Initialized</Badge>
                <p className="text-sm font-medium text-slate-600 text-center max-w-[200px]">
                  Historical chart data is not yet available for SY 2026-2027.
                </p>
              </div>
              <svg
                viewBox="0 0 1000 250"
                preserveAspectRatio="none"
                className="w-full h-full opacity-30 grayscale">
                
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#gradient1)" />
                
                <path
                  d="M0,180 C200,250 300,80 500,160 C700,240 800,80 1000,120"
                  fill="none"
                  stroke="rgb(234 88 12)"
                  strokeWidth="2"
                  opacity="0.8" />
                
              </svg>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-3 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">
                {recentCountThisMonth > 0 
                  ? `You have ${recentCountThisMonth} recent actions this ${currentMonthName}.`
                  : `No recent activity in ${currentMonthName}.`}
              </p>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((item, i) =>
                <div key={item.id || i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm shrink-0">
                      {item.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.detail}
                      </p>
                    </div>
                    <Badge className={`${item.color} border-none text-[10px] shrink-0`}>
                      {item.value}
                    </Badge>
                  </div>
                )
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No activities recorded yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>);

}