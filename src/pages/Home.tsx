import { useState } from "react";
import { ExperienceCard } from "@/components/ExperienceCard";
import { mockExperiences } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExperiences = mockExperiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Explore Experiences</h1>
          <div className="relative max-w-md">
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
        
        {filteredExperiences.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No experiences found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
