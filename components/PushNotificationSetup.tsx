"use client";

import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";

import { StatusBar } from "@capacitor/status-bar";

import {
  PushNotifications,
} from "@capacitor/push-notifications";

import {
  FirebaseMessaging,
} from "@capacitor-firebase/messaging";

export default function PushNotificationSetup() {

  useEffect(() => {

    if (!Capacitor.isNativePlatform()) {
      console.log("❌ Not running on native platform.");
      return;
    }

    console.log("✅ Running on native platform.");

    StatusBar.setOverlaysWebView({
      overlay: false,
    });

    const registerPush = async () => {

      try {

        console.log("🔔 Starting push registration...");

        let permission =
          await FirebaseMessaging.checkPermissions();

        console.log(
          "📋 Firebase permission:",
          permission
        );

        if (
          permission.receive === "prompt"
        ) {

          permission =
            await FirebaseMessaging.requestPermissions();

          console.log(
            "📋 Firebase permission after request:",
            permission
          );

        }

        if (
          permission.receive !== "granted"
        ) {

          console.log(
            "❌ Notification permission denied."
          );

          return;

        }

        console.log(
          "✅ Notification permission granted."
        );

        await PushNotifications.register();

        console.log(
          "✅ APNs registration requested."
        );

        const result =
          await FirebaseMessaging.getToken();

        console.log(
          "🔥 FCM TOKEN:",
          result.token
        );

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
                token: result.token,
              }),
            }
          );

        console.log(
          "📡 Register API Status:",
          response.status
        );

        console.log(
          await response.json()
        );

      } catch (err) {

        console.error(
          "❌ Push setup failed:",
          err
        );

      }

    };

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

    FirebaseMessaging.addListener(
      "tokenReceived",
      (event) => {

        console.log(
          "🔥 New FCM Token:",
          event.token
        );

      }
    );

    registerPush();

  }, []);

  return null;

}