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
import { UserData } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const { loginUser, btnLoading } = UserData();

  const submitHandler = () => {
    loginUser(email, navigate);
  };
  return (
    <div className="min-h-[60vh]">
      <Card className="md:w-100 sm:w-75 m-auto mt-5">
        <CardHeader>
          <CardTitle>Enter Email to get Otp</CardTitle>
          <CardDescription>
            If you have already get otp on mail then you can directly go to
            Verify tab
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-x-1">
            <Label className="mb-1">Enter Email</Label>

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/verify")}>
            Verify OTP
          </Button>

          <Button
            disabled={btnLoading}
            onClick={submitHandler}
            className="flex items-center"
          >
            {btnLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
