export const getProxiedImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  // If it is already a relative path, base64, or local asset, return as-is
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // Cloudinary and other external HTTP(S) images load directly over HTTPS
  return url;
};
