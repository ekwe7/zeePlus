import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useAuthStore } from "@/store/authStore";

export function DoctorDashboard() {
  const { id: doctorId } = useAuthStore();
  const appointments = useAppointmentStore((state) => state.appointments);
  const myAppointments = appointments.filter((a) => a.doctorId === doctorId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Console"
        subtitle="Today's overview of your patients and schedule."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned patients" value={myAppointments.length} />
        <StatCard
          label="Consultations today"
          value={myAppointments.filter((a) => a.status === "CONFIRMED").length}
        />
        <StatCard
          label="Completed visits"
          value={myAppointments.filter((a) => a.status === "COMPLETED").length}
        />
      </div>
    </div>
  );
}
