"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EventType = {
  id: number;
  event_type_name_en: string;
  event_type_name_kh: string;
  cover_image?: string;
};

export default function CateringPage() {
  const [data, setData] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/event-types");
        const json = await res.json();
        setData(json.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <h1 className="text-2xl font-bold col-span-full">Event Types</h1>

      {loading && <p>Loading...</p>}

      {data.map((item) => (
        <Link
          key={item.id}
          href={`catering/${item.id}`}
          className="border rounded-xl p-4 hover:shadow"
        >
          <img
            src={item.cover_image || "/placeholder.png"}
            className="h-40 w-full object-cover rounded"
          />
          <h2 className="font-semibold mt-2">{item.event_type_name_en}</h2>
          <p className="text-sm text-gray-500">{item.event_type_name_kh}</p>
        </Link>
      ))}
    </div>
  );
}
