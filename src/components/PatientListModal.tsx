import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Patient } from "@/types/patient";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User } from "lucide-react";

interface PatientListModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  title: string;
}

export const PatientListModal = ({ isOpen, onClose, patients, title }: PatientListModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {title}
            <span className="text-primary">({patients.length})</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {patients.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhum paciente nesta categoria</p>
            </div>
          ) : (
            patients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 rounded-xl border-2 border-border/50 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {patient.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(patient.appointmentDate, "PPP", { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
