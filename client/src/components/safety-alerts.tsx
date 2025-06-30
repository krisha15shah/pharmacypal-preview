import { AlertTriangle, AlertCircle, Shield, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SafetyAlert } from "@shared/schema";

interface SafetyAlertsProps {
  alerts: SafetyAlert[];
}

export default function SafetyAlerts({ alerts }: SafetyAlertsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "interaction":
        return <AlertCircle className="text-medical-red mr-3 mt-0.5" />;
      case "allergy":
        return <AlertTriangle className="text-medical-amber mr-3 mt-0.5" />;
      case "contraindication":
        return <Shield className="text-medical-red mr-3 mt-0.5" />;
      case "dosage":
        return <Pill className="text-medical-amber mr-3 mt-0.5" />;
      default:
        return <AlertTriangle className="text-medical-amber mr-3 mt-0.5" />;
    }
  };

  const getAlertStyle = (level: string) => {
    switch (level) {
      case "high":
        return "bg-medical-red/10 border-medical-red/20";
      case "medium":
        return "bg-medical-amber/10 border-medical-amber/20";
      case "low":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-medical-gray-50 border-medical-gray-200";
    }
  };

  const getAlertTitle = (level: string, type: string) => {
    switch (level) {
      case "high":
        return "High Risk " + (type === "interaction" ? "Interaction" : "Alert");
      case "medium":
        return type === "allergy" ? "Allergy Alert" : "Caution Required";
      case "low":
        return "Advisory";
      default:
        return "Alert";
    }
  };

  const getAlertTitleColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-medical-red";
      case "medium":
        return "text-medical-amber";
      case "low":
        return "text-blue-600";
      default:
        return "text-medical-gray-700";
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="bg-white shadow-sm border border-medical-gray-200">
        <CardHeader className="border-b border-medical-gray-200">
          <CardTitle className="text-lg font-semibold text-medical-gray-900 flex items-center">
            <AlertTriangle className="text-medical-amber mr-2" />
            Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-medical-gray-500">
            No safety alerts. All recommended medications appear safe for this patient.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-medical-gray-200">
      <CardHeader className="border-b border-medical-gray-200">
        <CardTitle className="text-lg font-semibold text-medical-gray-900 flex items-center">
          <AlertTriangle className="text-medical-amber mr-2" />
          Safety Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getAlertStyle(alert.level)}`}
          >
            <div className="flex items-start">
              {getAlertIcon(alert.type)}
              <div>
                <h4 className={`font-medium ${getAlertTitleColor(alert.level)}`}>
                  {getAlertTitle(alert.level, alert.type)}
                </h4>
                <p className="text-sm text-medical-gray-700 mt-1">{alert.message}</p>
                {alert.medication && (
                  <p className="text-xs text-medical-gray-500 mt-1">
                    Related to: {alert.medication}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
