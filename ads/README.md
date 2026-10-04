# Monetization configuration

Android apps should use Google AdMob rather than ordinary AdSense webpage code.

For development, this project uses Google's official test IDs. **Do not click live ads during testing.**

Release setup:
1. Create/register the Android app in AdMob.
2. Replace `admob_app_id` in `app/src/main/res/values/strings.xml`.
3. Replace the test banner unit ID in `MainActivity.kt`.
4. Later we can move all ad IDs into one generated config/resource file so the Kotlin source never needs editing.

Planned placements:
- Banner: bottom of the game screen.
- Rewarded: optional reward such as temporary 2x income.
- Interstitial: only at natural level/area transitions.
- App-open: optional, not required for v1.

Google requires testing with test ads during development.
