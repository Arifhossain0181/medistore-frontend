"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { DELIVERY_AREAS, VEHICLE_OPTIONS } from "@/lib/delivery-areas";

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

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
      <input name="name" placeholder="Full Name" value={form.name} onChange={onChange} className="w-full rounded border px-3 py-2" required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} className="w-full rounded border px-3 py-2" required />
      <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} className="w-full rounded border px-3 py-2" minLength={6} required />
      <input name="phone" placeholder="Phone Number" value={form.phone} onChange={onChange} className="w-full rounded border px-3 py-2" required />
      <input name="nidNumber" placeholder="NID Number" value={form.nidNumber} onChange={onChange} className="w-full rounded border px-3 py-2" required />
      <input name="licenseNumber" placeholder="Driving License Number" value={form.licenseNumber} onChange={onChange} className="w-full rounded border px-3 py-2" required />
      <select name="vehicleType" value={form.vehicleType} onChange={onChange} className="w-full rounded border px-3 py-2" required>
        <option value="">Select Vehicle Type</option>
        {VEHICLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input name="vehicleRegistrationNo" placeholder="Vehicle Registration Number" value={form.vehicleRegistrationNo} onChange={onChange} className="w-full rounded border px-3 py-2" required />
      <div className="grid grid-cols-1 gap-3 rounded border p-3">
        <p className="text-sm font-medium text-gray-700">Preferred Delivery Area</p>
        <select value={division} onChange={onDivisionChange} className="w-full rounded border px-3 py-2" required>
          <option value="">Select Division</option>
          {DELIVERY_AREAS.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
        <select value={district} onChange={onDistrictChange} className="w-full rounded border px-3 py-2" required disabled={!division}>
          <option value="">Select District</option>
          {districtOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select value={thana} onChange={onThanaChange} className="w-full rounded border px-3 py-2" required disabled={!district}>
          <option value="">Select Thana</option>
          {thanaOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <textarea name="currentAddress" placeholder="Current Address" value={form.currentAddress} onChange={onChange} className="w-full rounded border px-3 py-2" rows={3} required />
      <input name="emergencyContactName" placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={onChange} className="w-full rounded border px-3 py-2" required />
      <input name="emergencyContactPhone" placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={onChange} className="w-full rounded border px-3 py-2" required />

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Delivery Man Application"}
      </button>
    </form>
  );
}
