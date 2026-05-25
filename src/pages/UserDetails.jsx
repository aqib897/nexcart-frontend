import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { server } from "@/main";
import { UserData } from "@/context/UserContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Home } from "lucide-react";

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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">User Details</h1>

              <div className="flex gap-2">
                <button
                  onClick={() => changeRole("admin")}
                  className={`px-4 py-2 rounded-md text-sm ${
                    user.role === "admin" ? "bg-black text-white" : "border"
                  }`}
                >
                  Admin
                </button>

                <button
                  onClick={() => changeRole("user")}
                  className={`px-4 py-2 rounded-md text-sm ${
                    user.role === "user" ? "bg-black text-white" : "border"
                  }`}
                >
                  User
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Email</p>

                <h2 className="font-semibold break-all">{user.email}</h2>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Role</p>

                <h2 className="font-semibold capitalize">{user.role}</h2>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Created At</p>

                <h2 className="font-semibold">
                  {new Date(user.createdAt).toLocaleString()}
                </h2>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Updated At</p>

                <h2 className="font-semibold">
                  {new Date(user.updatedAt).toLocaleString()}
                </h2>
              </div>

              <div className="border rounded-lg p-4 md:col-span-2">
                <p className="text-sm text-muted-foreground mb-2">Addresses</p>

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address._id} className="border rounded-md p-3">
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {address.phone}
                        </p>

                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {address.address}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No Address Found</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TOTAL */}
            <div
              onClick={() => setActiveSection("total")}
              className={`border rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02]
      ${activeSection === "total" ? "bg-primary text-primary-foreground" : ""}
    `}
            >
              <p className="text-sm">Total Orders</p>

              <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
            </div>

            {/* CURRENT */}
            <div
              onClick={() => setActiveSection("current")}
              className={`border rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02]
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
              className={`border rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02]
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
