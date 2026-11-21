package com.watchearn.app.ui.screens.tasks

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.CoinIcon
import com.watchearn.app.ui.theme.*

@Composable
fun TasksScreen(
    repository: WatchEarnRepository,
    onBack: () -> Unit
) {
    val user by repository.user.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
    ) {
        AppHeader(title = "Achievements & Tasks", onBackClick = onBack)

        Spacer(modifier = Modifier.height(10.dp))

        // Streak Card (Matching 17_Achievements_Progress.png)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF2E195E), Color(0xFF1E134D))
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
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Current Streak",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${user.streakDays} Days 🔥",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = CoinGold
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Check in daily to increase your reward bonus",
                        fontSize = 11.sp,
                        color = Color(0xFFA5B4FC)
                    )
                }

                Text("🏆", fontSize = 42.sp)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Milestones & Achievements",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Tasks List (Matching 14_Achievement_Tasks.png)
        val achievements = listOf(
            AchievementItem("🎯", "First Ad", "Watch your first video ad", "Completed", true, 20),
            AchievementItem("📅", "Watch Streak", "100 Coins for 5 / 7 days", "Credited", true, 100),
            AchievementItem("✅", "Daily 5 Check-in", "Consecutive 5 check-ins", "Claimed", true, 50),
            AchievementItem("👥", "Refer a Friend", "First friend joins using code", "Completed", true, 500),
            AchievementItem("⭐", "Level 5 Milestone", "Reach Level 5 by active participation", "In Progress", false, 250)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(achievements) { item ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(DarkCardSurfaceElevated)
                        .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
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
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(Color(0xFF221A4B)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(item.emoji, fontSize = 20.sp)
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.padding(end = 8.dp)) {
                                Text(
                                    text = item.title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary,
                                    maxLines = 1,
                                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = item.subtitle,
                                    fontSize = 11.sp,
                                    color = TextSecondary,
                                    maxLines = 1,
                                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                )
                            }
                        }

                        // Right Status Badge
                        Box(
                            modifier = Modifier
                                .wrapContentWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (item.isCompleted) Color(0xFF132B22) else Color(0xFF2B2012))
                                .border(
                                    1.dp,
                                    if (item.isCompleted) EmeraldGreen else CoinGold,
                                    RoundedCornerShape(16.dp)
                                )
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (item.isCompleted) "✓ ${item.status}" else "+${item.rewardCoins} 🪙",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (item.isCompleted) EmeraldGreen else CoinGold,
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

private data class AchievementItem(
    val emoji: String,
    val title: String,
    val subtitle: String,
    val status: String,
    val isCompleted: Boolean,
    val rewardCoins: Int
)
