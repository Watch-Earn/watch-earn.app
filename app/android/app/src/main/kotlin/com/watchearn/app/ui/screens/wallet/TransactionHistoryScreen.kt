package com.watchearn.app.ui.screens.wallet

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.CoinIcon
import com.watchearn.app.ui.theme.*

@Composable
fun TransactionHistoryScreen(
    repository: WatchEarnRepository,
    onBack: () -> Unit
) {
    var selectedFilter by remember { mutableStateOf("All") }
    val transactions by repository.transactions.collectAsState()

    val filteredList = remember(selectedFilter, transactions) {
        when (selectedFilter) {
            "Earnings" -> transactions.filter { it.isCredit }
            "Withdrawals" -> transactions.filter { !it.isCredit }
            else -> transactions
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
    ) {
        AppHeader(title = "Transaction History", onBackClick = onBack)

        Spacer(modifier = Modifier.height(6.dp))

        // Filter Pills: All, Earnings, Withdrawals (Matching 15_Transaction_History.png)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            listOf("All", "Earnings", "Withdrawals").forEach { filter ->
                val isSelected = (selectedFilter == filter)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) RadiantPurple else DarkCardSurfaceElevated)
                        .border(1.dp, if (isSelected) RadiantPurpleLight else DarkBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedFilter = filter }
                        .padding(horizontal = 20.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = filter,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) TextPrimary else TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Transactions List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredList) { tx ->
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
                            // Icon Box
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (tx.isCredit) Color(0xFF1E214A) else Color(0xFF2E1935)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = if (tx.isCredit) "▶" else "UPI",
                                    fontSize = if (tx.isCredit) 16.sp else 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (tx.isCredit) ElectricCyan else RadiantPurpleLight
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.padding(end = 8.dp)) {
                                Text(
                                    text = tx.title,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary,
                                    maxLines = 1,
                                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = tx.timestamp,
                                    fontSize = 11.sp,
                                    color = TextMuted,
                                    maxLines = 1
                                )
                            }
                        }

                        // Right: Coins and Status
                        Column(
                            horizontalAlignment = Alignment.End,
                            modifier = Modifier.wrapContentWidth()
                        ) {
                            Text(
                                text = (if (tx.isCredit) "+" else "-") + "%,d Coins".format(tx.coins),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (tx.isCredit) CoinGold else Color(0xFFEF4444),
                                maxLines = 1,
                                softWrap = false
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = tx.statusText,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (tx.statusText == "Success" || tx.statusText == "Credited") EmeraldGreen else Color(0xFFF59E0B),
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
