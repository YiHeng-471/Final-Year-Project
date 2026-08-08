<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeMail;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'pref_scent_type',
        'pref_occasion',
        'pref_gender',
        'has_completed_questionnaire',
    ];

    /**
     * Get the attributes that should be hidden for serialization.
     *
     * @return array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'has_completed_questionnaire' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function perfumeReviews(): HasMany
    {
        return $this->hasMany(PerfumeReview::class);
    }

    public function questionnairePreference(): HasOne
    {
        return $this->hasOne(QuestionnairePreference::class);
    }

    public function sendEmailVerificationCode(): bool
    {
        $code = rand(100000, 999999);
        
        Cache::put('email_verification:' . $this->email, $code, now()->addMinutes(15));

        try {
            Mail::to($this->email)->send(new VerificationCodeMail($code));
            return true;
        } catch (\Exception $e) {
            logger()->error("Failed sending verification to {$this->email}: " . $e->getMessage());
            return false;
        }
    }
}
