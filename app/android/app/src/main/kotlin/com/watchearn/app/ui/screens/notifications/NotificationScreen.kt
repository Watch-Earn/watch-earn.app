package com.watchearn.app.ui.screens.notifications

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.model.NotificationCategory
import com.watchearn.app.data.model.NotificationItem
import com.watchearn.app.data.model.NotificationPreference
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.components.AppHeader
import com.watchearn.app.ui.theme.*

@Composable
fun NotificationScreen(
    repository: WatchEarnRepository,
    onBack: () -> Unit,
    onNavigateToScreen: (String) -> Unit = {}
) {
    val notifications by repository.notifications.collectAsState()
    val preferences by repository.preferences.collectAsState()
    var selectedCategory by remember { mutableStateOf(NotificationCategory.ALL) }
    var showPreferencesDialog by remember { mutableStateOf(false) }

    val filteredList = remember(notifications, selectedCategory) {
        when (selectedCategory) {
            NotificationCategory.ALL -> notifications
            NotificationCategory.REWARDS -> notifications.filter { it.category == NotificationCategory.REWARDS }
            NotificationCategory.WALLET -> notifications.filter { it.category == NotificationCategory.WALLET }
            NotificationCategory.ANNOUNCEMENTS -> notifications.filter { it.category == NotificationCategory.ANNOUNCEMENTS }
        }
    }

    val unreadCount = remember(notifications) {
        notifications.count { !it.isRead }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(horizontal = 16.dp)
    ) {
        // App Header with Mark All Read & Settings
        AppHeader(
            title = "Notifications",
            onBackClick = onBack,
            actions = {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (unreadCount > 0) {
                        Surface(
                            onClick = { repository.markAllNotificationsRead() },
                            color = DarkCardSurfaceElevated,
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, DarkBorderHighlight)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.DoneAll,
                                    contentDescription = "Mark all read",
                                    tint = ElectricCyan,
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = "Mark read",
                                    fontSize = 12.sp,
                                    color = ElectricCyan,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }

                    IconButton(
                        onClick = { showPreferencesDialog = true },
                        modifier = Modifier
                            .size(36.dp)
                            .background(DarkCardSurfaceElevated, CircleShape)
                            .border(1.dp, DarkBorder, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = "Preferences",
                            tint = TextSecondary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Category Filter Tabs
        CategoryTabsRow(
            selectedCategory = selectedCategory,
            onSelect = { selectedCategory = it },
            allCount = notifications.size,
            rewardsCount = notifications.count { it.category == NotificationCategory.REWARDS },
            walletCount = notifications.count { it.category == NotificationCategory.WALLET },
            announcementsCount = notifications.count { it.category == NotificationCategory.ANNOUNCEMENTS }
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Notifications List or Empty State
        if (filteredList.isEmpty()) {
            EmptyNotificationState(category = selectedCategory)
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                items(filteredList, key = { it.id }) { item ->
                    NotificationCard(
                        item = item,
                        onClick = {
                            if (!item.isRead) {
                                repository.markNotificationRead(item.id)
                            }
                            item.targetScreen?.let { screen ->
                                onNavigateToScreen(screen)
                            }
                        },
                        onMarkRead = {
                            repository.markNotificationRead(item.id)
                        }
                    )
                }
            }
        }
    }

    if (showPreferencesDialog) {
        NotificationPreferencesDialog(
            currentPreferences = preferences,
            onDismiss = { showPreferencesDialog = false },
            onSave = { updated ->
                repository.updateNotificationPreferences(updated)
                showPreferencesDialog = false
            }
        )
    }
}

@Composable
private fun CategoryTabsRow(
    selectedCategory: NotificationCategory,
    onSelect: (NotificationCategory) -> Unit,
    allCount: Int,
    rewardsCount: Int,
    walletCount: Int,
    announcementsCount: Int
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        CategoryTabPill(
            label = "All",
            count = allCount,
            isSelected = selectedCategory == NotificationCategory.ALL,
            onClick = { onSelect(NotificationCategory.ALL) }
        )
        CategoryTabPill(
            label = "Rewards",
            count = rewardsCount,
            icon = "🪙",
            isSelected = selectedCategory == NotificationCategory.REWARDS,
            onClick = { onSelect(NotificationCategory.REWARDS) }
        )
        CategoryTabPill(
            label = "Wallet",
            count = walletCount,
            icon = "💳",
            isSelected = selectedCategory == NotificationCategory.WALLET,
            onClick = { onSelect(NotificationCategory.WALLET) }
        )
        CategoryTabPill(
            label = "Announcements",
            count = announcementsCount,
            icon = "⚡",
            isSelected = selectedCategory == NotificationCategory.ANNOUNCEMENTS,
            onClick = { onSelect(NotificationCategory.ANNOUNCEMENTS) }
        )
    }
}

@Composable
private fun CategoryTabPill(
    label: String,
    count: Int,
    icon: String? = null,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val bgModifier = if (isSelected) {
        Modifier.background(PurpleGradient, RoundedCornerShape(20.dp))
    } else {
        Modifier.background(DarkCardSurfaceElevated, RoundedCornerShape(20.dp))
    }

    val borderModifier = if (isSelected) {
        Modifier.border(1.dp, RadiantPurpleLight, RoundedCornerShape(20.dp))
    } else {
        Modifier.border(1.dp, DarkBorder, RoundedCornerShape(20.dp))
    }

    Box(
        modifier = Modifier
            .then(bgModifier)
            .then(borderModifier)
            .clip(RoundedCornerShape(20.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            if (icon != null) {
                Text(icon, fontSize = 13.sp)
            }
            Text(
                text = label,
                fontSize = 13.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) Color.White else TextSecondary
            )
            if (count > 0) {
                Box(
                    modifier = Modifier
                        .background(
                            if (isSelected) Color.White.copy(alpha = 0.25f) else DarkBorderHighlight,
                            CircleShape
                        )
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "$count",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isSelected) Color.White else TextMuted
                    )
                }
            }
        }
    }
}

@Composable
private fun NotificationCard(
    item: NotificationItem,
    onClick: () -> Unit,
    onMarkRead: () -> Unit
) {
    val borderColor = if (!item.isRead) ElectricCyan.copy(alpha = 0.5f) else DarkBorder
    val surfaceColor = if (!item.isRead) DarkCardSurfaceElevated else DarkCardSurface

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(surfaceColor)
            .border(1.dp, borderColor, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            // Category Icon with glow
            val (badgeEmoji, badgeBrush) = when (item.category) {
                NotificationCategory.REWARDS -> "🪙" to GoldGradient
                NotificationCategory.WALLET -> "💳" to CyanGradient
                else -> "⚡" to PurpleGradient
            }

            Box(
                modifier = Modifier
                    .size(42.dp)
                    .background(badgeBrush, CircleShape)
                    .padding(1.dp)
                    .background(DarkNavyBg, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(badgeEmoji, fontSize = 18.sp)
            }

            // Message Body
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.title,
                        fontWeight = if (!item.isRead) FontWeight.Bold else FontWeight.SemiBold,
                        fontSize = 14.sp,
                        color = if (!item.isRead) TextPrimary else TextSecondary,
                        modifier = Modifier.weight(1f)
                    )

                    if (!item.isRead) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .shadow(elevation = 4.dp, shape = CircleShape, spotColor = ElectricCyan)
                                .background(ElectricCyan, CircleShape)
                        )
                    }
                }

                Text(
                    text = item.body,
                    fontSize = 13.sp,
                    color = TextSecondary,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(2.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.timestamp,
                        fontSize = 11.sp,
                        color = TextMuted
                    )

                    if (!item.isRead) {
                        Text(
                            text = "Tap to open",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = RadiantPurpleLight
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun EmptyNotificationState(category: NotificationCategory) {
    val categoryLabel = when (category) {
        NotificationCategory.ALL -> "all caught up"
        NotificationCategory.REWARDS -> "no reward notifications"
        NotificationCategory.WALLET -> "no wallet alerts"
        NotificationCategory.ANNOUNCEMENTS -> "no announcements"
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 60.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .background(DarkCardSurfaceElevated, CircleShape)
                    .border(1.dp, DarkBorderHighlight, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Notifications,
                    contentDescription = null,
                    tint = TextMuted,
                    modifier = Modifier.size(36.dp)
                )
            }

            Text(
                text = "You're $categoryLabel!",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Text(
                text = "New alerts, rewards and wallet updates will appear here.",
                fontSize = 13.sp,
                color = TextMuted,
                modifier = Modifier.padding(horizontal = 32.dp),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}

@Composable
private fun NotificationPreferencesDialog(
    currentPreferences: NotificationPreference,
    onDismiss: () -> Unit,
    onSave: (NotificationPreference) -> Unit
) {
    var rewardsEnabled by remember { mutableStateOf(currentPreferences.rewardsEnabled) }
    var promotionalEnabled by remember { mutableStateOf(currentPreferences.promotionalEnabled) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DarkCardSurfaceElevated,
        shape = RoundedCornerShape(20.dp),
        title = {
            Text(
                text = "Notification Settings",
                color = TextPrimary,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(
                    text = "Control what alerts and reminder notifications you receive on this device.",
                    color = TextSecondary,
                    fontSize = 13.sp
                )

                // Reward alerts toggle
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Reward & Milestone Alerts",
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary,
                            fontSize = 14.sp
                        )
                        Text(
                            text = "Earned coin confirmations and streak reminders",
                            color = TextMuted,
                            fontSize = 12.sp
                        )
                    }
                    Switch(
                        checked = rewardsEnabled,
                        onCheckedChange = { rewardsEnabled = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = RadiantPurple,
                            uncheckedThumbColor = TextMuted,
                            uncheckedTrackColor = DarkCardSurface
                        )
                    )
                }

                HorizontalDivider(color = DarkBorder)

                // Promotional alerts toggle
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Special Offers & Multipliers",
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary,
                            fontSize = 14.sp
                        )
                        Text(
                            text = "Double coin events and bonus reward announcements",
                            color = TextMuted,
                            fontSize = 12.sp
                        )
                    }
                    Switch(
                        checked = promotionalEnabled,
                        onCheckedChange = { promotionalEnabled = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = ElectricCyan,
                            uncheckedThumbColor = TextMuted,
                            uncheckedTrackColor = DarkCardSurface
                        )
                    )
                }

                HorizontalDivider(color = DarkBorder)

                // Quiet hours notice
                Column {
                    Text(
                        text = "Quiet Hours Respected",
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        fontSize = 14.sp
                    )
                    Text(
                        text = "No non-urgent promotional alerts will be delivered between 22:00 and 08:00 IST.",
                        color = TextMuted,
                        fontSize = 12.sp
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onSave(
                        currentPreferences.copy(
                            rewardsEnabled = rewardsEnabled,
                            promotionalEnabled = promotionalEnabled
                        )
                    )
                },
                colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
            ) {
                Text("Save Preferences", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = TextSecondary)
            }
        }
    )
}
