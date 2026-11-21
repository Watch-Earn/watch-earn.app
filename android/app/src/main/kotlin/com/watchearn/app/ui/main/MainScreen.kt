package com.watchearn.app.ui.main

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.data.model.VideoAd
import com.watchearn.app.data.repository.WatchEarnRepository
import com.watchearn.app.ui.screens.auth.LoginScreen
import com.watchearn.app.ui.screens.auth.OtpVerifyScreen
import com.watchearn.app.ui.screens.earn.AdPlayerScreen
import com.watchearn.app.ui.screens.earn.EarnHubScreen
import com.watchearn.app.ui.screens.earn.RewardSuccessScreen
import com.watchearn.app.ui.screens.earn.WatchAdsListScreen
import com.watchearn.app.ui.screens.home.HomeScreen
import com.watchearn.app.ui.screens.onboarding.OnboardingScreen
import com.watchearn.app.ui.screens.profile.ProfileScreen
import com.watchearn.app.ui.screens.refer.ReferScreen
import com.watchearn.app.ui.screens.splash.SplashScreen
import com.watchearn.app.ui.screens.support.SupportScreen
import com.watchearn.app.ui.screens.tasks.TasksScreen
import com.watchearn.app.ui.screens.wallet.TransactionHistoryScreen
import com.watchearn.app.ui.screens.wallet.WalletScreen
import com.watchearn.app.ui.screens.withdraw.WithdrawScreen
import com.watchearn.app.ui.theme.*

enum class BottomTab {
    HOME, TASKS, WALLET, PROFILE
}

sealed class ScreenRoute {
    data object Splash : ScreenRoute()
    data object Onboarding : ScreenRoute()
    data object Login : ScreenRoute()
    data class OtpVerify(val phone: String) : ScreenRoute()
    data object MainApp : ScreenRoute()
    data object WatchAdsList : ScreenRoute()
    data class AdPlayer(val ad: VideoAd) : ScreenRoute()
    data class RewardSuccess(val coins: Int) : ScreenRoute()
    data object EarnHub : ScreenRoute()
    data object Withdraw : ScreenRoute()
    data object TransactionHistory : ScreenRoute()
    data object Refer : ScreenRoute()
    data object Tasks : ScreenRoute()
    data object Support : ScreenRoute()
}

