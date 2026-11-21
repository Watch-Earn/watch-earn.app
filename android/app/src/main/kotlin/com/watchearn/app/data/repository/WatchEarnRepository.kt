package com.watchearn.app.data.repository

import com.watchearn.app.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class WatchEarnRepository {

    private val _user = MutableStateFlow(User())
    val user: StateFlow<User> = _user.asStateFlow()

    private val _wallet = MutableStateFlow(WalletSummary())
    val wallet: StateFlow<WalletSummary> = _wallet.asStateFlow()

    private val _videoAds = MutableStateFlow(
        listOf(
            VideoAd(1, "Ad Video #1", 30, 20),
            VideoAd(2, "Ad Video #2", 30, 20),
            VideoAd(3, "Ad Video #3", 30, 20),
            VideoAd(4, "Ad Video #4", 30, 20),
            VideoAd(5, "Ad Video #5", 30, 20),
            VideoAd(6, "Ad Video #6", 30, 20),
            VideoAd(7, "Ad Video #7", 30, 20),
            VideoAd(8, "Ad Video #8", 30, 20)
        )
    )
    val videoAds: StateFlow<List<VideoAd>> = _videoAds.asStateFlow()

    private val _tasks = MutableStateFlow(
        listOf(
            TaskItem(1, "Watch Ads", "Watch ads and earn coins instantly", 50, "ad"),
            TaskItem(2, "Play Games", "Play simple games & earn more coins", 200, "game"),
            TaskItem(3, "Daily Check-in", "Check in daily and get free coins", 100, "checkin", isCompleted = true),
            TaskItem(4, "Task Offers", "Complete tasks & earn big", 1000, "task"),
            TaskItem(5, "Surveys", "Share your opinion & earn", 300, "survey")
        )
    )
    val tasks: StateFlow<List<TaskItem>> = _tasks.asStateFlow()

    private val _transactions = MutableStateFlow(
        listOf(
            TransactionItem(1, "Withdraw to UPI", "12 Jan 2026, 04:20 PM", 10000, false, "Success", "withdrawals"),
            TransactionItem(2, "Watch Ad", "12 Jan 2026, 03:58 PM", 20, true, "Credited", "earnings"),
            TransactionItem(3, "Daily Check-in", "12 Jan 2026, 10:01 AM", 50, true, "Credited", "earnings"),
            TransactionItem(4, "Task Reward", "11 Jan 2026, 06:40 PM", 1000, true, "Credited", "earnings"),
            TransactionItem(5, "Played Game", "11 Jan 2026, 02:15 PM", 200, true, "Credited", "earnings"),
            TransactionItem(6, "Referral Bonus", "10 Jan 2026, 11:30 AM", 500, true, "Credited", "earnings")
        )
    )
    val transactions: StateFlow<List<TransactionItem>> = _transactions.asStateFlow()

    fun completeAd(adId: Int): Int {
        val reward = 20
        val currentU = _user.value
        val currentW = _wallet.value

        _user.value = currentU.copy(
            adsWatchedToday = currentU.adsWatchedToday + 1,
            todayEarnedCoins = currentU.todayEarnedCoins + reward,
            totalEarnedCoins = currentU.totalEarnedCoins + reward
        )

        _wallet.value = currentW.copy(
            availableCoins = currentW.availableCoins + reward,
            totalCoins = currentW.totalCoins + reward
        )

        val newTx = TransactionItem(
            id = System.currentTimeMillis(),
            title = "Watched Ad (30s)",
            timestamp = "Just now",
            coins = reward,
            isCredit = true,
            statusText = "Credited",
            type = "earnings"
        )
        _transactions.value = listOf(newTx) + _transactions.value

        return reward
    }

    fun submitWithdrawal(amountRupees: Int, upiId: String): Result<String> {
        val coinsRequired = amountRupees * 1000
        val currentW = _wallet.value

        if (currentW.availableCoins < coinsRequired) {
            return Result.failure(Exception("Insufficient available balance. You have ${currentW.availableCoins} coins."))
        }

        _wallet.value = currentW.copy(
            availableCoins = currentW.availableCoins - coinsRequired,
            totalCoins = currentW.totalCoins - coinsRequired,
            paidCoins = currentW.paidCoins + coinsRequired
        )

        val newTx = TransactionItem(
            id = System.currentTimeMillis(),
            title = "Withdraw to UPI ($upiId)",
            timestamp = "Just now",
            coins = coinsRequired,
            isCredit = false,
            statusText = "Processing",
            type = "withdrawals"
        )
        _transactions.value = listOf(newTx) + _transactions.value

        return Result.success("Withdrawal of ₹$amountRupees submitted successfully to $upiId!")
    }

    companion object {
        val instance = WatchEarnRepository()
    }
}
