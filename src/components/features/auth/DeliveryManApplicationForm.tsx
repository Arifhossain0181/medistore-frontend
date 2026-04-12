"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { DELIVERY_AREAS, VEHICLE_OPTIONS } from "@/lib/delivery-areas";
import { motion } from "framer-motion";

type DeliveryManApplicationFormValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  nidNumber: string;
  licenseNumber: string;
  vehicleType: string;
  vehicleRegistrationNo: string;
  deliveryArea: string;
  currentAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

const initialForm: DeliveryManApplicationFormValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  nidNumber: "",
  licenseNumber: "",
  vehicleType: "",
  vehicleRegistrationNo: "",
  deliveryArea: "",
  currentAddress: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function DeliveryManApplicationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<DeliveryManApplicationFormValues>(initialForm);
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");

  const selectedDivision = DELIVERY_AREAS.find((area) => area.value === division);
  const districtOptions = selectedDivision?.districts ?? [];
  const selectedDistrict = districtOptions.find((item) => item.value === district);
  const thanaOptions = selectedDistrict?.thanas ?? [];
  const selectedVehicle = VEHICLE_OPTIONS.find((option) => option.value === form.vehicleType);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onDivisionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextDivision = e.target.value;
    setDivision(nextDivision);
    setDistrict("");
    setThana("");
  };

  const onDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextDistrict = e.target.value;
    setDistrict(nextDistrict);
    setThana("");
  };

  const onThanaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setThana(e.target.value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const deliveryArea = [selectedDivision?.label, selectedDistrict?.label, thana]
        .filter(Boolean)
        .join(" / ");

      await axios.post(
        "/api/auth/apply-delivery-man",
        {
          ...form,
          vehicleType: selectedVehicle?.label ?? form.vehicleType,
          deliveryArea,
        },
        { withCredentials: true },
      );
      toast.success("Delivery Man application submitted. Admin will review your request.");
      router.push("/auth/login");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to submit delivery man application";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fieldClassName =
    "w-full rounded-xl border border-slate-300/80 bg-white/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.45)] transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600/80 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/40";

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <input name="name" placeholder="Full Name" value={form.name} onChange={onChange} className={fieldClassName} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} className={fieldClassName} required />
      <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} className={fieldClassName} minLength={6} required />
      <input name="phone" placeholder="Phone Number" value={form.phone} onChange={onChange} className={fieldClassName} required />
      <input name="nidNumber" placeholder="NID Number" value={form.nidNumber} onChange={onChange} className={fieldClassName} required />
      <input name="licenseNumber" placeholder="Driving License Number" value={form.licenseNumber} onChange={onChange} className={fieldClassName} required />
      <select name="vehicleType" value={form.vehicleType} onChange={onChange} className={fieldClassName} required>
        <option value="">Select Vehicle Type</option>
        {VEHICLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input name="vehicleRegistrationNo" placeholder="Vehicle Registration Number" value={form.vehicleRegistrationNo} onChange={onChange} className={fieldClassName} required />
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-300/80 bg-slate-50/80 p-3 md:col-span-2 dark:border-slate-700/80 dark:bg-slate-900/40">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preferred Delivery Area</p>
        <select value={division} onChange={onDivisionChange} className={fieldClassName} required>
          <option value="">Select Division</option>
          {DELIVERY_AREAS.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
        <select value={district} onChange={onDistrictChange} className={fieldClassName} required disabled={!division}>
          <option value="">Select District</option>
          {districtOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select value={thana} onChange={onThanaChange} className={fieldClassName} required disabled={!district}>
          <option value="">Select Thana</option>
          {thanaOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <textarea name="currentAddress" placeholder="Current Address" value={form.currentAddress} onChange={onChange} className={`${fieldClassName} md:col-span-2`} rows={3} required />
      <input name="emergencyContactName" placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={onChange} className={fieldClassName} required />
      <input name="emergencyContactPhone" placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={onChange} className={fieldClassName} required />

      <motion.button
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-semibold text-white shadow-[0_18px_30px_-20px_rgba(4,120,87,0.8)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
      >
        {loading ? "Submitting..." : "Submit Delivery Man Application"}
      </motion.button>
    </form>
  );
}
