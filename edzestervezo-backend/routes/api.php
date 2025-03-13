use Illuminate\Http\Request;
use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
