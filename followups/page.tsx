'use client';

import React, { useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function FollowupsPage() {
  const { mothers } = useData();

  const categorized = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const urgent: typeof mothers = [];
    const soon: typeof mothers = [];
    const upcoming: typeof mothers = [];

    mothers.forEach((mother) => {
      const followUpDate = new Date(mother.nextFollowUp);
      followUpDate.setHours(0, 0, 0, 0);

      const daysUntil = Math.floor((followUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil < 0) {
        urgent.push(mother);
      } else if (daysUntil <= 3) {
        soon.push(mother);
      } else {
        upcoming.push(mother);
      }
    });

    return { urgent, soon, upcoming };
  }, [mothers]);

  const FollowupCard = ({ mother, days }: { mother: (typeof mothers)[0]; days: number }) => {
    const isOverdue = days < 0;

    return (
      <Link href={`/mothers/${mother.id}`}>
        <Card className={`p-6 border-2 transition-all cursor-pointer group shadow-sm hover:shadow-md ${
          isOverdue
            ? 'border-destructive/40 hover:border-destructive/60 bg-gradient-to-br from-destructive/10 to-destructive/5'
            : days <= 3
              ? 'border-accent/40 hover:border-accent/60 bg-gradient-to-br from-accent/10 to-accent/5'
              : 'border-border hover:border-primary/40 bg-gradient-to-br from-white to-muted/20'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {mother.name}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground">Age {mother.age}</p>
            </div>
            {isOverdue && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-destructive/20 text-destructive rounded-full text-xs font-bold">
                <AlertCircle size={14} />
                Overdue
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{mother.village}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <Phone size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{mother.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">Next Follow-up</p>
              <p className="text-sm font-bold text-foreground">
                {new Date(mother.nextFollowUp).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              isOverdue
                ? 'bg-destructive/20 text-destructive'
                : days <= 3
                  ? 'bg-accent/20 text-accent'
                  : 'bg-primary/20 text-primary'
            }`}>
              {isOverdue ? `${Math.abs(days)} days ago` : `${days} days`}
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  const calculateDays = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUpDate = new Date(dateString);
    followUpDate.setHours(0, 0, 0, 0);
    return Math.floor((followUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Follow-ups Schedule</h1>
        <p className="text-muted-foreground mt-1">
          Manage maternal health follow-up visits
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border-2 border-destructive/40 bg-gradient-to-br from-destructive/10 to-destructive/5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-destructive uppercase tracking-widest">Urgent (Overdue)</p>
              <p className="text-4xl font-bold text-destructive mt-3">{categorized.urgent.length}</p>
              <p className="text-xs text-muted-foreground mt-2">Require immediate action</p>
            </div>
            <AlertCircle className="w-8 h-8 text-destructive opacity-80" />
          </div>
        </Card>

        <Card className="p-8 border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-widest">Soon (Within 3 Days)</p>
              <p className="text-4xl font-bold text-accent mt-3">{categorized.soon.length}</p>
              <p className="text-xs text-muted-foreground mt-2">Schedule soon</p>
            </div>
            <Clock className="w-8 h-8 text-accent opacity-80" />
          </div>
        </Card>

        <Card className="p-8 border-2 border-border bg-gradient-to-br from-white to-muted/20 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-widest">Upcoming</p>
              <p className="text-4xl font-bold text-primary mt-3">{categorized.upcoming.length}</p>
              <p className="text-xs text-muted-foreground mt-2">On schedule</p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary opacity-80" />
          </div>
        </Card>
      </div>

      {/* Urgent Section */}
      {categorized.urgent.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Urgent - Overdue Visits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorized.urgent.map((mother) => (
              <FollowupCard
                key={mother.id}
                mother={mother}
                days={calculateDays(mother.nextFollowUp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Soon Section */}
      {categorized.soon.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Soon - Follow-up Within 3 Days
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorized.soon.map((mother) => (
              <FollowupCard
                key={mother.id}
                mother={mother}
                days={calculateDays(mother.nextFollowUp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {categorized.upcoming.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Upcoming Follow-ups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorized.upcoming.map((mother) => (
              <FollowupCard
                key={mother.id}
                mother={mother}
                days={calculateDays(mother.nextFollowUp)}
              />
            ))}
          </div>
        </div>
      )}

      {categorized.urgent.length === 0 &&
        categorized.soon.length === 0 &&
        categorized.upcoming.length === 0 && (
          <Card className="p-12 text-center border-2 border-border">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              No follow-ups scheduled. All mothers are on track.
            </p>
          </Card>
        )}
    </div>
  );
}
