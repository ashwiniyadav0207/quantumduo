'use client';

import React, { useState } from 'react';
import { useData, type Mother } from '@/app/data-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search, Plus, ChevronRight } from 'lucide-react';

function getFatigueRisk(mother: Mother): 'green' | 'yellow' | 'red' {
  const count = [mother.fatigue.heavyWork, mother.fatigue.lessRest, mother.fatigue.weakness].filter(Boolean).length;
  if (count === 0) return 'green';
  if (count === 1) return 'yellow';
  return 'red';
}

export default function ProfilesPage() {
  const { mothers } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMothers = mothers.filter(
    (mother) =>
      mother.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mother.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mother Profiles</h1>
          <p className="text-muted-foreground mt-1">View and manage all registered pregnant women</p>
        </div>
        <Link href="/register">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Register Mother
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or village..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Profiles Grid */}
      {filteredMothers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMothers.map((mother) => {
            const fatigueRisk = getFatigueRisk(mother);
            const fatigueColors = {
              green: 'bg-green-100 text-green-800',
              yellow: 'bg-yellow-100 text-yellow-800',
              red: 'bg-red-100 text-red-800',
            };

            return (
              <Link key={mother.id} href={`/profile/${mother.id}`}>
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{mother.name}</h3>
                      <p className="text-sm text-muted-foreground">Age {mother.age} • {mother.village}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Pregnancy</p>
                        <p className="font-semibold text-foreground">Month {mother.pregnancyMonth}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">BP</p>
                        <p className="font-semibold text-foreground">{mother.bp}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-semibold text-foreground">{mother.weight} kg</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fatigueColors[fatigueRisk]}`}>
                        Fatigue: {fatigueRisk.toUpperCase()}
                      </span>
                      {mother.highRisk && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">High Risk</span>}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground mb-4">No mothers found</p>
          <Link href="/register">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Register First Mother
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
