import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../ui/Select';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../../lib/adminData';
import { SF4ReportDocument } from './SF4ReportDocument';
import { SF1ReportDocument } from './SF1ReportDocument';

export function ReportsView() {
  const { schoolYear, classrooms, sections } = useAdminData();
  const [generating, setGenerating] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSF4, setShowSF4] = useState(false);
  const [showSF1, setShowSF1] = useState(false);
  const [reportMonth, setReportMonth] = useState('JANUARY');

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId);
    setTimeout(() => {
      setGenerating(null);
      setSuccess(reportId);
      setTimeout(() => setSuccess(null), 3000);
      
      if (reportId === 'sf4') {
        setShowSF4(true);
      } else if (reportId === 'sf1') {
        setShowSF1(true);
      }
    }, 1000);
  };
  const reports = [
  {
    id: 'sf1',
    title: 'School Form 1 (SF1)',
    desc: 'School Register containing learner information, birth details, and parents/guardians.'
  },
  {
    id: 'sf4',
    title: 'School Form 4 (SF4)',
    desc: 'Monthly Learner Movement and Attendance summary for the entire school.'
  }];

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-tight">
          Official Reports
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl">
          {reports.map((report) =>
          <Card
            key={report.id}
            className="bg-card border-border p-4 sm:p-6 shadow-sm rounded-xl flex flex-col">
            
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {report.desc}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    School Year
                  </label>
                  <Select defaultValue={schoolYear?.id}>
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolYear &&
                    <SelectItem value={schoolYear.id}>
                          {schoolYear.name}
                        </SelectItem>
                    }
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Classroom
                    </label>
                    <Select>
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="All Classrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classrooms</SelectItem>
                        {classrooms.map((c) =>
                      <SelectItem key={c.id} value={c.id}>
                            {c.roomName}
                          </SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Section
                    </label>
                    <Select>
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="All Sections" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {sections.map((s) =>
                      <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {report.id === 'sf4' && (
                  <div className="space-y-1.5 mt-4">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Report Month
                    </label>
                    <Select value={reportMonth} onValueChange={setReportMonth}>
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'].map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
            </Card>
          )}
        </div>
      </div>

      {showSF4 && (
        <SF4ReportDocument 
          onClose={() => setShowSF4(false)} 
          reportMonth={reportMonth} 
          schoolYear={schoolYear?.name || '2024-2025'} 
        />
      )}
      {showSF1 && (
        <SF1ReportDocument 
          onClose={() => setShowSF1(false)} 
          schoolYear={schoolYear?.name || '2024-2025'} 
        />
      )}
    </div>);
}