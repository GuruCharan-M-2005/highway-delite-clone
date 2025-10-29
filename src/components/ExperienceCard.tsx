
import { Experience } from "@/types/booking";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const navigate = useNavigate();

  // handle missing image gracefully
  const imageSrc =
    experience.image ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop";

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
      onClick={() => navigate(`/experience/${experience.id}`)}
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={experience.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg leading-tight">
          {experience.title}
        </h3>

        {experience.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {experience.description}
          </p>
        )}

        {experience.location && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{experience.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xl font-bold">${experience.price}</div>
          <Button variant="default" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};