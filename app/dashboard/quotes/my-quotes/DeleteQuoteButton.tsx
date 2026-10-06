
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { deleteQuoteAction } from "./actions";

type Props = {
  quoteId: string;
};

export default function DeleteQuoteButton({
  quoteId,
}: Props) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleDelete = async (
    formData: FormData,
  ): Promise<void> => {
    setError("");
    setPending(true);

    try {
      const result = await deleteQuoteAction(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete quote error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this quote?",
      )
    ) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <form
        action={handleDelete}
        onSubmit={handleSubmit}
      >
        <input
          type="hidden"
          name="quoteId"
          value={quoteId}
        />

        <button
          type="submit"
          disabled={pending}
          aria-label="Delete quote"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </form>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

