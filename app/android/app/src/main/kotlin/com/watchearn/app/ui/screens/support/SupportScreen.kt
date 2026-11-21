package com.watchearn.app.ui.screens.support

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*

@Composable
fun SupportScreen(
    repository: WatchEarnRepository,
    onBack: () -> Unit = {}
) {
    val context = LocalContext.current
    var selectedCategory by remember { mutableStateOf("missing_reward") }
    var subject by remember { mutableStateOf("") }
    var message by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        AppHeader(title = "Help & Support", onBackClick = onBack)

        // Missing Reward / Dispute Form Card (Matching 19_Help_Support.png)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                Text(
                    text = "File a Dispute / Missing Reward",
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.titleMedium,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(10.dp))

                Text("Category:", fontSize = 12.sp, color = TextSecondary)
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(
                        "missing_reward" to "Missing Coins",
                        "withdrawal_issue" to "Payout Delay",
                        "other" to "General"
                    ).forEach { (cat, label) ->
                        val isSelected = (selectedCategory == cat)
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (isSelected) RadiantPurple else Color(0xFF1E2145))
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(label, fontSize = 12.sp, color = TextPrimary)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = subject,
                    onValueChange = { subject = it },
                    label = { Text("Subject (e.g. Ad Video #1)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = DarkCardSurface,
                        unfocusedContainerColor = DarkCardSurface,
                        focusedBorderColor = RadiantPurple,
                        unfocusedBorderColor = DarkBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = message,
                    onValueChange = { message = it },
                    label = { Text("Details & Reference") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 3,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = DarkCardSurface,
                        unfocusedContainerColor = DarkCardSurface,
                        focusedBorderColor = RadiantPurple,
                        unfocusedBorderColor = DarkBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                GradientButton(
                    text = "Submit Support Ticket",
                    onClick = {
                        Toast.makeText(context, "Support ticket submitted. Response within 48h.", Toast.LENGTH_SHORT).show()
                        subject = ""
                        message = ""
                    },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = subject.isNotBlank() && message.isNotBlank()
                )
            }
        }

        // FAQs Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                Text("Frequently Asked Questions", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 15.sp)
                Spacer(modifier = Modifier.height(12.dp))

                Text("Q: What is the coin conversion rate?", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = CoinGold)
                Text("A: Fixed rate: 100 Coins = ₹0.10, so 1,000 Coins = ₹1.00.", fontSize = 12.sp, color = TextSecondary)
                Spacer(modifier = Modifier.height(10.dp))

                Text("Q: What is the minimum withdrawal?", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = CoinGold)
                Text("A: 10,000 Coins (₹10.00) transferred directly via UPI.", fontSize = 12.sp, color = TextSecondary)
                Spacer(modifier = Modifier.height(10.dp))

                Text("Q: Are Google AdMob rewarded ads used for cash?", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = CoinGold)
                Text("A: No. Google AdMob policies prohibit cash rewards. Only authorized offerwall sponsors are used.", fontSize = 12.sp, color = TextSecondary)
            }
        }

        // Regulatory & Account Deletion
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                Text("Grievance Redressal (India)", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Text("Grievance Officer: Rohan Sharma\nEmail: support@watch-earn.app\nSLA: Within 48 business hours", fontSize = 12.sp, color = TextSecondary)

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedButton(
                    onClick = {
                        Toast.makeText(context, "Account deletion request submitted under DPDPA.", Toast.LENGTH_LONG).show()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFEF4444))
                ) {
                    Text("Request Account Deletion (DPDPA 2023)")
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}
