import { History, User, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConsultationWithPatient {
  id: number;
  patientId: number | null;
  pharmacistName: string;
  recommendations: any;
  safetyAlerts: any;
  status: string | null;
  createdAt: Date | null;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    symptoms: string | null;
  } | null;
}

interface PatientHistoryProps {
  consultations: ConsultationWithPatient[];
}

export default function PatientHistory({ consultations }: PatientHistoryProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    const now = new Date();
    const consultationDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - consultationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Today, ${consultationDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (diffDays === 2) {
      return `Yesterday, ${consultationDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      return consultationDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-medical-green/10 text-medical-green">Completed</Badge>;
      case "follow-up":
        return <Badge className="bg-medical-amber/10 text-medical-amber">Follow-up</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRecommendationSummary = (recommendations: any) => {
    if (!recommendations || !Array.isArray(recommendations)) return "No recommendations";
    if (recommendations.length === 0) return "No recommendations";
    if (recommendations.length === 1) return recommendations[0].medication?.name || "Unknown medication";
    return `${recommendations[0].medication?.name || "Unknown"} + ${recommendations.length - 1} more`;
  };

  return (
    <Card className="bg-white shadow-sm border border-medical-gray-200">
      <CardHeader className="border-b border-medical-gray-200">
        <CardTitle className="text-lg font-semibold text-medical-gray-900 flex items-center">
          <History className="text-medical-blue mr-2" />
          Recent Patient Consultations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {consultations.length === 0 ? (
          <div className="text-center text-medical-gray-500 py-8">
            No recent consultations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-medical-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-medical-gray-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-medical-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-medical-gray-700">Condition</th>
                  <th className="text-left py-3 px-4 font-medium text-medical-gray-700">Recommendation</th>
                  <th className="text-left py-3 px-4 font-medium text-medical-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-medical-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((consultation) => (
                  <tr key={consultation.id} className="border-b border-medical-gray-100 hover:bg-medical-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-medical-blue/10 rounded-full flex items-center justify-center mr-3">
                          <User className="text-medical-blue text-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-medical-gray-900">
                            {consultation.patient 
                              ? `${consultation.patient.firstName} ${consultation.patient.lastName}`
                              : "Unknown Patient"
                            }
                          </p>
                          <p className="text-sm text-medical-gray-500">
                            {consultation.patient ? `${consultation.patient.age} years old` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-medical-gray-600">
                      {formatDate(consultation.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-medical-gray-600">
                      {consultation.patient?.symptoms || "Not specified"}
                    </td>
                    <td className="py-3 px-4 text-sm text-medical-gray-600">
                      {getRecommendationSummary(consultation.recommendations)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(consultation.status)}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-medical-blue hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
