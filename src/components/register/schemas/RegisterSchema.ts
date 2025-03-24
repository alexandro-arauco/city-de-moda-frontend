import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre del Negocio debe tener al menos 2 caracteres.",
  }),
  email: z.string().email("Ingrese un correo electronico valido"),
  description: z.string().optional(),
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
  whatsapp: z.boolean().optional(),
  categories: z
    .array(
      z.object({
        name: z.string(),
        id: z.any(),
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
  services: z.array(z.object({ name: z.string().optional() })).optional(),
  additionalContact: z.string().optional(),
  socialMedia: z
    .array(
      z.object({
        name: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .optional(),

  location: z.string().optional(),
});

export const defaultValuesRegisterSchema = {
  name: "",
  email: "",
  description: "",
  address: "",
  phone: "",
  country: "",
  city: "",
  categories: [],
  schedule: [],
  mainImage: null,
  additionalImages: [],
  services: [],
  additionalContact: "",
  socialMedia: [],
  whatsapp: false,
};
