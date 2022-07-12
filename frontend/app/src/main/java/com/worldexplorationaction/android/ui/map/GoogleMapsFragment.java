package com.worldexplorationaction.android.ui.map;

import android.os.Bundle;
import android.view.View;

import com.google.android.gms.maps.SupportMapFragment;

public class GoogleMapsFragment extends SupportMapFragment {
    View mapView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mapView = getView();
    }
}
