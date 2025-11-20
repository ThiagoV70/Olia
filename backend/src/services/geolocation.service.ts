const DEFAULT_VIEWBOX = process.env.GEO_VIEWBOX || '-35.05,-8.00,-34.80,-8.25'; // Recife area
const NOMINATIM_URL =
  process.env.GEO_API_URL || 'https://nominatim.openstreetmap.org/search';
const GEO_USER_AGENT =
  process.env.GEO_USER_AGENT || 'olia-backend/1.0 (olia@example.com)';

interface GeocodeResult {
  lat: number;
  lng: number;
  city?: string;
  neighborhood?: string;
  postcode?: string;
}

export async function geocodeAddress(address?: string): Promise<GeocodeResult | null> {
  if (!address) return null;

  const params = new URLSearchParams({
    q: `${address}, Recife, Pernambuco, Brasil`,
    format: 'json',
    addressdetails: '1',
    limit: '5',
    bounded: '1',
    viewbox: DEFAULT_VIEWBOX,
  });

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': GEO_USER_AGENT,
      },
    });

    if (!response.ok) {
      console.warn('Geocoding request failed', response.statusText);
      return null;
    }

    const data = (await response.json()) as any[];
    if (!data?.length) return null;

    const { lat, lon, address: addr } = data[0];
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      city: addr?.city || addr?.town || addr?.county,
      neighborhood:
        addr?.suburb || addr?.neighbourhood || addr?.district || addr?.borough,
      postcode: addr?.postcode,
    };
  } catch (error) {
    console.error('Geocoding error', error);
    return null;
  }
}

