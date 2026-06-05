export const getProxiedImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  // If it is already a relative path, base64, or local asset, return as-is
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // Proxy Cloudinary and other external HTTP(S) images via the NephilimMS imageProxy function
  if (url.includes("cloudinary.com") || url.startsWith("http")) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    // Extract origin (e.g. "http://localhost:8888") from baseUrl (e.g. "http://localhost:8888/.netlify/functions/api")
    const apiOrigin = baseUrl.replace(/\/\.netlify\/functions\/api\/?$/, "");
    
    return `${apiOrigin}/.netlify/functions/imageProxy?url=${encodeURIComponent(url)}`;
  }

  return url;
};
