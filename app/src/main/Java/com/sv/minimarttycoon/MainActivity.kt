package com.sv.minimarttycoon

import android.app.Activity
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.view.ViewGroup
import android.widget.FrameLayout
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.AdSize

class MainActivity : Activity() {
    private lateinit var web: WebView
    private lateinit var banner: AdView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        MobileAds.initialize(this)
        val root = FrameLayout(this)

        web = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            webViewClient = WebViewClient()
            setBackgroundColor(android.graphics.Color.rgb(15,18,24))
            loadUrl("file:///android_asset/game/index.html")
        }
        root.addView(web, FrameLayout.LayoutParams(-1, -1))

        banner = AdView(this).apply {
            setAdSize(AdSize.BANNER)
            // Google's official test banner. Replace only this line with your real unit ID for release.
            adUnitId = "ca-app-pub-3940256099942544/9214589741"
            loadAd(AdRequest.Builder().build())
        }
        val lp = FrameLayout.LayoutParams(-1, -2)
        lp.gravity = android.view.Gravity.BOTTOM
        root.addView(banner, lp)
        setContentView(root)
    }

    override fun onDestroy() {
        banner.destroy()
        web.destroy()
        super.onDestroy()
    }
}
