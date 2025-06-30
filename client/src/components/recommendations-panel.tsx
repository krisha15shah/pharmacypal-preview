import { AlertTriangle, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SafetyAlerts from "@/components/safety-alerts";
import { type MedicationRecommendation, type SafetyAlert, type Patient } from "@shared/schema";

interface RecommendationsPanelProps {
  recommendations: MedicationRecommendation[];
  safetyAlerts: SafetyAlert[];
  selectedPatient: Patient | null;
}

export default function RecommendationsPanel({
  recommendations,
  safetyAlerts,
  selectedPatient,
}: RecommendationsPanelProps) {
  const getSafetyBadge = (level: string) => {
    switch (level) {
      case "safe":
        return <Badge className="bg-medical-green/10 text-medical-green hover:bg-medical-green/20">Safe</Badge>;
      case "caution":
        return <Badge className="bg-medical-amber/10 text-medical-amber hover:bg-medical-amber/20">Caution</Badge>;
      case "avoid":
        return <Badge className="bg-medical-red/10 text-medical-red hover:bg-medical-red/20">Avoid</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (!selectedPatient) {
    return (
      <div className="space-y-6">
        <Card className="bg-white shadow-sm border border-medical-gray-200">
          <CardContent className="p-6">
            <div className="text-center text-medical-gray-500">
              Create a patient profile and generate recommendations to see results here.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Safety Alerts */}
      <SafetyAlerts alerts={safetyAlerts} />

      {/* Medication Recommendations */}
      <Card className="bg-white shadow-sm border border-medical-gray-200">
        <CardHeader className="border-b border-medical-gray-200">
          <CardTitle className="text-lg font-semibold text-medical-gray-900 flex items-center">
            <Pill className="text-medical-blue mr-2" />
            Recommended Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {recommendations.length === 0 ? (
            <div className="text-center text-medical-gray-500">
              No recommendations available. Generate new recommendations based on patient profile.
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border border-medical-gray-200 rounded-lg p-4 hover:bg-medical-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-medical-gray-900">
                        {rec.medication.name}
                      </h3>
                      <p className="text-sm text-medical-gray-600">
                        {rec.medication.indications?.join(", ")}
                      </p>
                    </div>
                    {getSafetyBadge(rec.safetyLevel)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-medical-gray-700">Dosage:</span>
                      <p className="text-medical-gray-600">{rec.dosage}</p>
                    </div>
                    <div>
                      <span className="font-medium text-medical-gray-700">Max Daily:</span>
                      <p className="text-medical-gray-600">{rec.medication.maxDailyDose}</p>
                    </div>
                    <div>
                      <span className="font-medium text-medical-gray-700">Duration:</span>
                      <p className="text-medical-gray-600">{rec.duration}</p>
                    </div>
                  </div>
                  
                  {rec.instructions && (
                    <div className="mt-3 text-sm">
                      <span className="font-medium text-medical-gray-700">Instructions:</span>
                      <p className="text-medical-gray-600">{rec.instructions}</p>
                    </div>
                  )}
                  
                  {rec.clinicalNote && (
                    <div className="mt-3 p-3 bg-medical-blue/5 rounded-lg">
                      <p className="text-sm text-medical-gray-700">
                        <span className="font-medium">Clinical Note:</span> {rec.clinicalNote}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
