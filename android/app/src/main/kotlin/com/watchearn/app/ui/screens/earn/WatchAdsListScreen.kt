package com.watchearn.app.ui.screens.earn

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.model.VideoAd
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.CoinIcon
import com.watchearn.app.ui.theme.*

@Composable
fun WatchAdsListScreen(
    repository: WatchEarnRepository,
    onSelectAd: (VideoAd) -> Unit,
    onBack: () -> Unit
) {
    val videoAds by repository.videoAds.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
    ) {
        AppHeader(title = "Watch Ads", onBackClick = onBack)

        Spacer(modifier = Modifier.height(8.dp))

        // Top Clapperboard Banner (Matching 08_Watch_Ads_List.png)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF1B1454), Color(0xFF2C156C), Color(0xFF1E1148))
                    )
                )
                .border(
                    1.dp,
                    Brush.horizontalGradient(listOf(RadiantPurple, ElectricCyan)),
                    RoundedCornerShape(18.dp)
                )
                .padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // 3D Clapperboard
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(
                            Brush.linearGradient(listOf(Color(0xFF4C1D95), Color(0xFF6D28D9)))
                        )
                        .border(1.dp, RadiantPurpleLight, RoundedCornerShape(14.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🎬", fontSize = 32.sp)
                    }
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column {
                    Text(
                        text = "Watch Ads &",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = TextPrimary
                    )
                    Text(
                        text = "Earn Coins",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = CoinGold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Complete the ad to get your reward.",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Video Ads List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(videoAds) { ad ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkCardSurfaceElevated)
                        .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                        .clickable { onSelectAd(ad) }
                        .padding(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            // Purple Gradient Play Button Icon
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(PurpleGradient),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Default.PlayArrow,
                                    contentDescription = "Play",
                                    tint = Color.White,
                                    modifier = Modifier.size(24.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(14.dp))

                            Column(modifier = Modifier.padding(end = 8.dp)) {
                                Text(
                                    text = ad.title,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary,
                                    maxLines = 1,
                                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "Watch ${ad.durationSec} sec",
                                    fontSize = 12.sp,
                                    color = TextSecondary,
                                    maxLines = 1
                                )
                            }
                        }

                        // Gold Coin Reward Pill
                        Box(
                            modifier = Modifier
                                .wrapContentWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(Color(0xFF2E2413))
                                .border(1.dp, Color(0xFF6B531B), RoundedCornerShape(20.dp))
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                CoinIcon(size = 16.dp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "${ad.rewardCoins}",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = CoinGold,
                                    maxLines = 1,
                                    softWrap = false
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
