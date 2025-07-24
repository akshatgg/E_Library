"use client";

import { User, Calendar } from "lucide-react";

interface PartyDetailsFormProps {
  partyCode: string;
  setPartyCode: (value: string) => void;
  partyName: string;
  setPartyName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  gstNumber: string;
  setGstNumber: (value: string) => void;
  partnerName: string;
  setPartnerName: (value: string) => void;
  firmName: string;
  setFirmName: (value: string) => void;
  place: string;
  setPlace: (value: string) => void;
  assYear: string;
  setAssYear: (value: string) => void;
}

export default function PartyDetailsForm({
  partyCode,
  setPartyCode,
  partyName,
  setPartyName,
  address,
  setAddress,
  email,
  setEmail,
  gstNumber,
  setGstNumber,
  partnerName,
  setPartnerName,
  firmName,
  setFirmName,
  place,
  setPlace,
  assYear,
  setAssYear,
}: PartyDetailsFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <User className="h-5 w-5 mr-2 text-blue-600" />
        Party Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-blue-600 mb-2">
            Party Code:
          </label>
          <div className="flex gap-2">
            <input
              value={partyCode}
              onChange={(e) => setPartyCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 127"
            />
            <button className="px-3 py-2 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors">
              ...
            </button>
          </div>
        </div>

        <div className="md:text-right">
          <label className="block text-sm font-medium text-blue-600 mb-2">
            Code:
          </label>
          <div className="flex md:justify-end gap-2">
            <input
              value={partyCode}
              onChange={(e) => setPartyCode(e.target.value)}
              className="w-20 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="127"
            />
            <button className="px-3 py-2 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors">
              ...
            </button>
          </div>
          <div className="mt-3 text-sm font-medium text-blue-600">
            CompuOffice Home
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-sm font-medium text-blue-600">
            Party Name:
          </span>
          <input
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Abha Gaur"
          />
        </div>

        <div>
          <span className="text-sm font-medium text-blue-600">
            Address:
          </span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="e.g., 35 Khurjey Wala Mohalla, Lashker, Gwalior, MADHYA PRADESH, INDIA, 474001"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-blue-600">
              Email:
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., example@gmail.com"
            />
          </div>
          <div>
            <span className="text-sm font-medium text-blue-600">
              GST Number:
            </span>
            <input
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 07AABCU9603R1ZV"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-blue-600">
              Partner Name:
            </span>
            <input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Raj Kumar Kushwah"
            />
          </div>
          <div>
            <span className="text-sm font-medium text-blue-600">
              Firm Name:
            </span>
            <input
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Anshul Goods Carriers"
            />
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-blue-600">
            Place:
          </span>
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Fatehpur"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <label className="text-sm font-medium text-blue-600">
            Ass. Year:
          </label>
          <select
            value={assYear}
            onChange={(e) => setAssYear(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>2026 - 2027</option>
            <option>2025 - 2026</option>
            <option>2024 - 2025</option>
          </select>
        </div>
      </div>
    </div>
  );
}
