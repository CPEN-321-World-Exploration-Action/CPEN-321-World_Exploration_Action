package com.worldexplorationaction.android.ui.leaderboard;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.databinding.FragmentLeaderboardBinding;
import com.worldexplorationaction.android.ui.userlist.UserListMode;
import com.worldexplorationaction.android.ui.userlist.UserListView;

public class LeaderboardFragment extends Fragment implements View.OnClickListener {
    private static final String TAG = LeaderboardFragment.class.getSimpleName();
    private final static LeaderboardType DEFAULT_TYPE = LeaderboardType.GLOBAL;
    private Context context;
    private LeaderboardViewModel leaderboardViewModel;
    private FragmentLeaderboardBinding binding;
    private Button globalButton;
    private Button friendsButton;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        this.context = getContext();
        this.leaderboardViewModel = new ViewModelProvider(this).get(LeaderboardViewModel.class);
        this.binding = FragmentLeaderboardBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final UserListView userListView = binding.leaderboardContent;
        userListView.init(UserListMode.LEADERBOARD, context, getViewLifecycleOwner(), leaderboardViewModel);

        leaderboardViewModel.getLeaderboardType().observe(getViewLifecycleOwner(), this::onLeaderboardTypeUpdate);

        globalButton = binding.leaderboardGlobalButton;
        friendsButton = binding.leaderboardFriendsButton;

        globalButton.setOnClickListener(this);
        friendsButton.setOnClickListener(this);

        leaderboardViewModel.notifySwitchLeaderboardType(DEFAULT_TYPE);

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
        leaderboardViewModel = null;
    }

    @Override
    public void onClick(View v) {
        LeaderboardType target;
        if (v.getId() == R.id.leaderboard_global_button) {
            target = LeaderboardType.GLOBAL;
        } else if (v.getId() == R.id.leaderboard_friends_button) {
            target = LeaderboardType.FRIENDS;
        } else {
            Log.e(TAG, "Unknown click event, id=" + v.getId());
            return;
        }
        leaderboardViewModel.notifySwitchLeaderboardType(target);
    }

    public void onLeaderboardTypeUpdate(LeaderboardType newType) {
        Button active, inactive;
        switch (newType) {
            case GLOBAL:
                active = globalButton;
                inactive = friendsButton;
                break;
            case FRIENDS:
                active = friendsButton;
                inactive = globalButton;
                break;
            default:
                throw new IllegalStateException("Unexpected type: " + newType);
        }

        active.setTextColor(ContextCompat.getColor(context, R.color.leaderboard_button_active_font));
        active.setBackgroundColor(ContextCompat.getColor(context, R.color.leaderboard_button_active_background));

        inactive.setTextColor(ContextCompat.getColor(context, R.color.leaderboard_button_inactive_font));
        inactive.setBackgroundColor(ContextCompat.getColor(context, R.color.leaderboard_button_inactive_background));
    }
}