import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartData } from "@/context/CartContext";
import { UserData } from "@/context/UserContext";
import { Loader2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [otp, setOtp] = useState(" ");

  const navigate = useNavigate();

  const { btnLoading, loginUser, verifyUser } = UserData();

  const { fetchCart } = cartData();

  const email = localStorage.getItem("email");

  const submitHandler = () => {
    verifyUser(Number(otp), navigate, fetchCart);
  };

  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    const email = localStorage.getItem("email");
    await loginUser(email, navigate);
    setTimer(90);
    setCanResend(false);
  };
  return (
    <div className="min-h-[60vh]">
      <Card className="md:w-100 sm:w-75 m-auto mt-5">
        <CardHeader>
          <CardTitle>Verify User Otp</CardTitle>
          <CardDescription className="space-y-1">
            <p>
              OTP has been sent to:
              <span className="font-semibold ml-1">{email}</span>
            </p>

            <p>
              If you didn't get OTP in your inbox then check your spam section.
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-x-1">
            <Label className="mb-1">Enter Otp</Label>

            <Input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/login")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            disabled={btnLoading}
            onClick={submitHandler}
            className="flex items-center"
          >
            {btnLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </CardFooter>
        <div className="flex flex-col m-auto justify-center items-center w-50">
          <p className="text-center text-sm text-muted-foreground mb-3">
            {canResend ? (
              "OTP expired. You can resend OTP now."
            ) : (
              <>
                OTP is valid for{" "}
                <span className="font-semibold text-foreground">
                  {formatTime(timer)}
                </span>
              </>
            )}
          </p>
          <Button
            onClick={handleResendOtp}
            className="mb-3"
            disabled={!canResend}
          >
            Resend Otp
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Verify;
