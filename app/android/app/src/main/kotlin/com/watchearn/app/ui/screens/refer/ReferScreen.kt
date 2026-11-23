package com.watchearn.app.ui.screens.refer

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*

@Composable
fun ReferScreen(
    repository: WatchEarnRepository,
    onBack: () -> Unit
) {
    val user by repository.user.collectAsState()
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            AppHeader(title = "Refer & Earn", onBackClick = onBack)

            Spacer(modifier = Modifier.height(8.dp))

            // 3D Gift Box Graphic (Matching 16_Refer_And_Earn.png)
            Box(
                modifier = Modifier
                    .size(130.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(
                        Brush.radialGradient(listOf(Color(0xFF4C1D95), Color(0xFF1F0D42)))
                    )
                    .border(2.dp, RadiantPurple, RoundedCornerShape(24.dp)),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🎁", fontSize = 60.sp)
                    Text("🪙 🪙", fontSize = 16.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Invite Friends & Earn\nUp to 5,000 Coins!",
                fontSize = 22.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextPrimary,
                textAlign = TextAlign.Center,
                lineHeight = 28.sp
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Get 500 coins for each successful referral\n(after their first earning).",
                fontSize = 13.sp,
                color = TextSecondary,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Dashed Referral Code Box (Matching 16_Refer_And_Earn.png)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.5.dp, Color(0xFF4338CA), RoundedCornerShape(16.dp))
                    .padding(18.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Your Referral Code",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = user.referralCode,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = CoinGold
                        )
                    }

                    // Copy Button Box
                    IconButton(
                        onClick = {
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            val clip = ClipData.newPlainText("Referral Code", user.referralCode)
                            clipboard.setPrimaryClip(clip)
                            Toast.makeText(context, "Referral code copied!", Toast.LENGTH_SHORT).show()
                        },
                        modifier = Modifier
                            .size(42.dp)
                            .background(Color(0xFF261D4C), RoundedCornerShape(10.dp))
                            .border(1.dp, RadiantPurpleLight, RoundedCornerShape(10.dp))
                    ) {
                        Icon(
                            Icons.Default.ContentCopy,
                            contentDescription = "Copy",
                            tint = TextPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // WhatsApp Invite Button (Green Gradient / Pill)
            Button(
                onClick = {
                    val shareMsg = "Hey! Earn real money by watching simple ads on Watch & Earn! Use my invite code ${user.referralCode} to get 500 free bonus coins instantly: https://watchearn.app/join"
                    val whatsappIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        setPackage("com.whatsapp")
                        putExtra(Intent.EXTRA_TEXT, shareMsg)
                    }
                    try {
                        context.startActivity(whatsappIntent)
                    } catch (e: Exception) {
                        // Fallback to generic share chooser if WhatsApp is not installed
                        val chooser = Intent.createChooser(
                            Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, shareMsg)
                            },
                            "Share via"
                        )
                        context.startActivity(chooser)
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(26.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("💬", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Invite on WhatsApp",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }

        // Secondary Social Share Buttons Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 24.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            IconButton(
                onClick = {
                    val shareMsg = "Join Watch & Earn and make daily pocket money! Use code ${user.referralCode} to get free welcome coins: https://watchearn.app/join"
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, shareMsg)
                    }
                    context.startActivity(Intent.createChooser(shareIntent, "Share Referral Link"))
                },
                modifier = Modifier
                    .size(46.dp)
                    .background(DarkCardSurfaceElevated, CircleShape)
                    .border(1.dp, DarkBorder, CircleShape)
            ) {
                Icon(Icons.Default.Share, contentDescription = "Share", tint = TextPrimary, modifier = Modifier.size(20.dp))
            }
        }
    }
}
