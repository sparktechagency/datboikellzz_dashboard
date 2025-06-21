// export const url = import.meta.env.VITE_API_URL;
export const url = "http://3.76.70.78:8001";

export const imageUrl = (image) => {
  return image
    ? image?.startsWith("http")
      ? image
      : image?.startsWith("/")
      ? `${url}${image}`
      : `${url}/${image}`
    : "https://placehold.co/400";
};
