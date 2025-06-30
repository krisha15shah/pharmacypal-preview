import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Medication } from "@shared/schema";

export default function DrugSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/medications/search", { q: searchTerm }],
    enabled: !!searchTerm,
  });

  const handleSearch = () => {
    setSearchTerm(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const recentSearches = ["Ibuprofen", "Loratadine", "Omeprazole"];

  return (
    <Card className="bg-white shadow-sm border border-medical-gray-200">
      <CardHeader className="border-b border-medical-gray-200">
        <CardTitle className="text-lg font-semibold text-medical-gray-900 flex items-center">
          <Search className="text-medical-blue mr-2" />
          Drug Database Search
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by drug name, condition, or ingredient..."
              className="border-medical-gray-300 focus:ring-medical-blue focus:border-transparent"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-2 bg-medical-blue text-white hover:bg-blue-700 transition-colors"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {!searchTerm && (
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setSearchTerm(term);
                }}
                className="bg-medical-gray-100 text-medical-gray-700 px-3 py-1 rounded-full text-sm hover:bg-medical-gray-200 transition-colors"
              >
                Recent: {term}
              </button>
            ))}
          </div>
        )}

        {searchTerm && (
          <div className="mt-4">
            {isLoading ? (
              <div className="text-center text-medical-gray-500">Searching...</div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-medium text-medical-gray-900">
                  Search Results for "{searchTerm}"
                </h3>
                {searchResults.map((med: Medication) => (
                  <div
                    key={med.id}
                    className="border border-medical-gray-200 rounded-lg p-4 hover:bg-medical-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-medical-gray-900">{med.name}</h4>
                        <p className="text-sm text-medical-gray-600">
                          {med.genericName} • {med.strength} • {med.dosageForm}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {med.category}
                        </Badge>
                        {med.isOTC && (
                          <Badge className="bg-medical-green/10 text-medical-green text-xs">
                            OTC
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-medical-gray-600">
                      <p><span className="font-medium">Indications:</span> {med.indications?.join(", ")}</p>
                      {med.contraindications && med.contraindications.length > 0 && (
                        <p className="mt-1">
                          <span className="font-medium">Contraindications:</span> {med.contraindications.join(", ")}
                        </p>
                      )}
                      <p className="mt-1">
                        <span className="font-medium">Max Daily Dose:</span> {med.maxDailyDose}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-medical-gray-500">
                No medications found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
