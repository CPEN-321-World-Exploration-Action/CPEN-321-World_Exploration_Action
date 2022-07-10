package com.worldexplorationaction.android.ui.map;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.trophy.TrophyService;
import com.worldexplorationaction.android.ui.utility.CustomCallback;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;

public class MapViewModel extends ViewModel {
    private static final String TAG = MapViewModel.class.getSimpleName();
    private static final float MIN_ZOOM_TROPHY = 9.0f;
    private final MutableLiveData<Collection<Trophy>> displayTrophies;
    private final MutableLiveData<String> toastMessage;
    private final TrophyService trophyService;
    private Call<List<Trophy>> getTrophiesCall;

    public MapViewModel() {
        this.displayTrophies = new MutableLiveData<>(Collections.emptyList());
        this.trophyService = TrophyService.getService();
        this.toastMessage = new MutableLiveData<>();
    }

    public CameraPosition getDefaultCameraPosition() {
        LatLng vancouver = new LatLng(49.2827, -123.1207);
        return new CameraPosition(vancouver, 4.0f, 0.0f, 0.0f);
    }

    /**
     * The minimum zoom level required to show trophies
     *
     * @return the minimum zoom level required to show trophies
     */
    public float minZoomLevelForTrophies() {
        return MIN_ZOOM_TROPHY;
    }

    public LiveData<Collection<Trophy>> getDisplayTrophies() {
        return displayTrophies;
    }

    public LiveData<String> getToastMessage() {
        return toastMessage;
    }

    /**
     * Notify that the camera position is updated
     *
     * @param newCameraPosition new camera position
     */
    public void onCameraPositionUpdate(CameraPosition newCameraPosition) {
        Log.d(TAG, "onCameraPositionUpdate");
        if (newCameraPosition.zoom < MIN_ZOOM_TROPHY) {
            Log.d(TAG, "display no trophy since the map is zoomed out");
            displayTrophies.setValue(Collections.emptyList());
        } else {
            Log.d(TAG, "display some trophies");
            fetchTrophies(newCameraPosition.target.latitude, newCameraPosition.target.longitude);
        }
    }

    private void fetchTrophies(double latitude, double longitude) {
        if (getTrophiesCall != null) {
            getTrophiesCall.cancel();
            getTrophiesCall = null;
        }
        getTrophiesCall = trophyService.getTrophiesUser(latitude, longitude);
        getTrophiesCall.enqueue(new CustomCallback<>(responseBody -> {
            Log.i(TAG, "trophyService.getTrophiesUser success: " + responseBody);
            displayTrophies.setValue(responseBody);
        }, () -> {
            Log.i(TAG, "trophyService.getTrophiesUser canceled");
        }, errorMessage -> {
            Log.e(TAG, "trophyService.getTrophiesUser failed: " + errorMessage);
            showToastMessage("Could not get trophies: " + errorMessage);
        }));
    }

    private void showToastMessage(String message) {
        toastMessage.setValue(message);
        toastMessage.setValue(null);
    }
}