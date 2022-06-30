package com.worldexplorationaction.android.ui.leaderboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.worldexplorationaction.android.databinding.FragmentLeaderboardBinding;
import com.worldexplorationaction.android.ui.userlist.UserListMode;
import com.worldexplorationaction.android.ui.userlist.UserListView;

public class LeaderboardFragment extends Fragment {

    private FragmentLeaderboardBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        LeaderboardViewModel leaderboardViewModel =
                new ViewModelProvider(this).get(LeaderboardViewModel.class);

        binding = FragmentLeaderboardBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final UserListView userListView = binding.leaderboardContent;
        userListView.init(UserListMode.LEADERBOARD, getContext(), getViewLifecycleOwner(), leaderboardViewModel);

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}