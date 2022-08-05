package com.worldexplorationaction.android;

import android.app.AlertDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;

import com.google.android.gms.maps.MapsInitializer;
import com.worldexplorationaction.android.databinding.ActivityMainBinding;
import com.worldexplorationaction.android.fcm.WeaFirebaseMessagingService;
import com.worldexplorationaction.android.ui.signin.SignInManager;

import java.util.Objects;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = MainActivity.class.getSimpleName();
    private SignInManager signInManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        optInNewGoogleMapsRenderer();
        WeaFirebaseMessagingService.subscribeTopics();

        this.signInManager = new SignInManager(this);

        signInManager.setOnSignInResultListener(this::onSignInResult);
        if (!signInManager.checkLastAccount(this)) {
            setContentView(R.layout.main);
        }
    }

    public void signUp(View unused) {
        signIn(unused);
    }

    public void signIn(View unused) {
        signInManager.signIn();
    }

    public void logOut() {
        signInManager.logOut();
        finish();
        startActivity(getIntent());
    }

    public SignInManager getSignInManager() {
        return signInManager;
    }

    private void onSignInResult(boolean success, String errorMessage) {
        Log.d(TAG, "onSignInResult: " + success + ", error message: " + errorMessage);
        if (success) {
            inflateContent();
        } else {
            showSignInFailedDialog(errorMessage);
        }
    }

    private void inflateContent() {
        ActivityMainBinding binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        NavHostFragment navHostFragment = (NavHostFragment) Objects.requireNonNull(
                getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment_activity_main)
        );
        NavigationUI.setupWithNavController(binding.navView, navHostFragment.getNavController());
    }

    private void showSignInFailedDialog(String errorMessage) {
        new AlertDialog.Builder(this)
                .setTitle(R.string.sign_in_failed_title)
                .setMessage(getString(R.string.sign_in_failed_body, getString(R.string.app_name), errorMessage))
                .setNegativeButton(R.string.common_close, (d, w) -> MainActivity.this.finishAffinity())
                .setPositiveButton(R.string.common_retry, (d, w) -> signInManager.signIn())
                .create()
                .show();
    }

    /**
     * Opt-in to the new renderer in Maps SDK 18
     *
     * @see <a href="https://developers.google.com/maps/documentation/android-sdk/renderer">New Map Renderer</a>
     */
    private void optInNewGoogleMapsRenderer() {
        MapsInitializer.initialize(getApplicationContext(), MapsInitializer.Renderer.LATEST, renderer -> {
            switch (renderer) {
                case LATEST:
                    Log.d(TAG, "The latest version of the renderer is used.");
                    break;
                case LEGACY:
                    Log.d(TAG, "The legacy version of the renderer is used.");
                    break;
                default:
                    Log.d(TAG, "An unknown version of the renderer is used.");
                    break;
            }
        });
    }
}