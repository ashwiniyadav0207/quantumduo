'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Mother {
  id: string;
  name: string;
  age: number;
  village: string;
  husband: string;
  phone: string;
  pregnancyMonth: number;
  lmpDate: string;
  highRisk: boolean;
  conditions: string[];
  bp: string;
  weight: number;
  swelling: boolean;
  bleeding: boolean;
  headache: boolean;
  fatigue: { heavyWork: boolean; lessRest: boolean; weakness: boolean };
  timeline: { [key: string]: 'done' | 'due' | 'overdue' };
  nextFollowUp: string;
  notes: string;
  createdAt: string;
  lastVisit: string;
}

interface DataContextType {
  mothers: Mother[];
  addMother: (mother: Omit<Mother, 'id' | 'createdAt'>) => void;
  updateMother: (id: string, updates: Partial<Mother>) => void;
  getMother: (id: string) => Mother | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultTimeline = {
  anc1: 'due',
  anc2: 'due',
  ttInjection: 'due',
  ironTablets: 'due',
  ultrasound: 'due',
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [mothers, setMothers] = useState<Mother[]>([
    {
      id: '1',
      name: 'Sita Devi',
      age: 24,
      village: 'Dharampur',
      husband: 'Rajesh Kumar',
      phone: '9876543210',
      pregnancyMonth: 6,
      lmpDate: '2024-07-15',
      highRisk: false,
      conditions: [],
      bp: '120/80',
      weight: 62,
      swelling: false,
      bleeding: false,
      headache: false,
      fatigue: { heavyWork: true, lessRest: false, weakness: false },
      timeline: { ...defaultTimeline, anc1: 'done', anc2: 'due' },
      nextFollowUp: '2025-02-10',
      notes: 'Regular checkup completed. No complications.',
      createdAt: '2024-07-15',
      lastVisit: '2025-01-20',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 28,
      village: 'Khairagarh',
      husband: 'Vikram Singh',
      phone: '9123456789',
      pregnancyMonth: 8,
      lmpDate: '2024-05-20',
      highRisk: true,
      conditions: ['Anemia', 'High BP'],
      bp: '140/95',
      weight: 68,
      swelling: true,
      bleeding: false,
      headache: true,
      fatigue: { heavyWork: true, lessRest: true, weakness: true },
      timeline: { ...defaultTimeline, anc1: 'done', anc2: 'done', ttInjection: 'done' },
      nextFollowUp: '2025-01-28',
      notes: 'High priority. Referred to PHC for specialist consultation.',
      createdAt: '2024-05-20',
      lastVisit: '2025-01-15',
    },
    {
      id: '3',
      name: 'Anjali Das',
      age: 22,
      village: 'Raipur',
      husband: 'Arjun Das',
      phone: '9234567890',
      pregnancyMonth: 4,
      lmpDate: '2024-09-10',
      highRisk: false,
      conditions: [],
      bp: '118/76',
      weight: 59,
      swelling: false,
      bleeding: false,
      headache: false,
      fatigue: { heavyWork: false, lessRest: false, weakness: false },
      timeline: { ...defaultTimeline, anc1: 'done' },
      nextFollowUp: '2025-02-15',
      notes: 'On track. Regular pregnancy. No concerns.',
      createdAt: '2024-09-10',
      lastVisit: '2025-01-10',
    },
  ]);

  const addMother = (mother: Omit<Mother, 'id' | 'createdAt'>) => {
    const newMother: Mother = {
      ...mother,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMothers([...mothers, newMother]);
  };

  const updateMother = (id: string, updates: Partial<Mother>) => {
    setMothers(mothers.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const getMother = (id: string) => mothers.find((m) => m.id === id);

  return <DataContext.Provider value={{ mothers, addMother, updateMother, getMother }}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
