// LabPageTemplate.tsx - versi lengkap dan rapi
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";

interface ItemUnit {
  id: number;
  code: string;
  condition: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  lab_id: number;
  units: ItemUnit[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  lab_id: number;
}

interface Props {
  labId: number;
  labName: string;
}

export default function LabPageTemplate({ labId, labName }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [itemForm, setItemForm] = useState({ name: "", description: "" });

  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [descContent, setDescContent] = useState("");

  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [selectedItemForUnit, setSelectedItemForUnit] = useState<Item | null>(
    null
  );
  const [unitForm, setUnitForm] = useState({
    count: 1,
    condition: "Baik",
    codes: [""],
  });

  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [selectedItemForEditUnit, setSelectedItemForEditUnit] =
    useState<Item | null>(null);
  const [editUnitSelection, setEditUnitSelection] = useState<
    { id: number; code: string; condition: string; checked: boolean }[]
  >([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] =
    useState<Item | null>(null);
  const [deleteUnitCount, setDeleteUnitCount] = useState(1);
  const [deleteSelection, setDeleteSelection] = useState<
    { id: number; code: string; condition: string; checked: boolean }[]
  >([]);

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
    fetchProducts();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/items");
      const allItems = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      const filtered = allItems.filter((item: Item) => item.lab_id === labId);
      setItems(filtered);
    } catch (err) {
      console.error("Gagal fetch items:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      const allProducts = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      const filtered = allProducts.filter((p: Product) => p.lab_id === labId);
      setProducts(filtered);
    } catch (err) {
      console.error("Gagal fetch products:", err);
    }
  };

  const openEditItemModal = (item: Item) => {
    setEditItem(item);
    setItemForm({ name: item.name, description: item.description });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (field: string, value: string) => {
    setItemForm({ ...itemForm, [field]: value });
  };

  const saveEditItem = async () => {
    if (!editItem) return;
    try {
      await axios.put(`/items/${editItem.id}`, itemForm);
      setIsEditModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error("Gagal update item:", err);
    }
  };

  const submitAddUnits = async () => {
    if (!selectedItemForUnit) return;

    try {
      await axios.post("/item-units", {
        item_id: selectedItemForUnit.id,
        code: unitForm.codes,
        condition: unitForm.condition,
      });

      setIsAddUnitModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error("Gagal tambah unit:", err);
    }
  };

  const submitEditUnits = async () => {
    try {
      await Promise.all(
        editUnitSelection
          .filter((u) => u.checked)
          .map((u) => {
            const newCondition = u.condition === "Baik" ? "Rusak" : "Baik";
            return axios.put(`/item-units/${u.id}`, {
              condition: newCondition,
            });
          })
      );
      setIsEditUnitModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error("Gagal update kondisi unit:", err);
    }
  };

  const submitDeleteUnits = async () => {
    try {
      const selected = deleteSelection.filter((u) => u.checked);
      await Promise.all(
        selected.map((u) => axios.delete(`/item-units/${u.id}`))
      );
      if (selected.length === selectedItemForDelete?.units.length) {
        await axios.delete(`/items/${selectedItemForDelete.id}`);
      }
      setIsDeleteModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error("Gagal hapus unit/item:", err);
    }
  };

  const submitEditProduct = async () => {
    if (!editingProduct) return;
    try {
      await axios.put(`/products/${editingProduct.id}`, {
        product_name: editForm.name,
        description: editForm.description,
        lab_id: editingProduct.lab_id,
      });
      setIsEditProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Gagal edit produk:", err);
    }
  };

  const submitDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await axios.delete(`/products/${deletingProduct.id}`);
      setIsDeleteProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Gagal hapus produk:", err);
    }
  };  return (    
  <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Inventaris {labName}</h1>      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-[#F59E0B]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Cari nama item, kode unit, atau produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 shadow-md transition-all duration-200 hover:border-[#F59E0B]/50"
        />
      </div>
      <div className="bg-white rounded-xl shadow-md border-0 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D]">
          <h2 className="text-xl font-semibold text-white">Daftar Item</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Keterangan</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Jumlah</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Baik</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Rusak</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items
                .filter(
                  (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.units.some((unit) =>
                      unit.code?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
                .map((item) => {
                  const baik = item.units.filter(
                    (u) => u.condition === "Baik"
                  ).length;
                  const rusak = item.units.filter(
                    (u) => u.condition === "Rusak"
                  ).length;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() => {
                          setDescContent(item.description);
                          setIsDescModalOpen(true);
                        }}
                      >
                        {item.description.slice(0, 25)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">{item.units.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-center">{baik}</td>                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium text-center">{rusak}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="p-2 text-[#F59E0B] hover:bg-[#FEF3C7] rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit Item"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItemForUnit(item);
                              setUnitForm({
                                count: 1,
                                condition: "Baik",
                                codes: [""],
                              });
                              setIsAddUnitModalOpen(true);
                            }}
                            className="p-2 text-[#10B981] hover:bg-[#D1FAE5] rounded-lg transition-all duration-200 hover:scale-110"
                            title="Tambah Unit"
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItemForEditUnit(item);
                              setEditUnitSelection(
                                item.units.map((u) => ({
                                  id: u.id,
                                  code: u.code,
                                  condition: u.condition,
                                  checked: false,
                                }))
                              );
                              setIsEditUnitModalOpen(true);
                            }}
                            className="p-2 text-[#6366F1] hover:bg-[#E0E7FF] rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit Unit"
                          >
                            ⚙
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItemForDelete(item);
                              setDeleteUnitCount(1);
                              setDeleteSelection(
                                item.units.map((u) => ({
                                  id: u.id,
                                  code: u.code,
                                  condition: u.condition,
                                  checked: false,
                                }))
                              );
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-all duration-200 hover:scale-110"
                            title="Hapus Item"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>      <div className="bg-white rounded-xl shadow-md border-0 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D]">
          <h2 className="text-xl font-semibold text-white">Produk</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Nama Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Deskripsi</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setEditForm({ name: p.name, description: p.description });
                            setIsEditProductModalOpen(true);
                          }}
                          className="p-2 text-[#F59E0B] hover:bg-[#FEF3C7] rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit Produk"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProduct(p);
                            setIsDeleteProductModalOpen(true);
                          }}
                          className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-all duration-200 hover:scale-110"
                          title="Hapus Produk"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {isDescModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Keterangan Lengkap</h2>
            <p className="whitespace-pre-wrap break-words">{descContent}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDescModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <div className="mb-2">
              <label className="block font-semibold">Nama Item</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={itemForm.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block font-semibold">Keterangan</label>
              <textarea
                className="w-full border rounded p-2"
                value={itemForm.description}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={saveEditItem}
                className="px-4 py-2 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white rounded-lg transition-colors duration-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddUnitModalOpen && selectedItemForUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              Tambah Unit untuk {selectedItemForUnit.name}
            </h2>

            <div className="mb-2">
              <label className="block font-semibold">Jumlah Unit</label>
              <input
                type="number"
                min={1}
                max={99}
                value={unitForm.count}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  const codes = [...unitForm.codes];
                  while (codes.length < count) codes.push("");
                  while (codes.length > count) codes.pop();
                  setUnitForm({ ...unitForm, count, codes });
                }}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-2">
              <label className="block font-semibold">Kondisi</label>
              <select
                className="w-full border rounded p-2"
                value={unitForm.condition}
                onChange={(e) =>
                  setUnitForm({ ...unitForm, condition: e.target.value })
                }
              >
                <option value="Baik">Baik</option>
                <option value="Rusak">Rusak</option>
              </select>
            </div>

