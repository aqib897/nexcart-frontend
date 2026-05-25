import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full mt-10 border-t border-border bg-background">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left space-y-3">
            <img
              src="/nexcart-logo.svg"
              alt="NexCart"
              className="h-10 w-auto mx-auto lg:mx-0"
            />

            <p className="text-sm text-muted-foreground max-w-sm">
              Your one-stop destination for smart, seamless, and modern online
              shopping experience.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <span className="cursor-default hover:text-foreground transition-colors">
              About Us
            </span>

            <span className="cursor-default hover:text-foreground transition-colors">
              Contact
            </span>

            <span className="cursor-default hover:text-foreground transition-colors">
              Privacy Policy
            </span>

            <span className="cursor-default hover:text-foreground transition-colors">
              Terms & Conditions
            </span>
          </div>

          <div className="flex items-center gap-4 text-lg">
            <div className="p-2 rounded-full border hover:bg-muted transition-colors">
              <FaFacebook />
            </div>

            <div className="p-2 rounded-full border hover:bg-muted transition-colors">
              <FaXTwitter />
            </div>

            <div className="p-2 rounded-full border hover:bg-muted transition-colors">
              <FaInstagram />
            </div>

            <div className="p-2 rounded-full border hover:bg-muted transition-colors">
              <FaYoutube />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NexCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
