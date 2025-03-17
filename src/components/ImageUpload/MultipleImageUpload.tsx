"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MultipleImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  label?: string;
}

interface PreviewImage {
  url: string;
  file: File;
}

export const MultipleImageUpload = ({
  onImagesChange,
  maxImages = 5,
  label = "Subir Imágenes",
}: MultipleImageUploadProps) => {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = previews.length + files.length;

    if (totalImages > maxImages) {
      alert(`Solo puedes subir un máximo de ${maxImages} imágenes`);
      return;
    }

    const newPreviews: PreviewImage[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          url: reader.result as string,
          file,
        });
        if (newPreviews.length === files.length) {
          const updatedPreviews = [...previews, ...newPreviews];
          setPreviews(updatedPreviews);
          onImagesChange(updatedPreviews.map((preview) => preview.file));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesChange(newPreviews.map((preview) => preview.file));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={preview.url}
                alt={`Preview ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-[200px]"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {previews.length < maxImages && (
            <div className="flex items-center justify-center border-2 border-dashed rounded-lg h-[200px] p-4">
              <Button
                type="button"
                variant="outline"
                className="relative w-full max-w-[200px] whitespace-normal h-auto"
                onClick={() => document.getElementById("multiple-image-upload")?.click()}
              >
                {label}
              </Button>
              <input
                id="multiple-image-upload"
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Puedes subir hasta {maxImages} imágenes
        </p>
      </div>
    </div>
  );
}; 