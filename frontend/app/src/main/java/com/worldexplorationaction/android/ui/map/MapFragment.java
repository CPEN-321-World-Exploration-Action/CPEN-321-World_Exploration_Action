package com.worldexplorationaction.android.ui.map;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.trophy.TrophyBitmaps;
import com.worldexplorationaction.android.databinding.FragmentMapBinding;
import com.worldexplorationaction.android.ui.trophy.TrophyDetailsActivity;
import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Objects;
import java.util.Set;

public class MapFragment extends Fragment implements OnMapReadyCallback,
        GoogleMap.OnCameraIdleListener, GoogleMap.OnMarkerClickListener, GoogleMap.OnMyLocationButtonClickListener {
    private static final String TAG = MapFragment.class.getSimpleName();
    public static String trophyTitle = "";
    private static CameraPosition lastCameraPosition;
    private MapViewModel mapViewModel;
    private TrophyBitmaps trophyBitmaps;
    private UserLocation userLocation;
    private FragmentMapBinding binding;
    private GoogleMapsFragment googleMapsFragment;
    private GoogleMap googleMap;
    private Collection<Marker> markers;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        mapViewModel = new ViewModelProvider(this).get(MapViewModel.class);
        userLocation = new UserLocation(this);
        markers = new LinkedList<>();
        binding = FragmentMapBinding.inflate(inflater, container, false);
        mapViewModel.getDisplayTrophies().observe(getViewLifecycleOwner(), this::onDisplayTrophiesUpdate);

        googleMapsFragment = (GoogleMapsFragment) Objects.requireNonNull(
                getChildFragmentManager().findFragmentById(R.id.map_google_maps)
        );
        googleMapsFragment.getMapAsync(this);

        mapViewModel.getToastMessage().observe(getViewLifecycleOwner(), this::handleToastMessage);

        return binding.getRoot();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        lastCameraPosition = googleMap.getCameraPosition();
        googleMapsFragment = null;
        binding = null;
    }

    @SuppressLint("MissingPermission")
    @Override
    public void onMapReady(@NonNull GoogleMap map) {
        Log.d(TAG, "Map is ready");
        this.googleMap = map;

        /* Must be called after the map is initialized */
        trophyBitmaps = new TrophyBitmaps(getResources());

        int statusBarHeight = Utility.getStatusBarHeight(getResources());
        map.setPadding(0, statusBarHeight, 0, 0);

        map.setLocationSource(userLocation);
        map.setMyLocationEnabled(true);
        map.setOnCameraIdleListener(this);
        map.setOnMarkerClickListener(this);
        map.setOnMyLocationButtonClickListener(this);

//        map.setMapType(GoogleMap.MAP_TYPE_TERRAIN);
//        map.setTrafficEnabled(true);
        map.getUiSettings().setMyLocationButtonEnabled(true);
        map.getUiSettings().setAllGesturesEnabled(true);
//        map.getUiSettings().setZoomControlsEnabled(true);
        map.setBuildingsEnabled(true);
        map.setIndoorEnabled(true);
        // TODO: Set map style: https://developers.google.com/maps/documentation/cloud-customization/overview

        map.clear();

        if (lastCameraPosition != null) {
            Log.i(TAG, "Found lastCameraPosition");
            map.moveCamera(CameraUpdateFactory.newCameraPosition(lastCameraPosition));
        } else {
            Log.i(TAG, "No lastCameraPosition");
            animateCameraToMyLocation();
        }
    }

    @Override
    public void onCameraIdle() {
        Log.d(TAG, "onCameraIdle");
        mapViewModel.onCameraPositionUpdate(googleMap.getCameraPosition());
    }

    @Override
    public boolean onMarkerClick(@NonNull Marker marker) {
        Trophy trophy = (Trophy) Objects.requireNonNull(marker.getTag());
        userLocation.getCurrentLocation(location -> {
            if (location == null) {
                Toast.makeText(requireContext(), "Cannot get the current location.", Toast.LENGTH_LONG).show();
                TrophyDetailsActivity.start(requireContext(), trophy, false);
            } else {
                double distance = Utility.getDistance(location, marker.getPosition());
                boolean canCollect = distance < 500.0f;
                TrophyDetailsActivity.start(requireContext(), trophy, canCollect);
            }
        });
        return false;
    }

    @Override
    public boolean onMyLocationButtonClick() {
        animateCameraToMyLocation();
        return true;
    }

    @SuppressLint("MissingPermission")
    private void animateCameraToMyLocation() {
        Log.i(TAG, "animateCameraToMyLocation: start");
        userLocation.getCurrentLocation(location -> {
            if (location == null) {
                Log.i(TAG, "animateCameraToMyLocation: no location");
                new AlertDialog.Builder(getContext())
                        .setMessage(R.string.location_retrieval_error)
                        .setNeutralButton(R.string.common_retry,
                                (dialog, which) -> animateCameraToMyLocation())
                        .setPositiveButton(R.string.common_ok, (dialog, which) -> {
                        })
                        .create()
                        .show();
            } else {
                Log.i(TAG, "animateCameraToMyLocation: to location " + location);
                googleMap.setMyLocationEnabled(true); /* Make sure it is enabled */
                LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
                if (googleMap.getCameraPosition().zoom < mapViewModel.minZoomLevelForTrophies()) {
                    /* Automatically zoom in if necessary */
                    googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, 15.0f));
                } else {
                    googleMap.animateCamera(CameraUpdateFactory.newLatLng(latLng));
                }
            }
        });
    }

    /**
     * Update the UI for new trophies. This might be a costly operation.
     *
     * @param newTrophies new trophies from the view model
     */
    private void onDisplayTrophiesUpdate(Collection<Trophy> newTrophies) {
        if (googleMap == null) {
            return;
        }

        long startTime = System.nanoTime(); /* Time this operation */

        // FIXME: this is a temporary fix to the issue with multiple markers for than same trophy
        googleMap.clear();

        /* Skip trophies that are already on the map, */
        /* and remove markers that are not included in the new list */
        Set<Trophy> newTrophiesSet = new HashSet<>(newTrophies);
        Iterator<Marker> markersIterator = markers.iterator();
        while (markersIterator.hasNext()) {
            Marker oldMarker = markersIterator.next();
            Trophy markerTrophy = (Trophy) oldMarker.getTag();
            if (!newTrophiesSet.remove(markerTrophy)) {
                oldMarker.remove();
                markersIterator.remove();
            }
        }

        /* Add the rest of new trophies to the map */
        for (Trophy trophy : newTrophiesSet) {
            Marker newMarker = googleMap.addMarker(
                    new MarkerOptions()
                            .position(new LatLng(trophy.latitude, trophy.longitude))
                            .anchor(0.5f, 0.7f)
                            .icon(trophyBitmaps.getBitmapDescriptorForTrophy(trophy.getQuality()))
            );
            if (newMarker == null) {
                Log.e(TAG, "Could not add marker for trophy: " + trophy);
                continue;
            }
            newMarker.setTag(trophy);
            markers.add(newMarker);
        }

        Log.i(TAG, "onDisplayTrophiesUpdate took " + (System.nanoTime() - startTime) / 1e6 + "ms");
    }

    private void handleToastMessage(String message) {
        if (message != null) {
            Toast.makeText(requireContext(), message, Toast.LENGTH_LONG).show();
        }
    }
}