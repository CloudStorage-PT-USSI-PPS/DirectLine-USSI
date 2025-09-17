'use client';

import { useState } from 'react';
import { Paperclip, Send, Loader2, X } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { ChatCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => Promise<void>;
  category: ChatCategory;
  onCategoryChange: (category: ChatCategory) => void;
  isCategoryDisabled?: boolean;
}

type Inputs = {
  message: string;
};

export function MessageInput({ onSendMessage, category, onCategoryChange, isCategoryDisabled = false }: MessageInputProps) {
  const [isSending, setIsSending] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<Inputs>();
  const messageValue = watch('message');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.message.trim() && !attachedFile) return;

    setIsSending(true);
    await onSendMessage(data.message, attachedFile || undefined);
    setIsSending(false);
    reset({ message: '' });
    setAttachedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-t bg-background p-4 rounded-b-2xl">
      {attachedFile && (
          <div className="mb-2 flex items-center justify-between rounded-lg border p-2 text-sm">
            <div className="flex items-center gap-2 truncate">
              <Paperclip className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{attachedFile.name}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachedFile(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
      )}
      <div className="relative flex w-full items-start gap-4">
        <Textarea
          {...register('message')}
          placeholder="Ketik pesan Anda di sini..."
          className="min-h-0 flex-1 resize-none border-0 px-0 shadow-none focus-visible:ring-0"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
          disabled={isSending}
        />
        <div className="flex items-center gap-2">
           <Select value={category} onValueChange={(value: ChatCategory) => onCategoryChange(value)} disabled={isSending || isCategoryDisabled}>
            <SelectTrigger className="w-[120px] hidden sm:flex">
                <SelectValue placeholder="Kategori"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Kritis">Kritis</SelectItem>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Rendah">Rendah</SelectItem>
            </SelectContent>
          </Select>

          <Button type="button" variant="ghost" size="icon" className="relative" disabled={isSending}>
            <Paperclip className="h-5 w-5" />
            <Input type="file" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" onChange={handleFileChange}/>
          </Button>

          <Button type="submit" size="icon" disabled={isSending || (!messageValue && !attachedFile)}>
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
