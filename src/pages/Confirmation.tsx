

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { Booking } from "@/types/booking";

const Confirmation = () => {
  const navigate = useNavigate();
  const { id: bookingId } = useParams(); // e.g. /confirmation/:id
  const { resetBooking } = useBooking();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 👇 Redirect to "/" if user refreshed the page
  useEffect(() => {
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (navType === "reload") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) throw new Error("Missing booking ID");
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error("Failed to fetch booking details");
        const data = await res.json();
        setBooking(data);
      } catch (err: any) {
        console.error("Error loading booking:", err);
        setError("Unable to load your booking confirmation.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleNewBooking = () => {
    resetBooking();
    navigate("/");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading your booking...
      </div>
    );
  }

  // Error or missing booking
  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Booking Not Found</h2>
          <p className="text-muted-foreground">{error ?? "Please try again."}</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
          </div>

          {/* Success Text */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your booking has been successfully confirmed
            </p>
          </div>

          {/* Booking Details */}
          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-4 text-left">
              <div>
                <span className="text-sm text-muted-foreground">Booking ID</span>
                <p className="font-mono font-semibold">{booking.bookingId}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Experience</span>
                <p className="font-semibold">{booking.experience_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Date</span>
                  <p className="font-semibold">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Time</span>
                  <p className="font-semibold">{booking.time_slot_id}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Guest Name</span>
                <p className="font-semibold">{booking.name}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Email</span>
                <p className="font-semibold">{booking.email}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Total Paid</span>
                <p className="font-semibold">${booking.totalPrice}</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to {booking.email}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleNewBooking} size="lg">
                Book Another Experience
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} size="lg">
                Back to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirmation;

