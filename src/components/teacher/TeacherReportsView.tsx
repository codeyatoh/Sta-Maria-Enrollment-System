import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Download,
  CheckCircle2,
  Heart,
  Award,
  TrendingUp } from
'lucide-react';
export function TeacherReportsView() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setSuccess(id);
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };
  const reports = [
  {
    id: 'sf5',
    title: 'School Form 5 (SF5)',
    subtitle: 'Report on Promotion and Level of Proficiency',
    desc: 'Summary of student promotions, retentions, and academic proficiency levels at the end of the school year.',
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'sf8',
    title: 'School Form 8 (SF8)',
    subtitle: 'Learner Health Record',
    desc: 'Comprehensive health and nutritional status report including BMI, height, weight, and medical conditions for all students.',
    icon: Heart,
    color: 'bg-red-100 text-red-600'
  },
  {
    id: 'sf9',
    title: 'School Form 9 (SF9)',
    subtitle: 'Learner Progress Report Card',
    desc: 'Individual student report cards with quarterly grades, attendance summary, and teacher remarks.',
    icon: Award,
    color: 'bg-orange-100 text-orange-600'
  }];

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-tight">
          Generate Reports
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl">
          {reports.map((report) =>
          <Card
            key={report.id}
            className="bg-card border-border p-4 sm:p-6 shadow-sm rounded-xl flex flex-col">
            
              <div className="flex items-start gap-4 mb-6">
                <div
                className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center shrink-0`}>
                
                  <report.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {report.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
                {report.desc}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Section: Grade 1 - Section A</span>
                  <span>SY 2024-2025</span>
                </div>
                <Button
                className="w-full"
                variant={success === report.id ? 'outline' : 'default'}
                onClick={() => handleGenerate(report.id)}
                disabled={generating === report.id || success === report.id}>
                
                  {generating === report.id ?
                'Generating...' :
                success === report.id ?
                <>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />{' '}
                      Ready to Download
                    </> :

                <>
                      <Download className="w-4 h-4 mr-2" /> Generate Report
                    </>
                }
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>);

}