package com.worldexplorationaction.android.ui.map;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.worldexplorationaction.android.trophy.Trophy;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class MapViewModel extends ViewModel {
    private static final String TAG = MapViewModel.class.getSimpleName();
    private static final float MIN_ZOOM_TROPHY = 9.0f;
    private final MutableLiveData<Collection<Trophy>> displayTrophies;

    public MapViewModel() {
        displayTrophies = new MutableLiveData<>(Collections.emptyList());
    }

    public CameraPosition getDefaultCameraPosition() {
        LatLng vancouver = new LatLng(49.2827, -123.1207);
        return new CameraPosition(vancouver, 4.0f, 0.0f, 0.0f);
    }

    public float minZoomLevelForTrophies() {
        return MIN_ZOOM_TROPHY;
    }

    public LiveData<Collection<Trophy>> getDisplayTrophies() {
        return displayTrophies;
    }

    public void onCameraPositionUpdate(CameraPosition newCameraPosition) {
        Log.d(TAG, "onCameraPositionUpdate");
        if (newCameraPosition.zoom < MIN_ZOOM_TROPHY) {
            Log.d(TAG, "display no trophy since the map is zoomed out");
            displayTrophies.setValue(Collections.emptyList());
        } else {
            Log.d(TAG, "display some trophies");
            List<Trophy> n = new ArrayList<>();
            n.add(new Trophy("SW", "Science w", 49.273375652799665, -123.10383404409907));
            displayTrophies.setValue(n);
        }
    }
}