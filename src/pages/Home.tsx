
import { useState, useEffect } from "react";
import { ExperienceCard } from "@/components/ExperienceCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Experience } from "@/types/booking";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/experiences");
        if (!res.ok) throw new Error("Failed to load experiences");
        const data = await res.json();
        setExperiences(data);
      } catch (err: any) {
        console.error("Error fetching experiences:", err);
        setError("Unable to load experiences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading experiences...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
            Explore Experiences
          </h1>
          <div className="relative max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search experiences, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No experiences found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;




// import { useState } from "react";
// import { ExperienceCard } from "@/components/ExperienceCard";
// import { mockExperiences } from "@/data/mockData";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// const Home = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredExperiences = mockExperiences.filter(
//     (exp) =>
//       exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       exp.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b">
//         <div className="container mx-auto px-4 py-6">
//           <h1 className="text-3xl font-bold mb-6">Explore Experiences</h1>
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
//             <Input
//               type="text"
//               placeholder="Search experiences, locations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredExperiences.map((experience) => (
//             <ExperienceCard key={experience.id} experience={experience} />
//           ))}
//         </div>
        
//         {filteredExperiences.length === 0 && (
//           <div className="text-center py-16">
//             <p className="text-muted-foreground">No experiences found matching your search.</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;
