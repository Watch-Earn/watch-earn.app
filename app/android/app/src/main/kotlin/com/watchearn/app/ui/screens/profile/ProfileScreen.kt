package com.watchearn.app.ui.screens.profile

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.watchearn.app.R
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*

@Composable
fun ProfileScreen(
    repository: WatchEarnRepository,
    onNavigateToSupport: () -> Unit,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {
    val user by repository.user.collectAsState()
    val context = LocalContext.current

    // State for interactive dialogs
    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showUpiDialog by remember { mutableStateOf(false) }
    var showThemeDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showTermsDialog by remember { mutableStateOf(false) }
    var showLogoutConfirmDialog by remember { mutableStateOf(false) }
    var showGoogleAccountDialog by remember { mutableStateOf(false) }

    var notificationsEnabled by remember { mutableStateOf(true) }
    var currentThemeName by remember { mutableStateOf("Dark (Default)") }

    // Dialog Input states
    var tempName by remember(user.name) { mutableStateOf(user.name) }
    var tempUpi by remember(user.upiId) { mutableStateOf(user.upiId) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        AppHeader(title = "Your Profile", onBackClick = onBack)

        // Avatar with clickable Edit Pencil Badge
        Box(
            contentAlignment = Alignment.BottomEnd,
            modifier = Modifier.clickable { showEditProfileDialog = true }
        ) {
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(listOf(Color(0xFF38BDF8), Color(0xFF0284C7))),
                        CircleShape
                    )
                    .border(2.dp, RadiantPurple, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text("👦", fontSize = 48.sp)
            }

            Box(
                modifier = Modifier
                    .size(30.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF4C1D95), CircleShape)
                    .border(1.5.dp, Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Edit,
                    contentDescription = "Edit Profile",
                    tint = Color.White,
                    modifier = Modifier.size(15.dp)
                )
            }
        }

        // Name, Email and Clickable Google Verified Badge
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = user.name,
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(3.dp))
            Text(
                text = user.email,
                fontSize = 13.sp,
                color = TextSecondary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF1E293B))
                    .clickable { showGoogleAccountDialog = true }
                    .padding(horizontal = 10.dp, vertical = 5.dp)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.ic_google_logo),
                    contentDescription = "Google",
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Google Account Linked",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF67E8F9)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    Icons.Default.CheckCircle,
                    contentDescription = "Verified",
                    tint = Color(0xFF10B981),
                    modifier = Modifier.size(13.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        // Settings Menu Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(18.dp))
                .padding(vertical = 8.dp)
        ) {
            Column {
                // 1. Edit Profile
                MenuItem(
                    icon = "👤",
                    title = "Edit Profile",
                    subtitle = "Change your display name",
                    onClick = {
                        tempName = user.name
                        showEditProfileDialog = true
                    }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // 2. Linked UPI ID
                MenuItem(
                    icon = "💳",
                    title = "Linked UPI ID",
                    subtitle = user.upiId,
                    onClick = {
                        tempUpi = user.upiId
                        showUpiDialog = true
                    }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // 3. Notifications Toggle
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("🔔", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(
                                text = "Notifications",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = if (notificationsEnabled) "Daily rewards & ad reminders active" else "Notifications paused",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }
                    }
                    Switch(
                        checked = notificationsEnabled,
                        onCheckedChange = {
                            notificationsEnabled = it
                            Toast.makeText(
                                context,
                                if (it) "Notifications enabled" else "Notifications muted",
                                Toast.LENGTH_SHORT
                            ).show()
                        },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = RadiantPurple
                        )
                    )
                }
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // 4. App Theme
                MenuItem(
                    icon = "🌙",
                    title = "App Theme",
                    subtitle = currentThemeName,
                    onClick = { showThemeDialog = true }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // 5. Help & Support
                MenuItem(
                    icon = "❓",
                    title = "Help & Support",
                    subtitle = "FAQ, Ticket resolution & live chat",
                    onClick = onNavigateToSupport
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // 6. Privacy Policy
                MenuItem(
                    icon = "🛡️",
                    title = "Privacy Policy",
                    subtitle = "Compliant with Indian DPDPA (2023)",
                    onClick = { showPrivacyDialog = true }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // 7. Terms & Conditions
                MenuItem(
                    icon = "📄",
                    title = "Terms & Conditions",
                    subtitle = "Discretionary micro-rewards • 18+ only",
                    onClick = { showTermsDialog = true }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // 8. Logout
                MenuItem(
                    icon = "🚪",
                    title = "Logout",
                    subtitle = "Sign out from your Google account",
                    titleColor = Color(0xFFEF4444),
                    onClick = { showLogoutConfirmDialog = true }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Brand Logo Footer
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(id = R.drawable.brand_wordmark),
                contentDescription = "Watch & Earn",
                modifier = Modifier
                    .height(30.dp)
                    .wrapContentWidth(),
                contentScale = ContentScale.Fit
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Version 1.0.0 • Made with ❤️ in India",
                fontSize = 11.sp,
                color = TextMuted
            )
        }

        Spacer(modifier = Modifier.height(32.dp))
    }

    // ==========================================
    // 1. Edit Profile Dialog
    // ==========================================
    if (showEditProfileDialog) {
        AlertDialog(
            onDismissRequest = { showEditProfileDialog = false },
            containerColor = DarkCardSurfaceElevated,
            title = {
                Text(
                    text = "Edit Profile",
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Text(
                        text = "Update your public display name. Your linked Google email will remain unchanged.",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )

                    OutlinedTextField(
                        value = tempName,
                        onValueChange = { tempName = it },
                        label = { Text("Display Name") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedBorderColor = RadiantPurple,
                            unfocusedBorderColor = DarkBorder,
                            focusedContainerColor = Color(0xFF101333),
                            unfocusedContainerColor = Color(0xFF101333)
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Linked Google Email badge
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF101333))
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.ic_google_logo),
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = user.email,
                            fontSize = 12.sp,
                            color = TextMuted
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (tempName.isNotBlank()) {
                            repository.updateUserName(tempName)
                            showEditProfileDialog = false
                            Toast.makeText(context, "Profile name updated to $tempName", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Name cannot be empty", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
                ) {
                    Text("Save Changes", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showEditProfileDialog = false }) {
                    Text("Cancel", color = TextSecondary)
                }
            }
        )
    }

    // ==========================================
    // 2. Linked UPI ID Dialog
    // ==========================================
    if (showUpiDialog) {
        AlertDialog(
            onDismissRequest = { showUpiDialog = false },
            containerColor = DarkCardSurfaceElevated,
            title = {
                Text(
                    text = "Linked UPI ID",
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Text(
                        text = "Enter your UPI VPA (e.g. mobile@upi, name@okhdfcbank, name@paytm) to receive instant withdrawal payments.",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )

                    OutlinedTextField(
                        value = tempUpi,
                        onValueChange = { tempUpi = it },
                        label = { Text("UPI ID") },
                        placeholder = { Text("username@bank") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedBorderColor = RadiantPurple,
                            unfocusedBorderColor = DarkBorder,
                            focusedContainerColor = Color(0xFF101333),
                            unfocusedContainerColor = Color(0xFF101333)
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Text(
                        text = "⚡ Instant verification supported for PhonePe, GPay, Paytm & BHIM.",
                        fontSize = 11.sp,
                        color = Color(0xFF38BDF8)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val cleaned = tempUpi.trim()
                        if (cleaned.contains("@") && cleaned.length >= 4) {
                            repository.updateUpiId(cleaned)
                            showUpiDialog = false
                            Toast.makeText(context, "UPI ID updated to $cleaned", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "Please enter a valid UPI ID (e.g. name@okhdfcbank)", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
                ) {
                    Text("Save UPI ID", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showUpiDialog = false }) {
                    Text("Cancel", color = TextSecondary)
                }
            }
        )
    }

    // ==========================================
    // 3. App Theme Selector Dialog
    // ==========================================
    if (showThemeDialog) {
        AlertDialog(
            onDismissRequest = { showThemeDialog = false },
            containerColor = DarkCardSurfaceElevated,
            title = {
                Text(
                    text = "Select App Theme",
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    listOf(
                        "Dark (Default)" to "Deep navy indigo with radiant glow",
                        "AMOLED Pitch Black" to "Pure OLED black for maximum battery saving",
                        "Midnight Blue" to "Deep oceanic midnight tones"
                    ).forEach { (themeTitle, desc) ->
                        val isSelected = currentThemeName == themeTitle
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) Color(0xFF282B57) else Color(0xFF101333))
                                .clickable {
                                    currentThemeName = themeTitle
                                    showThemeDialog = false
                                    Toast.makeText(context, "Theme set to $themeTitle", Toast.LENGTH_SHORT).show()
                                }
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = isSelected,
                                onClick = {
                                    currentThemeName = themeTitle
                                    showThemeDialog = false
                                    Toast.makeText(context, "Theme set to $themeTitle", Toast.LENGTH_SHORT).show()
                                },
                                colors = RadioButtonDefaults.colors(selectedColor = RadiantPurple)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = themeTitle,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Text(
                                    text = desc,
                                    fontSize = 11.sp,
                                    color = TextSecondary
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showThemeDialog = false }) {
                    Text("Close", color = RadiantPurpleLight)
                }
            }
        )
    }

    // ==========================================
    // 4. Privacy Policy Dialog
    // ==========================================
    if (showPrivacyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            containerColor = DarkCardSurfaceElevated,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("🛡️", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Privacy Policy",
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 350.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "Compliant with India's Digital Personal Data Protection Act (DPDPA 2023).",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF38BDF8)
                    )
                    Text(
                        text = "1. Data We Collect:\n• Google Profile: Your public name and verified email.\n• Payouts: Your chosen UPI ID for transferring rewards.\n• Diagnostics: Anonymous fraud prevention & ad completion telemetry.",
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                    Text(
                        text = "2. How We Use Data:\n• Verify authentic ad views.\n• Process automated ledger credits and payouts.\n• Enforce daily limits and prevent bot abuse.",
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                    Text(
                        text = "3. Zero Spam Guarantee:\nWe never sell or rent your personal information to third parties.",
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showPrivacyDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
                ) {
                    Text("I Understand", color = Color.White)
                }
            }
        )
    }

    // ==========================================
    // 5. Terms & Conditions Dialog
    // ==========================================
    if (showTermsDialog) {
        AlertDialog(
            onDismissRequest = { showTermsDialog = false },
            containerColor = DarkCardSurfaceElevated,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("📄", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Terms & Conditions",
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 350.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "1. Age Eligibility: You must be at least 18 years old to earn and withdraw money from Watch & Earn.",
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                    Text(
                        text = "2. Micro-Rewards Nature: Coins earned are promotional loyalty micro-rewards. 1,000 Coins = ₹1.00. Minimum withdrawal threshold is 10,000 Coins (₹10.00).",
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                    Text(
                        text = "3. Fair Play Policy: Use of emulators, automated clickers, VPN spoofing, or multiple accounts is strictly prohibited and results in immediate account suspension.",
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                    Text(
                        text = "4. Payout Processing: Real-time via UPI rails. Verification may take up to 24 hours during banking maintenance windows.",
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showTermsDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
                ) {
                    Text("Agree & Close", color = Color.White)
                }
            }
        )
    }

    // ==========================================
    // 6. Logout Confirmation Dialog
    // ==========================================
    if (showLogoutConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutConfirmDialog = false },
            containerColor = DarkCardSurfaceElevated,
            title = {
                Text(
                    text = "Confirm Logout",
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            },
            text = {
                Text(
                    text = "Are you sure you want to sign out? Your coin balance (${user.totalEarnedCoins} coins) and achievements will remain securely saved in your Google Account.",
                    fontSize = 13.sp,
                    color = TextSecondary,
                    lineHeight = 19.sp
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showLogoutConfirmDialog = false
                        onLogout()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                ) {
                    Text("Logout", color = Color.White, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutConfirmDialog = false }) {
                    Text("Cancel", color = TextSecondary)
                }
            }
        )
    }

    // ==========================================
    // 7. Google Account Info Dialog
    // ==========================================
    if (showGoogleAccountDialog) {
        AlertDialog(
            onDismissRequest = { showGoogleAccountDialog = false },
            containerColor = DarkCardSurfaceElevated,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Image(
                        painter = painterResource(id = R.drawable.ic_google_logo),
                        contentDescription = "Google",
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Google Account",
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Your Watch & Earn profile is linked to:",
                        fontSize = 13.sp,
                        color = TextSecondary
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFF101333))
                            .padding(12.dp)
                    ) {
                        Column {
                            Text(
                                text = user.name,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                fontSize = 14.sp
                            )
                            Text(
                                text = user.email,
                                color = Color(0xFF38BDF8),
                                fontSize = 12.sp
                            )
                        }
                    }
                    Text(
                        text = "✓ 100% passwordless and secure. All coins, streak progress, and UPI withdrawal requests are securely backed up.",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showGoogleAccountDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
                ) {
                    Text("Done", color = Color.White)
                }
            }
        )
    }
}

@Composable
private fun MenuItem(
    icon: String,
    title: String,
    subtitle: String? = null,
    titleColor: Color = TextPrimary,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Text(icon, fontSize = 18.sp)
            Spacer(modifier = Modifier.width(14.dp))
            Column {
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = titleColor
                )
                if (subtitle != null) {
                    Text(
                        text = subtitle,
                        fontSize = 11.sp,
                        color = TextSecondary,
                        maxLines = 1
                    )
                }
            }
        }
        Icon(
            Icons.AutoMirrored.Filled.KeyboardArrowRight,
            contentDescription = "Navigate",
            tint = TextMuted,
            modifier = Modifier.size(18.dp)
        )
    }
}
