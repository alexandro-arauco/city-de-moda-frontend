"use client";

import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormSetValue,
} from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { RegisterSchema } from "./schemas/RegisterSchema";

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

interface ScheduleProps {
  control: Control<z.infer<typeof RegisterSchema>>;
  errors: FieldErrors<z.infer<typeof RegisterSchema>>;
  setValue: UseFormSetValue<z.infer<typeof RegisterSchema>>;
}

export function Schedule({ control, errors, setValue }: ScheduleProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const getAvailableDays = (currentValue: string) => {
    return days.filter(
      (day) => day === currentValue || !fields.some((f) => f.day === day)
    );
  };

  return (
    <div className="max-w-full border p-2">
      <FormLabel className="font-bold">Horarios de Atencion</FormLabel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dia</TableHead>
            <TableHead>Hora Apertura</TableHead>
            <TableHead>Hora Cierre</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <FormField
                  control={control}
                  name={`schedule.${index}.day`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            setValue("schedule", [...fields]);
                            field.onChange(value);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un dia" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {getAvailableDays(field.value).map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              <TableCell>
                <FormField
                  control={control}
                  name={`schedule.${index}.initHour`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              <TableCell>
                <FormField
                  control={control}
                  name={`schedule.${index}.endHour`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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

      {errors.schedule && !Array.isArray(errors.schedule) && (
        <p className="text-red-500 text-sm">
          Debe agregar al menos un horario de atencion
        </p>
      )}
      <Button
        className="mt-2"
        type="button"
        onClick={() => {
          append({ day: "", initHour: "", endHour: "" });
        }}
        disabled={fields.length >= 7}
      >
        Agregar
      </Button>
    </div>
  );
}
