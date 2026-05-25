import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { server } from "@/main";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/all`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const orderIdMatch = order._id?.toLowerCase().includes(searchText);

    const methodMatch = order.method?.toLowerCase().includes(searchText);

    const statusMatch = order.status?.toLowerCase().includes(searchText);

    const dateMatch = new Date(order.createdAt)
      .toLocaleDateString()
      .toLowerCase()
      .includes(searchText);

    const priceMatch = order.subTotal?.toString().includes(searchText);

    const titleMatch = order.items.some((item) =>
      item.product?.title?.toLowerCase().includes(searchText),
    );

    return (
      orderIdMatch ||
      methodMatch ||
      statusMatch ||
      dateMatch ||
      priceMatch ||
      titleMatch
    );
  });

  if (loading) {
    return <Loading />;
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-8">No Orders Yet</h1>
        <Button onClick={() => navigate("/products")}>Shop Now</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-6 min-h-[70vh]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Your Orders</h1>

        <Input
          placeholder="
Search by order id, title, method, status, date, price...
"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-[400px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <h2 className="text-2xl font-bold">No matching orders found</h2>

            <p className="text-muted-foreground mt-2">
              Try searching with another keyword
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            return (
              <Card
                key={order._id}
                className="
  border-0
  shadow-md
  hover:shadow-2xl
  hover:-translate-y-1
  transition-all
  duration-300
  rounded-2xl
  overflow-hidden
"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold line-clamp-1">
                    Order #{order._id.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                  <div className="my-5 space-y-4">
                    {/* PRODUCT PREVIEW */}
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 4).map((item, index) => (
                        <img
                          key={index}
                          src={item.product?.images?.[0]?.url}
                          alt={item.product?.title}
                          className="
          w-14 h-14
          rounded-full
          border-3 border-background
          object-cover
          shadow-md
          hover:scale-110
          transition-transform
          duration-200
        "
                        />
                      ))}

                      {order.items.length > 4 && (
                        <div
                          className="
          w-14 h-14
          rounded-full
          bg-muted
          border-3 border-background
          flex items-center justify-center
          text-sm font-semibold
          shadow-md
        "
                        >
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    {/* PRODUCT LIST */}
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className="
          flex items-center gap-3
          bg-muted/40
          hover:bg-muted/70
          transition-all
          duration-200
          rounded-xl
          p-3
        "
                        >
                          <img
                            src={item.product?.images?.[0]?.url}
                            alt={item.product?.title}
                            className="
            w-16 h-16
            object-cover
            rounded-xl
            border
            shadow-sm
          "
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {item.product?.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="px-2 py-1 rounded-md bg-background border">
                                Qty: {item.quantity}
                              </span>

                              <span className="px-2 py-1 rounded-md bg-background border">
                                ₹ {item.product?.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* MORE ITEMS */}
                    {order.items.length > 2 && (
                      <div
                        className="
        text-sm
        text-muted-foreground
        bg-muted/40
        border
        rounded-lg
        px-4 py-2
        inline-flex
        items-center
      "
                      >
                        +{order.items.length - 2} more item(s)
                      </div>
                    )}

                    {/* TOTAL ITEMS */}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-muted-foreground">
                        Total Products
                      </p>

                      <span className="font-semibold">
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}{" "}
                        Item(s)
                      </span>
                    </div>
                  </div>
                  <p>
                    <strong>Total Items: </strong>
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}{" "}
                    Item(s)
                  </p>

                  <p>
                    <strong>Payment Method: </strong>
                    <span className="capitalize">{order.method}</span>
                  </p>
                  <p>
                    <strong>SubTotal: ₹ </strong>
                    {order.subTotal}
                  </p>
                  <p>
                    <strong>Placed At: </strong>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <Button
                    className="
    mt-5
    w-full
    rounded-xl
    font-semibold
    h-11
  "
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Detail
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
