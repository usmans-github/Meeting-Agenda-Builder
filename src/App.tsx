/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AgendaTimeline } from '@/components/AgendaTimeline';
import { Stakeholders } from '@/components/Stakeholders';
import { Chat } from '@/components/Chat';
import { MeetingAgenda, generateAgenda } from '@/lib/gemini';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { FileText, Sparkles, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [agenda, setAgenda] = useState<MeetingAgenda | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcessed = async (data: { base64?: string; mimeType?: string; text?: string }) => {
    setIsProcessing(true);
    setError(null);
    toast.info("Analyzing document...", {
      description: "Gemini is extracting agenda items and stakeholders.",
    });

    try {
      const result = await generateAgenda(data);
      setAgenda(result);
      toast.success("Agenda generated!", {
        description: "You can now review and refine it in the chat.",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to process document. Please try again.");
      toast.error("Processing failed", {
        description: "Make sure the file is readable and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar 
        onFileProcessed={handleFileProcessed} 
        isProcessing={isProcessing} 
        error={error} 
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!agenda ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse" />
                <FileText className="w-10 h-10 text-primary relative z-10" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to build your agenda?</h2>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Upload a project brief, transcript, or notes. Our AI will transform it into a structured, time-boxed meeting plan.
              </p>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
                {[
                  { icon: Layout, title: "Timeline View", desc: "Visual sequence of topics" },
                  { icon: Sparkles, title: "AI Analysis", desc: "Inferred roles & goals" },
                  { icon: FileText, title: "Multiple Formats", desc: "PDF, DOCX, TXT, Images" }
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-2xl border bg-muted/30 space-y-2 text-left">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex overflow-hidden"
            >
              <div className="flex-1 overflow-hidden">
                <AgendaTimeline agenda={agenda} />
              </div>
              <Stakeholders stakeholders={agenda.stakeholders} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Chat agenda={agenda} />
      </main>

      <Toaster position="top-center" />
    </div>
  );
}

