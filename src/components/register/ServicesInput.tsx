import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "./schemas/RegisterSchema";
import { TableCell } from "@/components/ui/table";

interface ServicesInputProps {
  control: Control<z.infer<typeof RegisterSchema>>;
  index: number;
}

export default function ServicesInput({ control, index }: ServicesInputProps) {
  return (
    <TableCell>
      <FormField
        control={control}
        name={`services.${index}.name`}
        render={({ field }) => (
          <Input placeholder="Ingrese el nombre del Servicio" {...field} />
        )}
      />
    </TableCell>
  );
}
