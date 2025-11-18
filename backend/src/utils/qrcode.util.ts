export const generateQRCode = (type: 'donation' | 'pickup', id: string): string => {
  const timestamp = Date.now();
  return `OLIA-${type.toUpperCase()}-${id}-${timestamp}`;
};

export const generateDonationCode = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DOA-${year}-${random}`;
};

