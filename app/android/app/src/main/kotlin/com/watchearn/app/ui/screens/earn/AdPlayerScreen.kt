package com.watchearn.app.ui.screens.earn

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.model.VideoAd
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun AdPlayerScreen(
    ad: VideoAd,
    onAdCompleted: () -> Unit
) {
    var secondsLeft by remember { mutableIntStateOf(15) }
    var isPlaying by remember { mutableStateOf(true) }

    LaunchedEffect(key1 = secondsLeft, key2 = isPlaying) {
        if (secondsLeft > 0 && isPlaying) {
            delay(1000)
            secondsLeft--
        } else if (secondsLeft == 0) {
            onAdCompleted()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Header with Ad Countdown
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF1E2145))
                    .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "🎬 Rewarded Ad",
                    color = ElectricCyan,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF261D4C))
                    .border(1.dp, RadiantPurple, RoundedCornerShape(12.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "Ad ends in 0:${String.format("%02d", secondsLeft)}",
                    color = CoinGold,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Center Simulated Video Player Frame
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(260.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(
                    Brush.verticalGradient(
                        listOf(Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0F172A))
                    )
                )
                .border(1.dp, Color(0xFF334155), RoundedCornerShape(20.dp)),
            contentAlignment = Alignment.Center
        ) {
            // Simulated Game Landscape Background
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text("🏔️", fontSize = 48.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Sponsored Gaming Showcase",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Text(
                    text = "High Quality Interactive Ad",
                    color = Color(0xFF94A3B8),
                    fontSize = 12.sp
                )
            }

            // Play/Pause Overlay Button
            IconButton(
                onClick = { isPlaying = !isPlaying },
                modifier = Modifier
                    .size(54.dp)
                    .background(Color(0x80000000), CircleShape)
                    .border(1.dp, Color.White.copy(alpha = 0.5f), CircleShape)
            ) {
                Icon(
                    if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = "Toggle",
                    tint = Color.White,
                    modifier = Modifier.size(30.dp)
                )
            }
        }

        // Bottom Controls & Instruction
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Info Pill
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF161935))
                    .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = null,
                        tint = ElectricCyan,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Please watch the full ad to verify and credit your reward.",
                        color = TextSecondary,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Skip / Complete Demo Button
            GradientButton(
                text = if (secondsLeft == 0) "Claim Reward" else "Simulate Ad Finish (${secondsLeft}s)",
                onClick = onAdCompleted,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}
