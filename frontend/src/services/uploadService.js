import apiClient from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Uploads a measurement reference image. Returns a mock URL until the
 * backend storage endpoint (e.g. S3 / Multer) is implemented.
 */
export async function uploadReceipt(file, onProgress) {
  if (USE_MOCK) {
    await delay(1000);
    return {
      data: {
        url: URL.createObjectURL(file),
        filename: file.name,
        size: file.size,
      },
    };
  }
  const formData = new FormData();
  formData.append('receipt', file);
  const { data } = await apiClient.post('/uploads/receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });
  return data;
}
