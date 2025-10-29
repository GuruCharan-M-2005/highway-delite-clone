import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ChevronLeft, Loader2, Plus, Minus } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { Experience } from "@/types/booking";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingDetails } = useBooking();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Mock dates and times
  const availableDates = [
    { date: "2025-11-01", label: "Nov 1" },
    { date: "2025-11-02", label: "Nov 2" },
    { date: "2025-11-03", label: "Nov 3" },
    { date: "2025-11-04", label: "Nov 4" },
  ];

  const availableTimes = [
    { time: "09:00 AM", slots: 5 },
    { time: "12:00 PM", slots: 3 },
    { time: "03:00 PM", slots: 0 },
    { time: "06:00 PM", slots: 8 },
  ];

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

  const handleConfirm = () => {
    if (!experience || !selectedDate || !selectedTime) return;
    setBookingDetails({ 
      experience_id: experience.id, 
      guests: quantity,
      date: selectedDate,
      time: selectedTime,
      totalPrice:total
    });
    navigate(`/experience/${experience.id}/checkout`);
  };

  const subtotal = experience ? experience.price * quantity : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading experience details...
      </div>
    );
  }

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
      <Header />
      
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Details</h2>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-10 gap-8">
          {/* LEFT SIDE - 70% */}
          <div className="lg:col-span-7 space-y-6">
            {/* Image */}
            <div className="w-full overflow-hidden rounded-lg">
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full object-cover aspect-video"
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">{experience.title}</h1>
              <p className="text-muted-foreground">{experience.description}</p>
              
              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-semibold">{experience.rating}</span>
                <span className="text-muted-foreground">({experience.reviews} reviews)</span>
              </div>
            </div>

            {/* Select Date */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Select Date</h3>
              <div className="grid grid-cols-4 gap-2">
                {availableDates.map((d) => (
                  <Card
                    key={d.date}
                    className={cn(
                      "p-3 text-center cursor-pointer transition-all hover:border-accent",
                      selectedDate === d.date && "border-accent bg-accent/5"
                    )}
                    onClick={() => setSelectedDate(d.date)}
                  >
                    <div className="font-medium">{d.label}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Select Time */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Select Time</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map((t) => (
                  <Card
                    key={t.time}
                    className={cn(
                      "p-3 cursor-pointer transition-all",
                      t.slots === 0 && "opacity-50 cursor-not-allowed",
                      selectedTime === t.time && "border-accent bg-accent/5"
                    )}
                    onClick={() => t.slots > 0 && setSelectedTime(t.time)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t.time}</span>
                      <span className="text-sm text-muted-foreground">
                        {t.slots === 0 ? "Sold Out" : `${t.slots} slots left`}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">All times are IST</p>
            </div>

            {/* About */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">About</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Experience an unforgettable journey with professional guides and all necessary equipment included.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - 30% */}
          <div className="lg:col-span-3">
            <Card className="sticky top-24 p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Starts at</p>
                <p className="text-3xl font-bold">${experience.price}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Quantity</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                onClick={handleConfirm} 
                className="w-full" 
                size="lg"
                disabled={!selectedDate || !selectedTime}
              >
                Confirm
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetails;
