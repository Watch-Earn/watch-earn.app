package com.watchearn.app.ui.screens.auth

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.R
import com.watchearn.app.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    onGoogleSignIn: (name: String, email: String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(false) }
    var showTermsDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .statusBarsPadding()
            .padding(horizontal = 24.dp, vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top & Center Branding Section
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Spacer(modifier = Modifier.height(4.dp))

            // Main Brand Splash Logo
            Image(
                painter = painterResource(id = R.drawable.brand_splash_logo),
                contentDescription = "Watch & Earn",
                modifier = Modifier
                    .size(190.dp)
                    .padding(4.dp),
                contentScale = ContentScale.Fit
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Welcome to Watch & Earn",
                fontSize = 22.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextPrimary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Sign in or sign up with your Google account to start watching ads & earning real cash.",
                fontSize = 13.sp,
                color = TextSecondary,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Value Proposition / Trust Features List
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(DarkCardSurfaceElevated)
                    .border(1.dp, DarkBorder, RoundedCornerShape(18.dp))
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                AuthFeatureRow(
                    icon = "🎬",
                    title = "Watch Short Ads",
                    desc = "Get rewarded in coins for every 30s ad"
                )
                HorizontalDivider(color = DarkBorder.copy(alpha = 0.5f))
                AuthFeatureRow(
                    icon = "⚡",
                    title = "Instant UPI Withdrawals",
                    desc = "Direct payout to GPay, PhonePe or Paytm"
                )
                HorizontalDivider(color = DarkBorder.copy(alpha = 0.5f))
                AuthFeatureRow(
                    icon = "🛡️",
                    title = "1-Tap Google Sign-In",
                    desc = "No phone number, passwords or OTP needed"
                )
            }
        }

        // Action Section (Google Sign In Button + Legal Disclaimers)
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Google Sign In / Sign Up Button
            Button(
                onClick = {
                    if (!isLoading) {
                        isLoading = true
                        coroutineScope.launch {
                            delay(600) // Brief smooth transition delay
                            isLoading = false
                            Toast.makeText(context, "Signed in as Rahul Sharma", Toast.LENGTH_SHORT).show()
                            onGoogleSignIn("Rahul Sharma", "rahul.sharma@gmail.com")
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White,
                    contentColor = Color(0xFF1F2937)
                ),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = Color(0xFF1F2937),
                        strokeWidth = 2.5.dp
                    )
                } else {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.ic_google_logo),
                            contentDescription = "Google Logo",
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "Continue with Google",
                            color = Color(0xFF1F2937),
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Single tap to Log In or Sign Up instantly",
                fontSize = 12.sp,
                color = TextSecondary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Footer Compliance
            Text(
                text = "By continuing, you agree to our",
                fontSize = 12.sp,
                color = TextSecondary
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "Terms of Service",
                    fontSize = 12.sp,
                    color = RadiantPurpleLight,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable { showTermsDialog = true }
                )
                Text(
                    text = "  •  ",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
                Text(
                    text = "Privacy Policy",
                    fontSize = 12.sp,
                    color = RadiantPurpleLight,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable { showPrivacyDialog = true }
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        if (showTermsDialog) {
            AlertDialog(
                onDismissRequest = { showTermsDialog = false },
                containerColor = DarkCardSurfaceElevated,
                title = { Text("Terms of Service", fontWeight = FontWeight.Bold, color = TextPrimary) },
                text = {
                    Text(
                        text = "1. Age Eligibility: 18+ years only.\n2. Loyalty Micro-Rewards: 100 Coins = ₹0.10.\n3. Fair Play Policy: Automation, bots, or multiple accounts are strictly prohibited.\n4. Withdrawals: Processed via linked UPI.",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                },
                confirmButton = {
                    Button(
                        onClick = { showTermsDialog = false },
                        colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
                    ) {
                        Text("Close", color = Color.White)
                    }
                }
            )
        }

        if (showPrivacyDialog) {
            AlertDialog(
                onDismissRequest = { showPrivacyDialog = false },
                containerColor = DarkCardSurfaceElevated,
                title = { Text("Privacy Policy", fontWeight = FontWeight.Bold, color = TextPrimary) },
                text = {
                    Text(
                        text = "Watch & Earn is compliant with the Indian Digital Personal Data Protection Act (DPDPA 2023). We only collect your Google profile information (name, email) and UPI ID for processing rewards. Your personal data is never sold to third parties.",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                },
                confirmButton = {
                    Button(
                        onClick = { showPrivacyDialog = false },
                        colors = ButtonDefaults.buttonColors(containerColor = RadiantPurple)
                    ) {
                        Text("Close", color = Color.White)
                    }
                }
            )
        }
    }
}

@Composable
private fun AuthFeatureRow(
    icon: String,
    title: String,
    desc: String
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier
                .size(38.dp)
                .clip(CircleShape)
                .background(Color(0xFF1E2145)),
            contentAlignment = Alignment.Center
        ) {
            Text(icon, fontSize = 18.sp)
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = title,
                fontSize = 13.sp,
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
