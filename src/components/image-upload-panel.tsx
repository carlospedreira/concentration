import { useState, useRef } from "react";
import type { UploadedImage } from "../types/game";
import { validateImageFile } from "../utils/image-validation";

interface ImageUploadPanelProps {
  images: readonly UploadedImage[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

export function ImageUploadPanel({
  images,
  onAdd,
  onRemove,
  onReorder,
}: ImageUploadPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const result = validateImageFile(file);
      if (result.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${result.error}`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join("; "));
    } else {
      setError(null);
    }

    if (validFiles.length > 0) {
      onAdd(validFiles);
    }

    // Reset input so the same file can be re-selected
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <label
        htmlFor="image-upload"
        className="text-sm font-medium text-gray-700"
      >
        Upload Images
      </label>
      <input
        ref={inputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium file:cursor-pointer hover:file:bg-indigo-100"
      />

      {error && (
        <p role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <ul className="flex flex-col gap-2">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="text-sm text-gray-700 truncate flex-1">
                {image.name}
              </span>
              <div className="flex gap-1">
                {index > 0 && (
                  <button
                    onClick={() => onReorder(image.id, "up")}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Move ${image.name} up`}
                  >
                    ↑
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    onClick={() => onReorder(image.id, "down")}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Move ${image.name} down`}
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => onRemove(image.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  aria-label={`Remove ${image.name}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
