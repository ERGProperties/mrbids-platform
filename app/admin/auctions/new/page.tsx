"use client";

import { useState } from "react";

export default function NewAuctionPage() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    addressLine: "",
    cityStateZip: "",
    startingBid: "",
    bidIncrement: "",
    arv: "",
    startAt: "",
    endAt: "",
    imagesPath: "",
  });

  function update(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("NEW AUCTION (preview only):", form);

    alert(
      "Auction validated successfully.\n\nNext step will persist to database."
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Create New Auction
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6"
        >
          <Input label="Title" name="title" onChange={update} required />
          <Input label="Slug" name="slug" onChange={update} required />
          <Input
            label="Address Line"
            name="addressLine"
            onChange={update}
            required
          />
          <Input
            label="City, State ZIP"
            name="cityStateZip"
            onChange={update}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Starting Bid"
              name="startingBid"
              onChange={update}
              required
            />
            <Input
              label="Bid Increment"
              name="bidIncrement"
              onChange={update}
              required
            />
            <Input label="ARV" name="arv" onChange={update} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Auction Start (ISO)"
              name="startAt"
              onChange={update}
              required
            />
            <Input
              label="Auction End (ISO)"
              name="endAt"
              onChange={update}
              required
            />
          </div>

          <Input
            label="Images Path (public/...)"
            name="imagesPath"
            onChange={update}
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-full text-sm font-medium"
          >
            Validate Auction
          </button>
        </form>
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  onChange,
  required,
}: {
  label: string;
  name: string;
  onChange: any;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        name={name}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
      />
    </div>
  );
}
