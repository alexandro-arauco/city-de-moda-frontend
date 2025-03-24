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
import {
  Control,
  ControllerRenderProps,
  FieldArrayWithId,
  useFieldArray,
  UseFormSetValue,
} from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "./schemas/RegisterSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SocialMediaProps {
  control: Control<z.infer<typeof RegisterSchema>>;
  setValue: UseFormSetValue<z.infer<typeof RegisterSchema>>;
}

export default function SocialMedia({ control, setValue }: SocialMediaProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialMedia",
  });

  const social_media = [
    "Facebook",
    "Instagram",
    "Twitter",
    "LinkedIn",
    "Pinterest",
    "TikTok",
    "YouTube",
    "Otra",
  ];

  return (
    <div className="max-w-full border p-2">
      <FormLabel className="font-bold">Redes Sociales</FormLabel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Red Social</TableHead>
            <TableHead>URL / Link</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <FormField
                  control={control}
                  name={`socialMedia.${index}.name`}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        setValue("socialMedia", [...fields]);
                        field.onChange(value);
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una red social" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {social_media.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`socialMedia.${index}.url`}
                  render={({ field }) => (
                    <Input
                      placeholder="Ingrese la URL de la red social"
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
          append({ name: "", url: "" });
        }}
      >
        Agregar
      </Button>
    </div>
  );
}
