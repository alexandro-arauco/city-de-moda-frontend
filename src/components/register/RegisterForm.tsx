"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCountryStatesContext } from "@/context/CountryStatesContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { MultiSelect } from "@/components/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoriesResponse } from "@/interfaces/category";
import { SelectOptions } from "@/interfaces/multiselect";
import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { Schedule } from "./Schedule";
import { SingleImageUpload } from "@/components/ImageUpload/SingleImageUpload";
import { MultipleImageUpload } from "@/components/ImageUpload/MultipleImageUpload";

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre del Negocio debe tener al menos 2 caracteres.",
  }),
  address: z.string({ message: "Campo requerido" }).min(5, {
    message: "El campo direccion no puede estar vacio",
  }),
  country: z
    .string({ message: "Campo requerido" })
    .min(1, "Por favor seleccione un Pais"),
  city: z
    .string({ message: "Campo requerido" })
    .min(1, "Por favor seleccione una ciudad"),
  phone: z
    .string({ message: "Campo requerido" })
    .min(1, "Ingrese un numero telefono valido"),
  categories: z
    .array(
      z.object({
        label: z.string(),
        value: z.any(),
      })
    )
    .min(1, {
      message: "Debe seleccionar al menos una categoría.",
    }),
  schedule: z
    .array(
      z.object({
        day: z.string().min(1, { message: "Requerido" }),
        initHour: z.string().min(1, { message: "Requerido" }),
        endHour: z.string().min(1, { message: "Requerido" }),
      })
    )
    .min(1, "Debe agregar al menos un horario de atencion"),
  mainImage: z.any().refine((val) => val !== null, {
    message: "Debe subir una imagen principal",
  }),
  additionalImages: z.array(z.any()).optional(),
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterForm() {
  const { countries } = useCountryStatesContext();
  const [categoriesData, setCategoriesData] = useState<SelectOptions[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      country: "",
      city: "",
      categories: [],
      schedule: [],
      mainImage: null,
      additionalImages: [],
    },
  });
  const selectedCountry = form.watch("country");

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      form.setValue("city", ""); // Reset city when country changes
    }
  }, [selectedCountry, form]);

  const getCategories = async () => {
    const categoriesData = (await fetch(`${apiUrl}/api/category`).then((res) =>
      res.json()
    )) as CategoriesResponse;

    setCategoriesData(
      categoriesData.data.map((c) => ({
        label: c.name,
        value: c.id,
      }))
    );
  };

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    // Append all form fields
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "mainImage" && key !== "additionalImages") {
        formData.append(key, JSON.stringify(value));
      }
    });

    // Append images
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    formData.append("lat", "");
    formData.append("lng", "");

    additionalImages.forEach((file) => {
      formData.append(`additionalImages`, file);
    });

    const response = await fetch("http://localhost:8000/api/place", {
      method: "POST",
      body: formData,
    })
      .then((data) => data.json())
      .catch((error) => console.log({ error }));

    console.log({ response });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          name="name"
          form={form}
          label="Nombre del Negocio"
          placeholder="Ingrese el Nombre del Negocio"
        />

        <FormField
          control={form.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Imagen Principal</FormLabel>
              <FormControl>
                <SingleImageUpload
                  onImageChange={(file) => {
                    setMainImage(file);
                    field.onChange(file);
                  }}
                  label="Subir Imagen Principal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Imágenes Adicionales</FormLabel>
              <FormControl>
                <MultipleImageUpload
                  onImagesChange={(files) => {
                    setAdditionalImages(files);
                    field.onChange(files);
                  }}
                  maxImages={5}
                  label="Subir Imágenes Adicionales"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Categorias</FormLabel>
              <FormControl>
                <MultiSelect
                  options={categoriesData}
                  selected={(field.value as unknown as SelectOptions[]) || []}
                  onChange={(values) => {
                    field.onChange(values);
                    form.trigger("categories");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormInput
          name="address"
          label="Direccion"
          placeholder="Ingrese la direccion"
          form={form}
        />

        <FormInput
          name="phone"
          label="Telefono / Movil"
          placeholder="Ingrese el nro de telefono"
          form={form}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Pais</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un Pais" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCountry} // Disable if no country is selected
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione una ciudad" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {countries.filter(
                        (c) => c.value === selectedCountry
                      )[0] &&
                        countries
                          .filter((c) => c.value === selectedCountry)[0]
                          .states.map((city) => (
                            <SelectItem key={city.id} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Schedule
          control={form.control}
          errors={form.formState.errors}
          setValue={form.setValue}
        />

        <Button type="submit" className="w-full">
          Guardar
        </Button>
      </form>
    </Form>
  );
}
