package com.watchearn.app.data.model

data class User(
    val id: Long = 1,
    val name: String = "Rahul Sharma",
    val email: String = "rahul.sharma@gmail.com",
    val avatarUrl: String = "",
    val level: Int = 5,
    val streakDays: Int = 5,
    val todayEarnedCoins: Int = 200,
    val totalEarnedCoins: Int = 25300,
    val adsWatchedToday: Int = 2,
    val dailyAdsCap: Int = 10,
    val referralCode: String = "RAHUL123",
    val status: String = "active",
    val upiId: String = "rahul@okhdfcbank"
)

data class WalletSummary(
    val availableCoins: Int = 10500,
    val pendingCoins: Int = 2000,
    val reservedCoins: Int = 0,
    val paidCoins: Int = 10000,
    val totalCoins: Int = 12500,
    val minimumWithdrawalCoins: Int = 10000
) {
    val totalRupees: String get() = String.format("%.2f", totalCoins / 1000.0)
    val availableRupees: String get() = String.format("%.2f", availableCoins / 1000.0)
    val pendingRupees: String get() = String.format("%.2f", pendingCoins / 1000.0)
    val availablePaise: Int get() = availableCoins / 10
}

data class VideoAd(
    val id: Int,
    val title: String,
    val durationSec: Int = 30,
    val rewardCoins: Int = 20,
    val isCompleted: Boolean = false
)

data class TaskItem(
    val id: Int,
    val title: String,
    val subtitle: String,
    val rewardCoins: Int,
    val iconType: String, // "ad", "game", "checkin", "survey", "task"
    val isCompleted: Boolean = false
)

data class TransactionItem(
    val id: Long,
    val title: String,
    val timestamp: String,
    val coins: Int,
    val isCredit: Boolean,
    val statusText: String, // "Credited", "Success", "Pending"
    val type: String // "all", "earnings", "withdrawals"
)

data class WithdrawalRecord(
    val id: Long,
    val amountRupees: Int,
    val coinsSpent: Int,
    val upiId: String,
    val status: String, // "Success", "Processing", "Failed"
    val timestamp: String
)


enum class NotificationCategory {
    ALL, REWARDS, WALLET, ANNOUNCEMENTS
}

data class NotificationItem(
    val id: Long,
    val type: String,
    val title: String,
    val body: String,
    val targetScreen: String? = null,
    val targetData: Map<String, String> = emptyMap(),
    val timestamp: String,
    val isRead: Boolean = false
) {
    val category: NotificationCategory get() = when (type) {
        "DAILY_REWARD", "REWARD_CREDIT", "REWARD_EVENT" -> NotificationCategory.REWARDS
        "WALLET_UPDATE", "WITHDRAWAL_REQUESTED", "WITHDRAWAL_PAID", "WITHDRAWAL_FAILED" -> NotificationCategory.WALLET
        else -> NotificationCategory.ANNOUNCEMENTS
    }
}

data class NotificationPreference(
    val rewardsEnabled: Boolean = true,
    val promotionalEnabled: Boolean = true,
    val quietHoursStart: String? = "22:00",
    val quietHoursEnd: String? = "08:00",
    val timezone: String = "Asia/Kolkata"
)
