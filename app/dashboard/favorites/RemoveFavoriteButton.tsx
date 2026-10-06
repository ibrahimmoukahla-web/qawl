"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

import { removeFavorite } from "./actions";

type Props = {
  quoteId: string;
};

export default function RemoveFavoriteButton({ quoteId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFavorite(quoteId);

      if (result.success) {
        setRemoved(true);
      }
    });
  };

  if (removed) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className="transition hover:scale-110 disabled:opacity-50"
      aria-label="Remove from favorites"
    >
      <Heart
        size={22}
        className="fill-red-500 text-red-500"
      />
    </button>
  );
}