"use client";

import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";

import {
  PushNotifications,
} from "@capacitor/push-notifications";

export default function PushNotificationSetup() {

  useEffect(() => {

    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const registerPush = async () => {

      let permStatus =
        await PushNotifications.checkPermissions();

      if (
        permStatus.receive === "prompt"
      ) {

        permStatus =
          await PushNotifications.requestPermissions();
      }

      if (
        permStatus.receive !== "granted"
      ) {

        console.log(
          "Push notification permission denied"
        );

        return;
      }

      await PushNotifications.register();

      PushNotifications.addListener(
        "registration",
        async (token) => {

console.log(
  "Push registration success:",
  token.value
);

try {

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
    "Push token saved"
  );

} catch (err) {

  console.error(
    "Failed to save push token:",
    err
  );
}

        }
      );

      PushNotifications.addListener(
        "registrationError",
        (error) => {

          console.error(
            "Push registration error:",
            error
          );
        }
      );

      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {

          console.log(
            "Push notification received:",
            notification
          );
        }
      );

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {

          console.log(
            "Push notification action performed:",
            notification
          );
        }
      );
    };

    registerPush();

  }, []);

  return null;
}