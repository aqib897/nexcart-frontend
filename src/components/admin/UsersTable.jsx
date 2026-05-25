import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { server } from "@/main";
import toast from "react-hot-toast";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${server}/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      toast.success(data.message);

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.email?.toLowerCase().includes(query) ||
      String(user.phone)?.toLowerCase().includes(query) ||
      user.address?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email, phone, address or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border rounded-md bg-background"
        />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                onClick={() => navigate(`/admin/user/${user._id}`)}
                className="border-t cursor-pointer hover:bg-muted/50 group"
              >
                <td className="p-4">{user.email}</td>

                <td className="p-4">{user.phone}</td>

                <td className="p-4">{user.address}</td>

                <td className="p-4 capitalize">
                  <div className="flex items-center justify-between">
                    <span>{user.role}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(user._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
