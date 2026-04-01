import React from 'react';
import { motion } from 'motion/react';
import { User, Users, ShieldCheck, Mail, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Stakeholder } from '@/lib/gemini';

interface StakeholdersProps {
  stakeholders: Stakeholder[];
}

export const Stakeholders: React.FC<StakeholdersProps> = ({ stakeholders }) => {
  return (
    <div className="w-80 border-l bg-muted/10 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold tracking-tight">Stakeholders</h2>
        </div>

        <div className="space-y-4">
          {stakeholders.map((person, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group hover:border-primary/30 transition-all bg-background/50 backdrop-blur-sm shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="w-10 h-10 border-2 border-muted-foreground/10 group-hover:border-primary/20 transition-colors">
                    <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
                      {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {stakeholders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground">No stakeholders identified yet.</p>
          </div>
        )}
      </div>

      <div className="mt-auto p-6 border-t bg-muted/20">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Analysis Tip</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Roles are inferred from the document context. You can refine these in the chat.
          </p>
        </div>
      </div>
    </div>
  );
};
