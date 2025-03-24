import { Button } from "@/components/ui/button";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Control, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "./schemas/RegisterSchema";

interface ServicesProps {
  control: Control<z.infer<typeof RegisterSchema>>;
}

export default function Services({ control }: ServicesProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  return (
    <div className="max-w-full border p-2">
      <FormLabel className="font-bold">Servicios</FormLabel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <FormField
                  control={control}
                  name={`services.${index}.name`}
                  render={({ field }) => (
                    <Input
                      placeholder="Ingrese el nombre del Servicio"
                      {...field}
                    />
                  )}
                />
              </TableCell>

              <TableCell>
                <Button
                  onClick={() => {
                    remove(index);
                  }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        className="mt-2"
        type="button"
        onClick={() => {
          append({ name: "" });
        }}
      >
        Agregar
      </Button>
    </div>
  );
}
