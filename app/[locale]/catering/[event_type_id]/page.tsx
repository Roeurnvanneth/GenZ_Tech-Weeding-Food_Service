"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Standard = {
  id: number;
  catering_standard_name_en: string;
  catering_standard_name_kh: string;
  cover_image?: string;
  is_special: boolean;
};

export default function CateringStandardPage() {
  const params = useParams();

  const locale = params.locale as string;
  const event_type_id = params.event_type_id as string;

  const [data, setData] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_type_id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/admin/catering-standards?event_type_id=${event_type_id}`
        );

        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [event_type_id]);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <h1 className="text-2xl font-bold col-span-full">
        Catering Standards
      </h1>

      {loading && <p>Loading...</p>}

      {data.map((item) => (
        <Link
          key={item.id}
          href={`/${locale}/catering/${event_type_id}/${item.id}`} // ✅ CORRECT ROUTE
          className="border rounded-xl p-4 hover:shadow"
        >
          <img
            src={item.cover_image || "/placeholder.png"}
            className="h-40 w-full object-cover rounded"
          />

          <h2 className="font-semibold mt-2">
            {item.catering_standard_name_en}
          </h2>

          <p className="text-sm text-gray-500">
            {item.catering_standard_name_kh}
          </p>

          {item.is_special && (
            <span className="text-xs text-red-500">Special</span>
          )}
        </Link>
      ))}
    </div>
  );
}