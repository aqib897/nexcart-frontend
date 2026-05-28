import Loading from "@/components/Loading.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { cartData } from "@/context/CartContext.jsx";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Phone,
  CreditCard,
  Wallet,
  Truck,
  ShieldCheck,
} from "lucide-react";

const Payment = () => {
  const { cart, subTotal, fetchCart } = cartData();
  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setAddress(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, [id]);

  const paymentHandler = async () => {
    if (method === "cod") {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `${server}/api/order/new/cod`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          },
        );

        setLoading(false);
        toast.success(data.message);
        fetchCart();
        navigate("/orders");
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message);
      }
    }

    if (method === "online") {
      try {
        setLoading(true);

        const { data } = await axios.post(
          `${server}/api/order/new/online`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          },
        );

        if (data.url) {
          window.location.assign(data.url);
          setLoading(false);
        } else {
          toast.error("Failed to create payment session");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Payment Failed. Please Try Again");
        console.log(error);

        setLoading(false);
      }
    }
  };

  if (!loading && cart.length === 0) {
  navigate("/");
}
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
       <div className="container mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl font-bold text-center mb-2">
              Proceed to Payment
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Secure checkout with fast delivery & protected payments
            </p>

            <div className="border rounded-3xl p-6 shadow-sm bg-background">
              <h3 className="text-xl font-semibold">Products</h3>
              <Separator className="my-2" />

              <div className="space-y-4">
                {cart &&
                  cart.map((e, i) => (
                    <div
                      key={i}
                      className="
                        flex flex-col md:flex-row
                        items-center justify-between
                        bg-muted/30
                        p-5 rounded-2xl
                        border
                        hover:shadow-lg
                        transition-all duration-300
                        "
                    >
                      <img
                        src={e.product.images[0].url}
                        alt="image"
                        className="
                          w-24 h-24 object-cover
                          rounded-2xl border
                          mb-4 md:mb-0
                          "
                      />

                      <div className="flex-1 md:ml-4 text-center md:text-left">
                        <h2 className="text-lg font-medium">
                          {e.product.title}
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          ₹ {e.product.price} X {e.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          ₹ {e.product.price * e.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="text-lg font-medium text-center">
              Total Price to be Paid: ₹ {subTotal}
            </div>

            {address && (
              <div
                  className="
                  border rounded-3xl
                  p-6 shadow-sm
                  bg-background
                  space-y-6
                  "
                >
                <h3 className="text-lg font-semibold text-center">Details</h3>
                <Separator className="my-2" />

                <div className="flex flex-col space-y-4">
                  <div>

                    <div className="flex items-center gap-3 mb-5">
                  
                      <MapPin className="w-5 h-5 text-primary" />
                  
                      <h3 className="font-bold text-xl">
                        Delivery Address
                      </h3>
                  
                    </div>
                  
                    <div
                      className="
                      border rounded-2xl p-5
                      bg-muted/20
                      space-y-3
                      "
                    >
                  
                      <div className="flex items-center justify-between">
                  
                        <div>
                  
                          <h3 className="font-bold text-lg">
                            {address.firstName} {address.lastName}
                          </h3>
                  
                          <div className="flex items-center gap-2 mt-1">
                  
                            <Phone className="w-4 h-4 text-muted-foreground" />
                  
                            <p className="text-sm text-muted-foreground">
                              +91 {address.phone}
                            </p>
                  
                          </div>
                  
                        </div>
                  
                        <span
                          className="
                          px-3 py-1 rounded-full text-xs
                          bg-primary text-primary-foreground
                          "
                        >
                          {address.type}
                        </span>
                  
                      </div>
                  
                      <div className="space-y-1 text-sm text-muted-foreground leading-6">
                  
                        <p>{address.address1}</p>
                  
                        {address.address2 && (
                          <p>{address.address2}</p>
                        )}
                  
                        {address.landmark && (
                          <p>
                            Landmark: {address.landmark}
                          </p>
                        )}
                  
                        <p>
                          {address.city}, {address.state}
                        </p>
                  
                        <p>{address.pincode}</p>
                  
                      </div>
                  
                    </div>
                  
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2 mb-3">

                      <CreditCard className="w-5 h-5 text-primary" />
                    
                      <h4 className="font-semibold">
                        Select Payment Method
                      </h4>
                    
                    </div>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="
                        w-full p-4 border rounded-2xl
                        bg-background
                        outline-none
                        focus:ring-2 focus:ring-primary/30
                        transition-all
                        "
                      >
                      <option value="">Select Payment Method</option>
                      <option value="cod">
                        Cash On Delivery
                      </option>
                      <option value="online">
                      Online Payment
                    </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
            <div
              className="
              border rounded-3xl p-6
              shadow-sm bg-background
              h-fit sticky top-24
              space-y-6
              "
            >
            
              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>
            
              <div className="space-y-4">
            
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Products
                  </span>
            
                  <span>
                    {cart.length}
                  </span>
                </div>
            
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Delivery
                  </span>
            
                  <span className="text-green-500">
                    Free
                  </span>
                </div>
            
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Payment
                  </span>
            
                  <span className="capitalize">
                    {method || "Not Selected"}
                  </span>
                </div>
            
                <Separator />
            
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
            
                  <span>₹ {subTotal}</span>
                </div>
            
              </div>
            
              <div className="space-y-4 pt-4">
            
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-500" />
                  <span className="text-sm">
                    Fast Delivery
                  </span>
                </div>
            
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">
                    Secure Checkout
                  </span>
                </div>
            
              </div>
            
              <Button
                className="
                w-full h-12 text-lg rounded-2xl
                hover:scale-[1.02]
                transition-all duration-300
                "
                onClick={paymentHandler}
                disabled={!method || !address}
              >
                Proceed To Checkout
              </Button>
            
            </div>
          
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
