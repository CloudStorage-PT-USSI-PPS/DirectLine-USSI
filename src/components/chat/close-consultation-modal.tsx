
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';

interface CloseConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function CloseConsultationModal({ isOpen, onClose, onSubmit }: CloseConsultationModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason(''); // Reset state
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anda yakin ingin menutup sesi ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Menutup sesi secara sepihak dapat mempengaruhi penilaian kepuasan klien. Pastikan semua masalah telah terselesaikan atau berikan alasan yang jelas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2 py-4">
            <Label htmlFor="reason">Alasan Penutupan</Label>
            <Textarea
                id="reason"
                placeholder="Contoh: Masalah telah terselesaikan dengan baik."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason('')}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={!reason.trim()}>
            Ya, Tutup Sesi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
