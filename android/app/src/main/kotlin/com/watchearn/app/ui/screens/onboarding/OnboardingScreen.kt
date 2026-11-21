package com.watchearn.app.ui.screens.onboarding

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.R
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*

data class OnboardingStep(
    val emoji: String,
    val title: String,
    val description: String,
    val buttonText: String
)

@Composable
fun OnboardingScreen(onFinish: () -> Unit) {
    var currentStepIndex by remember { mutableIntStateOf(0) }

    val steps = listOf(
        OnboardingStep(
            emoji = "📺",
            title = "Watch Ads\nEarn Coins",
            description = "Watch short ads and get instant virtual coins.",
            buttonText = "Next"
        ),
        OnboardingStep(
            emoji = "🎁",
            title = "Complete Tasks\nGet More Rewards",
            description = "Finish simple tasks, offers and surveys to earn more.",
            buttonText = "Next"
        ),
        OnboardingStep(
            emoji = "👛",
            title = "Withdraw to\nYour UPI",
            description = "Convert your coins to real money and withdraw easily via UPI.",
            buttonText = "Get Started"
        )
    )

    val currentStep = steps[currentStepIndex]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Bar: Brand Logo & Skip Button
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = painterResource(id = R.drawable.brand_wordmark),
                contentDescription = "Watch & Earn",
                modifier = Modifier
                    .height(30.dp)
                    .wrapContentWidth(),
                contentScale = ContentScale.Fit
            )

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(16.dp))
            ) {
                TextButton(
                    onClick = onFinish,
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 4.dp)
                ) {
                    Text("Skip", color = TextSecondary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        // Center Visual & Text
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            // Glowing Icon Pod
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            listOf(Color(0xFF381B6D), Color(0xFF191240), DarkNavyBg)
                        )
                    )
                    .border(2.dp, Brush.linearGradient(listOf(ElectricCyan, RadiantPurple, NeonPink)), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(text = currentStep.emoji, fontSize = 72.sp)
            }

            Spacer(modifier = Modifier.height(40.dp))

            Text(
                text = currentStep.title,
                fontSize = 26.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextPrimary,
                textAlign = TextAlign.Center,
                lineHeight = 34.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = currentStep.description,
                fontSize = 14.sp,
                color = TextSecondary,
                textAlign = TextAlign.Center,
                lineHeight = 22.sp
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Step Indicator Dots
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                steps.indices.forEach { index ->
                    val isActive = index == currentStepIndex
                    Box(
                        modifier = Modifier
                            .height(8.dp)
                            .width(if (isActive) 24.dp else 8.dp)
                            .clip(CircleShape)
                            .background(if (isActive) ElectricCyan else Color(0xFF282D5C))
                    )
                }
            }
        }

        // Bottom Button
        GradientButton(
            text = currentStep.buttonText,
            onClick = {
                if (currentStepIndex < steps.size - 1) {
                    currentStepIndex++
                } else {
                    onFinish()
                }
            },
            modifier = Modifier.fillMaxWidth()
        )
    }
}
