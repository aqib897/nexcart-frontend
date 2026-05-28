import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { server } from "@/main";
import { UserData } from "@/context/UserContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Home,
  Mail,
  Shield,
  MapPin,
  Phone,
  CalendarDays,
  User2,
} from "lucide-react";

const UserDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user: role } = UserData();

  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("total");

  const [orderSearch, setOrderSearch] = useState("");

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setUser(data.user);

      setAddresses(data.addresses);

      setOrders(data.orders);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role?.role === "admin") {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [role]);

  const changeRole = async (role) => {
    try {
      const { data } = await axios.put(
        `${server}/api/user/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);

      setUser((prev) => ({
        ...prev,
        role,
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const filterOrders = (ordersArray) => {
    return ordersArray.filter((order) => {
      const search = orderSearch.toLowerCase();

      const matchesOrderId = order._id?.toLowerCase().includes(search);

      const matchesStatus = order.status?.toLowerCase().includes(search);

      const matchesMethod = order.method?.toLowerCase().includes(search);

      const matchesPrice = order.subTotal?.toString().includes(search);

      const matchesProducts = order.items?.some((item) =>
        item.product?.title?.toLowerCase().includes(search),
      );

      return (
        matchesOrderId ||
        matchesStatus ||
        matchesMethod ||
        matchesPrice ||
        matchesProducts
      );
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {role.role === "admin" ? (
        <>
          <div className="border rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

              <div className="flex items-center gap-5">
            
                <div
                  className="
                  w-24 h-24 rounded-full
                  bg-primary/10
                  flex items-center justify-center
                  text-4xl font-bold text-primary
                  border
                  "
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
            
                <div className="space-y-2">
            
                  <h1 className="text-3xl font-bold">
                    {user?.name}
                  </h1>
            
                  <div className="flex flex-wrap gap-3">
            
                    <span
                      className="
                      px-4 py-1 rounded-full text-sm
                      bg-primary text-primary-foreground
                      "
                    >
                      {user?.role}
                    </span>
            
                    <span
                      className="
                      px-4 py-1 rounded-full text-sm
                      bg-muted
                      "
                    >
                      Customer Account
                    </span>
            
                  </div>
            
                </div>
            
              </div>
            
              <div className="flex gap-3">
            
                <Button
                  variant={
                    user.role === "admin"
                      ? "default"
                      : "outline"
                  }
                  onClick={() => changeRole("admin")}
                >
                  Make Admin
                </Button>
            
                <Button
                  variant={
                    user.role === "user"
                      ? "default"
                      : "outline"
                  }
                  onClick={() => changeRole("user")}
                >
                  Make User
                </Button>
            
              </div>
            
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

            <div className="border rounded-2xl p-5 bg-background shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Email
                </p>
              </div>
          
              <h2 className="font-semibold break-all">
                {user.email}
              </h2>
            </div>
          
            <div className="border rounded-2xl p-5 bg-background shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Role
                </p>
              </div>
          
              <h2 className="font-semibold capitalize">
                {user.role}
              </h2>
            </div>
          
            <div className="border rounded-2xl p-5 bg-background shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Joined
                </p>
              </div>
          
              <h2 className="font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </h2>
            </div>
          
            <div className="border rounded-2xl p-5 bg-background shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <User2 className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Last Updated
                </p>
              </div>
          
              <h2 className="font-semibold">
                {new Date(user.updatedAt).toLocaleDateString()}
              </h2>
            </div>
          
          </div>
          </div>

          <div className="mt-8">

            <div className="flex items-center gap-3 mb-5">
          
              <MapPin className="w-6 h-6 text-primary" />
          
              <h2 className="text-2xl font-bold">
                Saved Addresses
              </h2>
          
            </div>
          
            {addresses.length > 0 ? (
          
              <div className="grid lg:grid-cols-2 gap-5">
          
                {addresses.map((address) => (
          
                  <div
                    key={address._id}
                    className="
                    border rounded-2xl p-5
                    bg-background
                    shadow-sm
                    hover:shadow-2xl
                    hover:-translate-y-1
                    transition-all duration-300
                    "
                  >
          
                    <div className="flex items-start justify-between mb-4">
          
                      <div>
          
                        <h3 className="font-bold text-lg">
                          {address.firstName}{" "}
                          {address.lastName}
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
          
                ))}
          
              </div>
          
            ) : (
          
              <div
                className="
                border rounded-2xl p-10
                text-center text-muted-foreground
                "
              >
                No Address Found
              </div>
          
            )}
          
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="
              border rounded-3xl p-6
              bg-green-500 text-white
              shadow-xl
              "
            >
              <p className="text-sm opacity-80">
                Total Spent
              </p>
            
              <h2 className="text-3xl font-bold mt-2">
                ₹
                {orders.reduce(
                  (acc, item) => acc + item.subTotal,
                  0,
                )}
              </h2>
            </div>
            <div
              onClick={() => setActiveSection("total")}
              className={`border rounded-3xl p-6 cursor-pointer
                    transition-all duration-300
                    hover:scale-[1.03]
                    hover:shadow-xl
      ${activeSection === "total" ? "bg-primary text-primary-foreground" : ""}
    `}
            >
              <p className="text-sm">Total Orders</p>

              <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
            </div>

            {/* CURRENT */}
            <div
              onClick={() => setActiveSection("current")}
              className={`border rounded-3xl p-6 cursor-pointer
                  transition-all duration-300
                  hover:scale-[1.03]
                  hover:shadow-xl
      ${activeSection === "current" ? "bg-primary text-primary-foreground" : ""}
    `}
            >
              <p className="text-sm">Current Orders</p>

              <h2 className="text-3xl font-bold mt-2">
                {
                  orders.filter(
                    (o) => o.status === "Pending" || o.status === "Shipped",
                  ).length
                }
              </h2>
            </div>

            {/* PREVIOUS */}
            <div
              onClick={() => setActiveSection("previous")}
              className={`border rounded-3xl p-6 cursor-pointer
                    transition-all duration-300
                    hover:scale-[1.03]
                    hover:shadow-xl
      ${
        activeSection === "previous" ? "bg-primary text-primary-foreground" : ""
      }
    `}
            >
              <p className="text-sm">Previous Orders</p>

              <h2 className="text-3xl font-bold mt-2">
                {
                  orders.filter(
                    (o) => o.status === "Delivered" || o.status === "Cancelled",
                  ).length
                }
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border rounded-xl p-4">
              <input
                type="text"
                placeholder="Search by Order ID, Product Title, Price, Status or Method..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 bg-background outline-none"
              />
            </div>
            {/* TOTAL ORDERS */}
            {activeSection === "total" && (
              <div className="border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Total Orders ({orders.length})
                </h2>

                {orders.length === 0 ? (
                  <p>No Orders Found</p>
                ) : (
                  <div className="space-y-5">
                    {filterOrders(orders).map((order) => (
                      <div
                        key={order._id}
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="border rounded-xl p-5 cursor-pointer hover:bg-muted/40 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                          <div>
                            <h3 className="font-semibold">Order ID:</h3>

                            <p className="text-sm break-all">{order._id}</p>
                          </div>

                          <div className="flex gap-3 flex-wrap">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border
                    ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }
                  `}
                            >
                              {order.status}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border
                    ${
                      order.method === "online"
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : "bg-orange-100 text-orange-700 border-orange-200"
                    }
                  `}
                            >
                              {order.method}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className="
                                flex items-center gap-4
                                border rounded-2xl p-4
                                bg-muted/30
                                hover:bg-muted/50
                                transition-all
                                "
                            >
                              <img
                                src={item.product?.images?.[0]?.url}
                                alt={item.product?.title}
                                className="w-20 h-20 rounded-xl object-cover border"
                              />

                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">
                                  {item.product?.title}
                                </h3>

                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  <p>Qty: {item.quantity}</p>

                                  <p>₹ {item.product?.price}</p>

                                  <p>Stock: {item.product?.stock}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-between items-center border-t pt-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>

                          <h3 className="text-lg font-bold">
                            ₹ {order.subTotal}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CURRENT ORDERS */}
            {activeSection === "current" && (
              <div className="border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Current Orders (
                  {
                    orders.filter(
                      (o) => o.status === "Pending" || o.status === "Shipped",
                    ).length
                  }
                  )
                </h2>

                <div className="space-y-5">
                  {filterOrders(
                    orders.filter(
                      (o) => o.status === "Pending" || o.status === "Shipped",
                    ),
                  ).map((order) => (
                    <div
                      key={order._id}
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="border rounded-xl p-5 cursor-pointer hover:bg-muted/40 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-semibold">Order ID:</h3>

                          <p className="text-sm break-all">{order._id}</p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border
            ${
              order.status === "Shipped"
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }
          `}
                          >
                            {order.status}
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border
            ${
              order.method === "online"
                ? "bg-purple-100 text-purple-700 border-purple-200"
                : "bg-orange-100 text-orange-700 border-orange-200"
            }
          `}
                          >
                            {order.method}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 border rounded-xl p-4 bg-muted/30"
                          >
                            <img
                              src={item.product?.images?.[0]?.url}
                              alt={item.product?.title}
                              className="w-20 h-20 rounded-xl object-cover border"
                            />

                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {item.product?.title}
                              </h3>

                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                <p>Qty: {item.quantity}</p>

                                <p>₹ {item.product?.price}</p>

                                <p>Stock: {item.product?.stock}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>

                        <h3 className="text-lg font-bold">
                          ₹ {order.subTotal}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PREVIOUS ORDERS */}
            {activeSection === "previous" && (
              <div className="border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Previous Orders (
                  {
                    orders.filter(
                      (o) =>
                        o.status === "Delivered" || o.status === "Cancelled",
                    ).length
                  }
                  )
                </h2>

                <div className="space-y-5">
                  {filterOrders(
                    orders.filter(
                      (o) =>
                        o.status === "Delivered" || o.status === "Cancelled",
                    ),
                  ).map((order) => (
                    <div
                      key={order._id}
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="border rounded-xl p-5 cursor-pointer hover:bg-muted/40 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-semibold">Order ID:</h3>

                          <p className="text-sm break-all">{order._id}</p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border
            ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }
          `}
                          >
                            {order.status}
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border
            ${
              order.method === "online"
                ? "bg-purple-100 text-purple-700 border-purple-200"
                : "bg-orange-100 text-orange-700 border-orange-200"
            }
          `}
                          >
                            {order.method}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 border rounded-xl p-4 bg-muted/30"
                          >
                            <img
                              src={item.product?.images?.[0]?.url}
                              alt={item.product?.title}
                              className="w-20 h-20 rounded-xl object-cover border"
                            />

                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {item.product?.title}
                              </h3>

                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                <p>Qty: {item.quantity}</p>

                                <p>₹ {item.product?.price}</p>

                                <p>Stock: {item.product?.stock}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>

                        <h3 className="text-lg font-bold">
                          ₹ {order.subTotal}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-8">
            You are not admin
          </h1>
          <Button onClick={() => navigate("/")}>
            Go to <Home /> page
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
