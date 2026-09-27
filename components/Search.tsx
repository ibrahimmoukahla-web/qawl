import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export default function InputGroupKbd({
  category,
  defaultValue,
}: {
  category?: string;
  defaultValue?: string;
}) {
  return (
    <form method="GET">
      {/* نحافظ على category عندما نبحث */}
      <input
        type="hidden"
        name="category"
        value={category ?? ""}
      />

      <InputGroup className="max-w-sm bg-[#111634] border border-[#242b5c]">
        <InputGroupInput
          name="q"
          placeholder="Search..."
          defaultValue={defaultValue}

        />

        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>

        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
