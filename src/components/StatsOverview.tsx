import { Users, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsOverviewProps {
  total: number;
  upcoming: number;
  overdue: number;
  onCardClick: (type: 'total' | 'upcoming' | 'overdue') => void;
}

export const StatsOverview = ({ total, upcoming, overdue, onCardClick }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card 
        className="shadow-card border-border/50 bg-gradient-soft cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onCardClick('total')}
      >
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total de Pacientes</p>
              <p className="text-3xl font-bold text-foreground">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="shadow-card border-border/50 bg-gradient-soft cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onCardClick('upcoming')}
      >
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-warning/20">
              <Calendar className="h-6 w-6 text-warning-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Consultas Próximas</p>
              <p className="text-3xl font-bold text-warning-foreground">{upcoming}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="shadow-card border-border/50 bg-gradient-soft cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onCardClick('overdue')}
      >
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Consultas Atrasadas</p>
              <p className="text-3xl font-bold text-destructive">{overdue}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
