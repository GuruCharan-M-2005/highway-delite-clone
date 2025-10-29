
import { useState, useEffect } from "react";
import { ExperienceCard } from "@/components/ExperienceCard";
import { Loader2 } from "lucide-react";
import { Experience } from "@/types/booking";
import { Header } from "@/components/Header";

const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/experiences");
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
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Experiences</h1>
        
        {experiences.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No experiences found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

