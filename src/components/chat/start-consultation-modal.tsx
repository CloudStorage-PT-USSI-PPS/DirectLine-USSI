'use client';

import { useState, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { Paperclip, X } from 'lucide-react';

interface StartConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, category: ChatCategory, file?: File) => void;
}

export function StartConsultationModal({ isOpen, onClose, onSubmit }: StartConsultationModalProps) {
  const [category, setCategory] = useState<ChatCategory>('Sedang');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (description.trim()) {
      onSubmit(description, category, file || undefined);
      // Reset state after submit
      setDescription('');
      setCategory('Sedang');
      setFile(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setDescription('');
    setCategory('Sedang');
    setFile(null);
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
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
           <div className="grid gap-2">
             <Label>Lampiran (Opsional)</Label>
             {file ? (
                <div className="flex items-center justify-between rounded-lg border p-2 text-sm">
                    <div className="flex items-center gap-2 truncate">
                    <Paperclip className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                    </Button>
                </div>
             ) : (
                <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Pilih File
                </Button>
             )}
            <Input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
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
