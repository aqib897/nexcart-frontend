import { server } from "@/main";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input.jsx";
import Loading from "../Loading.jsx";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.jsx";
import moment from "moment";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/order/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${server}/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      toast.success(data.message);

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const emailMatch = order.user?.email?.toLowerCase().includes(searchText);

    const orderIdMatch = order._id?.toLowerCase().includes(searchText);

    const titleMatch = order.items?.some((item) =>
      item.product?.title?.toLowerCase().includes(searchText),
    );

    const statusMatch = order.status?.toLowerCase().includes(searchText);

    return emailMatch || orderIdMatch || titleMatch || statusMatch;
  });
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      <Input
        placeholder="Search by title, email, status or Order Id"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2"
      />
      {loading ? (
        <Loading />
      ) : filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} className="group transition-colors">
                  <TableCell>
                    <Link
                      to={`/order/${order._id}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={order.items?.[0]?.product?.images?.[0]?.url}
                        alt={order.items[0]?.product?.title}
                        className="w-12 h-12 object-cover rounded-md border"
                      />

                      <div className="flex flex-col">
                        <span className="font-medium line-clamp-1">
                          {order.items?.[0]?.product?.title || "Product Removed"}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          #{order._id}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {order.user?.email || "User Deleted"}
                  </TableCell>
                  <TableCell>₹ {order.subTotal}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {moment(order.createdAt).format("DD MM YYYY, hh:mm A")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        className="
    px-3 py-2 border rounded-md
    bg-white text-black
    dark:bg-zinc-900 dark:text-white dark:border-zinc-700
    focus:outline-none
  "
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="
        text-sm font-bold
        hover:text-red-500
        opacity-0 pointer-events-none
        group-hover:opacity-100 group-hover:pointer-events-auto
        transition-all duration-200
      "
                      >
                        ✕
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>No Orders</p>
      )}
    </div>
  );
};

export default OrdersPage;
