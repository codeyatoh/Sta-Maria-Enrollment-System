import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle } from
'../components/ui/Card';
import {
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Settings,
  UserPlus,
  ClipboardCheck,
  Activity } from
'lucide-react';
export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <header className="w-full max-w-5xl bg-background/80 backdrop-blur-md border border-border shadow-sm rounded-full px-5 h-14 flex items-center justify-between pointer-events-auto">
          <div
            className="flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer"
            onClick={() => navigate('/')}>
            
            <img
              src="/pasted-image.jpg"
              alt="Sta. Maria Logo"
              className="w-8 h-8 rounded-full object-cover" />
            
            <span className="hidden sm:inline-block">
              Sta. Maria Enrollment System
            </span>
            <span className="sm:hidden">Sta. Maria</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#flow" className="hover:text-foreground transition-colors">
              System Flow
            </a>
            <a
              href="#roles"
              className="hover:text-foreground transition-colors">
              
              User Roles
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex rounded-full"
              onClick={() => navigate('/login')}>
              
              Sign In
            </Button>
            <Button
              size="sm"
              className="rounded-full px-5"
              onClick={() => navigate('/login')}>
              
              Get Started
            </Button>
          </div>
        </header>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b">
          {/* Subtle Grid Background with Radial Mask */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          <div className="container relative mx-auto px-6 max-w-5xl">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <div className="space-y-4 w-full">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
                  Manage your school with <br className="hidden sm:block" />
                  <span className="text-muted-foreground">
                    absolute clarity.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mt-6">
                  A complete ecosystem for educational institutions. From admin
                  initialization and parent enrollment to teacher operations and
                  automated report generation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full pt-4">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-full shadow-sm w-full sm:w-auto"
                  onClick={() => navigate('/login')}>
                  
                  Access Portal <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 rounded-full bg-background/50 backdrop-blur-sm w-full sm:w-auto"
                  onClick={() => navigate('/login')}>
                  
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* System Flow */}
        <section id="flow" className="container mx-auto px-6 py-24 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              The System Flow
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A logical, step-by-step pipeline ensuring data integrity from
              setup to reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-border z-0" />

            {[
            {
              icon: Settings,
              title: '1. Admin Setup',
              desc: 'Initialize school year, create classrooms, subjects, and user accounts.'
            },
            {
              icon: UserPlus,
              title: '2. Parent Enrollment',
              desc: 'Parents input learner profiles, medical info, and submit enrollment.'
            },
            {
              icon: ClipboardCheck,
              title: '3. Teacher Approval',
              desc: 'Teachers review enrollments, manage students, and encode daily data.'
            },
            {
              icon: FileText,
              title: '4. Report Generation',
              desc: 'Automated generation of official forms (SF1, SF4, SF5, SF8, SF9).'
            }].
            map((step, i) =>
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center space-y-4 bg-background p-4">
              
                <div className="w-16 h-16 rounded-full bg-background border shadow-sm flex items-center justify-center text-foreground">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* User Roles */}
        <section id="roles" className="bg-muted/30 py-24 border-y">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Role-Based Access
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Dedicated interfaces tailored to the specific responsibilities
                of each user.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Admin Card */}
              <Card className="bg-background shadow-sm">
                <CardHeader>
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Settings className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl">Admin Flow</CardTitle>
                  <CardDescription>
                    System Initialization & Oversight
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Set active School Year</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Create Classrooms, Sections & Subjects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Create Teacher and Parent accounts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Assign Teachers to Sections</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Generate SF1 and SF4 Reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Parent Card */}
              <Card className="bg-background shadow-sm">
                <CardHeader>
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl">Parent Flow</CardTitle>
                  <CardDescription>
                    Student Enrollment & Tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Add Child (Learner Profile)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Fill Personal, Address & Medical Info</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Submit Enrollment (Pending Status)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Track Teacher/Admin Approval</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>View Child's Attendance & Info</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Teacher Card */}
              <Card className="bg-background shadow-sm">
                <CardHeader>
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl">Teacher Flow</CardTitle>
                  <CardDescription>
                    Classroom Operations & Encoding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Review and Approve/Reject Enrollments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Manage Student Profiles</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Take Daily Attendance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Input Grades and BMI (Height/Weight)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Generate SF5, SF8, and SF9 Reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section
          id="features"
          className="container mx-auto px-6 py-24 max-w-6xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Core Capabilities
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built to handle the specific data requirements of modern
              educational institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
            {
              icon: UserPlus,
              title: 'Digital Enrollment Processing',
              desc: 'Transition from paper to digital. Parents submit comprehensive learner profiles, medical history, and address details online for teacher review.'
            },
            {
              icon: Activity,
              title: 'Health & Academic Tracking',
              desc: 'Teachers can easily input and monitor daily attendance, academic grades, and nutritional status (BMI, height, weight) in one unified dashboard.'
            },
            {
              icon: FileText,
              title: 'Automated DepEd Forms',
              desc: 'Eliminate manual computation. Automatically generate official school forms including SF1, SF4, SF5 (Promotion), SF8 (Health), and SF9 (Report Card).'
            },
            {
              icon: Settings,
              title: 'Strict System Hierarchy',
              desc: 'Ensures data integrity. No teacher or parent actions can occur until the Admin establishes the foundational school year, subjects, and sections.'
            }].
            map((feature, i) =>
            <div
              key={i}
              className="flex gap-4 p-6 rounded-xl border bg-card shadow-sm">
              
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30">
          <div className="container mx-auto px-6 py-24 max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to initialize your system?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Begin by logging in as an Administrator to set up your school year
              and classrooms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="h-12 px-8 w-full sm:w-auto"
                onClick={() => navigate('/login?role=admin')}>
                
                Login as Admin
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 bg-background w-full sm:w-auto"
                onClick={() => navigate('/login?role=teacher')}>
                
                Login as Teacher
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 bg-background w-full sm:w-auto"
                onClick={() => navigate('/login?role=parent')}>
                
                Login as Parent
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <img
                  src="/pasted-image.jpg"
                  alt="Sta. Maria Logo"
                  className="w-8 h-8 rounded-full object-cover" />
                
                <span>Sta. Maria Enrollment</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Modernizing school administration with digitized forms and
                streamlined workflows.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    API Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sta. Maria Central School SPED
              Center. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>);

}