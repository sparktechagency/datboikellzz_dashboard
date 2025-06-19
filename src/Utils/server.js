// export const url = import.meta.env.VITE_API_URL;
export const url = 'http://18.158.237.149:8001';

export const imageUrl = (image) => {
  return image
    ? image?.startsWith('http')
      ? image
      : image?.startsWith('/')
      ? `${url}${image}`
      : `${url}/${image}`
    : 'https://placehold.co/400';
};

