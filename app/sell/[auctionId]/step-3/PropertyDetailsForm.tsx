"use client";

import { useState, useEffect } from "react";

interface Props {
  auction: any;
}

export default function PropertyDetailsForm({ auction }: Props) {
  const [propertyType, setPropertyType] = useState(
    auction.propertyType || ""
  );
  const [beds, setBeds] = useState(auction.beds || "");
  const [baths, setBaths] = useState(auction.baths || "");
  const [sqft, setSqft] = useState(auction.sqft || "");
  const [condition, setCondition] = useState(
    auction.condition || ""
  );
  const [description, setDescription] = useState(
    auction.description || ""
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Autosave
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setSaving(true);

        await fetch(`/api/sell/${auction.id}/step-3`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyType,
            beds,
            baths,
            sqft,
            condition,
            description,
          }),
        });
      } catch (err) {
        console.error("Autosave failed:", err);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [
    propertyType,
    beds,
    baths,
    sqft,
    condition,
    description,
    auction.id,
  ]);

  const generateDescription = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/sell/${auction.id}/generate-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyType,
            beds,
            baths,
            sqft,
            condition,
            cityStateZip: auction.cityStateZip,
          }),
        }
      );

      const data = await response.json();

      if (data.description) {
        setDescription(data.description);
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <select
        className="w-full border rounded-lg px-4 py-2"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="">Property Type</option>
        <option value="Single Family">Single Family</option>
        <option value="Multi Family">Multi Family</option>
        <option value="Condo">Condo</option>
        <option value="Townhome">Townhome</option>
      </select>

      <input
        type="number"
        placeholder="Bedrooms"
        className="w-full border rounded-lg px-4 py-2"
        value={beds}
        onChange={(e) => setBeds(e.target.value)}
      />

      <input
        type="number"
        placeholder="Bathrooms"
        className="w-full border rounded-lg px-4 py-2"
        value={baths}
        onChange={(e) => setBaths(e.target.value)}
      />

      <input
        type="number"
        placeholder="Square Feet"
        className="w-full border rounded-lg px-4 py-2"
        value={sqft}
        onChange={(e) => setSqft(e.target.value)}
      />

      <select
        className="w-full border rounded-lg px-4 py-2"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Condition</option>
        <option value="Turnkey">Turnkey</option>
        <option value="Light Rehab">Light Rehab</option>
        <option value="Heavy Rehab">Heavy Rehab</option>
      </select>

      <button
        onClick={generateDescription}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50"
      >
        {loading
          ? "✨ Generating description..."
          : "✨ Generate Description"}
      </button>

      <textarea
        rows={6}
        className="w-full border rounded-lg px-4 py-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="text-sm text-gray-500">
        {saving ? "Saving..." : "All changes saved"}
      </div>

      <a
        href={`/sell/${auction.id}/step-4`}
        className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm"
      >
        Continue →
      </a>
    </div>
  );
}
