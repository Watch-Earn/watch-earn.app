package com.watchearn.app.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Phone
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

@Composable
fun LoginScreen(
    onSendOtp: (phone: String) -> Unit
) {
    var phone by remember { mutableStateOf("9876543210") }
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBg)
            .statusBarsPadding()
            .padding(horizontal = 24.dp, vertical = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Image(
                painter = painterResource(id = R.drawable.brand_splash_logo),
                contentDescription = "Watch & Earn",
                modifier = Modifier.size(170.dp),
                contentScale = ContentScale.Fit
            )

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Login to Continue",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "We'll send a secure OTP to verify your number.",
                fontSize = 13.sp,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Phone Input Box with +91 prefix
            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it.filter { c -> c.isDigit() }.take(10) },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Enter Mobile Number", color = TextMuted) },
                leadingIcon = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(start = 12.dp, end = 6.dp)
                    ) {
                        Text("🇮🇳", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("+91", color = TextPrimary, fontWeight = FontWeight.SemiBold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .width(1.dp)
                                .height(20.dp)
                                .background(DarkBorder)
                        )
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = DarkCardSurfaceElevated,
                    unfocusedContainerColor = DarkCardSurfaceElevated,
                    focusedBorderColor = RadiantPurple,
                    unfocusedBorderColor = DarkBorder,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Send OTP Button
            GradientButton(
                text = "Send OTP",
                onClick = {
                    if (phone.length == 10) {
                        onSendOtp(phone)
                    } else {
                        Toast.makeText(context, "Please enter a valid 10-digit number", Toast.LENGTH_SHORT).show()
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = phone.length == 10
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Or Divider
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier.weight(1f).height(1.dp).background(DarkBorder))
                Text("  or  ", color = TextSecondary, fontSize = 13.sp)
                Box(modifier = Modifier.weight(1f).height(1.dp).background(DarkBorder))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Continue with Google Button
            Button(
                onClick = {
                    onSendOtp("9876543210")
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(26.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🌐", fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Continue with Google",
                        color = Color(0xFF1F2937),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
            }
        }

        // Footer
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            Text(
                text = "By continuing, you agree to our",
                fontSize = 12.sp,
                color = TextSecondary
            )
            Text(
                text = "Terms & Privacy Policy",
                fontSize = 12.sp,
                color = RadiantPurpleLight,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
