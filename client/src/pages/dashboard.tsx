import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, PillBottle, User } from "lucide-react";
import PatientProfileForm from "@/components/patient-profile-form";
import RecommendationsPanel from "@/components/recommendations-panel";
import PatientHistory from "@/components/patient-history";
import DrugSearch from "@/components/drug-search";
import { type Patient, type MedicationRecommendation, type SafetyAlert } from "@shared/schema";

export default function Dashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [recommendations, setRecommendations] = useState<MedicationRecommendation[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: recentConsultations } = useQuery({
    queryKey: ["/api/consultations/recent"],
  });

  const handlePatientCreated = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleGenerateRecommendations = async (patient: Patient) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patient.id,
          pharmacistName: "Dr. Sarah Chen",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setSafetyAlerts(data.safetyAlerts);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-medical-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-medical-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
                <PillBottle className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-medical-gray-900">PharmAssist</h1>
                <p className="text-sm text-medical-gray-500">Clinical Decision Support</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-medical-gray-500 hover:text-medical-gray-700 transition-colors">
                <Bell className="text-lg" />
                <span className="absolute -top-1 -right-1 bg-medical-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center">
                  <User className="text-white text-sm" />
                </div>
                <span className="text-sm font-medium text-medical-gray-700">Dr. Sarah Chen</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Profile Form */}
          <div className="lg:col-span-1">
            <PatientProfileForm
              onPatientCreated={handlePatientCreated}
              onGenerateRecommendations={handleGenerateRecommendations}
              isGenerating={isGenerating}
            />
          </div>

          {/* Recommendations Panel */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <RecommendationsPanel
                recommendations={recommendations}
                safetyAlerts={safetyAlerts}
                selectedPatient={selectedPatient}
              />
              <DrugSearch />
            </div>
          </div>
        </div>

        {/* Patient History */}
        <div className="mt-6">
          <PatientHistory consultations={recentConsultations || []} />
        </div>
      </div>
    </div>
  );
}
