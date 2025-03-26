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

import { MultipleImageUpload } from "@/components/ImageUpload/MultipleImageUpload";
import { SingleImageUpload } from "@/components/ImageUpload/SingleImageUpload";
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
import { API_URL } from "@/lib/variables";
import { useEffect, useState } from "react";
import * as z from "zod";
import FormTable from "../FormTable";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import FormInput from "./FormInput";
import { Schedule } from "./Schedule";
import {
  defaultValuesRegisterSchema,
  RegisterSchema,
} from "./schemas/RegisterSchema";
import ServicesInput from "./ServicesInput";
import SocialMediaInput from "./SocialMediaInput";
import VideosInput from "./VideosInput";
import clsx from "clsx";

export default function RegisterForm() {
  const { countries } = useCountryStatesContext();
  const [categoriesData, setCategoriesData] = useState<SelectOptions[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: defaultValuesRegisterSchema,
  });
  const selectedCountry = form.watch("country");

  console.log(form.err);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      form.setValue("city", ""); // Reset city when country changes
    }
  }, [selectedCountry, form]);

  const getCategories = async () => {
    const categoriesData = (await fetch(`${API_URL}/api/category`).then((res) =>
      res.json()
    )) as CategoriesResponse;

    setCategoriesData(
      categoriesData.data.map((c) => ({
        name: c.name,
        id: c.id,
      }))
    );
  };

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
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

    const response = await fetch(`${API_URL}/api/place`, {
      method: "POST",
      body: formData,
    })
      .then((data) => data.json())
      .catch((error) => console.log({ error }));

    if (response.message === "success") {
      setOpenModal(true);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            name="name"
            form={form}
            label="Nombre del Negocio"
            placeholder="Ingrese el Nombre del Negocio"
          />

          <FormInput
            name="email"
            form={form}
            label="Email"
            placeholder="Ingrese el Correo Electronico"
          />

          <FormInput
            name="additionalContact"
            form={form}
            label="Informacion de contacto adicional"
            placeholder="Ingrese informacion de contacto adicional"
            render={(field) => (
              <Textarea className="resize-none h-[100px]" {...field} />
            )}
          />

          <FormInput
            name="description"
            form={form}
            label="Descripcion del Negocio"
            placeholder="Ingrese Descripcion del Negocio"
            render={(field) => (
              <Textarea className="resize-none h-[100px]" {...field} />
            )}
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
                    label="Subir Imagen"
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
                <FormLabel className="font-bold">Galeria de Imagenes</FormLabel>
                <FormControl>
                  <MultipleImageUpload
                    onImagesChange={(files) => {
                      setAdditionalImages(files);
                      field.onChange(files);
                    }}
                    maxImages={5}
                    label="Subir Imagen"
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
            name="location"
            label="Como llegar"
            placeholder="Ingrese URL de Google Maps"
            form={form}
          />

          <div className="space-y-4">
            <FormInput
              name="phone"
              label="Telefono / Movil"
              placeholder="Ingrese el nro de telefono"
              form={form}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="whatsapp"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel htmlFor="whatsapp">
                        Cuenta con Whatsapp?
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormTable
            title="Redes Sociales"
            columnsHeader={["Nombre", "URL / Link"]}
            control={form.control}
            name="socialMedia"
            object={{ name: "", url: "" }}
            render={(index, fields) => (
              <SocialMediaInput
                control={form.control}
                index={index}
                setValue={form.setValue}
                fields={fields}
              />
            )}
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

          <FormTable
            title="Servicios"
            columnsHeader={["Nombre"]}
            control={form.control}
            name="services"
            object={{ name: "" }}
            render={(index) => (
              <ServicesInput control={form.control} index={index} />
            )}
          />

          <FormTable
            title="Videos"
            columnsHeader={["URL / Link"]}
            control={form.control}
            name="videos"
            object={{ url: "" }}
            render={(index) => (
              <VideosInput control={form.control} index={index} />
            )}
          />

          <Button
            type="submit"
            className={clsx(
              "w-full",
              form.formState.isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            disabled={form.formState.isSubmitting}
          >
            {`${
              form.formState.isSubmitting
                ? "Guardando Informacion..."
                : "Guardar"
            }`}
          </Button>
        </form>
      </Form>

      {openModal && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>

            <DialogClose className="bg-black text-white mx-auto p-2 m-2 rounded-sm text-sm">
              Aceptar
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
