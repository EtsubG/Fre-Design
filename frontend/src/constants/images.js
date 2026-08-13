/**
 * Local image references — used as quick-pick options in the admin
 * when no uploaded image is available yet.
 * Images are served from the local assets folder.
 */
export const LOCAL_IMAGES = [];

export function getLocalImageUrls() {
  return LOCAL_IMAGES.map((img) => img.url);
}
