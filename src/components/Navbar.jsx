import { LogIn, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.jsx";
import { ModeToggle } from "./mode-toggle.jsx";
import { UserData } from "@/context/UserContext.jsx";
import { cartData } from "@/context/CartContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();

  const { isAuth, logoutUser, user } = UserData();

  const { totalItem, setTotalItem } = cartData();

  const logoutHandler = () => {
    logoutUser(navigate, setTotalItem);
  };

  return (
    <div className="z-50 sticky top-0 bg-background/50 border-b backdrop-blur">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src="/nexcart-logo.svg"
            alt="NexCart"
            onClick={() => navigate("/")}
            className="h-10 md:h-11 w-auto cursor-pointer object-contain"
          />
        </div>
        <ul className="flex justify-center items-center space-x-6">
          <li className="cursor-pointer" onClick={() => navigate("/")}>
            Home
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/products")}>
            Products
          </li>
          <li
            className="cursor-pointer relative flex items-center"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItem > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItem}
              </span>
            )}
          </li>
          <li className="cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {isAuth ? <User /> : <LogIn />}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isAuth ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      Login
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      Your Order
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/dashboard")}
                      >
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logoutHandler}>
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <ModeToggle />
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
