'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/lib/data-context';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const { addMother } = useData();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    village: '',
    phone: '',
    guardian: '',
    pregnancyMonth: '1',
    lmpDate: '',
    highRisk: false,
    conditions: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleConditionChange = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMother: any = {
      id: Date.now().toString(),
      ...formData,
      age: parseInt(formData.age),
      pregnancyMonth: parseInt(formData.pregnancyMonth),
      lastBP: '120/80',
      lastWeight: '62kg',
      swelling: false,
      bleeding: false,
      headache: false,
      fatigue: { heavyWork: false, lessRest: false, weakness: false },
      timeline: {
        anc1: 'due',
        anc2: 'due',
        ttInjection: 'due',
        ironTablets: 'due',
        ultrasound: 'due',
      },
      nextFollowUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'New registration',
      createdAt: new Date().toISOString(),
    };

    addMother(newMother);
    router.push('/mothers');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/mothers">
          <Button variant="ghost" className="gap-2 mb-4 text-muted-foreground hover:text-foreground">
            <ChevronLeft size={18} />
            Back to Mothers
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-foreground">Register New Mother</h1>
          <p className="text-muted-foreground mt-2 text-lg">Add a new pregnant woman to your healthcare program</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <Card className="p-8 border-2 border-border h-fit bg-gradient-to-br from-white to-muted/10 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-7 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            Basic Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Full Name</label>
              <Input
                type="text"
                name="name"
                placeholder="Enter mother's full name"
                value={formData.name}
                onChange={handleChange}
                className="h-12 border-2 border-border focus:border-primary rounded-xl transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Age</label>
              <Input
                type="number"
                name="age"
                placeholder="Age in years"
                value={formData.age}
                onChange={handleChange}
                className="h-12 border-2 border-border focus:border-primary rounded-xl transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Village / Area</label>
              <Input
                type="text"
                name="village"
                placeholder="Enter village name"
                value={formData.village}
                onChange={handleChange}
                className="h-12 border-2 border-border focus:border-primary rounded-xl transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                className="h-12 border-2 border-border focus:border-primary rounded-xl transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Husband / Guardian</label>
              <Input
                type="text"
                name="guardian"
                placeholder="Guardian's name"
                value={formData.guardian}
                onChange={handleChange}
                className="h-12 border-2 border-border focus:border-primary rounded-xl transition-colors"
              />
            </div>
          </div>
        </Card>

        {/* Right Column - Pregnancy Details */}
        <Card className="p-8 border-2 border-border h-fit bg-gradient-to-br from-white to-muted/10 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-7 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            Pregnancy Details
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Pregnancy Month</label>
              <select
                name="pregnancyMonth"
                value={formData.pregnancyMonth}
                onChange={handleChange}
                className="w-full h-12 px-4 border-2 border-border focus:border-primary rounded-xl bg-white text-foreground font-medium transition-colors appearance-none cursor-pointer"
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">LMP Date</label>
              <Input
                type="date"
                name="lmpDate"
                value={formData.lmpDate}
                onChange={handleChange}
                className="h-12 border-2 border-border focus:border-primary rounded-xl transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">High Risk History</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="highRisk"
                  checked={formData.highRisk}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border border-input"
                />
                <span className="text-foreground">Mark as high-risk pregnancy</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Medical Conditions</label>
              <div className="space-y-2">
                {['Anemia', 'High BP', 'Diabetes', 'Heart Disease'].map((condition) => (
                  <label key={condition} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.conditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      className="w-4 h-4 rounded border border-input"
                    />
                    <span className="text-foreground">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="lg:col-span-2 flex gap-4">
          <Link href="/mothers" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12 font-semibold bg-transparent"
              type="button"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1 h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-all"
          >
            Register Mother
          </Button>
        </div>
      </form>
    </div>
  );
}
