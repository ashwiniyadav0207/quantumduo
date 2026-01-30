'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Calendar, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MothersPage() {
  const { mothers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'low'>('all');

  const filtered = mothers.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || (filterRisk === 'high' ? m.highRisk : !m.highRisk);
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (mother: typeof mothers[0]) => {
    const count = [mother.fatigue.heavyWork, mother.fatigue.lessRest, mother.fatigue.weakness].filter(Boolean).length;
    if (count === 0) return 'bg-green-100';
    if (count === 1) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mother Profiles</h1>
        <p className="text-muted-foreground mt-1">View and manage all pregnant mothers in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-border focus:border-primary rounded-xl bg-white text-base"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterRisk === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterRisk('all')}
            className={`h-11 px-6 rounded-full font-semibold transition-all ${
              filterRisk === 'all'
                ? 'bg-primary text-white'
                : 'border-2 border-border hover:border-primary/50 bg-white'
            }`}
          >
            All Mothers
          </Button>
          <Button
            variant={filterRisk === 'high' ? 'default' : 'outline'}
            onClick={() => setFilterRisk('high')}
            className={`h-11 px-6 rounded-full font-semibold transition-all flex items-center gap-2 ${
              filterRisk === 'high'
                ? 'bg-destructive text-white'
                : 'border-2 border-destructive/30 hover:border-destructive/50 bg-white text-foreground'
            }`}
          >
            <AlertTriangle size={16} />
            High Risk
          </Button>
          <Button
            variant={filterRisk === 'low' ? 'default' : 'outline'}
            onClick={() => setFilterRisk('low')}
            className={`h-11 px-6 rounded-full font-semibold transition-all flex items-center gap-2 ${
              filterRisk === 'low'
                ? 'bg-green-600 text-white'
                : 'border-2 border-green-200 hover:border-green-400 bg-white text-foreground'
            }`}
          >
            <CheckCircle size={16} />
            Low Risk
          </Button>
        </div>
      </div>

      {/* Mother Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mother) => {
            const isOverdue = new Date(mother.nextFollowUp) < new Date();
            return (
              <Link key={mother.id} href={`/mothers/${mother.id}`}>
                <Card className={`p-6 border-2 transition-all cursor-pointer group h-full flex flex-col shadow-sm hover:shadow-md ${getRiskColor(mother) === 'bg-red-100' ? 'border-destructive/40 hover:border-destructive/60' : getRiskColor(mother) === 'bg-yellow-100' ? 'border-accent/40 hover:border-accent/60' : 'border-border hover:border-primary/40'}`}>
                  {/* Status Bar */}
                  <div className={`h-1.5 w-full rounded-full mb-5 ${getRiskColor(mother)}`} />

                  {/* Header */}
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {mother.name}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground mt-1">Age {mother.age} years</p>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">{mother.village}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground font-semibold">Month</p>
                        <p className="text-lg font-bold text-foreground">{mother.pregnancyMonth}/9</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground font-semibold">BP</p>
                        <p className="text-sm font-bold text-foreground">{mother.lastBP}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground font-semibold">Weight</p>
                        <p className="text-sm font-bold text-foreground">{mother.lastWeight}</p>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-5 pt-4 border-t border-border/50 flex gap-2 flex-wrap">
                    {mother.highRisk && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-destructive/15 text-destructive text-xs font-bold rounded-full">
                        <AlertTriangle size={14} />
                        High Risk
                      </span>
                    )}
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/15 text-accent text-xs font-bold rounded-full">
                        <Calendar size={14} />
                        Overdue
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full ml-auto">
                      View Profile →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 border-2 border-border text-center bg-gradient-to-br from-muted/30 to-background">
          <p className="text-muted-foreground text-lg font-medium">No mothers found matching your search</p>
        </Card>
      )}
    </div>
  );
}
