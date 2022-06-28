package com.worldexplorationaction.android.ui.map;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.pm.PackageManager;
import android.util.Log;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.worldexplorationaction.android.R;

/**
 * The {@link UserLocation} is a helper for {@link Fragment} that manages location permissions.
 */
public class UserLocation {
    private static final String TAG = UserLocation.class.getSimpleName();
    private final Activity activity;
    private final OnPermissionsUpdateListener permissionsUpdateListener;
    private final ActivityResultLauncher<String[]> permissionsRequestLauncher;

    /**
     * Create an instance of {@link UserLocation}.
     *
     * @param fragment the fragment using the user's location.
     * @param permissionsUpdateListener the callback to be called when the location permission status is updated
     */
    public UserLocation(@NonNull Fragment fragment, @NonNull OnPermissionsUpdateListener permissionsUpdateListener) {
        this.activity = fragment.requireActivity();
        this.permissionsUpdateListener = permissionsUpdateListener;
        this.permissionsRequestLauncher = fragment.registerForActivityResult(
                new ActivityResultContracts.RequestMultiplePermissions(),
                result -> permissionsRequestCallback()
        );
    }

    /**
     * Determine whether the app has been granted sufficient location permissions.
     *
     * @return true if the app has been granted the permissions, false if not.
     */
    public boolean isPermissionGranted() {
        boolean coarse = ContextCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        Log.i(TAG, coarse ? "Coarse location permissions granted" : "Coarse location permissions not granted");
        boolean fine = ContextCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        Log.i(TAG, coarse ? "Fine location permissions granted" : "Fine location permissions not granted");
        return coarse && fine;
    }

    /**
     * Request location permissions if the user has not granted them.
     * The {@link OnPermissionsUpdateListener} will be called at least once.
     */
    public void requestPermissionsIfNeeded() {
        if (isPermissionGranted()) {
            Log.i(TAG, "The user has already granted the permissions.");
            permissionsUpdateListener.onPermissionsUpdate(true);
        } else {
            if (shouldShowPermissionRationale()) {
                Log.i(TAG, "Showing the permission rationale");
                new AlertDialog.Builder(activity)
                        .setTitle(R.string.location_request_rationale_title)
                        .setMessage(R.string.location_request_rationale_message)
                        .setNegativeButton(R.string.permission_no,
                                (dialog, which) -> permissionsUpdateListener.onPermissionsUpdate(false))
                        .setPositiveButton(R.string.permission_ok,
                                (dialog, which) -> doRequestPermissions())
                        .create()
                        .show();
            } else {
                doRequestPermissions();
            }
        }
    }

    /**
     * Check whether the app should show UI with rationale before requesting a permission.
     *
     * @return true if the app should show UI with rationale, false if not.
     */
    private boolean shouldShowPermissionRationale() {
        boolean coarse = ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACCESS_COARSE_LOCATION);
        boolean fine = ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACCESS_FINE_LOCATION);
        return coarse || fine;
    }

    /**
     * Request the permissions. {@link #permissionsRequestCallback()} will be called when the request is completed.
     */
    private void doRequestPermissions() {
        Log.i(TAG, "Requesting permissions");
        permissionsRequestLauncher.launch(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION});
    }

    private void permissionsRequestCallback() {
        if (isPermissionGranted()) {
            Log.i(TAG, "Permissions granted");
            permissionsUpdateListener.onPermissionsUpdate(true);
        } else {
            Log.i(TAG, "Permissions denied");
            Toast.makeText(activity, R.string.location_permissions_denied, Toast.LENGTH_SHORT).show();
            if (shouldShowPermissionRationale()) {
                requestPermissionsIfNeeded();
            } else {
                permissionsUpdateListener.onPermissionsUpdate(false);
            }
        }
    }

    public interface OnPermissionsUpdateListener {

        /**
         * Called when the location permission status is updated
         *
         * @param granted whether the location permissions has been granted
         */
        void onPermissionsUpdate(boolean granted);
    }
}
