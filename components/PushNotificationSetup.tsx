"use client";

import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";

import { StatusBar } from "@capacitor/status-bar";

import {
  PushNotifications,
} from "@capacitor/push-notifications";

export default function PushNotificationSetup() {

  useEffect(() => {

    if (!Capacitor.isNativePlatform()) {
      console.log("❌ Not running on native platform.");
      return;
    }

    console.log("✅ Running on native platform.");

    // Prevent the WebView from rendering underneath
    // the iPhone status bar.
    StatusBar.setOverlaysWebView({
      overlay: false,
    });

    const registerPush = async () => {

      console.log("🔔 Starting push registration...");

      let permStatus =
        await PushNotifications.checkPermissions();

      console.log("📋 Current permission:", permStatus);

      if (
        permStatus.receive === "prompt"
      ) {

        console.log("📲 Requesting notification permission...");

        permStatus =
          await PushNotifications.requestPermissions();

        console.log(
          "📋 Permission after request:",
          permStatus
        );
      }

      if (
        permStatus.receive !== "granted"
      ) {

        console.log(
          "❌ Push notification permission denied."
        );

        return;
      }

      console.log("✅ Permission granted.");

      // Register listeners BEFORE calling register()
      PushNotifications.addListener(
        "registration",
        async (token) => {

          console.log("================================");
          console.log("🎉 REGISTRATION EVENT RECEIVED");
          console.log(token);
          console.log("TOKEN:", token.value);
          console.log("================================");

          try {

            const response =
              await fetch(
                "/api/push/register",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    token: token.value,
                  }),
                }
              );

            console.log(
              "📡 Register API status:",
              response.status
            );

            const data =
              await response.json();

            console.log(
              "📡 Register API response:",
              data
            );

          } catch (err) {

            console.error(
              "❌ Failed to save push token:",
              err
            );
          }

        }
      );

      PushNotifications.addListener(
        "registrationError",
        (error) => {

          console.error(
            "❌ Push registration error:",
            error
          );
        }
      );

      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {

          console.log(
            "📩 Push notification received:",
            notification
          );
        }
      );

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {

          console.log(
            "👆 Push notification tapped:",
            notification
          );
        }
      );

      console.log("📲 Calling PushNotifications.register()...");

      await PushNotifications.register();

      console.log("✅ PushNotifications.register() returned.");

    };

    registerPush();

  }, []);

  return null;
}