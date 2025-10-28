import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { useToast } from "@/hooks/use-toast";
import type { Experience } from "@/types/booking";

const SelectDate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setBookingDetails } = useBooking();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchExperience = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/experiences/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load experience");

        setExperience(data.experience);
      } catch (err) {
        console.error("Error loading experience:", err);
        toast({
          title: "Failed to load experience",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const handleContinue = () => {
    if (!selectedDate) return;
    setBookingDetails({ date: selectedDate.toISOString() });
    navigate(`/experience/${id}/select-time`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Experience not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/experience/${id}`)}>
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
          <Button onClick={handleContinue} disabled={!selectedDate} size="lg">
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SelectDate;



// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ChevronLeft } from "lucide-react";
// import { useBooking } from "@/hooks/useBooking";
// import { mockExperiences } from "@/data/mockData";

// const SelectDate = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { setBookingDetails } = useBooking();
//   const [selectedDate, setSelectedDate] = useState<Date>();
  
//   const experience = mockExperiences.find((exp) => exp.id === id);

//   const handleContinue = () => {
//     if (selectedDate) {
//       setBookingDetails({ date: selectedDate });
//       navigate(`/experience/${id}/select-time`);
//     }
//   };

//   if (!experience) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b">
//         <div className="container mx-auto px-4 py-4">
//           <Button
//             variant="ghost"
//             onClick={() => navigate(`/experience/${id}`)}
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">Select a Date</h1>
//         <p className="text-muted-foreground mb-8">{experience.title}</p>

//         <Card className="p-6">
//           <Calendar
//             mode="single"
//             selected={selectedDate}
//             onSelect={setSelectedDate}
//             disabled={(date) => date < new Date()}
//             className="rounded-md border-0"
//           />
//         </Card>

//         <div className="mt-6 flex justify-end">
//           <Button
//             onClick={handleContinue}
//             disabled={!selectedDate}
//             size="lg"
//           >
//             Continue
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default SelectDate;
