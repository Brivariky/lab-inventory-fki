// updated dashboard page with product support

"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ItemUnit {
  id: number;
  code: string;
  condition: string;
}

interface NewItem {
  name: string;
  quantity: number;
  condition: string;
  lab: string;
  description: string;
  units: ItemUnit[];
  createdAt: number;
}

interface Product {
  id: number;
  name: string;
  lab: string;
  description: string;
  createdAt: number;
}

const labOptions = [
  "LAB FKI",
  "LAB LABORAN",
  "LAB SI",
  "LAB RPL",
  "LAB JARKOM",
  "LAB SIC",
];

const labMap: Record<string, number> = {
  "LAB FKI": 1,
  "LAB LABORAN": 2,
  "LAB SI": 3,
  "LAB RPL": 4,
  "LAB JARKOM": 5,
  "LAB SIC": 6,
};

export default function DashboardPage() {
  const [items, setItems] = useState<NewItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<NewItem>({
    name: "",
    quantity: 1,
    condition: "Baik",
    lab: labOptions[0],
    description: "",
    units: [{ id: 0, code: "", condition: "Baik" }],
    createdAt: Date.now(),
  });
  const [productForm, setProductForm] = useState<Product>({
    id: 0,
    name: "",
    lab: labOptions[0],
    description: "",
    createdAt: Date.now(),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemRes = await axios.get("/items");
        const productRes = await axios.get("/products");

        // Pastikan ambil array yang benar dari respons
        const fetchedItems = Array.isArray(itemRes.data)
          ? itemRes.data
          : itemRes.data.data ?? [];
        const fetchedProducts = Array.isArray(productRes.data)
          ? productRes.data
          : productRes.data.data ?? [];

        setItems(fetchedItems);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (field: keyof NewItem, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleProductChange = (field: keyof Product, value: any) => {
    setProductForm({ ...productForm, [field]: value });
  };

  const handleUnitCodeChange = (index: number, value: string) => {
    const updatedUnits = [...form.units];
    updatedUnits[index].code = value;
    setForm({ ...form, units: updatedUnits });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        quantity: form.quantity,
        condition: form.condition,
        lab_id: labMap[form.lab],
        description: form.description,
        units: form.units.map((u) => ({
          code: u.code,
          condition: form.condition,
        })),
      };

      await axios.post("/items", payload);

      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit item:", err);
    }
  };

  const handleProductSubmit = async () => {
    try {
      const payload = {
        product_name: productForm.name,
        lab_id: labMap[productForm.lab], // Gunakan mapping ID lab seperti item
        description: productForm.description,
      };

      await axios.post("/products", payload);
      setIsProductModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit product:", err);
    }
  };

  {
    /*const latestActivity = [...items, ...products]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);*/
  }
  const countItems = (lab: string) =>
    items.filter((item) => item.lab === lab).length;
  const countProducts = (lab: string) =>
    products.filter((p) => p.lab === lab).length;

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    labOptions.forEach((lab) => {
      const itemData = items
        .filter((item) => item.lab === lab)
        .map((item) => ({
          Name: item.name,
          Quantity: item.quantity,
          Condition: item.condition,
          Description: item.description,
        }));

      const productData = products
        .filter((product) => product.lab === lab)
        .map((product) => ({
          Name: product.name,
          Description: product.description,
        }));

      const itemSheet = XLSX.utils.json_to_sheet(itemData || []);
      const productSheet = XLSX.utils.json_to_sheet(productData || []);

      XLSX.utils.book_append_sheet(workbook, itemSheet, `${lab}_Items`);
      XLSX.utils.book_append_sheet(workbook, productSheet, `${lab}_Products`);
    });

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "LabInventory.xlsx"
    );
  };
  return (
    <div className="text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Item
        </button>
        <button
          onClick={() => setIsProductModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add New Product
        </button>
        <button
          onClick={exportToExcel}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Export Excel
        </button>
      </div>

      {/* Modal Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full">
            <div className="mb-4">
              <label className="block font-semibold">Nama Item</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Jumlah</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border rounded p-2"
                  value={form.quantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value) || 1;
                    const updatedUnits = Array.from(
                      { length: qty },
                      (_, i) => ({
                        id: i,
                        code: form.units[i]?.code || "",
                        condition: form.condition,
                      })
                    );
                    setForm({ ...form, quantity: qty, units: updatedUnits });
                  }}
                />
              </div>
              <div>
                <label className="block font-semibold">Kondisi Default</label>
                <select
                  className="w-full border rounded p-2"
                  value={form.condition}
                  onChange={(e) =>
                    handleFormChange("condition", e.target.value)
                  }
                >
                  <option value="Baik">Baik</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>
            </div>
            <div className="my-4">
              <label className="block font-semibold">
                Kode per Unit (opsional)
              </label>
              <div className="max-h-[250px] overflow-y-auto space-y-1 pr-1">
                {form.units.map((unit, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Unit ${i + 1}`}
                    className="w-full border rounded p-2"
                    value={unit.code}
                    onChange={(e) => handleUnitCodeChange(i, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Lab</label>
                <select
                  className="w-full border rounded p-2"
                  value={form.lab}
                  onChange={(e) => handleFormChange("lab", e.target.value)}
                >
                  {labOptions.map((lab) => (
                    <option key={lab} value={lab}>
                      {lab}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold">Keterangan</label>
                <textarea
                  rows={3}
                  className="w-full border rounded p-2"
                  value={form.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 text-sm rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Simpan Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4">Tambah Produk</h2>
            <label className="block font-semibold">Nama Produk</label>
            <input
              type="text"
              className="w-full border rounded p-2 mb-3"
              value={productForm.name}
              onChange={(e) => handleProductChange("name", e.target.value)}
            />
            <label className="block font-semibold">Keterangan</label>
            <textarea
              className="w-full border rounded p-2 mb-3"
              value={productForm.description}
              onChange={(e) =>
                handleProductChange("description", e.target.value)
              }
            />
            <label className="block font-semibold">Lab</label>
            <select
              className="w-full border rounded p-2 mb-4"
              value={productForm.lab}
              onChange={(e) => handleProductChange("lab", e.target.value)}
            >
              {labOptions.map((lab) => (
                <option key={lab} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={handleProductSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}      {/* Display labs summary */}      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {labOptions.map((lab) => (
          <div key={lab} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"><div className="p-5">
              <h2 className="font-semibold text-lg mb-3 text-gray-900">
                {lab}
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-700 flex justify-between items-center bg-white p-2 rounded">
                  <span>Total Items</span>
                  <span className="font-medium text-[#2F3185]">{countItems(lab)}</span>
                </p>
                <p className="text-sm text-gray-700 flex justify-between items-center bg-white p-2 rounded">
                  <span>Total Produk</span>
                  <span className="font-medium text-[#2F3185]">{countProducts(lab)}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest activity 
      <div>
        <h2 className="text-xl font-bold mb-3">🆕 5 Item & Produk Terbaru</h2>
        <ul className="space-y-2">
          {latestActivity.map((entry, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded">
              {"lab" in entry && "units" in entry ? (
                <>
                  <div className="font-semibold">{entry.name} - {entry.lab}</div>
                  <div className="text-sm text-gray-600">{entry.units.length} unit, kondisi: {entry.condition}</div>
                </>
              ) : (
                <>
                  <div className="font-semibold">🧾 {entry.name} - {entry.lab}</div>
                  <div className="text-sm text-gray-600">{entry.description}</div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>*/}
    </div>
  );
}