            {unitForm.count > 0 && (
              <div className="mb-2 max-h-[200px] overflow-auto">
                <label className="block font-semibold mb-1">
                  Kode Unit (Opsional)
                </label>
                {unitForm.codes.map((code, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Unit ${i + 1}`}
                    value={code}
                    onChange={(e) => {
                      const updated = [...unitForm.codes];
                      updated[i] = e.target.value;
                      setUnitForm({ ...unitForm, codes: updated });
                    }}
                    className="w-full border rounded p-2 mb-1"
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsAddUnitModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={submitAddUnits}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditUnitModalOpen && selectedItemForEditUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              Edit Unit untuk {selectedItemForEditUnit.name}
            </h2>

            {editUnitSelection.map((editUnit, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={editUnit.checked}
                  onChange={(e) => {
                    const updated = [...editUnitSelection];
                    updated[i].checked = e.target.checked;
                    setEditUnitSelection(updated);
                  }}
                  className="mr-2"
                />                <span className="text-sm">
                  {editUnit.code || `Unit ${i + 1}`} — kondisi: {editUnit.condition}
                </span>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsEditUnitModalOpen(false)}
                className="ml-auto px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={submitEditUnits}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Ubah Unit
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && selectedItemForDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              Hapus Unit dari {selectedItemForDelete.name}
            </h2>

            <div className="mb-2">
              <label className="block font-semibold">
                Jumlah Unit yang akan dihapus
              </label>
              <input
                type="number"
                min={1}
                max={selectedItemForDelete.units.length}
                value={deleteUnitCount}
                onChange={(e) => setDeleteUnitCount(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-2">
              <label className="block font-semibold">
                Pilih Unit yang akan dihapus
              </label>
              {deleteSelection.map((unit, i) => (
                <div key={unit.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={unit.checked}
                    disabled={
                      deleteSelection.filter((u) => u.checked).length >=
                        deleteUnitCount && !unit.checked
                    }
                    onChange={(e) => {
                      const updated = [...deleteSelection];
                      updated[i].checked = e.target.checked;
                      setDeleteSelection(updated);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {unit.code || `Unit ${i + 1}`} — {unit.condition}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-600 mt-2">
              {deleteSelection.filter((u) => u.checked).length ===
              selectedItemForDelete.units.length
                ? "Semua unit dipilih. Item akan ikut dihapus."
                : `${
                    deleteSelection.filter((u) => u.checked).length
                  } unit akan dihapus.`}
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={submitDeleteUnits}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
            <div className="mb-2">
              <label className="block font-semibold">Nama Produk</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label className="block font-semibold">Deskripsi</label>
              <textarea
                className="w-full border rounded p-2"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditProductModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={submitEditProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteProductModalOpen && deletingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Hapus Produk</h2>
            <p className="text-sm text-gray-700 mb-4">
              Apakah kamu yakin ingin menghapus produk
              <strong> {deletingProduct.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteProductModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Batal
              </button>
              <button
                onClick={submitDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
