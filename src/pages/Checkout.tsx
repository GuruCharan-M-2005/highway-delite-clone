import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Calendar, Clock, Users, Tag } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { toast } from "sonner";
import { Experience } from "@/types/booking";

const Checkout = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookingDetails, userInfo, promoCode, setUserInfo, setPromoCode } = useBooking();

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [promoInput, setPromoInput] = useState(promoCode || "");
  const [promoApplied, setPromoApplied] = useState(!!promoCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);

  // 👇 Redirect to "/" if user refreshed the page
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (navType === "reload") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Fetch real experience data from backend
  useEffect(() => {
    const loadExperience = async () => {
      try {
        const res = await fetch(`/api/experiences/${id}`);
        if (!res.ok) throw new Error("Failed to fetch experience");
        const data = await res.json();
        setExperience(data);
      } catch (err) {
        console.error("Error fetching experience:", err);
        toast.error("Unable to load experience details.");
        navigate("/");
      }
    };
    if(id) loadExperience();
  },[]);

  if (!experience || !bookingDetails.date || !bookingDetails.time_slot_id) {
    return null;
  }

  const basePrice = experience.price * (bookingDetails.guests || 1);
  const discount = promoApplied && promoCode
    ? basePrice * 0.1 // optional: backend should verify real promo
    : 0;
  const totalPrice = basePrice - discount;

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === "SAVE10") {
      setPromoCode("SAVE10");
      setPromoApplied(true);
      toast.success("Promo code applied! 10% discount");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setUserInfo({ name, email, phone });

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience_id:id,
          timeslot_id:bookingDetails.time_slot_id, 
          date:bookingDetails.date, 
          time:bookingDetails.time_slot_id, 
          customer_name:name, 
          customer_email:email, 
          // seats: 
          // experienceId: id,
          // name,
          // email,
          // phone,
          // date: bookingDetails.date,
          // timeSlot: bookingDetails.time_slot_id,
          // guests: bookingDetails.guests || 1,
          // promoCode,
          // totalPrice,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");
      const data = await response.json();

      toast.success("Booking successful!");
      navigate(`/confirmation/${data.bookingId}`);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formValid = name && email && phone;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/experience/${id}/select-time`)}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: User Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        disabled={promoApplied}
                      />
                      <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={promoApplied}>
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={!formValid || isProcessing}>
                    {isProcessing ? "Processing..." : "Complete Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img src={experience.image} alt={experience.title} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-semibold text-lg">{experience.title}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{bookingDetails.date.toString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{bookingDetails.time_slot_id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{bookingDetails.guests || 1} guest(s)</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-accent">
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span>Discount</span>
                      </div>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;


