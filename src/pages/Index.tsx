import { useState, useEffect } from "react";
import { StatsOverview } from "@/components/StatsOverview";
import { PatientForm } from "@/components/PatientForm";
import { PatientList } from "@/components/PatientList";
import { PatientListModal } from "@/components/PatientListModal";
import { storage } from "@/lib/storage";
import { Patient, Reminder } from "@/types/patient";
import { toast } from "@/hooks/use-toast";
import { differenceInDays } from "date-fns";
import { Stethoscope } from "lucide-react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [modalType, setModalType] = useState<
    "total" | "upcoming" | "overdue" | null
  >(null);

  useEffect(() => {
    // Pede permissão para notificações na primeira vez que o app abre
    const setupNotifications = async () => {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
    };
    setupNotifications();

    const loadedPatients = storage.getPatients();
    setPatients(loadedPatients);
  }, []);

  useEffect(() => {
    const checkAppointments = () => {
      const today = new Date();
      patients.forEach((patient) => {
        const daysUntil = differenceInDays(patient.appointmentDate, today);

        patient.reminders.forEach((reminder) => {
          if (daysUntil === reminder.daysInAdvance) {
            // Nova notificação nativa com som
            sendNotification({
              title: "Lembrete de Consulta",
              body: `Consulta de ${patient.name} em ${reminder.daysInAdvance} dias.`,
              sound: "default",
            });
          }
        });
      });
    };

    // Roda a verificação uma vez ao carregar
    checkAppointments();
    // E depois a cada 24 horas
    const interval = setInterval(checkAppointments, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [patients]);

  const addPatient = (
    name: string,
    appointmentDate: Date,
    reminders: Reminder[],
  ) => {
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      name,
      appointmentDate,
      createdAt: new Date(),
      reminders,
    };

    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    storage.savePatients(updatedPatients);

    toast({
      title: "Paciente cadastrado!",
      description: `${name} foi adicionado com sucesso.`,
      className: "bg-success text-success-foreground",
    });
  };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter((p) => p.id !== id);
    setPatients(updatedPatients);
    storage.savePatients(updatedPatients);

    toast({
      title: "Paciente removido",
      description: "O paciente foi removido da lista.",
    });
  };

  const getUpcomingCount = () => {
    const today = new Date();
    return patients.filter((p) => {
      const days = differenceInDays(p.appointmentDate, today);
      const maxDaysInAdvance = Math.max(
        ...p.reminders.map((r) => r.daysInAdvance),
      );
      return days >= 0 && days <= maxDaysInAdvance;
    }).length;
  };

  const getUpcomingPatients = () => {
    const today = new Date();
    return patients.filter((p) => {
      const days = differenceInDays(p.appointmentDate, today);
      const maxDaysInAdvance = Math.max(
        ...p.reminders.map((r) => r.daysInAdvance),
      );
      return days >= 0 && days <= maxDaysInAdvance;
    });
  };

  const getOverdueCount = () => {
    const today = new Date();
    return patients.filter(
      (p) => differenceInDays(p.appointmentDate, today) < 0,
    ).length;
  };

  const getOverduePatients = () => {
    const today = new Date();
    return patients.filter(
      (p) => differenceInDays(p.appointmentDate, today) < 0,
    );
  };

  const handleCardClick = (type: "total" | "upcoming" | "overdue") => {
    setModalType(type);
  };

  const getModalPatients = () => {
    switch (modalType) {
      case "total":
        return patients;
      case "upcoming":
        return getUpcomingPatients();
      case "overdue":
        return getOverduePatients();
      default:
        return [];
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "total":
        return "Todos os Pacientes";
      case "upcoming":
        return "Consultas Próximas";
      case "overdue":
        return "Consultas Atrasadas";
      default:
        return "";
    }
  };

  const getDaysInAdvance = () => {
    if (patients.length === 0) return 20;
    const allReminders = patients.flatMap((p) => p.reminders);
    return Math.max(...allReminders.map((r) => r.daysInAdvance));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Controle de Consultas
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Sistema de gerenciamento de pacientes e agendamentos
          </p>
        </header>

        <StatsOverview
          total={patients.length}
          upcoming={getUpcomingCount()}
          overdue={getOverdueCount()}
          onCardClick={handleCardClick}
        />

        <div className="mb-6">
          <PatientForm onAddPatient={addPatient} />
        </div>

        <PatientList
          patients={patients}
          daysInAdvance={getDaysInAdvance()}
          onDeletePatient={deletePatient}
        />

        <PatientListModal
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
          patients={getModalPatients()}
          title={getModalTitle()}
        />
      </div>
    </div>
  );
};

export default Index;