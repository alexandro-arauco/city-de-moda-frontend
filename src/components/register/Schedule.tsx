"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
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

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

const schema = z.object({
  day: z
    .string({ message: "Campo requerido" })
    .min(1, "Por favor seleccione un dia"),
  initHour: z
    .string({ message: "Campo requerido" })
    .min(1, "Por favor seleccione hora de apertura"),
  endHour: z
    .string({ message: "Campo requerido" })
    .min(1, "Por favor seleccione hora de cierre"),
});

export function Schedule() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      day: "",
      initHour: "",
      endHour: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
  };

  return (
    <>
      <div className="max-w-full border p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-3 gap-4 my-2 px-2">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Pais</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un Pais" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {days.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormItem>
                <FormLabel className="font-bold">Hora Apertura</FormLabel>
                <FormControl>
                  <Input type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel className="font-bold">Hora Cierre</FormLabel>
                <FormControl>
                  <Input type="time" />
                </FormControl>
                <FormMessage />
              </FormItem> */}
            </div>
            <Button
              className="w-[100px] m-2 p-2"
              size="default"
              variant="default"
            >
              Anhadir
            </Button>
          </form>
        </Form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dia</TableHead>
              <TableHead>Hora Apertura</TableHead>
              <TableHead>Hora Cierre</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>Domingo</TableCell>
              <TableCell>08:00 am</TableCell>
              <TableCell>18:00 pm</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
