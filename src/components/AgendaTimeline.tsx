import React from 'react';
import { motion } from 'motion/react';
import { Clock, User, MessageSquare, ChevronRight, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AgendaItem, MeetingAgenda } from '@/lib/gemini';
import { cn } from '@/lib/utils';

interface AgendaTimelineProps {
  agenda: MeetingAgenda;
}

export const AgendaTimeline: React.FC<AgendaTimelineProps> = ({ agenda }) => {
  let currentTime = 0;

  return (
    <div className="flex flex-col h-full gap-8 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
            Meeting Agenda
          </Badge>
          <div className="h-px flex-1 bg-muted" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{agenda.title}</h1>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-muted-foreground/10">
          <Target className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Primary Goal</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{agenda.goal}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4">
          <div className="relative pl-8 space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

            {agenda.agenda.map((item, index) => {
              const start = currentTime;
              currentTime += item.duration;
              const end = currentTime;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[25px] top-2 w-5 h-5 rounded-full border-4 border-background bg-primary shadow-sm z-10 group-hover:scale-125 transition-transform" />

                  <Card className="overflow-hidden border-muted-foreground/10 hover:border-primary/30 transition-all hover:shadow-md bg-background/50 backdrop-blur-sm">
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{start}m - {end}m</span>
                          <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0 h-5 bg-muted/50">
                            {item.duration} min
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-primary" />
                          <span className="text-xs font-semibold text-foreground">{item.owner}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
