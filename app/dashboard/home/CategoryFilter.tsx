"use client";

import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

type Props = {
  categories: Category[];
  activeCategory?: string;
};

export default function CategoryFilter({
  categories,
  activeCategory,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none">
      {categories.map((category) => {
        const active =
          activeCategory === category.slug;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              router.push(
                `/dashboard/home?category=${category.slug}`
              );
            }}
            style={{
              color: category.color,
              backgroundColor: active
                ? `${category.color}25`
                : `${category.color}10`,
              borderColor: `${category.color}50`,
            }}
            className="
              shrink-0
              flex items-center
              border
              rounded-2xl
              px-3 py-1
              transition-all duration-200
              hover:scale-105
            "
          >
            {category.name}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => {
          router.push("/dashboard/home");
        }}
        className="
          shrink-0
          px-3 py-1
          rounded-2xl
          border border-[#282e5c]
          text-gray-300
          hover:bg-[#8B5CF6]/10
          transition
        "
      >
        All
      </button>
    </div>
  );
}