@Composable
fun MainScreen(
    repository: WatchEarnRepository = WatchEarnRepository.instance
) {
    var currentRoute by remember { mutableStateOf<ScreenRoute>(ScreenRoute.Splash) }
    var currentBottomTab by remember { mutableStateOf(BottomTab.HOME) }

    when (val route = currentRoute) {
        is ScreenRoute.Splash -> {
            SplashScreen(onFinish = { currentRoute = ScreenRoute.MainApp })
        }
        is ScreenRoute.Onboarding -> {
            OnboardingScreen(onFinish = { currentRoute = ScreenRoute.Login })
        }
        is ScreenRoute.Login -> {
            LoginScreen(
                onSendOtp = { phone -> currentRoute = ScreenRoute.OtpVerify(phone) }
            )
        }
        is ScreenRoute.OtpVerify -> {
            OtpVerifyScreen(
                phone = route.phone,
                onBack = { currentRoute = ScreenRoute.Login },
                onVerified = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.WatchAdsList -> {
            WatchAdsListScreen(
                repository = repository,
                onSelectAd = { ad -> currentRoute = ScreenRoute.AdPlayer(ad) },
                onBack = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.AdPlayer -> {
            AdPlayerScreen(
                ad = route.ad,
                onAdCompleted = {
                    val reward = repository.completeAd(route.ad.id)
                    currentRoute = ScreenRoute.RewardSuccess(reward)
                }
            )
        }
        is ScreenRoute.RewardSuccess -> {
            RewardSuccessScreen(
                rewardCoins = route.coins,
                onClaim = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.EarnHub -> {
            EarnHubScreen(
                onNavigateToWatchAds = { currentRoute = ScreenRoute.WatchAdsList },
                onNavigateBack = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.Withdraw -> {
            WithdrawScreen(
                repository = repository,
                onBack = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.TransactionHistory -> {
            TransactionHistoryScreen(
                repository = repository,
                onBack = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.Refer -> {
            ReferScreen(
                repository = repository,
                onBack = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.Tasks -> {
            TasksScreen(
                repository = repository,
                onBack = { currentRoute = ScreenRoute.MainApp }
            )
        }
        is ScreenRoute.Support -> {
            SupportScreen(repository = repository)
        }
        is ScreenRoute.MainApp -> {
            // Main Scaffold with Bottom Navigation Bar matching 00_ORIGINAL_DARK_THEME_REFERENCE.png
            Scaffold(
                containerColor = DarkNavyBg,
                contentWindowInsets = WindowInsets(0, 0, 0, 0),
                bottomBar = {
                    DarkThemeBottomNav(
                        currentTab = currentBottomTab,
                        onTabSelected = { tab -> currentBottomTab = tab },
                        onWatchCenterClick = { currentRoute = ScreenRoute.WatchAdsList }
                    )
                }
            ) { innerPadding ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(bottom = innerPadding.calculateBottomPadding())
                ) {
                    when (currentBottomTab) {
                        BottomTab.HOME -> HomeScreen(
                            repository = repository,
                            onNavigateToWatchAds = { currentRoute = ScreenRoute.WatchAdsList },
                            onNavigateToWallet = { currentBottomTab = BottomTab.WALLET },
                            onNavigateToWithdraw = { currentRoute = ScreenRoute.Withdraw },
                            onNavigateToTasks = { currentBottomTab = BottomTab.TASKS },
                            onNavigateToRefer = { currentRoute = ScreenRoute.Refer }
                        )
                        BottomTab.TASKS -> TasksScreen(
                            repository = repository,
                            onBack = { currentBottomTab = BottomTab.HOME }
                        )
                        BottomTab.WALLET -> WalletScreen(
                            repository = repository,
                            onNavigateToWithdraw = { currentRoute = ScreenRoute.Withdraw },
                            onNavigateToHistory = { currentRoute = ScreenRoute.TransactionHistory },
                            onBack = { currentBottomTab = BottomTab.HOME }
                        )
                        BottomTab.PROFILE -> ProfileScreen(
                            repository = repository,
                            onNavigateToSupport = { currentRoute = ScreenRoute.Support },
                            onLogout = { currentRoute = ScreenRoute.Login },
                            onBack = { currentBottomTab = BottomTab.HOME }
                        )
                    }
                }
            }
        }
    }
}

/**
 * Bottom Navigation Bar faithful to 00_ORIGINAL_DARK_THEME_REFERENCE.png
 * Features:
 * - Home (with cyan active glow indicator)
 * - Tasks
 * - Elevated Glowing Center Circular "Watch" Button (Radiant Purple & Neon Pink Halo)
 * - Wallet
 * - Profile
 */
@Composable
fun DarkThemeBottomNav(
    currentTab: BottomTab,
    onTabSelected: (BottomTab) -> Unit,
    onWatchCenterClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(84.dp)
            .background(DarkNavyBg)
    ) {
        // Background Bar Surface
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .height(64.dp)
                .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                .background(Color(0xFF101333))
                .border(1.dp, Color(0xFF282B57), RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                // 1. Home
                NavTabItem(
                    title = "Home",
                    icon = "🏠",
                    isSelected = (currentTab == BottomTab.HOME),
                    onClick = { onTabSelected(BottomTab.HOME) }
                )

                // 2. Tasks
                NavTabItem(
                    title = "Tasks",
                    icon = "📋",
                    isSelected = (currentTab == BottomTab.TASKS),
                    onClick = { onTabSelected(BottomTab.TASKS) }
                )

                // Space for center Watch button
                Spacer(modifier = Modifier.width(64.dp))

                // 4. Wallet
                NavTabItem(
                    title = "Wallet",
                    icon = "👛",
                    isSelected = (currentTab == BottomTab.WALLET),
                    onClick = { onTabSelected(BottomTab.WALLET) }
                )

                // 5. Profile
                NavTabItem(
                    title = "Profile",
                    icon = "👤",
                    isSelected = (currentTab == BottomTab.PROFILE),
                    onClick = { onTabSelected(BottomTab.PROFILE) }
                )
            }
        }

        // Center Elevated Glowing Watch Button (Matching 00_ORIGINAL_DARK_THEME_REFERENCE.png)
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .offset(y = (-6).dp)
                .clickable { onWatchCenterClick() },
            contentAlignment = Alignment.Center
        ) {
            // Neon Glow Ring
            Box(
                modifier = Modifier
                    .size(66.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            listOf(Color(0xFFE024C3), Color(0xFF9633F5), Color.Transparent)
                        )
                    )
            )

            // Inner Button
            Box(
                modifier = Modifier
                    .size(54.dp)
                    .shadow(12.dp, CircleShape, spotColor = Color(0xFFE024C3))
                    .clip(CircleShape)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFFA855F7), Color(0xFF6B21A8))
                        )
                    )
                    .border(2.dp, Color(0xFFE9D5FF), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        Icons.Default.PlayArrow,
                        contentDescription = "Watch",
                        tint = Color.White,
                        modifier = Modifier.size(26.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun NavTabItem(
    title: String,
    icon: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier
            .clickable { onClick() }
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = icon,
            fontSize = if (isSelected) 20.sp else 18.sp
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = title,
            fontSize = 11.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = if (isSelected) ElectricCyan else TextSecondary
        )
        if (isSelected) {
            Box(
                modifier = Modifier
                    .padding(top = 2.dp)
                    .width(16.dp)
                    .height(2.dp)
                    .background(ElectricCyan, CircleShape)
            )
        }
    }
}
