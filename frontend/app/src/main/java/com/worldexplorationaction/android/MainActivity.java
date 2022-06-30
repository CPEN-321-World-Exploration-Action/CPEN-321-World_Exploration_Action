package com.worldexplorationaction.android;

import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;

import com.google.android.gms.maps.MapsInitializer;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.worldexplorationaction.android.databinding.ActivityMainBinding;

import java.util.Objects;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = MainActivity.class.getSimpleName();
    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        optInNewGoogleMapsRenderer();

        BottomNavigationView navView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
//        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
//                R.id.navigation_profile, R.id.navigation_map,
//                R.id.navigation_leaderboard, R.id.navigation_friends
//        ).build();
        NavHostFragment navHostFragment = (NavHostFragment) Objects.requireNonNull(
                getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment_activity_main)
        );
        NavController navController = navHostFragment.getNavController();
//        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(binding.navView, navController);
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
            }
        });
    }
}