package com.worldexplorationaction.android.ui.friends;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.worldexplorationaction.android.databinding.FragmentFriendsBinding;
import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.Objects;

public class FriendsFragment extends Fragment {
    private FriendsViewModel viewModel;
    private FragmentFriendsBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        this.viewModel = new ViewModelProvider(this).get(FriendsViewModel.class);
        this.binding = FragmentFriendsBinding.inflate(inflater, container, false);

        viewModel.fetchFriends();
        viewModel.fetchFriendRequests();

        binding.friendsUserList.init(getContext(), getViewLifecycleOwner(), viewModel);
        binding.friendsUserList.setOnItemClickListener(itemPosition ->
                Toast.makeText(getContext(),
                        Objects.requireNonNull(viewModel.getUsers().getValue())
                                .get(itemPosition).toString(),
                        Toast.LENGTH_SHORT
                ).show()
        );

        View root = binding.getRoot();
        root.setPadding(0, Utility.getStatusBarHeight(getResources()), 0, 0);
        return root;
    }

    @Override
    public void onStart() {
        super.onStart();
        binding.friendsSearchEditText.setText("");
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}