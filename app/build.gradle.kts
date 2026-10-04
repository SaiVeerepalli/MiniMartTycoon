plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android { namespace = "com.sv.minimarttycoon"; compileSdk = 35
    defaultConfig { applicationId = "com.sv.minimarttycoon"; minSdk = 24; targetSdk = 35; versionCode = 1; versionName = "0.1.0" }
}
dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("com.google.android.gms:play-services-ads:24.7.0")
}
