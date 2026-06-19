import Pusher from "pusher-js";

let pusherClient: Pusher | null =
  null;

if (
  typeof window !==
  "undefined"
) {

  pusherClient =
    new Pusher(
      process.env
        .NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster:
          process.env
            .NEXT_PUBLIC_PUSHER_CLUSTER!,

        channelAuthorization: {
          endpoint:
            "/api/pusher/auth",

          transport:
            "ajax",
        },
      }
    );

}

export { pusherClient };