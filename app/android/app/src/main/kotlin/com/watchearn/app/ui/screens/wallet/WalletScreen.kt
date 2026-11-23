package com.watchearn.app.ui.screens.wallet

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
fun WalletScreen(
    repository: WatchEarnRepository,
    onNavigateToWithdraw: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onBack: () -> Unit
) {
    val wallet by repository.wallet.collectAsState()
    val user by repository.user.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        AppHeader(title = "My Wallet", onBackClick = onBack)

        // Total Balance Hero Card (Matching 12_Wallet.png)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF231354), Color(0xFF381577), Color(0xFF1E1045))
                    )
                )
                .border(
                    1.5.dp,
                    Brush.horizontalGradient(listOf(RadiantPurple, ElectricCyan)),
                    RoundedCornerShape(20.dp)
                )
                .padding(22.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    CoinIcon(size = 36.dp)
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "%,d".format(wallet.totalCoins),
                        fontSize = 34.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = CoinGold
                    )
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "Coins",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "= ₹${wallet.totalRupees}",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFFA5B4FC)
                )
            }
        }

        // Two Action Buttons: Withdraw & History (Matching 12_Wallet.png)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Withdraw Action
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                    .clickable { onNavigateToWithdraw() }
                    .padding(vertical = 18.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.linearGradient(listOf(Color(0xFF8B2CF5), Color(0xFF5E17EB)))
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🎁", fontSize = 24.sp)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Withdraw",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = TextPrimary
                    )
                }
            }

            // History Action
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                    .clickable { onNavigateToHistory() }
                    .padding(vertical = 18.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF2A2312))
                            .border(1.dp, CoinGold, RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🕒", fontSize = 22.sp)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "History",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = TextPrimary
                    )
                }
            }
        }

        // Coin Conversion Rate Highlight Card (Golden Border)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(Color(0xFF1E1710))
                .border(1.5.dp, CoinGold, RoundedCornerShape(14.dp))
                .padding(16.dp)
        ) {
            Column {
                Text(
                    text = "Coin Conversion Rate",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "100 Coins = ₹0.10",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = CoinGold
                )
            }
        }

        // Wallet Summary Section (Matching 12_Wallet.png)
        Text(
            text = "Wallet Summary",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                SummaryRow("Total Earned", "%,d 🪙".format(user.totalEarnedCoins), Color(0xFF60A5FA))
                SummaryRow("Available Balance", "%,d 🪙 (₹${wallet.availableRupees})".format(wallet.availableCoins), EmeraldGreen)
                SummaryRow("Pending Verification", "%,d 🪙 (₹${wallet.pendingRupees})".format(wallet.pendingCoins), CoinGold)
                SummaryRow("Total Withdrawn", "%,d 🪙".format(wallet.paidCoins), RadiantPurpleLight)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}

@Composable
private fun SummaryRow(label: String, value: String, valueColor: Color = TextPrimary) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, fontSize = 13.sp, color = TextSecondary)
        Text(
            text = value,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = valueColor
        )
    }
}
