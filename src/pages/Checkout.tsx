import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { toast } from "sonner";
import { Experience } from "@/types/booking";
import { Header } from "@/components/Header";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookingDetails, userInfo, promoCode, setUserInfo, setPromoCode } = useBooking();

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [promoInput, setPromoInput] = useState(promoCode || "");
  const [promoApplied, setPromoApplied] = useState(!!promoCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const subtotal = experience.price * (bookingDetails.guests || 1);
  const discount = promoApplied && promoCode ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.18;
  const totalPrice = subtotal - discount + tax;

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
    setUserInfo({ name, email, phone: "" });

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience_id:id,
          timeslot_id:bookingDetails.time_slot_id, 
          date:bookingDetails.date, 
          time:bookingDetails.time, 
          customer_name:name, 
          customer_email:email, 
          amount:totalPrice
        }),
      });

      if (!response.ok) throw new Error("Booking failed");
      const data = await response.json();
      data['bookingId']=1;
      toast.success("Booking successful!");
      navigate(`/confirmation/${data.bookingId}`);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formValid = name && email && agreedToTerms;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/experience/${id}`)}>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
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

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Agree with T&C
                    </label>
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
                <h3 className="font-semibold text-lg mb-3">{experience.title}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">{experience.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{bookingDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{bookingDetails.time_slot_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{bookingDetails.guests || 1}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-accent">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={!formValid || isProcessing}>
                  {isProcessing ? "Processing..." : "Confirm"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;


