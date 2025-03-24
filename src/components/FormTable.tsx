import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrayPath, Control, FieldArray, useFieldArray } from "react-hook-form";

import { FieldValues } from "react-hook-form";

interface FormTableProps<T extends FieldValues> {
  title: string;
  columnsHeader: string[];
  control: Control<T>;
  name: ArrayPath<T>;
  object: FieldArray<T, ArrayPath<T>>;
  render: (index: number) => React.ReactNode;
}

export default function FormTable<T extends FieldValues>({
  title,
  columnsHeader,
  control,
  name,
  object,
  render,
}: FormTableProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="max-w-full border p-2">
      <FormLabel className="font-bold">{title}</FormLabel>
      <Table>
        <TableHeader>
          <TableRow>
            {columnsHeader.map((column, index) => (
              <TableHead key={`${index}-${column}`}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              {render(index)}
              <TableCell>
                <Button onClick={() => remove(index)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button className="mt-2" type="button" onClick={() => append(object)}>
        Agregar
      </Button>
    </div>
  );
}
