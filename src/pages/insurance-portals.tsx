import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Shield, Building } from "lucide-react";

interface Portal {
  name: string;
  shortName: string;
  description: string;
  url: string;
}

const UAE_INSURANCE_PORTALS: Portal[] = [
  {
    name: "Daman - National Health Insurance Company",
    shortName: "Daman",
    description: "UAE-based health insurer serving Abu Dhabi and Dubai residents.",
    url: "",
  },
  {
    name: "ADNIC - Abu Dhabi National Insurance Company",
    shortName: "ADNIC",
    description: "One of the largest insurance groups in the UAE.",
    url: "",
  },
  {
    name: "Sukoon (formerly Oman Insurance)",
    shortName: "Sukoon",
    description: "Major UAE health and general insurance provider.",
    url: "",
  },
  {
    name: "Tawuniya",
    shortName: "Tawuniya",
    description: "Saudi Arabian insurer with UAE operations.",
    url: "",
  },
  {
    name: "Bupa Arabia",
    shortName: "Bupa",
    description: "International health insurance provider active in the UAE.",
    url: "",
  },
  {
    name: "Saada",
    shortName: "Saada",
    description: "Abu Dhabi government health insurance program for UAE nationals.",
    url: "",
  },
  {
    name: "MaxCare",
    shortName: "MaxCare",
    description: "Third-party administrator and health benefits manager.",
    url: "",
  },
  {
    name: "Neuron",
    shortName: "Neuron",
    description: "Health insurance claims and provider management platform.",
    url: "",
  },
  {
    name: "Mubadala Health",
    shortName: "Mubadala Health",
    description: "Healthcare network with linked insurance and patient services.",
    url: "",
  },
];

export default function InsurancePortals() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0B3D91] text-white shadow-md shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">Insurance Portals</div>
              <div className="text-xs text-blue-200">UAE provider links</div>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-slate-800">UAE Insurance Portals</h1>
            <p className="text-sm text-slate-500 mt-1">
              Quick links to major UAE insurance provider portals. Add URLs when ready.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {UAE_INSURANCE_PORTALS.map((portal) => (
              <Card key={portal.shortName} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0B3D91]/10 flex items-center justify-center">
                      <Building className="w-4 h-4 text-[#0B3D91]" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-800">{portal.shortName}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-slate-600 mb-4 min-h-[2.5rem]">{portal.description}</p>
                  <a
                    href={portal.url || "#"}
                    target={portal.url ? "_blank" : undefined}
                    rel={portal.url ? "noopener noreferrer" : undefined}
                    className="inline-flex w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[#0B3D91] border-[#0B3D91]/30 hover:bg-[#0B3D91]/5"
                      disabled={!portal.url}
                    >
                      Go to portal
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add placeholder card */}
          <Card className="mt-6 border-dashed border-slate-300 bg-slate-50/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Need more provider portals? Add links here as they become available.
              </div>
              <Button variant="ghost" size="sm" className="text-slate-500" disabled>
                + Add portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
