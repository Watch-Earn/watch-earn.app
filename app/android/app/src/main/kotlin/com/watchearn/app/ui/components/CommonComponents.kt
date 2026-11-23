package com.watchearn.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.watchearn.app.ui.theme.*

@Composable
fun AppHeader(
    title: String,
    onBackClick: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .padding(top = 4.dp, bottom = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            if (onBackClick != null) {
                IconButton(
                    onClick = onBackClick,
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
                Spacer(modifier = Modifier.width(12.dp))
            }
            Text(
                text = title,
                fontSize = 19.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            actions()
        }
    }
}

@Composable
fun CoinIcon(modifier: Modifier = Modifier, size: Dp = 22.dp) {
    Box(
        modifier = modifier
            .size(size)
            .background(GoldGradient, CircleShape)
            .border(1.5.dp, Color(0xFFFFF0A6), CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            Icons.Default.Star,
            contentDescription = "Coin",
            tint = Color(0xFF7A4A00),
            modifier = Modifier.size(size * 0.65f)
        )
    }
}

@Composable
fun GlowCard(
    modifier: Modifier = Modifier,
    borderColor: Color = DarkBorder,
    backgroundColor: Color = DarkCardSurface,
    cornerRadius: Dp = 16.dp,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadius))
            .background(backgroundColor)
            .border(1.dp, borderColor, RoundedCornerShape(cornerRadius))
            .padding(16.dp),
        content = content
    )
}

@Composable
fun GradientButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    gradient: Brush = PurpleGradient,
    leadingIcon: (@Composable () -> Unit)? = null
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .height(52.dp)
            .shadow(if (enabled) 12.dp else 0.dp, RoundedCornerShape(26.dp), spotColor = RadiantPurple),
        shape = RoundedCornerShape(26.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent,
            disabledContainerColor = Color(0xFF232549)
        ),
        contentPadding = PaddingValues()
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(if (enabled) gradient else Brush.linearGradient(listOf(Color(0xFF232549), Color(0xFF232549))))
                .padding(horizontal = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                if (leadingIcon != null) {
                    leadingIcon()
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(
                    text = text,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (enabled) TextPrimary else TextMuted
                )
            }
        }
    }
}

@Composable
fun GamepadLogo(modifier: Modifier = Modifier, size: Dp = 80.dp) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Crown on top
        Text(text = "👑", fontSize = (size.value * 0.35f).sp)
        Box(
            modifier = Modifier
                .size(size)
                .background(
                    Brush.radialGradient(listOf(Color(0xFF431980), Color(0xFF1F0D42), DarkNavyBg)),
                    CircleShape
                )
                .border(2.dp, Brush.linearGradient(listOf(ElectricCyan, RadiantPurple, NeonPink)), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(text = "🎮", fontSize = (size.value * 0.48f).sp)
        }
    }
}
