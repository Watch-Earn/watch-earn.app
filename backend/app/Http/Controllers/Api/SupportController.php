<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function createTicket(Request $request): JsonResponse
    {
        $request->validate([
            'category' => 'required|string|in:missing_reward,withdrawal_issue,account_query,other',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:2000',
        ]);

        $ticket = SupportTicket::create([
            'user_id' => $request->user()->id,
            'category' => $request->input('category'),
            'subject' => $request->input('subject'),
            'message' => $request->input('message'),
            'status' => 'open',
        ]);

        return response()->json([
            'success' => true,
            'data' => $ticket,
            'message' => 'Support case opened. Our team responds within 48 hours.',
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $tickets = SupportTicket::where('user_id', $request->user()->id)
            ->latest('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }
}
