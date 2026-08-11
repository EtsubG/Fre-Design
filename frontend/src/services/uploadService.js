import apiClient from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Uploads a reference image / receipt for an order.
 * Backend: POST /api/upload  (field name: "receipt")
 * Returns { receiptUrl } on success.
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

  // apiClient base is /api — so this hits POST /api/upload
  const { data } = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  // Backend returns { receiptUrl } — normalise to { data: { url } }
  return { data: { url: data.receiptUrl, filename: file.name } };
}
