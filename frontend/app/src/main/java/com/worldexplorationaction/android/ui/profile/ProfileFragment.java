package com.worldexplorationaction.android.ui.profile;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.MainActivity;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.databinding.FragmentProfileBinding;

import java.util.List;

public class ProfileFragment extends Fragment {
    private static final String TAG = ProfileFragment.class.getSimpleName();
    private FragmentProfileBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        ProfileViewModel viewModel =
                new ViewModelProvider(this).get(ProfileViewModel.class);

        binding = FragmentProfileBinding.inflate(inflater, container, false);

        viewModel.getUserProfile().observe(getViewLifecycleOwner(), this::onNewUserProfile);
        viewModel.getPhotos().observe(getViewLifecycleOwner(), this::onNewPhotos);

        if (getActivity() instanceof ProfileActivity) {
            /* Showing a friend's profile */
            ProfileActivity activity = (ProfileActivity) requireActivity();
            viewModel.setDisplayingUser(activity.getUser());
            binding.profileLogoutButton.setVisibility(View.GONE);
            binding.profileYourImagesTitle.setText(R.string.profile_friend_images_title);
        } else {
            viewModel.fetchProfileAndPhotos("id7");
            binding.profileLogoutButton.setOnClickListener(v -> {
                viewModel.logOut();
                MainActivity activity = (MainActivity) requireActivity();
                activity.logOut();
            });
        }

        return binding.getRoot();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @SuppressLint("SetTextI18n")
    private void onNewUserProfile(UserProfile user) {
        Log.i(TAG, "onNewUserProfile: " + user);
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

    private void onNewPhotos(List<Photo> photos) {
        Log.i(TAG, "onNewPhotos: " + photos);
        for (int i = 0; i < binding.profileImagesGrid.getChildCount(); i++) {
            ImageView imageView = (ImageView) binding.profileImagesGrid.getChildAt(i);
            if (i < photos.size()) {
                Glide.with(requireContext())
                        .load(photos.get(i).getPhotoUrl())
                        .placeholder(R.drawable.ic_default_avatar_35dp)
                        .into(imageView);
            } else {
                Glide.with(requireContext())
                        .clear(imageView);
            }
        }
    }
}
