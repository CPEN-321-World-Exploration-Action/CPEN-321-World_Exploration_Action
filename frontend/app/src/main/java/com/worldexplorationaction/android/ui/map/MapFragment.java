package com.worldexplorationaction.android.ui.map;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.databinding.FragmentMapBinding;
import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.Objects;

public class MapFragment extends Fragment implements OnMapReadyCallback, UserLocation.OnPermissionsUpdateListener,
        GoogleMap.OnMapClickListener, GoogleMap.OnCameraMoveStartedListener, GoogleMap.OnCameraMoveCanceledListener, GoogleMap.OnCameraIdleListener {
    private static final String TAG = MapFragment.class.getSimpleName();
    private MapViewModel mapViewModel;
    private UserLocation userLocation;
    private FragmentMapBinding binding;
    private GoogleMap googleMap;
    private GoogleMapsFragment googleMapsFragment;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        mapViewModel = new ViewModelProvider(this).get(MapViewModel.class);
        userLocation = new UserLocation(this, this);

        binding = FragmentMapBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textMap;
        mapViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);

        googleMapsFragment = (GoogleMapsFragment) Objects.requireNonNull(
                getChildFragmentManager().findFragmentById(R.id.map_google_maps)
        );
        googleMapsFragment.getMapAsync(this);

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @SuppressLint("MissingPermission")
    @Override
    public void onPermissionsUpdate(boolean granted) {
        /* The map must be ready */
        googleMap.setMyLocationEnabled(granted);
    }

    @Override
    public void onMapReady(@NonNull GoogleMap map) {
        this.googleMap = map;

        int statusBarHeight = Utility.getStatusBarHeight(requireActivity());
        googleMap.setPadding(0, statusBarHeight, 0, 0);

        googleMap.setOnMapClickListener(this);
        googleMap.setOnCameraMoveStartedListener(this);
        googleMap.setOnCameraMoveCanceledListener(this);
        googleMap.setOnCameraIdleListener(this);

//        googleMap.setMapType(GoogleMap.MAP_TYPE_TERRAIN);
//        googleMap.setTrafficEnabled(true);
        googleMap.getUiSettings().setMyLocationButtonEnabled(true);
        googleMap.getUiSettings().setAllGesturesEnabled(true);
        googleMap.getUiSettings().setZoomControlsEnabled(true);
        googleMap.setBuildingsEnabled(true);
        googleMap.setIndoorEnabled(true);
        // TODO: Set map style: https://developers.google.com/maps/documentation/cloud-customization/overview

        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(mapViewModel.getDefaultLocation(), 2.0f));

        userLocation.requestPermissionsIfNeeded();
    }

    @Override
    public void onMapClick(@NonNull LatLng latLng) {
        Log.d(TAG, "The user clicked the map.");
    }

    @Override
    public void onCameraIdle() {
        Log.d(TAG, "onCameraIdle");
    }

    @Override
    public void onCameraMoveCanceled() {
        Log.d(TAG, "onCameraMoveCanceled");
    }

    @Override
    public void onCameraMoveStarted(int reason) {
        Log.d(TAG, "onCameraMoveStarted");
    }
}