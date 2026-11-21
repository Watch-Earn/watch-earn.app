package com.watchearn.app.ui.screens.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.R
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.CoinIcon
import com.watchearn.app.ui.theme.*

@Composable
fun HomeScreen(
    repository: WatchEarnRepository,
    onNavigateToWatchAds: () -> Unit,
    onNavigateToWallet: () -> Unit,
    onNavigateToWithdraw: () -> Unit,
    onNavigateToTasks: () -> Unit,
    onNavigateToRefer: () -> Unit,
    onNavigateToNotifications: () -> Unit = {}
) {
    val user by repository.user.collectAsState()
    val wallet by repository.wallet.collectAsState()
    val unreadNotifs by repository.unreadNotificationCount.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .statusBarsPadding()
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Spacer(modifier = Modifier.height(2.dp))

        // Top Branding Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Master Horizontal Brand Wordmark
            Image(
                painter = painterResource(id = R.drawable.brand_wordmark),
                contentDescription = "Watch & Earn",
                modifier = Modifier
                    .height(36.dp)
                    .wrapContentWidth(),
                contentScale = ContentScale.Fit
            )

            // Right icons: Notification & Gift
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(DarkCardSurfaceElevated, CircleShape)
                        .border(1.dp, DarkBorder, CircleShape)
                        .clickable { onNavigateToNotifications() },
                    contentAlignment = Alignment.Center
                ) {
                    Text("🔔", fontSize = 16.sp)
                    if (unreadNotifs > 0) {
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .offset(x = 2.dp, y = (-2).dp)
                                .size(14.dp)
                                .background(ElectricCyan, CircleShape)
                                .border(1.5.dp, DarkNavyBg, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (unreadNotifs > 9) "9+" else "$unreadNotifs",
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = DarkNavyBg
                            )
                        }
                    }
                }
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(DarkCardSurfaceElevated, CircleShape)
                        .border(1.dp, DarkBorder, CircleShape)
                        .clickable { onNavigateToRefer() },
                    contentAlignment = Alignment.Center
                ) {
                    Text("🎁", fontSize = 16.sp)
                }
            }
        }

        // User Greeting Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(listOf(Color(0xFF6B21A8), Color(0xFF3B0764))),
                        CircleShape
                    )
                    .border(2.dp, RadiantPurple, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text("🎧", fontSize = 24.sp)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = "Hello, ${user.name} 👋",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = "Watch Ads, Complete Tasks & Earn!",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }
        }

        // Massive Glowing Balance Card with Treasure Chest
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF161042), Color(0xFF281865), Color(0xFF1E114D))
                    )
                )
                .border(
                    1.5.dp,
                    Brush.horizontalGradient(listOf(Color(0xFF5D24C6), ElectricCyan, RadiantPurple)),
                    RoundedCornerShape(20.dp)
                )
                .clickable { onNavigateToWallet() }
                .padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Your Coin Balance",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFFC7D2FE)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CoinIcon(size = 28.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "%,d".format(wallet.totalCoins),
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CoinGold
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            Icons.AutoMirrored.Filled.KeyboardArrowRight,
                            contentDescription = null,
                            tint = Color(0xFF93C5FD),
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "≈ ₹${wallet.totalRupees}",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFA5B4FC)
                    )
                }

                // 3D Master Brand Emblem Illustration
                Image(
                    painter = painterResource(id = R.drawable.brand_emblem),
                    contentDescription = "Treasure Chest Emblem",
                    modifier = Modifier.size(92.dp),
                    contentScale = ContentScale.Fit
                )
            }
        }

        // Daily Progress Bar Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                .padding(14.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("📅", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Daily Progress",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                    Text(
                        text = "${user.adsWatchedToday} / ${user.dailyAdsCap} Ads Watched",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = ElectricCyan
                    )
                }
                Spacer(modifier = Modifier.height(2.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color(0xFF1E2145))
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxHeight()
                                .fillMaxWidth(user.adsWatchedToday.toFloat() / user.dailyAdsCap)
                                .clip(RoundedCornerShape(4.dp))
                                .background(CyanGradient)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("🎁", fontSize = 18.sp)
                }
            }
        }

        // "Watch Ad & Earn Coins" Hero Action Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(
                    Brush.horizontalGradient(listOf(Color(0xFF221155), Color(0xFF381577)))
                )
                .border(
                    1.5.dp,
                    Brush.horizontalGradient(listOf(RadiantPurple, ElectricCyan)),
                    RoundedCornerShape(18.dp)
                )
                .clickable { onNavigateToWatchAds() }
                .padding(16.dp)
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
                    // Clapperboard Graphic
                    Box(
                        modifier = Modifier
                            .size(52.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.linearGradient(listOf(Color(0xFF4C1D95), Color(0xFF6D28D9)))
                            )
                            .border(1.dp, RadiantPurpleLight, RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🎬", fontSize = 28.sp)
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Watch Ad & ",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = TextPrimary
                            )
                            Text(
                                text = "Earn Coins",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = CoinGold
                            )
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Watch short ads and get instant coins!",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }

                // Big Golden Play Button
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .shadow(8.dp, CircleShape, spotColor = CoinGold)
                        .background(GoldGradient, CircleShape)
                        .border(1.5.dp, Color(0xFFFFF0A6), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.PlayArrow,
                        contentDescription = "Play",
                        tint = Color(0xFF5A3100),
                        modifier = Modifier.size(28.dp)
                    )
                }
            }
        }

        // Quick Actions Row (3 Cards: Tasks, Wallet, Withdraw)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Tasks
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                    .clickable { onNavigateToTasks() }
                    .padding(vertical = 12.dp, horizontal = 6.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("🎯", fontSize = 22.sp)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text("Tasks", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary, maxLines = 1)
                    Text("Complete", fontSize = 10.sp, color = TextSecondary, maxLines = 1)
                }
            }

            // Wallet
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                    .clickable { onNavigateToWallet() }
                    .padding(vertical = 12.dp, horizontal = 6.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("👛", fontSize = 22.sp)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text("Wallet", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary, maxLines = 1)
                    Text("Balance", fontSize = 10.sp, color = TextSecondary, maxLines = 1)
                }
            }

            // Withdraw
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                    .clickable { onNavigateToWithdraw() }
                    .padding(vertical = 12.dp, horizontal = 6.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("🏧", fontSize = 22.sp)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text("Withdraw", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary, maxLines = 1)
                    Text("Redeem", fontSize = 10.sp, color = TextSecondary, maxLines = 1)
                }
            }
        }

        // Rewards & Tasks Section Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🏆", fontSize = 18.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Rewards & Tasks",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
            Text(
                text = "See All >",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = ElectricCyan,
                modifier = Modifier.clickable { onNavigateToTasks() }
            )
        }

        // Rewards Items (3 items matching reference)
        listOf(
            Triple("Watch Ads", "Watch ads and earn coins instantly", 50),
            Triple("Play Games", "Play simple games & earn more coins", 200),
            Triple("Daily Check-in", "Check in daily and get free coins", 100)
        ).forEach { (title, subtitle, coins) ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                    .clickable { onNavigateToWatchAds() }
                    .padding(12.dp)
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
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color(0xFF1E214A)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = when (title) {
                                    "Watch Ads" -> "▶"
                                    "Play Games" -> "🎮"
                                    else -> "✅"
                                },
                                fontSize = 16.sp,
                                color = ElectricCyan
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column(modifier = Modifier.padding(end = 8.dp)) {
                            Text(title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimary, maxLines = 1)
                            Text(
                                subtitle,
                                fontSize = 11.sp,
                                color = TextSecondary,
                                maxLines = 1,
                                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                            )
                        }
                    }

                    // Gold Reward Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(Color(0xFF2E2413))
                            .border(1.dp, Color(0xFF6B531B), RoundedCornerShape(20.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            CoinIcon(size = 14.dp)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "+$coins",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = CoinGold,
                                maxLines = 1,
                                softWrap = false
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                Icons.AutoMirrored.Filled.KeyboardArrowRight,
                                contentDescription = null,
                                tint = CoinGold,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }
        }

        // Recent Activity Section
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🕒", fontSize = 18.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Recent Activity",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
            Text(
                text = "See All >",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = ElectricCyan,
                modifier = Modifier.clickable { onNavigateToWallet() }
            )
        }

        // Activity Items
        listOf(
            Triple("Watched Ad (30s)", "Just now", 50),
            Triple("Daily Check-in", "2 hours ago", 100),
            Triple("Played Game", "4 hours ago", 200)
        ).forEach { (title, time, coins) ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFF1E214A)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(if (title.startsWith("Watched")) "▶" else if (title.startsWith("Daily")) "✅" else "🎮", fontSize = 14.sp, color = RadiantPurpleLight)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(title, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                            Text(time, fontSize = 11.sp, color = TextMuted)
                        }
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CoinIcon(size = 14.dp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "+$coins",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = CoinGold
                        )
                    }
                }
            }
        }

        // Official Sponsors & Verified Offer Partners
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🤝", fontSize = 18.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Official Sponsors & Partners",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
            Text(
                text = "100% Verified",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = EmeraldGreen
            )
        }

        // Horizontal scrolling partner showcase
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            listOf(
                Triple("AdGate Media", "Offerwall & Quests", "🌐"),
                Triple("OfferToro", "Rewarded Engagement", "🎯"),
                Triple("RevU", "High-Yield Tasks", "🚀"),
                Triple("BitLabs", "Verified Surveys", "📊")
            ).forEach { (name, type, icon) ->
                Box(
                    modifier = Modifier
                        .width(155.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkCardSurfaceElevated)
                        .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
                        .clickable { onNavigateToTasks() }
                        .padding(12.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(icon, fontSize = 20.sp)
                            Box(
                                modifier = Modifier
                                    .background(Color(0xFF132A22), RoundedCornerShape(6.dp))
                                    .border(1.dp, Color(0xFF1F5C45), RoundedCornerShape(6.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text("HMAC", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = EmeraldGreen)
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(name, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        Text(type, fontSize = 10.sp, color = TextSecondary, maxLines = 1)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}
