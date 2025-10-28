import { useParams, useNavigate } from "react-router-dom";
import { mockExperiences } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Clock, ChevronLeft } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingDetails } = useBooking();
  
  const experience = mockExperiences.find((exp) => exp.id === id);

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Experience not found</h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    setBookingDetails({ experienceId: experience.id, guests: 1 });
    navigate(`/experience/${experience.id}/select-date`);
  };

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full rounded-lg object-cover aspect-video"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{experience.rating}</span>
                <span className="text-muted-foreground">({experience.reviews} reviews)</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{experience.title}</h1>
              <p className="text-lg text-muted-foreground">{experience.description}</p>
            </div>

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
