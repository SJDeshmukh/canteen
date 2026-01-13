export const compressImage = (file: File, maxWidth = 1600, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('no-canvas'));
          return;
        }
        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('img-error'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('read-error'));
    reader.readAsDataURL(file);
  });
};

export const dataUrlToBlob = (dataUrl: string): Blob => {
  const parts = dataUrl.split(',');
  const meta = parts[0];
  const base64 = parts[1];
  const mimeMatch = /data:(.*?);base64/.exec(meta);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};
