package com.worldexplorationaction.android.ui.map;

import android.os.Bundle;
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
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.databinding.FragmentMapBinding;
import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.Objects;

public class MapFragment extends Fragment implements OnMapReadyCallback {
    private FragmentMapBinding binding;
    private GoogleMap googleMap;
    private GoogleMapsFragment googleMapsFragment;
    private MapViewModel mapViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        mapViewModel =
                new ViewModelProvider(this).get(MapViewModel.class);

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

    @Override
    public void onMapReady(@NonNull GoogleMap map) {
        this.googleMap = map;

        int statusBarHeight = Utility.getStatusBarHeight(requireActivity());
        googleMap.setPadding(0, statusBarHeight, 0, 0);

//        googleMap.setMyLocationEnabled(true);
//        googleMap.setMapType(GoogleMap.MAP_TYPE_TERRAIN);
        googleMap.getUiSettings().setZoomControlsEnabled(true);
//        googleMap.setTrafficEnabled(true);
        googleMap.getUiSettings().setAllGesturesEnabled(true);
        googleMap.setBuildingsEnabled(true);
        googleMap.setIndoorEnabled(true);
        // TODO: Set map style: https://developers.google.com/maps/documentation/cloud-customization/overview
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(mapViewModel.getDefaultLocation(), 2.0f));
    }
}