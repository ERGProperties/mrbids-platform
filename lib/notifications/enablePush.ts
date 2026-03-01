export async function enablePush() {
  if (!("serviceWorker" in navigator)) return;
  if (!("PushManager" in window)) return;

  try {
    // register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");

    // ask permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") return;

    // subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    });

    // save on server
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    console.log("Push enabled");
  } catch (err) {
    console.error("Push setup failed:", err);
  }
}