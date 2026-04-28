"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type MenuItem = {
  id: number;
  menu_item_name_en: string;
  menu_item_name_kh: string;
  cover_image?: string;
};

type Item = {
  id: number;
  menu_item_id: number;
  price_usd: number;
  price_khr: number;
};

export default function Page() {
  const { standard_id } = useParams();

  const [items, setItems] = useState<Item[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!standard_id) return;

    const fetchData = async () => {
      try {
        const [itemsRes, menuRes] = await Promise.all([
          fetch(
            `/api/admin/catering-standard-items?catering_standard_id=${standard_id}`
          ),
          fetch(`/api/admin/menu-items`),
        ]);

        const itemsJson = await itemsRes.json();
        const menuJson = await menuRes.json();

        setItems(itemsJson.data || []);
        setMenus(menuJson.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [standard_id]);

  const getMenu = (id: number) =>
    menus.find((m) => m.id === id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Standard Items
      </h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const menu = getMenu(item.menu_item_id);

          return (
            <div key={item.id} className="border rounded-xl p-4">
              <img
                src={menu?.cover_image || "/placeholder.png"}
                className="h-40 w-full object-cover rounded"
              />

              <h2 className="font-semibold mt-2">
                {menu?.menu_item_name_en}
              </h2>

              <p className="text-sm text-gray-500">
                {menu?.menu_item_name_kh}
              </p>

              <div className="mt-2 text-sm">
                💲 USD: {item.price_usd} <br />
                💰 KHR: {item.price_khr}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}