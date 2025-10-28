import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { mockExperiences } from "@/data/mockData";

const Confirmation = () => {
  const navigate = useNavigate();
  const { bookingDetails, userInfo, resetBooking } = useBooking();
  
  const experience = mockExperiences.find(
    (exp) => exp.id === bookingDetails.experienceId
  );

  useEffect(() => {
    if (!experience || !userInfo.email) {
      navigate("/");
    }
  }, [experience, userInfo.email, navigate]);

  if (!experience || !userInfo.email) {
    return null;
  }

  const bookingId = `BK${Date.now().toString().slice(-8)}`;

  const handleNewBooking = () => {
    resetBooking();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your booking has been successfully confirmed
            </p>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-4">
              <div className="text-left space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Booking ID</span>
                  <p className="font-mono font-semibold">{bookingId}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <p className="font-semibold">{experience.title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Date</span>
                    <p className="font-semibold">
                      {bookingDetails.date?.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Time</span>
                    <p className="font-semibold">{bookingDetails.timeSlot}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Guest Name</span>
                  <p className="font-semibold">{userInfo.name}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-semibold">{userInfo.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to {userInfo.email}
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
