import Loading from "@/components/Loading.jsx";
import ProductCard from "@/components/ProductCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.jsx";
import { cartData } from "@/context/CartContext.jsx";
import { ProductData } from "@/context/ProductContext.jsx";
import { UserData } from "@/context/UserContext.jsx";
import { server } from "@/main";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Edit,
  Loader2,
  X,
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  Trash2,
  Pencil,
} from "lucide-react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading, categories } =
    ProductData();

  const { addToCart } = cartData();
  const { id } = useParams();

  const { isAuth, user } = UserData();

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id);
  };

  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [wishlist, setWishlist] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const reviews = product?.reviews || [];

  const averageRating = product?.rating || 0;

  const updateHandler = () => {
    setShow(!show);
    setCategory(product.category);
    setTitle(product.title);
    setDescription(product.description);
    setStock(product.stock);
    setPrice(product.price);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { title, description, price, stock, category },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const [updatedImages, setUpdatedImages] = useState(null);

  const handleSubmitImage = async (e) => {
    e.preventDefault();

    if (!updatedImages || updatedImages.length === 0) {
      return toast.error("Please select new images");
    }

    setBtnLoading(true);

    const formData = new FormData();

    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(data.message);

      fetchProduct(id);

      setUpdatedImages(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update images");
    } finally {
      setBtnLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewName || !reviewComment) {
      return toast.error("Please fill all fields");
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}/review`,
        {
          name: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);

      fetchProduct(id);

      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  const deleteReview = async (reviewId) => {
    try {
      const { data } = await axios.delete(
        `${server}/api/product/${id}/review/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);

      fetchProduct(id);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {user && user.role === "admin" && (
            <div className="w-75 md:w-112.5 m-auto mb-5">
              <Button onClick={updateHandler}>{show ? <X /> : <Edit />}</Button>
              {show && (
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="Product Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Product description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                    >
                      {categories.map((e) => (
                        <option value={e} key={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Price</Label>
                    <Input
                      placeholder="Product Price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Stock</Label>
                    <Input
                      placeholder="Product Stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={btnLoading}
                    onClick={submitHandler}
                  >
                    {btnLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating Product...
                      </>
                    ) : (
                      "Update Product"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          {product && (
            <div>
              <div className="flex flex-col lg:flex-row items-start gap-14">
                <div className="w-full lg:w-[500px] overflow-hidden rounded-2xl border">
                  <Carousel>
                    <CarouselContent>
                      {product.images &&
                        product.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <img
                              src={image.url}
                              alt={`Product ${index + 1}`}
                              className="
w-full h-[500px] object-cover rounded-2xl
transition-all duration-500
hover:scale-105
cursor-zoom-in
"
                            />
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                  {user && user.role === "admin" && (
                    <form
                      onSubmit={handleSubmitImage}
                      className="flex flex-col gap-4"
                    >
                      <div>
                        <Label className="mb-4 mt-4">Upload New Images:</Label>
                        <input
                          type="file"
                          name="files"
                          id="files"
                          multiple
                          accept="image/*"
                          onChange={(e) => setUpdatedImages(e.target.files)}
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
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={btnLoading}
                      >
                        {btnLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating Images...
                          </>
                        ) : (
                          "Update Images"
                        )}
                      </Button>
                    </form>
                  )}
                </div>

                <div className="w-full lg:w-1/2 space-y-6 sticky top-24">
                  <div className="flex items-center gap-3">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      Bestseller
                    </span>

                    <button
                      onClick={() => setWishlist(!wishlist)}
                      className="border rounded-full p-2 hover:bg-red-100 transition"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          wishlist ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <h1 className="text-4xl font-bold leading-tight">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i <= Math.round(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="font-medium">
                      {averageRating.toFixed(1)}
                    </span>

                    <div className="text-muted-foreground">
                      ({product.numReviews} reviews)
                      <div className="space-y-2 pt-4">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm w-6">{star}★</span>

                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${Math.random() * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-4xl font-bold text-primary">
                    ₹ {product.price}
                  </p>

                  <p className="text-lg leading-7 text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="border rounded-2xl p-5 bg-muted/40 space-y-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-green-500" />
                      <span>Free delivery within 3-5 days</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-5 h-5 text-blue-500" />
                      <span>7 Days Easy Return</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-purple-500" />
                      <span>100% Secure Payments</span>
                    </div>
                  </div>

                  {isAuth ? (
                    <>
                      {product.stock <= 0 ? (
                        <p className="text-red-600 text-2xl font-semibold">
                          Out of Stock
                        </p>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-green-600 font-medium">
                            In Stock ({product.stock} left)
                          </p>

                          <Button
                            onClick={addToCartHandler}
                            className="w-full h-12 text-lg rounded-xl cursor-pointer"
                          >
                            Add To Cart
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-blue-500">
                      Please Login to add something in cart
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-20">
                <h2 className="text-3xl font-bold mb-10">Customer Reviews</h2>

                <div className="grid lg:grid-cols-2 gap-10">
                  <form
                    onSubmit={submitReview}
                    className="space-y-5 border rounded-2xl p-6"
                  >
                    <Input
                      placeholder="Your Name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />

                    <textarea
                      placeholder="Write your review..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full border rounded-xl p-4 min-h-[120px] bg-background"
                    />

                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full border rounded-xl p-3 bg-background dark:bg-gray-900"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>

                    <Button type="submit" className="w-full">
                      Submit Review
                    </Button>
                  </form>

                  <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <div
                          key={index}
                          className="
border rounded-2xl p-5 bg-muted/30
hover:shadow-xl transition-all duration-300
hover:-translate-y-1
"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {review.name}
                              </h3>

                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                Verified Purchase
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              {user?._id === review.user && (
                                <button
                                  onClick={() => setEditingReview(review)}
                                  className="text-blue-500"
                                >
                                  <Pencil className="w-5 h-5" />
                                </button>
                              )}
                              {(user?._id === review.user ||
                                user?.role === "admin") && (
                                <button
                                  onClick={() => deleteReview(review._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="mt-4 text-muted-foreground leading-7">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No Reviews Yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-20 grid md:grid-cols-3 gap-6">
                <div className="border rounded-2xl p-6 hover:shadow-lg transition">
                  <BadgeCheck className="w-10 h-10 mb-4 text-green-500" />
                  <h3 className="font-semibold text-xl mb-2">
                    Premium Quality
                  </h3>
                  <p className="text-muted-foreground">
                    Carefully crafted premium product quality.
                  </p>
                </div>

                <div className="border rounded-2xl p-6 hover:shadow-lg transition">
                  <Truck className="w-10 h-10 mb-4 text-blue-500" />
                  <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
                  <p className="text-muted-foreground">
                    Safe and quick shipping available.
                  </p>
                </div>

                <div className="border rounded-2xl p-6 hover:shadow-lg transition">
                  <ShieldCheck className="w-10 h-10 mb-4 text-purple-500" />
                  <h3 className="font-semibold text-xl mb-2">
                    Secure Shopping
                  </h3>
                  <p className="text-muted-foreground">
                    Encrypted and secure checkout system.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {relatedProduct?.length > 0 && (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="mt-12">
              <h2 className="text-xl font-bold px-4">Related Products</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {relatedProduct.map((e) => (
                  <ProductCard key={e._id} product={e} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
