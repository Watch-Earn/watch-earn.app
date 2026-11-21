package com.watchearn.app.ui.screens.withdraw

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.CoinIcon
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*

@Composable
fun WithdrawScreen(
    repository: WatchEarnRepository,
    onBack: () -> Unit
) {
    val wallet by repository.wallet.collectAsState()
    val user by repository.user.collectAsState()
    val context = LocalContext.current

    var amountRupeesText by remember { mutableStateOf("10") }
    val amountRupees = amountRupeesText.toIntOrNull() ?: 10
    val coinsRequired = amountRupees * 1000

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        AppHeader(title = "Withdraw", onBackClick = onBack)

        // Top Pill: 100 Coins = ₹0.10 (Matching 13_UPI_Withdraw.png)
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(20.dp))
                .background(Color(0xFF261D4C))
                .border(1.dp, RadiantPurple, RoundedCornerShape(20.dp))
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                CoinIcon(size = 18.dp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "100 Coins = ₹0.10",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
        }

        // Available Balance Text
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Available Balance",
                fontSize = 13.sp,
                color = TextSecondary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "%,d Coins".format(wallet.availableCoins),
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = CoinGold
                )
                Text(
                    text = " (₹${wallet.availableRupees})",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        // Enter Withdrawal Amount Input
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Enter Withdrawal Amount (₹)",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = amountRupeesText,
                onValueChange = { amountRupeesText = it.filter { c -> c.isDigit() } },
                modifier = Modifier.fillMaxWidth(),
                prefix = {
                    Text(
                        text = "₹ ",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                },
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = DarkCardSurfaceElevated,
                    unfocusedContainerColor = DarkCardSurfaceElevated,
                    focusedBorderColor = RadiantPurple,
                    unfocusedBorderColor = DarkBorder,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true
            )
        }

        // Quick Preset Chips (₹10, ₹50, ₹100) (Matching 13_UPI_Withdraw.png)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            listOf(10, 50, 100).forEach { preset ->
                val isSelected = (amountRupees == preset)
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isSelected) RadiantPurple else DarkCardSurfaceElevated)
                        .border(1.dp, if (isSelected) RadiantPurpleLight else DarkBorder, RoundedCornerShape(16.dp))
                        .clickable { amountRupeesText = preset.toString() }
                        .padding(vertical = 12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "₹$preset",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isSelected) TextPrimary else TextSecondary
                    )
                }
            }
        }

        // "You will spend" calculation
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "You will spend",
                fontSize = 12.sp,
                color = TextSecondary
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "%,d Coins".format(coinsRequired),
                fontSize = 18.sp,
                fontWeight = FontWeight.ExtraBold,
                color = CoinGold
            )
        }

        // Withdraw to UPI CTA Button (Matching 13_UPI_Withdraw.png)
        GradientButton(
            text = "Withdraw to UPI",
            onClick = {
                val result = repository.submitWithdrawal(amountRupees, user.upiId)
                result.onSuccess { msg ->
                    Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
                }.onFailure { err ->
                    Toast.makeText(context, err.message, Toast.LENGTH_SHORT).show()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = coinsRequired <= wallet.availableCoins && coinsRequired >= wallet.minimumWithdrawalCoins
        )

        // Linked UPI Instant Card (Matching 13_UPI_Withdraw.png)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // UPI Logo badge
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFF1E2145)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("UPI", fontWeight = FontWeight.ExtraBold, fontSize = 13.sp, color = ElectricCyan)
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Text(
                        text = "Linked VPA: ${user.upiId}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Withdrawals are sent to linked UPI ID instantly (within a few minutes).",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        lineHeight = 16.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}
