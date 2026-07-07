import { useCallback, useState } from "react";

// TODO: Replace with the proper state management thing
export function useSelectedPhotos() {
  const [photos, setPhotos] = useState<Set<string>>(new Set());

  const togglePhoto = useCallback((id: string) => {
    setPhotos((photos) => {
      const newPhoto = new Set(photos);

      if (photos.has(id)) {
        newPhoto.delete(id);
      } else {
        newPhoto.add(id);
      }

      return newPhoto;
    });
  }, []);

  return {
    togglePhoto,
    photos,
  };
}
