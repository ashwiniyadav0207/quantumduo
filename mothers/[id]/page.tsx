'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

interface TimelineStep {
  key: string;
  label: string;
  status: 'done' | 'due' | 'overdue';
  icon: React.ReactNode;
}

export default function MotherProfilePage({ params }: { params: { id: string } }) {
  const { getMother } = useData();
  const mother = getMother(params.id);
  const [activeTab, setActiveTab] = useState('summary');

  if (!mother) {
    return (
      <div className="space-y-4">
        <Link href="/mothers">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft size={18} />
            Back
          </Button>
        </Link>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Mother profile not found</p>
        </Card>
      </div>
    );
  }

  const fatigueCount = [mother.fatigue.heavyWork, mother.fatigue.lessRest, mother.fatigue.weakness].filter(Boolean).length;
  const getRiskColor = () => {
    if (fatigueCount === 0) return 'bg-green-100 text-green-800 border-green-200';
    if (fatigueCount === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const timelineSteps: TimelineStep[] = [
    {
      key: 'anc1',
      label: 'ANC 1',
      status: mother.timeline.anc1,
      icon: <CheckCircle size={20} />,
    },
    {
      key: 'anc2',
      label: 'ANC 2',
      status: mother.timeline.anc2,
      icon: <CheckCircle size={20} />,
    },
    {
      key: 'ttInjection',
      label: 'TT Injection',
      status: mother.timeline.ttInjection,
      icon: <CheckCircle size={20} />,
    },
    {
      key: 'ironTablets',
      label: 'Iron Tablets',
      status: mother.timeline.ironTablets,
      icon: <CheckCircle size={20} />,
    },
    {
      key: 'ultrasound',
      label: 'Ultrasound',
      status: mother.timeline.ultrasound,
      icon: <CheckCircle size={20} />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'text-green-600';
      case 'due':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/mothers">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft size={18} />
            Back
          </Button>
        </Link>
        <Button className="gap-2 bg-primary text-primary-foreground">
          <Edit size={18} />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="p-8 border-2 border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Basic Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">{mother.name}</h1>
              <p className="text-muted-foreground mt-1">Age {mother.age} years</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Village</p>
                  <p className="font-semibold text-foreground">{mother.village}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{mother.phone}</p>
                </div>
              </div>

              {mother.highRisk && (
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-destructive">High Risk Pregnancy</p>
                    <p className="text-xs text-destructive/80">{mother.conditions.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Risk & Timeline */}
          <div>
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-2">Pregnancy Progress</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(mother.pregnancyMonth / 9) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {mother.pregnancyMonth}/9
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-3">Current Vitals</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                  <p className="font-bold text-foreground mt-1">{mother.lastBP}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-bold text-foreground mt-1">{mother.lastWeight}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-3">Fatigue Risk</p>
              <div className={`p-4 rounded-lg border-2 ${getRiskColor()} text-center`}>
                <p className="font-bold">
                  {fatigueCount === 0 ? 'LOW' : fatigueCount === 1 ? 'MEDIUM' : 'HIGH'}
                </p>
                <p className="text-xs mt-1">{fatigueCount} risk indicators</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 border border-border bg-muted/50 rounded-lg p-1">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="logs">Visit Logs</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Details */}
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Basic Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guardian</span>
                  <span className="font-semibold text-foreground">{mother.guardian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-semibold text-foreground">{mother.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Village</span>
                  <span className="font-semibold text-foreground">{mother.village}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-semibold text-foreground">{mother.age}</span>
                </div>
              </div>
            </Card>

            {/* Pregnancy Details */}
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Pregnancy Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pregnancy Month</span>
                  <span className="font-semibold text-foreground">{mother.pregnancyMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LMP Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(mother.lmpDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High Risk</span>
                  <span className="font-semibold text-foreground">{mother.highRisk ? 'Yes' : 'No'}</span>
                </div>
                {mother.conditions.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-2">Conditions</span>
                    <div className="flex flex-wrap gap-2">
                      {mother.conditions.map((condition) => (
                        <span
                          key={condition}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Current Visit Assessment */}
            <Card className="p-6 border border-border md:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">Current Health Indicators</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Blood Pressure</p>
                  <p className="text-lg font-bold text-foreground">{mother.lastBP}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Weight</p>
                  <p className="text-lg font-bold text-foreground">{mother.lastWeight}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Swelling</p>
                  <p className="text-lg font-bold text-foreground">{mother.swelling ? 'Yes' : 'No'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Bleeding</p>
                  <p className="text-lg font-bold text-foreground">{mother.bleeding ? 'Yes' : 'No'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Headache</p>
                  <p className="text-lg font-bold text-foreground">{mother.headache ? 'Yes' : 'No'}</p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${getRiskColor()}`}>
                  <p className="text-xs font-semibold mb-2">Fatigue Risk</p>
                  <p className="font-bold">
                    {fatigueCount === 0 ? 'LOW' : fatigueCount === 1 ? 'MEDIUM' : 'HIGH'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card className="p-8 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-8">Pregnancy Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => (
                <div key={step.key} className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${getStatusColor(step.status)}`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{step.label}</p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      step.status === 'done'
                        ? 'bg-green-100 text-green-800'
                        : step.status === 'due'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {step.status.toUpperCase()}
                  </span>

                  {/* Connector Line */}
                  {index !== timelineSteps.length - 1 && (
                    <div className="absolute left-[27px] top-[60px] h-12 border-l-2 border-border" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Visit Logs Tab */}
        <TabsContent value="logs">
          <Card className="p-8 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Visits</h3>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                <p className="font-semibold text-foreground">BP Recorded</p>
                <p className="text-sm text-muted-foreground mt-1">{mother.lastBP} - Normal range</p>
                <p className="text-xs text-muted-foreground mt-2">Last week</p>
              </div>
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                <p className="font-semibold text-foreground">Fatigue Assessment</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {fatigueCount === 0
                    ? 'Low fatigue indicators'
                    : fatigueCount === 1
                      ? 'Moderate fatigue'
                      : 'High fatigue - Requires attention'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">This week</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Follow-ups Tab */}
        <TabsContent value="followups">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Next Follow-up</h3>
              <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                  <p className="font-bold text-foreground text-lg">
                    {new Date(mother.nextFollowUp).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <Button className="w-full h-10 bg-primary text-primary-foreground font-semibold">
                Schedule Visit
              </Button>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Action Items</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-10 bg-transparent"
                >
                  <Phone size={18} />
                  Call Mother
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-10 bg-transparent"
                >
                  <MapPin size={18} />
                  Home Visit
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-10 bg-transparent"
                >
                  <AlertTriangle size={18} />
                  Refer to PHC
                </Button>
              </div>
            </Card>

            <Card className="p-6 border border-border md:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">Clinical Notes</h3>
              <div className="p-4 bg-muted rounded-lg border border-border">
                <p className="text-foreground whitespace-pre-wrap">{mother.notes}</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
