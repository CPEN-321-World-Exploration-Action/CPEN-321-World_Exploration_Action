package com.worldexplorationaction.android.ui.map;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.worldexplorationaction.android.data.trophy.Trophy;

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
            List<Trophy> n = new ArrayList<>();
            n.add(new Trophy("ubcbg", "UBC Botanical Garden", Trophy.Quality.SILVER, 49.25423261518663, -123.25060270580698));
            n.add(new Trophy("ubcwb", "Wreck Beach", Trophy.Quality.SILVER, 49.262173379130644, -123.26152320148114));
            n.add(new Trophy("ubcbs", "UBC Bookstore", Trophy.Quality.BRONZE, 49.26518650521084, -123.25043270796431));
            n.add(new Trophy("ubcbbm", "Beaty Biodiversity Museum", Trophy.Quality.SILVER, 49.263267669324605, -123.25096787350371));
            n.add(new Trophy("ubcma", "Museum of Anthropology at UBC", Trophy.Quality.GOLD, 49.26958931834766, -123.25948194617801));
            displayTrophies.setValue(n);
        }
    }
}