export function emailFooter() {
  return `
    <!-- APP DOWNLOAD -->
    <tr>
      <td
        style="
          padding:30px;
          text-align:center;
          background:#fafafa;
          border-top:1px solid #f1f1f1;
          border-bottom:1px solid #f1f1f1;
        "
      >

        <h2
          style="
            margin:0 0 12px;
            font-size:22px;
            color:#111827;
          "
        >
          Take MrBids Anywhere
        </h2>

        <p
          style="
            margin:0 0 24px;
            color:#666;
            font-size:15px;
            line-height:1.6;
          "
        >
          Receive instant outbid alerts, watch auctions end live,
          and bid from anywhere with the official MrBids app.
        </p>

        <a
          href="https://apps.apple.com/us/app/mrbids-auctions/id6782255893"
          target="_blank"
          style="display:inline-block; margin:0 8px 12px;"
        >
          <img
            src="https://mrbids.com/images/app-store-badge.svg"
            alt="Download on the App Store"
            style="width:176px; height:auto;"
          />
        </a>

        <a
          href="https://play.google.com/store/apps/details?id=com.mrbids.app"
          target="_blank"
          style="display:inline-block; margin:0 8px 12px;"
        >
          <img
            src="https://mrbids.com/images/google-play-badge.png"
            alt="Get it on Google Play"
            style="width:176px; height:auto;"
          />
        </a>

        <div style="height:8px;"></div>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td
        style="
          padding:24px;
          text-align:center;
          background:#ffffff;
        "
      >

        <p style="margin:0; font-size:13px; color:#555;">
          <strong>MrBids</strong><br/>
          Marketplace & Real Estate Auctions
        </p>

        <p
          style="
            margin:12px 0 0;
            font-size:12px;
            color:#888;
            line-height:1.7;
          "
        >
          © ${new Date().getFullYear()} MrBids<br/>

          <a
            href="https://mrbids.com"
            style="color:#2563eb; text-decoration:none;"
          >
            www.mrbids.com
          </a>
        </p>

      </td>
    </tr>
  `;
}