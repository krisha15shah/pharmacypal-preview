import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertPatientSchema, type Patient, type InsertPatient } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const chronicConditionsOptions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Kidney Disease",
  "Liver Disease",
  "Asthma",
  "COPD",
  "Arthritis",
];

interface PatientProfileFormProps {
  onPatientCreated: (patient: Patient) => void;
  onGenerateRecommendations: (patient: Patient) => void;
  isGenerating: boolean;
}

export default function PatientProfileForm({
  onPatientCreated,
  onGenerateRecommendations,
  isGenerating,
}: PatientProfileFormProps) {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertPatient>({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 0,
      weight: 0,
      gender: "",
      symptoms: "",
      chronicConditions: [],
      allergies: "",
      currentMedications: "",
      isPregnant: false,
    },
  });

  const onSubmit = async (data: InsertPatient) => {
    try {
      const response = await apiRequest("POST", "/api/patients", data);
      const patient = await response.json();
      setCurrentPatient(patient);
      onPatientCreated(patient);
      toast({
        title: "Patient Profile Created",
        description: "Patient information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create patient profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateRecommendations = () => {
    if (currentPatient) {
      onGenerateRecommendations(currentPatient);
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-medical-gray-200">
      <CardHeader className="border-b border-medical-gray-200">
        <CardTitle className="text-lg font-semibold text-medical-gray-900 flex items-center">
          <UserPlus className="text-medical-blue mr-2" />
          Patient Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-medical-gray-700">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-medical-gray-700">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-medical-gray-700">Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="45"
                        className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-medical-gray-700">
                      Weight (kg)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="70"
                        className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-medical-gray-700">Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-medical-gray-700">
                    Primary Symptoms
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe current symptoms..."
                      className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chronicConditions"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-medical-gray-700 mb-2">
                    Chronic Conditions
                  </FormLabel>
                  <div className="space-y-2">
                    {chronicConditionsOptions.map((condition) => (
                      <FormField
                        key={condition}
                        control={form.control}
                        name="chronicConditions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={condition}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(condition)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, condition])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== condition)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm text-medical-gray-700">
                                {condition}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-medical-gray-700">
                    Known Allergies
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any known drug allergies..."
                      className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentMedications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-medical-gray-700">
                    Current Medications
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List current medications and dosages..."
                      className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPregnant"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm text-medical-gray-700">
                    Patient is pregnant or breastfeeding
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-medical-blue text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Save Patient Profile
            </Button>

            {currentPatient && (
              <Button
                type="button"
                onClick={handleGenerateRecommendations}
                disabled={isGenerating}
                className="w-full bg-medical-blue text-white hover:bg-blue-700 transition-colors font-medium"
              >
                <Search className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Recommendations"}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
