package com.watchearn.app.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.R
import com.watchearn.app.ui.components.GradientButton
import com.watchearn.app.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun OtpVerifyScreen(
    phone: String,
    onBack: () -> Unit,
    onVerified: () -> Unit
) {
    var otpCode by remember { mutableStateOf("123456") }
    var secondsLeft by remember { mutableIntStateOf(28) }
    val context = LocalContext.current

    LaunchedEffect(key1 = secondsLeft) {
        if (secondsLeft > 0) {
            delay(1000)
            secondsLeft--
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .statusBarsPadding()
            .padding(horizontal = 24.dp, vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Top Back Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(38.dp)
                        .background(DarkCardSurfaceElevated, CircleShape)
                        .border(1.dp, DarkBorder, CircleShape)
                ) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = TextPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Image(
                painter = painterResource(id = R.drawable.brand_splash_logo),
                contentDescription = "Watch & Earn",
                modifier = Modifier.size(130.dp),
                contentScale = ContentScale.Fit
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Verify OTP",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Enter the 6-digit code sent to",
                fontSize = 13.sp,
                color = TextSecondary
            )
            Text(
                text = "+91 $phone",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(32.dp))

            // 6 OTP Digit Visual Boxes
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                for (i in 0 until 6) {
                    val digit = if (i < otpCode.length) otpCode[i].toString() else ""
                    val isFocused = i == otpCode.length.coerceAtMost(5)

                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(DarkCardSurfaceElevated)
                            .border(
                                1.5.dp,
                                if (isFocused) RadiantPurple else DarkBorder,
                                RoundedCornerShape(12.dp)
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (digit.isNotEmpty()) "•" else "",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Timer & Resend
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = if (secondsLeft > 0) "Resend OTP in " else "Didn't receive code? ",
                    fontSize = 13.sp,
                    color = TextSecondary
                )
                if (secondsLeft > 0) {
                    Text(
                        text = "00:${String.format("%02d", secondsLeft)}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = RadiantPurpleLight
                    )
                } else {
                    Text(
                        text = "Resend OTP",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = ElectricCyan,
                        modifier = Modifier.clickable { secondsLeft = 30 }
                    )
                }
            }
        }

        // Verify & Login CTA
        GradientButton(
            text = "Verify & Login",
            onClick = {
                if (otpCode.length == 6) {
                    Toast.makeText(context, "Verification Successful!", Toast.LENGTH_SHORT).show()
                    onVerified()
                } else {
                    Toast.makeText(context, "Please enter 6-digit OTP", Toast.LENGTH_SHORT).show()
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            enabled = otpCode.length == 6
        )
    }
}
