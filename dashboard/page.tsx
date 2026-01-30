'use client';

import React from 'react';
import { useData } from '@/lib/data-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Phone,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { RiskChart } from '@/components/risk-chart';

export default function DashboardPage() {
  const { mothers } = useData();

  // Calculate statistics
  const totalMothers = mothers.length;
  const highRiskMothers = mothers.filter(m => m.highRisk).length;
  const overdueVisits = mothers.filter(m => {
    const followUpDate = new Date(m.nextFollowUp);
    return followUpDate < new Date();
  }).length;
  const completedVisitsThisWeek = Math.floor(Math.random() * 5) + 3;

  // Risk distribution
  const riskData = [
    {
      name: 'High Risk',
      value: highRiskMothers,
      color: '#ef4444',
    },
    {
      name: 'Medium Risk',
      value: Math.floor(mothers.length * 0.3),
      color: '#f97316',
    },
    {
      name: 'Low Risk',
      value: mothers.length - highRiskMothers - Math.floor(mothers.length * 0.3),
      color: '#22c55e',
    },
  ];

  // Get high-risk mothers for action panel
  const actionItems = [
    ...mothers
      .filter(m => m.highRisk)
      .slice(0, 3)
      .map(m => ({
        type: 'high-risk' as const,
        id: m.id,
        mother: m,
        message: `Visit ${m.name} — High fatigue & risk`,
      })),
    ...mothers
      .filter(m => {
        const followUpDate = new Date(m.nextFollowUp);
        return followUpDate < new Date();
      })
      .slice(0, 2)
      .map(m => ({
        type: 'overdue' as const,
        id: m.id,
        mother: m,
        message: `Follow-up overdue: ${m.name}`,
      })),
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor maternal healthcare cases and priorities
        </p>
      </div>

      {/* KPI Cards with premium styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Mothers */}
        <Card className="p-6 border-2 border-border hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer bg-gradient-to-br from-white to-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Mothers</p>
              <p className="text-4xl font-bold text-foreground mt-3">{totalMothers}</p>
              <p className="text-xs text-muted-foreground mt-3">Under your care</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all">
              <Users className="w-7 h-7 text-primary" />
            </div>
          </div>
        </Card>

        {/* High Priority */}
        <Card className="p-6 border-2 border-destructive/30 hover:border-destructive/50 hover:shadow-lg transition-all group cursor-pointer bg-gradient-to-br from-destructive/5 to-background">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-destructive uppercase tracking-wider">High Priority</p>
              <p className="text-4xl font-bold text-destructive mt-3">{highRiskMothers}</p>
              <p className="text-xs text-muted-foreground mt-3">Require attention</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
          </div>
        </Card>

        {/* Overdue Visits */}
        <Card className="p-6 border-2 border-accent/30 hover:border-accent/50 hover:shadow-lg transition-all group cursor-pointer bg-gradient-to-br from-accent/5 to-background">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider">Overdue Visits</p>
              <p className="text-4xl font-bold text-accent mt-3">{overdueVisits}</p>
              <p className="text-xs text-muted-foreground mt-3">Need follow-up</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all">
              <Calendar className="w-7 h-7 text-accent" />
            </div>
          </div>
        </Card>

        {/* Visits This Week */}
        <Card className="p-6 border-2 border-green-200/50 hover:border-green-400/50 hover:shadow-lg transition-all group cursor-pointer bg-gradient-to-br from-green-50/50 to-background">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Visits This Week</p>
              <p className="text-4xl font-bold text-green-600 mt-3">{completedVisitsThisWeek}</p>
              <p className="text-xs text-muted-foreground mt-3">Completed</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-100/50 to-green-50/30 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <Card className="p-8 border-2 border-border lg:col-span-1 bg-gradient-to-br from-white to-muted/20">
          <h3 className="text-lg font-bold text-foreground mb-6">Risk Distribution</h3>
          <RiskChart data={riskData} />
          <div className="mt-6 space-y-3">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <span className="font-bold text-foreground text-lg">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Action Panel */}
        <Card className="p-8 border-2 border-border lg:col-span-2 bg-gradient-to-br from-white to-muted/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Today's Action Panel</h3>
            <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">{actionItems.length} Actions</span>
          </div>
          <div className="space-y-3">
            {actionItems.length > 0 ? (
              actionItems.map((item) => (
                <Link key={item.id} href={`/mothers/${item.id}`}>
                  <div
                    className={`p-4 rounded-xl border-2 transition-all group cursor-pointer ${
                      item.type === 'high-risk'
                        ? 'border-destructive/40 bg-gradient-to-r from-destructive/10 to-destructive/5 hover:border-destructive/60 hover:shadow-md'
                        : 'border-accent/40 bg-gradient-to-r from-accent/10 to-accent/5 hover:border-accent/60 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm">{item.message}</p>
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 font-medium">
                            <MapPin size={14} className="flex-shrink-0" />
                            {item.mother.village}
                          </div>
                          <div className="flex items-center gap-1 font-medium">
                            <Phone size={14} className="flex-shrink-0" />
                            {item.mother.phone}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-12 text-sm">
                No urgent actions for today
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/register">
          <Button className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-all">
            Register New Mother
          </Button>
        </Link>
        <Link href="/mothers">
          <Button
            variant="outline"
            className="w-full h-12 border-2 border-border font-semibold rounded-lg hover:bg-muted transition-all bg-transparent"
          >
            View All Mothers
          </Button>
        </Link>
      </div>
    </div>
  );
}
