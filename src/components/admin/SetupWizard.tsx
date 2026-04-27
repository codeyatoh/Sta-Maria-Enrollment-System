import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdminData } from '../../lib/adminData';
export function SetupWizard() {
  const {
    setSchoolYear,
    addClassroom,
    addSection,
    addSubject,
    setSetupComplete
  } = useAdminData();
  const [step, setStep] = useState(1);
  // Local state for wizard
  const [sy, setSy] = useState({
    name: '2024-2025',
    startDate: '',
    endDate: ''
  });
  const [classrooms, setLocalClassrooms] = useState([
  {
    name: 'Grade 1',
    gradeLevel: '1'
  }]
  );
  const [sections, setLocalSections] = useState([
  {
    name: 'Section A',
    classroomIndex: 0
  }]
  );
  const [subjects, setLocalSubjects] = useState([
  {
    name: 'Mathematics',
    code: 'MATH101'
  }]
  );
  const handleComplete = () => {
    // Save all to context
    setSchoolYear({
      id: 'sy1',
      name: sy.name,
      startDate: sy.startDate,
      endDate: sy.endDate,
      isActive: true
    });
    // In a real app we'd map IDs carefully, here we just add them sequentially
    classrooms.forEach((c) =>
    addClassroom({
      name: c.name,
      gradeLevel: c.gradeLevel
    })
    );
    sections.forEach((s) =>
    addSection({
      name: s.name,
      classroomId: '1'
    })
    ); // Mocking classroomId for simplicity in wizard
    subjects.forEach((s) =>
    addSubject({
      name: s.name,
      code: s.code
    })
    );
    setSetupComplete(true);
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
                  <div className="space-y-2">
                    <Label>School Year Name</Label>
                    <Input
                    value={sy.name}
                    onChange={(e) =>
                    setSy({
                      ...sy,
                      name: e.target.value
                    })
                    }
                    placeholder="e.g. 2024-2025" />
                  
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                      type="date"
                      value={sy.startDate}
                      onChange={(e) =>
                      setSy({
                        ...sy,
                        startDate: e.target.value
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                      type="date"
                      value={sy.endDate}
                      onChange={(e) =>
                      setSy({
                        ...sy,
                        endDate: e.target.value
                      })
                      } />
                    
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
                        <Label>Classroom Name</Label>
                        <Input
                      value={c.name}
                      onChange={(e) => {
                        const newC = [...classrooms];
                        newC[i].name = e.target.value;
                        setLocalClassrooms(newC);
                      }} />
                    
                      </div>
                      <div className="space-y-2">
                        <Label>Grade Level</Label>
                        <Input
                      value={c.gradeLevel}
                      onChange={(e) => {
                        const newC = [...classrooms];
                        newC[i].gradeLevel = e.target.value;
                        setLocalClassrooms(newC);
                      }} />
                    
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
                    name: '',
                    gradeLevel: ''
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
                    code: ''
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
                  You are about to initialize the system for SY {sy.name} with{' '}
                  {classrooms.length} classrooms, {sections.length} sections,
                  and {subjects.length} subjects.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-auto w-full sm:w-auto">
                  <Button
                  variant="ghost"
                  onClick={() => setStep(4)}
                  className="w-full sm:w-auto">
                  
                    Review Changes
                  </Button>
                  <Button
                  onClick={handleComplete}
                  className="w-full sm:w-auto sm:px-8">
                  
                    Complete Setup
                  </Button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </Card>
      </div>
    </div>);

}