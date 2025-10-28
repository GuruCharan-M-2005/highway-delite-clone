
import { Experience } from "@/types/booking";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock } from "lucide-react";
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

      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">
            {experience.title}
          </h3>
          {experience.rating && (
            <div className="flex items-center gap-1 text-sm font-medium shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>{Number(experience.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {experience.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {experience.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {experience.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{experience.location}</span>
            </div>
          )}
          {experience.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{experience.duration}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          {experience.reviews !== undefined && (
            <div className="text-sm text-muted-foreground">
              {experience.reviews} reviews
            </div>
          )}
          <div className="text-xl font-bold">${experience.price}</div>
        </div>
      </CardContent>
    </Card>
  );
};
// import { Experience } from "@/types/booking";
// import { Card, CardContent } from "@/components/ui/card";
// import { Star, MapPin, Clock } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface ExperienceCardProps {
//   experience: Experience;
// }

// export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
//   const navigate = useNavigate();

//   return (
//     <Card 
//       className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
//       onClick={() => navigate(`/experience/${experience.id}`)}
//     >
//       <div className="aspect-video w-full overflow-hidden">
//         <img
//           src={experience.image}
//           alt={experience.title}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//         />
//       </div>
//       <CardContent className="p-4 space-y-2">
//         <div className="flex items-start justify-between gap-2">
//           <h3 className="font-semibold text-lg leading-tight">{experience.title}</h3>
//           <div className="flex items-center gap-1 text-sm font-medium shrink-0">
//             <Star className="w-4 h-4 fill-accent text-accent" />
//             <span>{experience.rating}</span>
//           </div>
//         </div>
        
//         <p className="text-sm text-muted-foreground line-clamp-2">
//           {experience.description}
//         </p>
        
//         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//           <div className="flex items-center gap-1">
//             <MapPin className="w-4 h-4" />
//             <span>{experience.location}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Clock className="w-4 h-4" />
//             <span>{experience.duration}</span>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between pt-2">
//           <div className="text-sm text-muted-foreground">
//             {experience.reviews} reviews
//           </div>
//           <div className="text-xl font-bold">
//             ${experience.price}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
