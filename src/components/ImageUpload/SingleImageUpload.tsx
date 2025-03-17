"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SingleImageUploadProps {
  onImageChange: (file: File | null) => void;
  label?: string;
}

export const SingleImageUpload = ({
  onImageChange,
  label = "Subir Imagen",
}: SingleImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4">
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Button
              type="button"
              variant="outline"
              className="relative"
              onClick={() =>
                document.getElementById("single-image-upload")?.click()
              }
            >
              {label}
            </Button>
            <input
              id="single-image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
