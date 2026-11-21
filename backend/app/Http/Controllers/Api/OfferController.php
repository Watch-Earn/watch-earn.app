<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\RewardEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $offers = Offer::with('partner:id,name,slug')
            ->where('status', 'active')
            ->get()
            ->map(function ($offer) {
                return [
                    'id' => $offer->id,
                    'partner' => $offer->partner->name,
                    'title' => $offer->title,
                    'description' => $offer->description,
                    'reward_coins' => $offer->reward_coins,
                    'reward_inr_equivalent' => number_format($offer->reward_coins / 1000, 2),
                    'daily_cap' => $offer->daily_cap,
                    'terms' => $offer->terms,
                    'status' => $offer->status,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $offers,
        ]);
    }

    public function start(Request $request, int $id): JsonResponse
    {
        $offer = Offer::with('partner')->where('status', 'active')->findOrFail($id);
        $user = $request->user();

        // Create signed session token
        $sessionToken = hash_hmac(
            'sha256',
            "user_{$user->id}_offer_{$offer->id}_" . time(),
            $offer->partner->secret_key
        );

        $launchUrl = "https://partner-gateway.watch-earn.app/track?session={$sessionToken}&user={$user->id}&offer={$offer->external_offer_id}";

        return response()->json([
            'success' => true,
            'data' => [
                'session_token' => $sessionToken,
                'launch_url' => $launchUrl,
                'offer_id' => $offer->id,
                'title' => $offer->title,
                'reward_coins' => $offer->reward_coins,
            ],
            'message' => 'Offer session initialized',
        ]);
    }

    public function activities(Request $request): JsonResponse
    {
        $user = $request->user();

        $events = RewardEvent::with(['offer:id,title', 'partner:id,name'])
            ->where('user_id', $user->id)
            ->latest('received_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }
}
