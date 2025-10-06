import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Clock } from "lucide-react";
import { Patient } from "@/types/patient";
import { cn } from "@/lib/utils";

interface PatientListProps {
  patients: Patient[];
  daysInAdvance: number;
  onDeletePatient: (id: string) => void;
}

export const PatientList = ({ patients, daysInAdvance, onDeletePatient }: PatientListProps) => {
  const getDaysRemaining = (date: Date) => {
    return differenceInDays(date, new Date());
  };

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining < 0) return "bg-destructive/10 border-destructive/30";
    if (daysRemaining <= daysInAdvance) return "bg-warning/20 border-warning/40";
    return "bg-card border-border/50";
  };

  const getStatusText = (daysRemaining: number) => {
    if (daysRemaining < 0) return "text-destructive";
    if (daysRemaining <= daysInAdvance) return "text-warning-foreground";
    return "text-foreground";
  };

  const sortedPatients = [...patients].sort((a, b) => 
    a.appointmentDate.getTime() - b.appointmentDate.getTime()
  );

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Pacientes Cadastrados ({patients.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhum paciente cadastrado ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPatients.map((patient) => {
              const daysRemaining = getDaysRemaining(patient.appointmentDate);
              return (
                <div
                  key={patient.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all hover:shadow-md",
                    getStatusColor(daysRemaining)
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("font-semibold text-lg mb-2", getStatusText(daysRemaining))}>
                        {patient.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(patient.appointmentDate, "PPP", { locale: ptBR })}</span>
                        </div>
                        <div className={cn("flex items-center gap-2 font-medium", getStatusText(daysRemaining))}>
                          <Clock className="h-4 w-4" />
                          <span>
                            {daysRemaining < 0
                              ? `${Math.abs(daysRemaining)} dias atrasado`
                              : daysRemaining === 0
                              ? "Hoje!"
                              : `${daysRemaining} dias restantes`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeletePatient(patient.id)}
                      className="hover:bg-destructive/10 hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
