"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { TextField, Button, Switch, FormControlLabel, Paper } from "@mui/material";

function CouponFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useModal();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    code: "",
    discountAmount: 0,
    isPercentage: false,
    expirationDate: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/coupons/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            code: data.code || "",
            discountAmount: data.discountAmount || 0,
            isPercentage: data.isPercentage || false,
            expirationDate: data.expirationDate ? new Date(data.expirationDate).toISOString().split('T')[0] : "",
            isActive: data.isActive !== undefined ? data.isActive : true,
          });
        });
    }
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/admin/coupons/${id}` : "/api/admin/coupons";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin/coupons");
    } else {
      showAlert("Error", "Error saving coupon");
    }
  };

  return (
    <Paper className="p-6 max-w-xl mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit Coupon" : "Add Coupon"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
        <TextField label="Code" name="code" value={formData.code} onChange={handleChange} required />
        <TextField label="Discount Amount" name="discountAmount" type="number" value={formData.discountAmount} onChange={handleChange} required />
        
        <FormControlLabel
          control={<Switch name="isPercentage" checked={formData.isPercentage} onChange={handleChange} />}
          label="Is Percentage Discount?"
        />
        
        <TextField 
          label="Expiration Date" 
          name="expirationDate" 
          type="date" 
          value={formData.expirationDate} 
          onChange={handleChange} 
          InputLabelProps={{ shrink: true }} 
          required 
        />
        
        <FormControlLabel
          control={<Switch name="isActive" checked={formData.isActive} onChange={handleChange} />}
          label="Is Active?"
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outlined" onClick={() => router.push("/admin/coupons")}>Cancel</Button>
          <Button variant="contained" type="submit">Save</Button>
        </div>
      </form>
    </Paper>
  );
}

export default function CouponForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CouponFormContent />
    </Suspense>
  );
}
