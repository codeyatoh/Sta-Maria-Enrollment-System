import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAdminData } from '../../lib/adminData';

export function SetupWizard() {
  const { setSetupComplete } = useAdminData();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local state for wizard
  const [sy, setSy] = useState({
    startYear: '2025',
    endYear: '2026'
  });
  const [classrooms, setLocalClassrooms] = useState([
    { roomName: 'Room 101', roomType: 'Lecture' }
  ]);
  const [sections, setLocalSections] = useState([
    { name: 'Section A' }
  ]);
  const [subjects, setLocalSubjects] = useState([
    { name: 'Mathematics', code: 'MATH101', units: 3, gradeLevel: '1' }
  ]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const academicYearStr = `${sy.startYear}-${sy.endYear}`;
      
      // Save settings
      await setDoc(doc(db, 'settings', 'system'), {
        currentAcademicYear: academicYearStr,
        setupComplete: true,
        updatedAt: serverTimestamp()
      });

      // Save classrooms
      const classroomPromises = classrooms.map(c => 
        addDoc(collection(db, 'classrooms'), {
          roomName: c.roomName,
          roomType: c.roomType,
          status: 'Available',
          createdAt: serverTimestamp()
        })
      );
      const classroomRefs = await Promise.all(classroomPromises);
      const firstClassroomId = classroomRefs.length > 0 ? classroomRefs[0].id : 'unassigned';

      // Save sections
      const sectionPromises = sections.map(s => 
        addDoc(collection(db, 'sections'), {
          name: s.name,
          classroomId: firstClassroomId,
          status: 'Active',
          createdAt: serverTimestamp()
        })
      );
      await Promise.all(sectionPromises);

      // Save subjects
      const subjectPromises = subjects.map(s => 
        addDoc(collection(db, 'subjects'), {
          name: s.name,
          code: s.code,
          gradeLevel: s.gradeLevel,
          units: s.units,
          academicYear: academicYearStr,
          status: 'Active',
          createdAt: serverTimestamp()
        })
      );
      await Promise.all(subjectPromises);

      setSetupComplete(true);
    } catch (error) {
      console.error("Setup Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };
  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <img
              src="/pasted-image.jpg"
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover" />
            
            <span>Sta. Maria Admin Setup</span>
          </div>
        </div>

        <div className="flex justify-between mb-8 px-4 relative">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -z-10 -translate-y-1/2"></div>
          {[1, 2, 3, 4, 5].map((i) =>
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-border'}`}>
            
              {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
            </div>
          )}
        </div>

        <Card className="bg-card border-border shadow-lg overflow-hidden relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={1}>
            {step === 1 &&
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="p-4 sm:p-8 h-full flex flex-col">
              
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Set School Year
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  Initialize the foundational academic year.
                </p>
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Year</Label>
                      <Input
                      type="number"
                      value={sy.startYear}
                      onChange={(e) =>
                      setSy({
                        ...sy,
                        startYear: e.target.value
                      })
                      }
                      placeholder="e.g. 2025" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Year</Label>
                      <Input
                      type="number"
                      value={sy.endYear}
                      onChange={(e) =>
                      setSy({
                        ...sy,
                        endYear: e.target.value
                      })
                      }
                      placeholder="e.g. 2026" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-6 mt-auto">
                  <Button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto">
                  
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            }

            {step === 2 &&
            <motion.div
              key="step2"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="p-4 sm:p-8 h-full flex flex-col">
              
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Create Classrooms
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  Add the main grade levels or classroom groups.
                </p>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {classrooms.map((c, i) =>
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-border rounded-lg bg-muted/30">
                  
                      <div className="space-y-2">
                        <Label>Room Name</Label>
                        <Input
                      value={c.roomName}
                      onChange={(e) => {
                        const newC = [...classrooms];
                        newC[i].roomName = e.target.value;
                        setLocalClassrooms(newC);
                      }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Room Type</Label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={c.roomType}
                          onChange={(e) => {
                            const newC = [...classrooms];
                            newC[i].roomType = e.target.value;
                            setLocalClassrooms(newC);
                          }}
                        >
                          <option value="Lecture">Lecture</option>
                          <option value="Laboratory">Laboratory</option>
                          <option value="Multipurpose">Multipurpose</option>
                        </select>
                      </div>
                    </div>
                )}
                  <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() =>
                  setLocalClassrooms([
                  ...classrooms,
                  {
                    roomName: '',
                    roomType: 'Lecture'
                  }]
                  )
                  }>
                  
                    + Add Another Classroom
                  </Button>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-auto">
                  <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto">
                  
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto">
                  
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            }

            {step === 3 &&
            <motion.div
              key="step3"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="p-4 sm:p-8 h-full flex flex-col">
              
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Create Sections
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  Divide classrooms into specific sections.
                </p>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {sections.map((s, i) =>
                <div
                  key={i}
                  className="space-y-2 p-4 border border-border rounded-lg bg-muted/30">
                  
                      <Label>Section Name</Label>
                      <Input
                    value={s.name}
                    onChange={(e) => {
                      const newS = [...sections];
                      newS[i].name = e.target.value;
                      setLocalSections(newS);
                    }}
                    placeholder="e.g. Section A" />
                  
                    </div>
                )}
                  <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() =>
                  setLocalSections([
                  ...sections,
                  {
                    name: '',
                    classroomIndex: 0
                  }]
                  )
                  }>
                  
                    + Add Another Section
                  </Button>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-auto">
                  <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto">
                  
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                  onClick={() => setStep(4)}
                  className="w-full sm:w-auto">
                  
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            }

            {step === 4 &&
            <motion.div
              key="step4"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="p-4 sm:p-8 h-full flex flex-col">
              
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Create Subjects
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  Define the curriculum subjects.
                </p>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {subjects.map((s, i) =>
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-border rounded-lg bg-muted/30">
                  
                      <div className="space-y-2">
                        <Label>Subject Name</Label>
                        <Input
                      value={s.name}
                      onChange={(e) => {
                        const newS = [...subjects];
                        newS[i].name = e.target.value;
                        setLocalSubjects(newS);
                      }} />
                    
                      </div>
                      <div className="space-y-2">
                        <Label>Subject Code</Label>
                        <Input
                      value={s.code}
                      onChange={(e) => {
                        const newS = [...subjects];
                        newS[i].code = e.target.value;
                        setLocalSubjects(newS);
                      }} />
                    
                      </div>
                      <div className="space-y-2">
                        <Label>Grade Level</Label>
                        <Input
                      value={s.gradeLevel}
                      onChange={(e) => {
                        const newS = [...subjects];
                        newS[i].gradeLevel = e.target.value;
                        setLocalSubjects(newS);
                      }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Units</Label>
                        <Input
                      type="number"
                      value={s.units}
                      onChange={(e) => {
                        const newS = [...subjects];
                        newS[i].units = parseInt(e.target.value) || 0;
                        setLocalSubjects(newS);
                      }} />
                      </div>
                    </div>
                )}
                  <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() =>
                  setLocalSubjects([
                  ...subjects,
                  {
                    name: '',
                    code: '',
                    gradeLevel: '1',
                    units: 3
                  }]
                  )
                  }>
                  
                    + Add Another Subject
                  </Button>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-auto">
                  <Button
                  variant="ghost"
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto">
                  
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                  onClick={() => setStep(5)}
                  className="w-full sm:w-auto">
                  
                    Review <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            }

            {step === 5 &&
            <motion.div
              key="step5"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3
              }}
              className="p-4 sm:p-8 h-full flex flex-col items-center justify-center text-center">
              
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Ready to Initialize
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md">
                  You are about to initialize the system for SY {sy.startYear}-{sy.endYear} with{' '}
                  {classrooms.length} classrooms, {sections.length} sections,
                  and {subjects.length} subjects.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-auto w-full sm:w-auto">
                  <Button
                  variant="ghost"
                  onClick={() => setStep(4)}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}>
                  
                    Review Changes
                  </Button>
                  <Button
                  onClick={handleComplete}
                  className="w-full sm:w-auto sm:px-8"
                  disabled={isSubmitting}>
                  
                    {isSubmitting ? 'Saving...' : 'Complete Setup'}
                  </Button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </Card>
      </div>
    </div>);

}