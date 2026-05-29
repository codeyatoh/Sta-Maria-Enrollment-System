import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { CheckCircle2, CircleDashed, FileText, Search, XCircle, Eye } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import {
  reviewEnrollmentDocument,
  subscribeAllEnrollmentDocuments,
  subscribeEnrollmentDocumentsByGradeLevel
} from '../../lib/services/enrollmentDocumentsService';
import { DOCUMENT_STATUS, DOCUMENT_TYPES, EnrollmentDocument } from '../../lib/schema/phase2';

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-100 text-rose-700 border-rose-200'
};

export function DocumentVerificationView({ role = 'admin', gradeLevelFilter }: { role?: 'admin' | 'teacher', gradeLevelFilter?: string }) {
  const { user, userData } = useAuth();
  const [documents, setDocuments] = useState<EnrollmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let unsub: () => void;
    console.log('[DocumentVerificationView] Initializing with role:', role, 'gradeLevelFilter:', gradeLevelFilter);
    if (role === 'teacher' && gradeLevelFilter) {
      unsub = subscribeEnrollmentDocumentsByGradeLevel(gradeLevelFilter, (rows) => {
        console.log('[DocumentVerificationView] Teacher received documents:', rows.length, rows);
        setDocuments(rows);
        setLoading(false);
      });
    } else if (role === 'teacher' && !gradeLevelFilter) {
      // If teacher but no grade level assigned yet, just stop loading and show empty
      console.log('[DocumentVerificationView] Teacher has no gradeLevelFilter assigned!');
      setLoading(false);
      setDocuments([]);
      unsub = () => {};
    } else {
      unsub = subscribeAllEnrollmentDocuments((rows) => {
        console.log('[DocumentVerificationView] Admin received documents:', rows.length, rows);
        setDocuments(rows);
        setLoading(false);
      });
    }
    return () => {
      if (unsub) unsub();
    };
  }, [role, gradeLevelFilter]);

  const filteredDocuments = useMemo(() => {
    console.log('[DocumentVerificationView] Filtering documents. Total:', documents.length, 'Filter state:', filter);
    return documents.filter((doc) => {
      const docStatus = doc.status?.toUpperCase() || '';
      const matchesFilter = filter === 'ALL' || docStatus === filter;
      const text = `${doc.studentName} ${doc.fileName} ${doc.gradeLevel}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      
      console.log(`[DocumentVerificationView] Doc: ${doc.studentName}, Status: ${doc.status}, Filter: ${filter}, matchesFilter: ${matchesFilter}`);
      
      return matchesFilter && matchesSearch;
    });
  }, [documents, filter, search]);

  const handleApprove = async (row: EnrollmentDocument) => {
    if (!user) return;
    setBusyId(row.id);
    try {
      await reviewEnrollmentDocument({
        documentId: row.id,
        enrollmentId: row.enrollmentId,
        documentType: row.documentType,
        status: DOCUMENT_STATUS.APPROVED,
        reviewerId: user.uid,
        reviewerName: `${(userData as Record<string, string> | null)?.firstName || 'Admin'} ${(userData as Record<string, string> | null)?.lastName || ''}`.trim()
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (row: EnrollmentDocument) => {
    if (!user) return;
    const reason = window.prompt('Enter rejection reason:') || '';
    if (!reason.trim()) return;
    setBusyId(row.id);
    try {
      await reviewEnrollmentDocument({
        documentId: row.id,
        enrollmentId: row.enrollmentId,
        documentType: row.documentType,
        status: DOCUMENT_STATUS.REJECTED,
        reviewerId: user.uid,
        reviewerName: `${(userData as Record<string, string> | null)?.firstName || 'Admin'} ${(userData as Record<string, string> | null)?.lastName || ''}`.trim(),
        rejectionReason: reason.trim()
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleView = (row: EnrollmentDocument) => {
    window.open(row.fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="px-6 py-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <FileText className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Document Verification</h1>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Review parent-uploaded enrollment documents and approve or reject for record validation.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <Card className="bg-white border-slate-200/60 p-4 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by learner or filename..."
                className="pl-9 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              {(['PENDING', 'ALL', 'APPROVED', 'REJECTED'] as const).map((value) => (
                <Button
                  key={value}
                  variant={filter === value ? 'default' : 'outline'}
                  className="rounded-xl"
                  onClick={() => setFilter(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading documents...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No documents match the current filters.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDocuments.map((row) => (
                <div key={row.id} className="p-4 sm:p-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  <div className="space-y-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{row.studentName}</p>
                    <p className="text-sm text-slate-500 truncate">{row.fileName}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                      {row.documentType === DOCUMENT_TYPES.PSA_BIRTH_CERTIFICATE ? 'PSA/Birth Certificate' : row.documentType} | Grade {row.gradeLevel}
                    </p>
                    {row.rejectionReason && row.status === DOCUMENT_STATUS.REJECTED && (
                      <p className="text-xs text-rose-600">Reason: {row.rejectionReason}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={STATUS_STYLE[row.status] || 'bg-slate-100 text-slate-700 border-slate-200'}>
                      {row.status === DOCUMENT_STATUS.PENDING && <CircleDashed className="w-3.5 h-3.5 mr-1.5 animate-spin-slow" />}
                      {row.status === DOCUMENT_STATUS.APPROVED && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                      {row.status === DOCUMENT_STATUS.REJECTED && <XCircle className="w-3.5 h-3.5 mr-1.5" />}
                      {row.status}
                    </Badge>

                    <Button variant="outline" className="rounded-xl" onClick={() => handleView(row)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>

                    <Button
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={row.status === DOCUMENT_STATUS.APPROVED || busyId === row.id}
                      onClick={() => handleApprove(row)}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50"
                      disabled={busyId === row.id}
                      onClick={() => handleReject(row)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
