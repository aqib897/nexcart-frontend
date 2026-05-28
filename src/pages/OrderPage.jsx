import Loading from "@/components/Loading.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { UserData } from "@/context/UserContext.jsx";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Home,
  PackageCheck,
  MapPin,
  Phone,
  CreditCard,
  CalendarDays,
  Truck,
  Printer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = UserData();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        setOrder(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-600">
          No Order with this Id
        </h1>
        <Button onClick={() => navigate("/products")}>Shop Now</Button>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-10 px-4">
      {user._id === order.user._id || user.role === "admin" ? (
        <>
          <Card
            className="
            mb-8 border-0
            shadow-2xl
            rounded-3xl
            overflow-hidden
            bg-background/80
            backdrop-blur
            "
          >
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                  <PackageCheck className="w-10 h-10 text-primary" />
                  Order Details
                </CardTitle>
                <Button
                onClick={() => window.print()}
                className="
                rounded-2xl h-12 px-6
                hover:scale-[1.03]
                transition-all duration-300
                "
              >
                <Printer className="w-5 h-5 mr-2" />
                Print Order
              </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div
                    className="
                    border rounded-3xl
                    p-6 bg-muted/20
                    shadow-sm
                    space-y-4
                    "
                  >
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <p>
                    <strong>Order Id: </strong>
                    {order._id}
                  </p>
                  <p>
                    <strong>Status: </strong>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border
    ${
      order.status === "Delivered"
        ? "bg-green-100 text-green-700 border-green-200"
        : order.status === "Cancelled"
          ? "bg-red-100 text-red-700 border-red-200"
          : order.status === "Shipped"
            ? "bg-blue-100 text-blue-700 border-blue-200"
            : order.status === "Pending"
              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
              : "bg-gray-100 text-gray-700 border-gray-200"
    }
  `}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Total Items: </strong>
                    {order.items.length}
                  </p>
                  <p>
                    <strong>Payment Method: </strong>
                    {order.method}
                  </p>
                  <p>
                    <strong>SubTotal: </strong>
                    {order.subTotal}
                  </p>
                  <p>
                    <strong>Placed At: </strong>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Paid At: </strong>
                    {order.paidAt || "Payment through COD"}
                  </p>
                </div>
                <div
                  className="
                  border rounded-3xl
                  p-6 bg-muted/20
                  shadow-sm
                  space-y-4
                  "
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Details
                  </h2>
                  <div className="space-y-5">

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Phone Number
                      </p>
                
                      <h3 className="font-semibold text-lg">
                        +91 {order.phone}
                      </h3>
                    </div>
                  </div>
                
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Delivery Address
                      </p>
                
                      <h3 className="font-medium leading-7 whitespace-pre-line">
                        {order.address}
                      </h3>
                    </div>
                  </div>
                
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-primary mt-1" />
                
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Method
                      </p>
                
                      <h3 className="font-semibold capitalize">
                        {order.method}
                      </h3>
                    </div>
                  </div>
                
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-primary mt-1" />
                
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Status
                      </p>
                
                      <h3 className="font-semibold">
                        {order.status}
                      </h3>
                    </div>
                  </div>
                
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-primary mt-1" />
                
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ordered By
                      </p>
                
                      <h3 className="font-semibold break-all">
                        {order.user?.email || "Guest"}
                      </h3>
                    </div>
                  </div>
                
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {order.items.map((e, i) => (
              <Card
                key={i}
                className="
                rounded-3xl overflow-hidden
                border-0 shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all duration-300
                "
              >
                <Link to={`/product/${e.product._id}`}>
                  <img
                    src={e.product.images[0]?.url}
                    alt={e.product.title}
                    className="
                    w-full h-64 object-cover
                    bg-muted/20
                    "
                  />
                </Link>

                 <CardContent className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold">{e.product.title}</h3>
                  <p>
                    <strong>Quantity: </strong>
                    {e.quantity}
                  </p>
                  <p>
                    <strong>Price: ₹ </strong>
                    {e.product.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-8">
            This is not your order
          </h1>
          <Button onClick={() => navigate("/")}>
            Go to <Home /> page
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
