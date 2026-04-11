export const compressImage = (file: File, maxWidth = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const ratio = Math.min(1, maxWidth / img.width, maxWidth / img.height);
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);

        URL.revokeObjectURL(url);
        resolve(compressed.split(',')[1] || '');
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
};
