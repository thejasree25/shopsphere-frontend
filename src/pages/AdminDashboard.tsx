import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent, CSSProperties } from "react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type ProductPayload,
} from "../service/productService";

import type { Product } from "../types/Product";

const emptyForm: ProductPayload = {
  name: "",
  category: "",
  price: 0,
  originalPrice: undefined,
  rating: 0,
  image: "",
  badge: "",
  description: "",
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        ["price", "originalPrice", "rating"].includes(name)
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const payload: ProductPayload = {
      ...form,
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      image: form.image?.trim() || "",
      badge: form.badge?.trim() || "",
      description: form.description?.trim() || "",
    };

    try {
      if (editingId !== null) {
        await updateProduct(editingId, payload);
        setMessage("Product updated successfully.");
      } else {
        await createProduct(payload);
        setMessage("Product added successfully.");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.backendId ?? product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: Number(product.price),
      originalPrice: product.originalPrice,
      rating: product.rating,
      image: product.image,
      badge: product.badge ?? "",
      description: product.description ?? "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(product: Product) {
    const id = product.backendId ?? product.id;

    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ""
    ) {
      setError("Product ID is missing.");
      return;
    }

    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteProduct(id);

      setProducts((previous) =>
        previous.filter(
          (item) =>
            String(item.backendId ?? item.id) !== String(id)
        )
      );

      setMessage("Product deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );
    }
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
  };

  const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
  };

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 20px",
        color: "#111827",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <p
          style={{
            color: "#4f46e5",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 1.5,
          }}
        >
          SHOPSPHERE ADMIN
        </p>

        <h1 style={{ fontSize: 30, fontWeight: 800 }}>
          Product Management
        </h1>

        <p style={{ color: "#6b7280" }}>
          Add, update, and delete products from your database.
        </p>
      </header>

      {error && (
        <p
          role="alert"
          style={{
            padding: 12,
            color: "#991b1b",
            background: "#fef2f2",
            borderRadius: 8,
          }}
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          style={{
            padding: 12,
            color: "#065f46",
            background: "#ecfdf5",
            borderRadius: 8,
          }}
        >
          {message}
        </p>
      )}

      <section
        style={{
          padding: 22,
          marginBottom: 28,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          background: "#fff",
        }}
      >
        <h2 style={{ fontSize: 21, fontWeight: 700 }}>
          {editingId !== null ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <label>
              <span style={labelStyle}>Product Name *</span>
              <input
                style={inputStyle}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span style={labelStyle}>Category *</span>
              <input
                style={inputStyle}
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span style={labelStyle}>Price *</span>
              <input
                style={inputStyle}
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span style={labelStyle}>Original Price</span>
              <input
                style={inputStyle}
                name="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice ?? ""}
                onChange={handleChange}
              />
            </label>

            <label>
              <span style={labelStyle}>Rating</span>
              <input
                style={inputStyle}
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating ?? 0}
                onChange={handleChange}
              />
            </label>

            <label>
              <span style={labelStyle}>Badge</span>
              <input
                style={inputStyle}
                name="badge"
                value={form.badge ?? ""}
                onChange={handleChange}
              />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span style={labelStyle}>Image URL</span>
              <input
                style={inputStyle}
                name="image"
                type="url"
                value={form.image ?? ""}
                onChange={handleChange}
              />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span style={labelStyle}>Description</span>
              <textarea
                style={{ ...inputStyle, minHeight: 80 }}
                name="description"
                value={form.description ?? ""}
                onChange={handleChange}
              />
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18,
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "11px 18px",
                border: 0,
                borderRadius: 8,
                color: "#fff",
                background: "#4f46e5",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Product"
                  : "Add Product"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "11px 18px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <h2 style={{ fontSize: 21, fontWeight: 700 }}>
            Products ({products.length})
          </h2>

          <button
            type="button"
            onClick={() => void loadProducts()}
            style={{
              padding: "9px 14px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found in the backend.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 650,
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>
                    Product
                  </th>
                  <th style={{ padding: 12, textAlign: "left" }}>
                    Category
                  </th>
                  <th style={{ padding: 12, textAlign: "left" }}>
                    Price
                  </th>
                  <th style={{ padding: 12, textAlign: "left" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={String(product.backendId ?? product.id)}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: 42,
                              height: 42,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        )}
                        {product.name}
                      </div>
                    </td>

                    <td style={{ padding: 12 }}>
                      {product.category}
                    </td>

                    <td style={{ padding: 12 }}>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        style={{
                          marginRight: 8,
                          padding: "7px 10px",
                          border: "1px solid #c7d2fe",
                          borderRadius: 7,
                          background: "#eef2ff",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(product)}
                        style={{
                          padding: "7px 10px",
                          border: "1px solid #fecaca",
                          borderRadius: 7,
                          background: "#fef2f2",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}