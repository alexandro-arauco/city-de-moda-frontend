import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { Control } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "./schemas/RegisterSchema";

interface VideosInputProps {
  control: Control<z.infer<typeof RegisterSchema>>;
  index: number;
}

export default function VideosInput({ control, index }: VideosInputProps) {
  return (
    <TableCell>
      <FormField
        control={control}
        name={`videos.${index}.url`}
        render={({ field }) => (
          <>
            <FormControl>
              <Input placeholder="Ingrese URL del Video" {...field} />
            </FormControl>
            <FormMessage />
          </>
        )}
      />
    </TableCell>
  );
}
