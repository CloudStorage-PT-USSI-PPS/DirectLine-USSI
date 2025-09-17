'use client';

import { useState } from 'react';
import type { ChatCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StartConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, category: ChatCategory) => void;
}

export function StartConsultationModal({ isOpen, onClose, onSubmit }: StartConsultationModalProps) {
  const [category, setCategory] = useState<ChatCategory>('Sedang');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (description.trim()) {
      onSubmit(description, category);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Mulai Sesi Konsultasi</DialogTitle>
          <DialogDescription>
            Silakan pilih kategori dan jelaskan masalah Anda untuk memulai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Kategori Masalah</Label>
            <Select value={category} onValueChange={(value: ChatCategory) => setCategory(value)}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Kritis">Kritis</SelectItem>
                    <SelectItem value="Tinggi">Tinggi</SelectItem>
                    <SelectItem value="Sedang">Sedang</SelectItem>
                    <SelectItem value="Rendah">Rendah</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi Masalah</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan masalah yang Anda hadapi secara detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!description.trim()}>
            Mulai Konsultasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
