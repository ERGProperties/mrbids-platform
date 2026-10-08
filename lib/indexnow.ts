const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const SITE_URL = "https://mrbids.com";

export async function submitToIndexNow(
  urls: string | string[]
): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : [urls];

  if (urlList.length === 0) {
    return;
  }

  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    console.error("IndexNow submission skipped: INDEXNOW_KEY missing");
    return;
  }

  const keyLocation = `${SITE_URL}/${key}.txt`;

  try {
    await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "mrbids.com",
        key,
        keyLocation,
        urlList,
      }),
    });
  } catch (error) {
    console.error("IndexNow submission failed:", error);
  }
}