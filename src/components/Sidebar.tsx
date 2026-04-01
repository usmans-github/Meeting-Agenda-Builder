import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import mammoth from 'mammoth';

interface FileData {
  base64?: string;
  mimeType?: string;
  text?: string;
}

interface SidebarProps {
  onFileProcessed: (data: FileData) => void;
  isProcessing: boolean;
  error: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ onFileProcessed, isProcessing, error }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          onFileProcessed({ text: result.value });
        } catch (err) {
          console.error("Mammoth error:", err);
          onFileProcessed({ text: "" }); // Fallback
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => {
        onFileProcessed({ text: reader.result as string });
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onFileProcessed({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    }
  });

  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Agenda Builder</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upload a document to generate a structured meeting agenda.
        </p>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
            isProcessing && "opacity-50 pointer-events-none"
          )}
        >
          <input {...getInputProps()} />
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? "Drop it here" : "Click or drag file"}
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX, TXT, or Images
            </p>
          </div>
        </div>

        {fileName && !isProcessing && (
          <Card className="mt-4 p-3 bg-background/50 border-primary/20 flex items-center gap-3">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium truncate flex-1">{fileName}</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </Card>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instructions</h3>
          <ul className="space-y-3">
            {[
              "Upload project briefs, meeting notes, or transcripts.",
              "Gemini extracts stakeholders and key topics.",
              "Review the timeline and adjust timings in chat.",
              "Export or share your finalized agenda."
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>

      <div className="p-6 mt-auto border-t bg-muted/10">
        <Button variant="outline" className="w-full justify-start gap-2 text-xs" onClick={() => window.location.reload()}>
          <Upload className="w-3 h-3" />
          New Session
        </Button>
      </div>
    </div>
  );
};
