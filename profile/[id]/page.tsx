'use client';

import React, { useState } from 'react';
import { useData, type Mother } from '@/app/data-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';

export default function ProfilePage() {
  const { id } = useParams();
  const { getMother, updateMother } = useData();
  const router = useRouter();
  const mother = getMother(id as string);

  const [formData, setFormData] = useState(mother || {});
  const [editing, setEditing] = useState(false);

  if (!mother) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Mother not found</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFatigueChange = (key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      fatigue: { ...prev.fatigue, [key]: !prev.fatigue[key] },
    }));
  };

  const handleSave = () => {
    updateMother(mother.id, formData);
    setEditing(false);
  };

  const getFatigueRisk = (): 'green' | 'yellow' | 'red' => {
    const count = [formData.fatigue?.heavyWork, formData.fatigue?.lessRest, formData.fatigue?.weakness].filter(Boolean).length;
    if (count === 0) return 'green';
    if (count === 1) return 'yellow';
    return 'red';
  };

  const fatigueRisk = getFatigueRisk();
  const fatigueColors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{formData.name}</h1>
            <p className="text-muted-foreground">Age {formData.age} • {formData.village}</p>
          </div>
        </div>
        <Button onClick={() => (editing ? handleSave() : setEditing(true))} className="gap-2">
          {editing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            'Edit Profile'
          )}
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                {editing ? (
                  <Input name="name" value={formData.name} onChange={handleInputChange} />
                ) : (
                  <p className="text-foreground font-medium">{formData.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Age</label>
                  {editing ? (
                    <Input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                  ) : (
                    <p className="text-foreground font-medium">{formData.age} years</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                  {editing ? (
                    <Input name="phone" value={formData.phone} onChange={handleInputChange} />
                  ) : (
                    <p className="text-foreground font-medium">{formData.phone || 'N/A'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Village</label>
                {editing ? (
                  <Input name="village" value={formData.village} onChange={handleInputChange} />
                ) : (
                  <p className="text-foreground font-medium">{formData.village}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Husband/Guardian</label>
                {editing ? (
                  <Input name="husband" value={formData.husband} onChange={handleInputChange} />
                ) : (
                  <p className="text-foreground font-medium">{formData.husband || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Current Visit Assessment */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Current Visit Assessment</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Blood Pressure</label>
                  {editing ? (
                    <Input name="bp" value={formData.bp} onChange={handleInputChange} placeholder="120/80" />
                  ) : (
                    <p className="text-foreground font-medium">{formData.bp}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Weight (kg)</label>
                  {editing ? (
                    <Input type="number" name="weight" value={formData.weight} onChange={handleInputChange} />
                  ) : (
                    <p className="text-foreground font-medium">{formData.weight} kg</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                {editing ? (
                  <>
                    <label className="flex items-center gap-3">
                      <Checkbox checked={formData.swelling} onChange={() => handleCheckboxChange('swelling')} />
                      <span className="text-sm text-foreground">Swelling</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <Checkbox checked={formData.bleeding} onChange={() => handleCheckboxChange('bleeding')} />
                      <span className="text-sm text-foreground">Bleeding</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <Checkbox checked={formData.headache} onChange={() => handleCheckboxChange('headache')} />
                      <span className="text-sm text-foreground">Severe Headache</span>
                    </label>
                  </>
                ) : (
                  <>
                    <p className="text-sm">
                      <span className="font-medium">Swelling:</span> {formData.swelling ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Bleeding:</span> {formData.bleeding ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Severe Headache:</span> {formData.headache ? 'Yes' : 'No'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pregnancy Details */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Pregnancy Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Pregnancy Month</label>
                {editing ? (
                  <Input type="number" name="pregnancyMonth" value={formData.pregnancyMonth} onChange={handleInputChange} min="1" max="9" />
                ) : (
                  <p className="text-foreground font-medium">Month {formData.pregnancyMonth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">LMP Date</label>
                {editing ? (
                  <Input type="date" name="lmpDate" value={formData.lmpDate} onChange={handleInputChange} />
                ) : (
                  <p className="text-foreground font-medium">{formData.lmpDate || 'Not recorded'}</p>
                )}
              </div>

              <div className="border-t border-border pt-4">
                {editing ? (
                  <label className="flex items-center gap-3">
                    <Checkbox checked={formData.highRisk} onChange={() => handleCheckboxChange('highRisk')} />
                    <span className="text-sm font-medium text-foreground">High Risk Pregnancy</span>
                  </label>
                ) : (
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${formData.highRisk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {formData.highRisk ? 'High Risk' : 'Low Risk'}
                  </div>
                )}
              </div>

              {formData.conditions && formData.conditions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Medical Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.conditions.map((condition: string) => (
                      <span key={condition} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fatigue Risk */}
          <div className={`rounded-lg border p-6 shadow-sm ${fatigueRisk === 'red' ? 'bg-red-50 border-red-200' : fatigueRisk === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Fatigue Risk Assessment</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fatigueColors[fatigueRisk]}`}>
                {fatigueRisk.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              {editing ? (
                <>
                  <label className="flex items-center gap-3">
                    <Checkbox checked={formData.fatigue?.heavyWork} onChange={() => handleFatigueChange('heavyWork')} />
                    <span className="text-sm text-foreground">Heavy work today?</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <Checkbox checked={formData.fatigue?.lessRest} onChange={() => handleFatigueChange('lessRest')} />
                    <span className="text-sm text-foreground">Rest less than 6 hours?</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <Checkbox checked={formData.fatigue?.weakness} onChange={() => handleFatigueChange('weakness')} />
                    <span className="text-sm text-foreground">Weakness or dizziness?</span>
                  </label>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    <span className="font-medium">Heavy work:</span> {formData.fatigue?.heavyWork ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Rest &lt; 6 hrs:</span> {formData.fatigue?.lessRest ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Weakness:</span> {formData.fatigue?.weakness ? 'Yes' : 'No'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pregnancy Timeline */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Pregnancy Timeline</h2>
        <div className="space-y-3">
          {[
            { key: 'anc1', label: 'ANC Visit 1' },
            { key: 'anc2', label: 'ANC Visit 2' },
            { key: 'ttInjection', label: 'TT Injection' },
            { key: 'ironTablets', label: 'Iron Tablets' },
            { key: 'ultrasound', label: 'Ultrasound' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-foreground font-medium">{label}</span>
              {editing ? (
                <div className="flex gap-2">
                  {['done', 'due', 'overdue'].map((status) => (
                    <Button
                      key={status}
                      variant={formData.timeline?.[key] === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          timeline: { ...prev.timeline, [key]: status },
                        }))
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    formData.timeline?.[key] === 'done'
                      ? 'bg-green-100 text-green-800'
                      : formData.timeline?.[key] === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {formData.timeline?.[key]?.toUpperCase() || 'DUE'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Information */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Follow-up Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Next Follow-up Date</label>
            {editing ? (
              <Input type="date" name="nextFollowUp" value={formData.nextFollowUp} onChange={handleInputChange} />
            ) : (
              <p className="text-foreground font-medium">{formData.nextFollowUp}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
            {editing ? (
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                rows={3}
              />
            ) : (
              <p className="text-foreground">{formData.notes || 'No notes'}</p>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
