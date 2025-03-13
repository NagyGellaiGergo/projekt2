<?php

namespace App\Http\Controllers;

use App\Models\Workout;
use Illuminate\Http\Request;

class WorkoutController extends Controller
{
    public function index()
    {
        return Workout::all();
    }

    public function store(Request $request)
    {
        $workout = Workout::create($request->all());
        return response()->json($workout, 201);
    }
}