package com.worldexplorationaction.android;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.databinding.ActivityMainBinding;

import java.util.Objects;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = MainActivity.class.getSimpleName();
    private UserService userService;
    private UserProfile user;
    private ActivityMainBinding binding;
    private GoogleSignInClient mGoogleSignInClient;
    public static String loggedName = "";
    public static String emailAddress = "";
    public static Uri photoURI;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(String.valueOf(R.string.client_server_id))
                .requestEmail()
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(MainActivity.this);
        if (account != null){
            updateUI(account);
        }else {
            signIn();
        }
    }

    public void logOut() {
        mGoogleSignInClient.signOut();
        finish();
        startActivity(getIntent());
    }

    private void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        ActivityResultLauncher<Intent> activityResultLaunch = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                this::onActivityResult);
        activityResultLaunch.launch(signInIntent);
    }


    public void onActivityResult(ActivityResult result) {
        Log.d(TAG, String.valueOf(result.getResultCode()));
        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (result.getResultCode() == Activity.RESULT_OK) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
            handleSignInResult(task);
        }

    }
    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);

            // Signed in successfully, show authenticated UI.
            updateUI(account);
        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
            updateUI(null);
        }
    }
    private void updateUI(GoogleSignInAccount account) {
        if (account == null){
            Log.d(TAG, "There is no user signed in.");
            // Show message with more info
            new AlertDialog.Builder(this)
                    .setTitle(R.string.sign_in_failed_title)
                    .setMessage(getString(R.string.sign_in_failed_body, getString(R.string.app_name)))
                    .setNegativeButton("CANCEL", (dialog, which) -> {
                        dialog.dismiss();
                        MainActivity.this.finish();
                        System.exit(0);
                    })
                    .setPositiveButton("OK", (dialog, which) -> signIn())
                    .create()
                    .show();

        }else{
            Log.d(TAG, "Pref Name: " +  account.getDisplayName());
            Log.d(TAG, account.getGivenName() + " " + account.getFamilyName());
            loggedName = account.getDisplayName();
            emailAddress = account.getEmail();
            photoURI = account.getPhotoUrl();
            Log.d(TAG,  "logged Name: " + loggedName);
            Log.d(TAG, "emailAddress: " + emailAddress);
            Log.d (TAG, "Display URI: " + photoURI);

            // Send to backend
            String tokenID =  account.getIdToken();
            Log.d(TAG, tokenID);
            userService.login(tokenID).enqueue(new Callback<UserProfile>(){
                @Override
                public void onResponse(Call<UserProfile> call, Response<UserProfile> response) {
                    user = response.body();
                    Log.d(TAG, String.valueOf(user));
                }

                @Override
                public void onFailure(Call<UserProfile> call, Throwable t) {
                    Log.d(TAG, String.valueOf(t));
//                    Toast.makeText(getApplicationContext(), "An error has occured", Toast.LENGTH_LONG).show();
                }
            });

            //Move to main view.
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