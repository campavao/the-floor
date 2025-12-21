import { NextRequest, NextResponse } from "next/server";

// Image search API route - proxies image search to avoid CORS issues
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const start = searchParams.get("start") || "1";

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  // Try Google Custom Search API first if configured
  const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (googleApiKey && searchEngineId) {
    try {
      const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&searchType=image&q=${encodeURIComponent(query)}&start=${start}&num=10&imgSize=large`;
      
      const response = await fetch(googleUrl);
      const data = await response.json();

      if (data.items) {
        const images = data.items.map((item: any) => ({
          url: item.link,
          thumbnail: item.image?.thumbnailLink || item.link,
          title: item.title,
          width: item.image?.width,
          height: item.image?.height,
        }));
        return NextResponse.json({ images, source: "google" });
      }
    } catch (error) {
      console.error("Google Search API error:", error);
    }
  }

  // Fallback: Use web scraping approach (similar to manual_cleaner.py)
  try {
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const imageUrls: string[] = [];

    // Pattern 1: Look for "ou":"URL" in JSON-like structures
    const ouMatches = html.match(/"ou":"([^"]+)"/g) || [];
    for (const match of ouMatches) {
      const urlMatch = match.match(/"ou":"([^"]+)"/);
      if (urlMatch && urlMatch[1]) {
        let url = urlMatch[1];
        // Decode unicode escapes
        try {
          url = url.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
            String.fromCharCode(parseInt(hex, 16))
          );
        } catch {}
        
        if (url.startsWith("http") && 
            /\.(jpg|jpeg|png|webp)/i.test(url) &&
            !url.includes("encrypted-tbn") && 
            !url.includes("google.com") && 
            !url.includes("gstatic.com")) {
          imageUrls.push(url);
        }
      }
      if (imageUrls.length >= 25) break;
    }

    // Pattern 2: Look for direct image URLs
    if (imageUrls.length < 25) {
      const imgMatches = html.match(/https:\/\/[^"\s<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"\s<>]*)?/gi) || [];
      for (const url of imgMatches) {
        if (!imageUrls.includes(url) && 
            !url.includes("encrypted-tbn") && 
            !url.includes("google.com") && 
            !url.includes("gstatic.com")) {
          imageUrls.push(url);
        }
        if (imageUrls.length >= 25) break;
      }
    }

    const images = imageUrls.map((url) => ({
      url,
      thumbnail: url,
      title: "",
    }));

    return NextResponse.json({ images, source: "scrape" });
  } catch (error) {
    console.error("Image search error:", error);
    return NextResponse.json({ 
      error: "Failed to search for images. Please try again.", 
      images: [] 
    }, { status: 500 });
  }
}
