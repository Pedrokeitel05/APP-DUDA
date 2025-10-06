import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, UserPlus, Plus, X, Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Reminder } from "@/types/patient";

interface PatientFormProps {
  onAddPatient: (name: string, date: Date, reminders: Reminder[]) => void;
}

export const PatientForm = ({ onAddPatient }: PatientFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: crypto.randomUUID(), daysInAdvance: 20 }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      onAddPatient(name, date, reminders);
      setName("");
      setDate(undefined);
      setReminders([{ id: crypto.randomUUID(), daysInAdvance: 20 }]);
    }
  };

  const addReminder = () => {
    setReminders([...reminders, { id: crypto.randomUUID(), daysInAdvance: 10 }]);
  };

  const removeReminder = (id: string) => {
    if (reminders.length > 1) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  const updateReminder = (id: string, days: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, daysInAdvance: days } : r));
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <UserPlus className="h-5 w-5 text-primary" />
          Cadastrar Novo Paciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nome do Paciente</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
              required
              className="border-border bg-card"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Data da Próxima Consulta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-border bg-card",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Lembretes
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addReminder}
                className="h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {reminders.map((reminder, index) => (
                <div key={reminder.id} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={reminder.daysInAdvance}
                    onChange={(e) => updateReminder(reminder.id, parseInt(e.target.value) || 1)}
                    className="border-border bg-card"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">dias antes</span>
                  {reminders.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReminder(reminder.id)}
                      className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!name || !date}>
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Paciente
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
