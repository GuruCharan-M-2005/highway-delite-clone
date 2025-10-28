import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Clock, ChevronLeft, Loader2 } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { Experience } from "@/types/booking";

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingDetails } = useBooking();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchExperience = async () => {
      try {
        const res = await fetch(`/api/experiences/${id}`);
        if (!res.ok) throw new Error("Failed to load experience details");
        const data = await res.json();
        setExperience(data.experience);
      } catch (err: any) {
        console.error("Error fetching experience:", err);
        setError("Unable to load experience. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const handleBookNow = () => {
    if (!experience) return;
    setBookingDetails({ experience_id: experience.id, guests: 1 });
    navigate(`/experience/${experience.id}/select-date`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading experience details...
      </div>
    );
  }

  // Error or Missing Data
  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Experience not found</h2>
          <p className="text-muted-foreground">{error ?? "Please return to the homepage."}</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Experiences
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full rounded-lg object-cover aspect-video"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Info Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{experience.rating}</span>
                <span className="text-muted-foreground">
                  ({experience.reviews} reviews)
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{experience.title}</h1>
              <p className="text-lg text-muted-foreground">{experience.description}</p>
            </div>

            {/* Price & Info */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{experience.location}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-3xl font-bold">${experience.price}</span>
                  <span className="text-muted-foreground">per person</span>
                </div>
                <Button onClick={handleBookNow} className="w-full" size="lg">
                  Book Now
                </Button>
              </div>
            </Card>

            {/* Included Section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">What's included</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Professional guide</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>All necessary equipment</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Refreshments and snacks</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Photos of your experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetails;





// import { useParams, useNavigate } from "react-router-dom";
// import { mockExperiences } from "@/data/mockData";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Star, MapPin, Clock, ChevronLeft } from "lucide-react";
// import { useBooking } from "@/hooks/useBooking";

// const ExperienceDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { setBookingDetails } = useBooking();
  
//   const experience = mockExperiences.find((exp) => exp.id === id);

//   if (!experience) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Experience not found</h2>
//           <Button onClick={() => navigate("/")}>Back to Home</Button>
//         </div>
//       </div>
//     );
//   }

//   const handleBookNow = () => {
//     setBookingDetails({ experienceId: experience.id, guests: 1 });
//     navigate(`/experience/${experience.id}/select-date`);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b">
//         <div className="container mx-auto px-4 py-4">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/")}
//             className="mb-2"
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" />
//             Back to Experiences
//           </Button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="grid lg:grid-cols-2 gap-8">
//           <div>
//             <img
//               src={experience.image}
//               alt={experience.title}
//               className="w-full rounded-lg object-cover aspect-video"
//             />
//           </div>

//           <div className="space-y-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Star className="w-5 h-5 fill-accent text-accent" />
//                 <span className="font-semibold">{experience.rating}</span>
//                 <span className="text-muted-foreground">({experience.reviews} reviews)</span>
//               </div>
//               <h1 className="text-4xl font-bold mb-4">{experience.title}</h1>
//               <p className="text-lg text-muted-foreground">{experience.description}</p>
//             </div>

//             <Card className="p-6 space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Clock className="w-5 h-5" />
//                   <span>{experience.duration}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <MapPin className="w-5 h-5" />
//                   <span>{experience.location}</span>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <div className="flex items-baseline justify-between mb-4">
//                   <span className="text-3xl font-bold">${experience.price}</span>
//                   <span className="text-muted-foreground">per person</span>
//                 </div>
//                 <Button onClick={handleBookNow} className="w-full" size="lg">
//                   Book Now
//                 </Button>
//               </div>
//             </Card>

//             <div className="space-y-2">
//               <h3 className="font-semibold text-lg">What's included</h3>
//               <ul className="space-y-2 text-muted-foreground">
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span>Professional guide</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span>All necessary equipment</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span>Refreshments and snacks</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span>Photos of your experience</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ExperienceDetails;
