/**
 * Universal safe API fetch helper for SignalCX
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // 1. Try relative path first (/api/...)
  try {
    const res = await fetch(cleanPath, options);
    if (res.status !== 403 && res.status !== 502 && res.status !== 503 && res.status !== 504) {
      return res;
    }
  } catch (err) {
    // Relative request failed, try fallback
  }

  // 2. Try direct EC2 backend IP
  try {
    const res = await fetch(`http://54.91.159.187:8000${cleanPath}`, options);
    return res;
  } catch (err: any) {
    throw new Error(
      "Backend connection error. Please ensure http://54.91.159.187:8000 is accessible or open the app directly at http://54.91.159.187:8000/complaint/"
    );
  }
}
