'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Mail, 
  Globe, 
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  X
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { REPORT_TEMPLATES, EXPORT_FORMAT_INFO } from '@/lib/reports-mock';
import { toast } from 'sonner';

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated: (schedule: any) => void;
  initialTemplateId?: string;
}

export function ScheduleReportModal({ 
  isOpen, 
  onClose, 
  onScheduleCreated,
  initialTemplateId 
}: ScheduleReportModalProps) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState(initialTemplateId || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [format, setFormat] = useState('pdf');
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const handleAddEmail = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && emailInput.trim()) {
      if (!emails.includes(emailInput.trim())) {
        setEmails([...emails, emailInput.trim()]);
      }
      setEmailInput('');
      e.preventDefault();
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleCreate = () => {
    if (!name || !templateId || emails.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSchedule = {
      id: `sch-${Math.random().toString(36).substr(2, 9)}`,
      name,
      templateId,
      format,
      frequency,
      deliveryEmails: emails,
      nextRunAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      isActive: true,
      runCount: 0
    };

    onScheduleCreated(newSchedule);
    toast.success('Report scheduled successfully');
    onClose();
    
    // Reset form
    setName('');
    setTemplateId('');
    setEmails([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Report</DialogTitle>
          <DialogDescription>
            Configure an automated report to be delivered to your team.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Schedule Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Weekly Performance Audit" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Report Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TEMPLATES.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      <t.icon className={`h-4 w-4 ${t.iconColor}`} />
                      <span>{t.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Frequency</Label>
            <Tabs 
              defaultValue="weekly" 
              onValueChange={(v) => setFrequency(v as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Export Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPORT_FORMAT_INFO).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Time (UTC)</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input type="time" defaultValue="09:00" className="flex-1" />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Email Recipients</Label>
            <div className="flex flex-wrap gap-2 p-2 bg-background border border-input rounded-md min-h-[42px]">
              {emails.map(email => (
                <span key={email} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {email}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-primary/80" 
                    onClick={() => removeEmail(email)}
                  />
                </span>
              ))}
              <input 
                className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px]"
                placeholder={emails.length === 0 ? "Enter email addresses..." : ""}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleAddEmail}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Press Enter to add multiple emails.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} className="gap-2">
            <Calendar className="h-4 w-4" />
            Create Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
