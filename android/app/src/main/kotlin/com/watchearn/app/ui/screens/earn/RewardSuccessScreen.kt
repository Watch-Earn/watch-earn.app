package com.watchearn.app.ui.screens.earn

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.ui.components.CoinIcon
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*

@Composable
fun RewardSuccessScreen(
    rewardCoins: Int = 20,
    onClaim: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(28.dp)
        ) {
            // Golden Star Medal & Laurel Graphic (Matching 10_Reward_Success.png)
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(listOf(Color(0xFFFFDF70), Color(0xFFFFAE00), Color(0xFFB45309)))
                    )
                    .border(3.dp, Color(0xFFFFFBEB), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("⭐", fontSize = 54.sp)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            Text(
                text = "Congratulations! 🎉",
                fontSize = 26.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "You earned",
                fontSize = 14.sp,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(18.dp))

            // Glowing Purple Reward Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFF2E1B6B), Color(0xFF1B144E))
                        )
                    )
                    .border(
                        1.5.dp,
                        Brush.horizontalGradient(listOf(RadiantPurple, ElectricCyan)),
                        RoundedCornerShape(18.dp)
                    )
                    .padding(20.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CoinIcon(size = 32.dp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "+$rewardCoins Coins",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CoinGold
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Ad completed successfully (= ₹0.02)",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFFC7D2FE)
                    )
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Continue Button
            GradientButton(
                text = "Continue",
                onClick = onClaim,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}
