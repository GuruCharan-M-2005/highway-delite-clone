import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { mockExperiences } from "@/data/mockData";

const SelectDate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingDetails } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const experience = mockExperiences.find((exp) => exp.id === id);

  const handleContinue = () => {
    if (selectedDate) {
      setBookingDetails({ date: selectedDate });
      navigate(`/experience/${id}/select-time`);
    }
  };

  if (!experience) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/experience/${id}`)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Select a Date</h1>
        <p className="text-muted-foreground mb-8">{experience.title}</p>

        <Card className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border-0"
          />
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedDate}
            size="lg"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SelectDate;
