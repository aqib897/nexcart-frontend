import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "@/main";
import toast from "react-hot-toast";
import { ProductData } from "@/context/ProductContext.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";

const ITEMS_PER_PAGE = 10;

const ProductInventoryTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const {
    products,
    fetchProducts,
    categories,
    setCategories,
    newCategory,
    setNewCategory,
  } = ProductData();

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const exists = categories.some(
      (cat) => cat.toLowerCase() === newCategory.toLowerCase(),
    );

    if (exists) {
      return toast.error("Category already exists");
    }

    setCategories((prev) => [...prev, newCategory]);

    toast.success("Category added");

    setNewCategory("");
  };

  const deleteCategory = (categoryToDelete) => {
    const confirmDelete = window.confirm(
      `Delete ${categoryToDelete} category?`,
    );

    if (!confirmDelete) return;

    setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));

    if (form.category === categoryToDelete) {
      setForm((prev) => ({
        ...prev,
        category: "",
      }));
    }

    toast.success("Category deleted");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const remaining = p.stock || 0;

    const searchValue = search.toLowerCase();

    return (
      p.title?.toLowerCase().includes(searchValue) ||
      p.category?.toLowerCase().includes(searchValue) ||
      String(p.price).includes(searchValue) ||
      String(p.stock).includes(searchValue) ||
      String(p.sold || 0).includes(searchValue) ||
      String(remaining).includes(searchValue)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const openEdit = (product) => {
    setEditingProduct(product._id);
    setForm({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
    });
    setImageFiles([]);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // TEXT UPDATE
      await axios.put(`${server}/api/product/${editingProduct}`, form, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      // IMAGE UPDATE
      if (imageFiles.length > 0) {
        const imageForm = new FormData();

        for (let i = 0; i < imageFiles.length; i++) {
          imageForm.append("files", imageFiles[i]);
        }

        await axios.post(`${server}/api/product/${editingProduct}`, imageForm, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      await fetchProducts();

      toast.success("Product updated");

      setEditingProduct(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { data } = await axios.delete(
        `${server}/api/product/${productId}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      toast.success(data.message || "Deleted");
      await fetchProducts();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="items-center pb-0">
          <CardTitle>Product Inventory Overview</CardTitle>
          <CardDescription>
            Total quantity, sold and remaining stock for all products
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Search */}
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-1/2"
          />

          {/* Table */}
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Total Stock
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Sold</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  paginated.map((product) => {
                    const remaining = product.stock || 0;
                    const totalStock = product.totalStock || product.stock || 0;

                    const stockPct = totalStock
                      ? Math.min(100, (remaining / totalStock) * 100)
                      : 0;

                    return (
                      <tr
                        key={product._id}
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="border-t hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        {/* Product */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0]?.url}
                              alt={product.title}
                              className="w-10 h-10 rounded-md object-cover border flex-shrink-0"
                            />
                            <span className="font-medium truncate max-w-[140px]">
                              {product.title}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {product.category}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          ₹ {product.price}
                        </td>

                        {/* Total Stock */}
                        <td className="px-4 py-3">
                          {product.totalStock || product.stock}
                        </td>

                        {/* Sold */}
                        <td className="px-4 py-3">{product.sold || 0}</td>

                        {/* Remaining + progress bar */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 min-w-[80px]">
                            <span
                              className={
                                remaining <= 0
                                  ? "text-red-500 font-semibold"
                                  : remaining < 5
                                    ? "text-yellow-500 font-semibold"
                                    : "text-green-600 font-semibold"
                              }
                            >
                              {remaining <= 0 ? "Out of Stock" : remaining}
                            </span>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  stockPct > 50
                                    ? "bg-green-500"
                                    : stockPct > 20
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${stockPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(product);
                              }}
                              className="px-3 py-1 text-xs border rounded-md hover:bg-muted transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product._id);
                              }}
                              className="px-3 py-1 text-xs border border-red-200 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-sm">
              <span className="text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length} products
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 border rounded-md transition-colors ${
                          page === p
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {[
              { label: "Title", key: "title" },
              { label: "Price", key: "price", type: "number" },
              { label: "Stock", key: "stock", type: "number" },
            ].map(({ label, key, type = "text" }) => (
              <div key={key} className="space-y-1">
                <label className="text-sm font-medium">{label}</label>

                <Input
                  type={type}
                  value={form[key] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}

            <div className="space-y-3">
              <label className="text-sm font-medium">Category</label>

              <div className="flex gap-2">
                <Input
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />

                <button
                  type="button"
                  onClick={addCategory}
                  className="px-3 py-2 border rounded-md text-sm hover:bg-muted"
                >
                  Add
                </button>
              </div>

              <select
                value={form.category ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {form.category && (
                <button
                  type="button"
                  onClick={() => deleteCategory(form.category)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Delete Selected Category
                </button>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Replace Image</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                className="
    
    cursor-pointer
    border             
    file:mr-4
    file:h-8
    file:rounded-md
   
    file:bg-primary
    file:px-4
    file:text-sm
    file:font-medium
    file:text-primary-foreground

    hover:file:bg-primary/90
    active:file:scale-95

    file:transition-all
    file:duration-200
  "
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-2 border rounded-md text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInventoryTable;
