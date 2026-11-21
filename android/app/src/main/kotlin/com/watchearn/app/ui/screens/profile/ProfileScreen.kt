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
import com.watchearn.app.R
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.theme.*

@Composable
fun ProfileScreen(
    repository: WatchEarnRepository,
    onNavigateToSupport: () -> Unit,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {
    val user by repository.user.collectAsState()
    var notificationsEnabled by remember { mutableStateOf(true) }
    val context = LocalContext.current

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

        // Avatar with Edit Pencil Badge (Matching 18_Profile.png)
        Box(contentAlignment = Alignment.BottomEnd) {
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
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF4C1D95), CircleShape)
                    .border(1.5.dp, Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Edit,
                    contentDescription = "Edit",
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
            }
        }

        // Name and Phone
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = user.name,
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = user.phone,
                fontSize = 13.sp,
                color = TextSecondary
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Settings Menu Card (Matching 18_Profile.png)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(DarkCardSurfaceElevated)
                .border(1.dp, DarkBorder, RoundedCornerShape(18.dp))
                .padding(vertical = 8.dp)
        ) {
            Column {
                MenuItem(
                    icon = "👤",
                    title = "Edit Profile",
                    onClick = { Toast.makeText(context, "Edit Profile", Toast.LENGTH_SHORT).show() }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                MenuItem(
                    icon = "💳",
                    title = "Linked UPI ID",
                    subtitle = user.upiId,
                    onClick = { Toast.makeText(context, "Linked UPI: ${user.upiId}", Toast.LENGTH_SHORT).show() }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                // Notifications Toggle
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
                        Text(
                            text = "Notifications",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                    Switch(
                        checked = notificationsEnabled,
                        onCheckedChange = { notificationsEnabled = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = RadiantPurple
                        )
                    )
                }
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                MenuItem(
                    icon = "🌙",
                    title = "App Theme",
                    subtitle = "Dark (Default)",
                    onClick = { Toast.makeText(context, "Dark Theme is active", Toast.LENGTH_SHORT).show() }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                MenuItem(
                    icon = "❓",
                    title = "Help & Support",
                    onClick = onNavigateToSupport
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                MenuItem(
                    icon = "🛡️",
                    title = "Privacy Policy",
                    onClick = { Toast.makeText(context, "Compliant with Indian DPDPA (2023)", Toast.LENGTH_SHORT).show() }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                MenuItem(
                    icon = "📄",
                    title = "Terms & Conditions",
                    onClick = { Toast.makeText(context, "Discretionary micro-rewards. 18+ only.", Toast.LENGTH_SHORT).show() }
                )
                HorizontalDivider(color = DarkBorder, modifier = Modifier.padding(horizontal = 16.dp))

                MenuItem(
                    icon = "🚪",
                    title = "Logout",
                    titleColor = Color(0xFFEF4444),
                    onClick = onLogout
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
        Row(verticalAlignment = Alignment.CenterVertically) {
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
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }
        }
        Icon(
            Icons.AutoMirrored.Filled.KeyboardArrowRight,
            contentDescription = null,
            tint = TextMuted,
            modifier = Modifier.size(20.dp)
        )
    }
}
