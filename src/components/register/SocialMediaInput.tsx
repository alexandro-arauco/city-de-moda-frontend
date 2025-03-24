/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { Control, UseFormSetValue } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "./schemas/RegisterSchema";

interface SocialMediaInputProps {
  control: Control<z.infer<typeof RegisterSchema>>;
  index: number;
  setValue: UseFormSetValue<z.infer<typeof RegisterSchema>>;
  fields: any;
}

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

export default function SocialMediaInput({
  control,
  index,
  setValue,
  fields,
}: SocialMediaInputProps) {
  return (
    <>
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
            <Input placeholder="Ingrese la URL de la red social" {...field} />
          )}
        />
      </TableCell>
    </>
  );
}
