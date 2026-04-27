import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useParentData } from '../../lib/parentData';
export function EnrollmentForm({ onComplete }: {onComplete: () => void;}) {
  const { addChild } = useParentData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: '',
    lrn: '',
    gradeLevel: '',
    address: {
      street: '',
      barangay: '',
      city: '',
      province: '',
      zipCode: ''
    },
    medical: {
      height: '',
      weight: '',
      bloodType: '',
      allergies: '',
      conditions: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    additional: {
      motherTongue: '',
      religion: '',
      isIndigenous: false,
      indigenousGroup: ''
    }
  });
  const handleSubmit = () => {
    addChild(formData);
    onComplete();
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
    <div className="flex flex-col h-full bg-muted/30">
      <header className="h-16 flex items-center justify-center px-4 sm:px-8 border-b border-border shrink-0 bg-background/50 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-tight">
          New Student Enrollment
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between mb-8 px-2 sm:px-4 relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -z-10 -translate-y-1/2"></div>
            {[1, 2, 3, 4, 5].map((i) =>
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground border border-border'}`}>
              
                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
              </div>
            )}
          </div>

          <Card className="bg-card border-border shadow-sm overflow-hidden relative min-h-[500px]">
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
                    Personal Information
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                    Enter the learner's basic details.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                      value={formData.firstName}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName: e.target.value
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                      value={formData.lastName}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName: e.target.value
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Middle Name</Label>
                      <Input
                      value={formData.middleName}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        middleName: e.target.value
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Birth Date</Label>
                      <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthDate: e.target.value
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                      value={formData.gender}
                      onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        gender: v
                      })
                      }>
                      
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Grade Level to Enroll</Label>
                      <Select
                      value={formData.gradeLevel}
                      onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        gradeLevel: v
                      })
                      }>
                      
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Grade 1</SelectItem>
                          <SelectItem value="2">Grade 2</SelectItem>
                          <SelectItem value="3">Grade 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Learner Reference Number (LRN)</Label>
                      <Input
                      value={formData.lrn}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        lrn: e.target.value
                      })
                      }
                      placeholder="Optional for new students" />
                    
                    </div>
                  </div>
                  <div className="flex justify-end pt-6 mt-6 border-t border-border">
                    <Button
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto"
                    disabled={
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.gradeLevel
                    }>
                    
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
                    Address
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                    Current residential address.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>House No. / Street</Label>
                      <Input
                      value={formData.address.street}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          street: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Barangay</Label>
                      <Input
                      value={formData.address.barangay}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          barangay: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>City / Municipality</Label>
                      <Input
                      value={formData.address.city}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          city: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Province</Label>
                      <Input
                      value={formData.address.province}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          province: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Zip Code</Label>
                      <Input
                      value={formData.address.zipCode}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          zipCode: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-border">
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
                    Medical Information
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                    Important health details for emergencies.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
                    <div className="space-y-2">
                      <Label>Height (cm)</Label>
                      <Input
                      type="number"
                      value={formData.medical.height}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical: {
                          ...formData.medical,
                          height: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input
                      type="number"
                      value={formData.medical.weight}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical: {
                          ...formData.medical,
                          weight: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Blood Type</Label>
                      <Select
                      value={formData.medical.bloodType}
                      onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        medical: {
                          ...formData.medical,
                          bloodType: v
                        }
                      })
                      }>
                      
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact Name</Label>
                      <Input
                      value={formData.medical.emergencyContact}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical: {
                          ...formData.medical,
                          emergencyContact: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact Phone</Label>
                      <Input
                      value={formData.medical.emergencyPhone}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical: {
                          ...formData.medical,
                          emergencyPhone: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-border">
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
                    Additional Information
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                    Required demographic data.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
                    <div className="space-y-2">
                      <Label>Mother Tongue</Label>
                      <Input
                      value={formData.additional.motherTongue}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional: {
                          ...formData.additional,
                          motherTongue: e.target.value
                        }
                      })
                      }
                      placeholder="e.g. Tagalog" />
                    
                    </div>
                    <div className="space-y-2">
                      <Label>Religion</Label>
                      <Input
                      value={formData.additional.religion}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional: {
                          ...formData.additional,
                          religion: e.target.value
                        }
                      })
                      } />
                    
                    </div>
                    <div className="space-y-4 sm:col-span-2 mt-2 sm:mt-4 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                        id="indigenous"
                        checked={formData.additional.isIndigenous}
                        onCheckedChange={(c) =>
                        setFormData({
                          ...formData,
                          additional: {
                            ...formData.additional,
                            isIndigenous: !!c
                          }
                        })
                        } />
                      
                        <Label htmlFor="indigenous" className="font-normal">
                          Belongs to an Indigenous Peoples (IP) Community
                        </Label>
                      </div>
                      {formData.additional.isIndigenous &&
                    <div className="space-y-2 pl-6">
                          <Label>Specify IP Group</Label>
                          <Input
                        value={formData.additional.indigenousGroup}
                        onChange={(e) =>
                        setFormData({
                          ...formData,
                          additional: {
                            ...formData.additional,
                            indigenousGroup: e.target.value
                          }
                        })
                        } />
                      
                        </div>
                    }
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-border">
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
                className="p-4 sm:p-8 h-full flex flex-col">
                
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    Review & Submit
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6">
                    Please review the information before submitting.
                  </p>

                  <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2">
                    <div className="p-4 border border-border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-3">Personal Info</h3>
                      <p className="text-sm">
                        <span className="text-muted-foreground w-24 inline-block">
                          Name:
                        </span>{' '}
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground w-24 inline-block">
                          Grade:
                        </span>{' '}
                        {formData.gradeLevel}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground w-24 inline-block">
                          LRN:
                        </span>{' '}
                        {formData.lrn || 'None'}
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-3">Address</h3>
                      <p className="text-sm">
                        {formData.address.street}, {formData.address.barangay},{' '}
                        {formData.address.city}
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-3">Emergency Contact</h3>
                      <p className="text-sm">
                        <span className="text-muted-foreground w-24 inline-block">
                          Name:
                        </span>{' '}
                        {formData.medical.emergencyContact}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground w-24 inline-block">
                          Phone:
                        </span>{' '}
                        {formData.medical.emergencyPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-border">
                    <Button
                    variant="ghost"
                    onClick={() => setStep(4)}
                    className="w-full sm:w-auto">
                    
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto sm:px-8">
                    
                      Submit Enrollment
                    </Button>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>);

}