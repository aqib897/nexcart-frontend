import Loading from "@/components/Loading.jsx";
import { Button } from "@/components/ui/button.jsx";
import { server } from "@/main";
import Cookies from "js-cookie";
import axios from "axios";
import { Trash, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  async function fetchAddress(showLoader = false) {
    if (showLoader) setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setAddress(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editingAddressId, setEditingAddressId] = useState(null);

  const [editAddress, setEditAddress] = useState({
    address: "",
    phone: "",
  });
  const [newAddress, setNewAddress] = useState({
    address: "",
    phone: "",
  });

  const handleAddAddress = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        { address: newAddress.address, phone: newAddress.phone },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      if (data.message) {
        toast.success(data.message);
        await fetchAddress();
        (setNewAddress({
          address: "",
          phone: "",
        }),
          setModalOpen(false));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEditAddress = async () => {
    setUpdating(true);

    try {
      const { data } = await axios.put(
        `${server}/api/address/${editingAddressId}`,
        {
          address: editAddress.address,
          phone: editAddress.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);

      await fetchAddress();

      setEditModalOpen(false);

      setEditingAddressId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchAddress(true);
  }, []);

  const deleteHandler = async (id) => {
    if (confirm("Are you sure, you want to delete this address ")) {
      try {
        const { data } = await axios.delete(`${server}/api/address/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        toast.success(data.message);
        await fetchAddress();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {address && address.length > 0 ? (
            address.map((e) => (
              <div className="p-4 border rounded-lg shadow-sm" key={e._id}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold flex-1 min-w-0 break-words">
                    Address - {e.address}
                  </h3>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingAddressId(e._id);

                        setEditAddress({
                          address: e.address,
                          phone: e.phone,
                        });

                        setEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteHandler(e._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mb-4">Phone- {e.phone}</p>
                <Link to={`/payment/${e._id}`}>
                  <Button variant="outline">Use Address</Button>
                </Link>
              </div>
            ))
          ) : (
            <p>No Address Found</p>
          )}
        </div>
      )}

      <Button
        className="mt-6"
        variant="outline"
        onClick={() => setModalOpen(true)}
      >
        Add New Address
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <div className="space-y-4">
              <Input
                placeholder="Address"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Phone"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handleAddAddress}>
              Add Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>

            <div className="space-y-4">
              <Input
                placeholder="Address"
                value={editAddress.address}
                onChange={(e) =>
                  setEditAddress({
                    ...editAddress,
                    address: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="Phone"
                value={editAddress.phone}
                onChange={(e) =>
                  setEditAddress({
                    ...editAddress,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleEditAddress} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
