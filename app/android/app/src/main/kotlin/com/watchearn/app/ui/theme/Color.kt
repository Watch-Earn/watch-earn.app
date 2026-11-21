package com.watchearn.app.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Watch & Earn Gaming Dark Theme Tokens (from DESIGN_SYSTEM_AND_SCREEN_INVENTORY.md)
val DarkNavyBg = Color(0xFF080B20)
val DarkCardSurface = Color(0xFF121536)
val DarkCardSurfaceElevated = Color(0xFF151837)
val DarkBorder = Color(0xFF242752)
val DarkBorderHighlight = Color(0xFF383C75)

val RadiantPurple = Color(0xFF9633F5)
val DeepPurple = Color(0xFF5E17EB)
val RadiantPurpleLight = Color(0xFFA855F7)
val ElectricCyan = Color(0xFF29CBFF)
val ElectricCyanDark = Color(0xFF00A3FF)
val CoinGold = Color(0xFFFFC638)
val CoinGoldDark = Color(0xFFFFAE00)
val EmeraldGreen = Color(0xFF28D991)
val NeonPink = Color(0xFFE024C3)
val ErrorRed = Color(0xFFEF4444)

val TextPrimary = Color(0xFFF7F8FF)
val TextSecondary = Color(0xFFAAB4DB)
val TextMuted = Color(0xFF6B74A3)

// Reusable gradients
val PurpleGradient = Brush.horizontalGradient(
    listOf(RadiantPurpleLight, DeepPurple)
)

val CyanGradient = Brush.horizontalGradient(
    listOf(ElectricCyan, ElectricCyanDark)
)

val GoldGradient = Brush.horizontalGradient(
    listOf(Color(0xFFFFDF70), CoinGoldDark)
)

val CardGlowGradient = Brush.verticalGradient(
    listOf(Color(0xFF241F5A), Color(0xFF121536))
)

val CenterDomeGradient = Brush.radialGradient(
    listOf(Color(0xFF3B1E82), Color(0xFF150E3E), DarkNavyBg)
)
