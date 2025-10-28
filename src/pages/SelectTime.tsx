import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Clock, Users } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { cn } from "@/lib/utils";
import type { Experience, TimeSlot } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";

const SelectTime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookingDetails, setBookingDetails } = useBooking();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>();

  useEffect(() => {
    if (!id || !bookingDetails.date) return;

    const fetchExperience = async () => {
      setLoading(true);
      try {
        const dateStr = bookingDetails.date;
        const res = await fetch(`/api/experiences/${id}?date=${dateStr}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load experience");

        setExperience(data.experience);
        setTimeSlots(data.timeslots);
      } catch (err) {
        console.error("Error loading experience:", err);
        toast({
          title: "Failed to load time slots",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, bookingDetails.date]);

  const handleContinue = () => {
    if (!selectedTimeSlot) return;
    setBookingDetails({ time_slot_id: selectedTimeSlot });
    navigate(`/experience/${id}/checkout`);
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
          <Button
            variant="ghost"
            onClick={() => navigate(`/experience/${id}/select-date`)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Select Time</h1>
        <p className="text-muted-foreground mb-8">{experience.title}</p>

        <div className="space-y-3">
          {timeSlots.map((slot) => (
            <Card
              key={slot.id}
              className={cn(
                "p-4 cursor-pointer transition-all",
                !slot.available && "opacity-50 cursor-not-allowed",
                selectedTimeSlot === slot.id && "ring-2 ring-accent bg-accent/5"
              )}
              onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-lg">{slot.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  {slot.available ? (
                    <>
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {slot.spotsLeft} spots left
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-destructive font-medium">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedTimeSlot}
            size="lg"
          >
            Continue to Checkout
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SelectTime;



// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ChevronLeft, Clock, Users } from "lucide-react";
// import { useBooking } from "@/hooks/useBooking";
// import { mockExperiences, generateTimeSlots } from "@/data/mockData";
// import { cn } from "@/lib/utils";

// const SelectTime = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { bookingDetails, setBookingDetails } = useBooking();
//   const [selectedTime, setSelectedTime] = useState<string>();
  
//   const experience = mockExperiences.find((exp) => exp.id === id);
//   const timeSlots = bookingDetails.date ? generateTimeSlots(bookingDetails.date) : [];

//   const handleContinue = () => {
//     if (selectedTime) {
//       setBookingDetails({ timeSlot: selectedTime });
//       navigate(`/experience/${id}/checkout`);
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
//             onClick={() => navigate(`/experience/${id}/select-date`)}
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 max-w-2xl">
//         <h1 className="text-3xl font-bold mb-2">Select Time</h1>
//         <p className="text-muted-foreground mb-8">{experience.title}</p>

//         <div className="space-y-3">
//           {timeSlots.map((slot) => (
//             <Card
//               key={slot.id}
//               className={cn(
//                 "p-4 cursor-pointer transition-all",
//                 !slot.available && "opacity-50 cursor-not-allowed",
//                 selectedTime === slot.time && "ring-2 ring-accent bg-accent/5"
//               )}
//               onClick={() => slot.available && setSelectedTime(slot.time)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Clock className="w-5 h-5 text-muted-foreground" />
//                   <span className="font-semibold text-lg">{slot.time}</span>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   {slot.available ? (
//                     <>
//                       <Users className="w-4 h-4 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">
//                         {slot.spotsLeft} spots left
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-sm text-destructive font-medium">
//                       Sold Out
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>

//         <div className="mt-6 flex justify-end">
//           <Button
//             onClick={handleContinue}
//             disabled={!selectedTime}
//             size="lg"
//           >
//             Continue to Checkout
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default SelectTime;
