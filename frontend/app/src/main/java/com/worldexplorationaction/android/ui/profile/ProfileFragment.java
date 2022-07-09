package com.worldexplorationaction.android.ui.profile;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.MainActivity;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.databinding.FragmentProfileBinding;

public class ProfileFragment extends Fragment {
    private FragmentProfileBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        ProfileViewModel profileViewModel =
                new ViewModelProvider(this).get(ProfileViewModel.class);

        binding = FragmentProfileBinding.inflate(inflater, container, false);

        profileViewModel.getUserProfile().observe(getViewLifecycleOwner(), this::onNewUserProfile);

        binding.profileLogoutButton.setOnClickListener(v -> {
            MainActivity activity = (MainActivity) requireActivity();
            activity.logOut();
        });

        return binding.getRoot();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @SuppressLint("SetTextI18n")
    private void onNewUserProfile(UserProfile user) {
        if (user == null) {
            return;
        }
        binding.profileName.setText(user.getName());
        binding.profileEmail.setText(user.getEmail());

        binding.profileTrophiesNumber.setText(Integer.toString(user.getScore()));
        if (user.getRank() == null) {
            binding.profileRankNumber.setText("-");
        } else {
            binding.profileRankNumber.setText(Integer.toString(user.getRank()));
        }

        if (user.getImageUrl() != null && !user.getImageUrl().isEmpty()) {
            Glide.with(requireContext())
                    .load(user.getImageUrl())
                    .into(binding.profileProfileImage);
        } else {
            binding.profileProfileImage.setImageResource(R.drawable.ic_default_avatar_35dp);
        }
    }
}
