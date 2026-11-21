package com.watchearn.app.ui.screens.earn

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.GamepadLogo
import com.watchearn.app.ui.theme.*

@Composable
fun EarnHubScreen(
    onNavigateToWatchAds: () -> Unit,
    onNavigateBack: () -> Unit
) {
    var selectedTab by remember { mutableStateOf("All") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
    ) {
        AppHeader(title = "Earn Coins", onBackClick = onNavigateBack)

        Spacer(modifier = Modifier.height(8.dp))

        // Center Gamepad & Subtitle
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            GamepadLogo(size = 64.dp)
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "Choose any way to earn coins",
                fontSize = 13.sp,
                color = TextSecondary
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Filter Pills Row (All, Tasks, Offers)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            listOf("All", "Tasks", "Offers").forEach { tab ->
                val isSelected = tab == selectedTab
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) RadiantPurple else DarkCardSurfaceElevated)
                        .border(1.dp, if (isSelected) RadiantPurpleLight else DarkBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedTab = tab }
                        .padding(horizontal = 20.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = tab,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) TextPrimary else TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Earn Options List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            val earnItems = listOf(
                EarnOptionItem("🎬", "Watch Ads", "Earn 20 - 100 Coins", onNavigateToWatchAds),
                EarnOptionItem("📋", "Task Offers", "Complete tasks & earn big", onNavigateToWatchAds),
                EarnOptionItem("📝", "Surveys", "Share your opinion & earn", onNavigateToWatchAds),
                EarnOptionItem("🎮", "Play Games", "Play games & earn coins", onNavigateToWatchAds),
                EarnOptionItem("🎁", "Daily Bonus", "Claim your daily reward", onNavigateToWatchAds)
            )

            items(earnItems.size) { index ->
                val item = earnItems[index]
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(DarkCardSurfaceElevated)
                        .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                        .clickable { item.onClick() }
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color(0xFF221650)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(item.emoji, fontSize = 24.sp)
                            }
                            Spacer(modifier = Modifier.width(14.dp))
                            Column {
                                Text(
                                    text = item.title,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = item.subtitle,
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )
                            }
                        }

                        Icon(
                            Icons.AutoMirrored.Filled.KeyboardArrowRight,
                            contentDescription = null,
                            tint = TextMuted,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }
    }
}

private data class EarnOptionItem(
    val emoji: String,
    val title: String,
    val subtitle: String,
    val onClick: () -> Unit
)
