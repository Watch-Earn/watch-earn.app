WATCH & EARN - LOGO ASSET PACK
================================

brand_master/
  01_App_Icon_Original.png        = your first selected app icon
  02_App_Icon_Refined.png         = updated polished rounded app icon
  03_Transparent_Emblem.png      = transparent mark for UI components
  04_Horizontal_Wordmark.png     = transparent horizontal branding logo
  05_Splash_Logo_Transparent.png = transparent splash/onboarding logo

android/mipmap-*dpi/
  ic_launcher.png                = legacy Android launch icon at each density
  ic_launcher_foreground.png     = adaptive icon foreground at each density

android/adaptive_icon/
  mipmap-anydpi-v26/ic_launcher.xml = adaptive launcher configuration
  values/colors.xml                = dark navy icon background color (#070D28)
  Copy these XML resources into the matching Android app/src/main/res folders.
  Copy each android/mipmap-*dpi directory into app/src/main/res.
  Ensure AndroidManifest.xml uses android:icon="@mipmap/ic_launcher".

play_store/store_icon_512.png     = Google Play listing icon (512x512)
web/                             = icon sizes for website/PWA/favicons

The adaptive foreground keeps the emblem within the central safe area.
Use the transparent brand assets in the app UI. PNGs are raster artwork, not
editable vectors; no SVG has been generated.
