import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";

import { FieldValues, Path } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  form: UseFormReturn<T, T, T>;
  name: Path<T>;
  label: string;
  placeholder: string;
}

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: FormInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
