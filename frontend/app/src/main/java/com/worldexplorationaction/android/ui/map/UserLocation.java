package com.worldexplorationaction.android.ui.map;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.tasks.Task;
import com.worldexplorationaction.android.R;

import java.util.Map;
import java.util.function.Consumer;

/**
 * The {@link UserLocation} is a helper for {@link Fragment} that manages user's location.
 */
public class UserLocation implements LocationSource {
    private static final String TAG = UserLocation.class.getSimpleName();
    private static final long LOCATION_UPDATE_INTERVAL = 1000L;
    private final FusedLocationProviderClient fusedLocationClient;
    private final LocationCallback flpCallback;
    private final Activity activity;
    private final ActivityResultLauncher<String[]> permissionsRequestLauncher;
    private Consumer<Boolean> permissionsUpdateListener;
    private OnLocationChangedListener locationChangedListener;

    /**
     * Create an instance of {@link UserLocation}.
     *
     * @param fragment the fragment using the user's location.
     */
    public UserLocation(@NonNull Fragment fragment) {
        this.activity = fragment.requireActivity();
        this.fusedLocationClient = LocationServices.getFusedLocationProviderClient(activity);
        this.permissionsRequestLauncher = fragment.registerForActivityResult(
                new ActivityResultContracts.RequestMultiplePermissions(),
                this::permissionsRequestActivityCallback
        );
        this.flpCallback = new LocationCallback() {
            @Override
            public void onLocationResult(@NonNull LocationResult locationResult) {
                Location last = locationResult.getLastLocation();
                if (locationChangedListener != null && last != null) {
                    last.removeBearing();
                    last.setLatitude(49.28441697922914);
                    last.setLongitude(-123.11978016872);
                    locationChangedListener.onLocationChanged(last);
                }
            }
        };
    }

    @SuppressLint("MissingPermission")
    @Override
    public void activate(@NonNull OnLocationChangedListener onLocationChangedListener) {
        Log.i(TAG, "activate OnLocationChangedListener");
        UserLocation.this.locationChangedListener = onLocationChangedListener;
        tryRequestingLocationUpdates();
    }

    @Override
    public void deactivate() {
        Log.i(TAG, "deactivate OnLocationChangedListener");
        this.locationChangedListener = null;
    }

    /**
     * Get the user's current location. Request location permissions if necessary.
     *
     * @param callback callback to call when the current location is available. If the location
     *                 cannot be obtained, the callback will get a null value.
     */
    @SuppressLint("MissingPermission")
    public void getCurrentLocation(Consumer<Location> callback) {
        doWithPermissions(hasPermissions -> {
            if (hasPermissions) {
                Log.i(TAG, "getCurrentLocation: calling fusedLocationClient.getCurrentLocation");
                Task<Location> task = fusedLocationClient.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, null);
                task.addOnCompleteListener(t -> {
                    if (t.isSuccessful()) {
                        Log.i(TAG, "getCurrentLocation: success, location=" + t.getResult());
                        Location l = t.getResult();
                        l.setLatitude(49.28441697922914);
                        l.setLongitude(-123.11978016872);
                        callback.accept(l);
                    } else {
                        Log.w(TAG, "getCurrentLocation: fusedLocationClient.getCurrentLocation failed, reason: " + t.getException());
                        callback.accept(null);
                    }
                });
            } else {
                Log.i(TAG, "getCurrentLocation: unable to obtain permissions");
                callback.accept(null);
            }
        });
    }

    /**
     * Perform a task which might require location permissions. Automatically request location
     * permissions if the user has not granted them.
     *
     * @param task the task which might require location permissions to perform
     */
    private void doWithPermissions(Consumer<Boolean> task) {
        Log.i(TAG, "Do with permissions");
        if (isPermissionGranted()) {
            task.accept(true);
        } else {
            requestPermissions(task);
        }
    }

    /**
     * Request location permissions.
     *
     * @param callback callback when the result of the request is available.
     */
    private void requestPermissions(Consumer<Boolean> callback) {
        Log.i(TAG, "Request permissions with callback");
        permissionsUpdateListener = callback; /* will be called once */
        if (shouldShowPermissionRationale()) {
            showPermissionRequestDialog();
        } else {
            launchPermissionsRequestActivity();
        }
    }

    /**
     * Show a dialog to ask whether the user wants to grant location permissions
     */
    private void showPermissionRequestDialog() {
        Log.i(TAG, "Showing the permission rationale dialog");
        new AlertDialog.Builder(activity)
                .setTitle(R.string.location_request_rationale_title)
                .setMessage(R.string.location_request_rationale_message)
                .setNegativeButton(R.string.common_no,
                        (dialog, which) -> notifyPermissionsUpdateListener(false))
                .setPositiveButton(R.string.common_ok,
                        (dialog, which) -> launchPermissionsRequestActivity())
                .create()
                .show();
    }

    /**
     * Determine whether the app has been granted sufficient location permissions.
     *
     * @return true if the app has been granted the permissions, false if not.
     */
    private boolean isPermissionGranted() {
        boolean coarse = ContextCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        Log.i(TAG, coarse ? "Coarse location permissions granted" : "Coarse location permissions not granted");
        boolean fine = ContextCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        Log.i(TAG, coarse ? "Fine location permissions granted" : "Fine location permissions not granted");
        return coarse && fine;
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
     * Request the permissions.
     * {@link #permissionsRequestActivityCallback(Map)} will be called when the request activity is completed.
     */
    private void launchPermissionsRequestActivity() {
        Log.i(TAG, "Requesting permissions");
        permissionsRequestLauncher.launch(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION});
    }

    /**
     * Called by the {@link #permissionsRequestLauncher}
     */
    private void permissionsRequestActivityCallback(Map<String, Boolean> unused) {
        if (isPermissionGranted()) {
            Log.i(TAG, "Permissions granted by user");
            tryRequestingLocationUpdates();
            notifyPermissionsUpdateListener(true);
        } else {
            Log.i(TAG, "Permissions denied by user");
            Toast.makeText(activity, R.string.location_permissions_denied, Toast.LENGTH_SHORT).show();
            if (shouldShowPermissionRationale()) {
                /* Ask the user again */
                showPermissionRequestDialog();
            } else {
                notifyPermissionsUpdateListener(false);
            }
        }
    }

    /**
     * Try requesting location updates. Do nothing if permissions are not granted.
     */
    @SuppressLint("MissingPermission")
    private void tryRequestingLocationUpdates() {
        if (isPermissionGranted()) {
            LocationRequest request = LocationRequest.create()
                    .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
                    .setWaitForAccurateLocation(true)
                    .setInterval(LOCATION_UPDATE_INTERVAL)
                    .setMaxWaitTime(LOCATION_UPDATE_INTERVAL);
            fusedLocationClient.requestLocationUpdates(request, flpCallback, Looper.getMainLooper());
        }
    }

    /**
     * Notify {@link #permissionsUpdateListener} if it is not null.
     *
     * @param granted new permissions status
     */
    private void notifyPermissionsUpdateListener(boolean granted) {
        Log.i(TAG, "notifyPermissionsUpdateListener");
        if (permissionsUpdateListener != null) {
            permissionsUpdateListener.accept(granted);
            permissionsUpdateListener = null;
        }
    }
}
