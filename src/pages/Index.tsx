// // Update this page (the content is just a fallback if you fail to update the page)


import { useEffect, useState } from "react";
import { Experience } from "@/types/booking";
import { ExperienceCard } from "@/components/ExperienceCard";
import { Loader2 } from "lucide-react";

const Index = () => {
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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Available Experiences</h1>

        {experiences.length === 0 ? (
          <p className="text-center text-muted-foreground">No experiences found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;


