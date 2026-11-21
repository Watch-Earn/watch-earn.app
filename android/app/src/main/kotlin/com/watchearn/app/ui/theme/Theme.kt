package com.watchearn.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = RadiantPurple,
    onPrimary = TextPrimary,
    primaryContainer = DarkCardSurfaceElevated,
    onPrimaryContainer = TextPrimary,
    secondary = ElectricCyan,
    onSecondary = DarkNavyBg,
    tertiary = CoinGold,
    background = DarkNavyBg,
    onBackground = TextPrimary,
    surface = DarkCardSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkCardSurfaceElevated,
    onSurfaceVariant = TextSecondary,
    outline = DarkBorder,
    error = ErrorRed,
    onError = TextPrimary
)

@Composable
fun WatchEarnTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
