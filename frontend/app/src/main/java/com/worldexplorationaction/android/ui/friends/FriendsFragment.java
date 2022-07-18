package com.worldexplorationaction.android.ui.friends;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.StringRes;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.databinding.FragmentFriendsBinding;
import com.worldexplorationaction.android.ui.profile.ProfileActivity;
import com.worldexplorationaction.android.ui.utility.Utils;

import java.util.Objects;

public class FriendsFragment extends Fragment implements TextWatcher {
    private static final String TAG = FriendsFragment.class.getSimpleName();
    private FriendsViewModel viewModel;
    private FragmentFriendsBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        this.viewModel = new ViewModelProvider(this).get(FriendsViewModel.class);
        this.binding = FragmentFriendsBinding.inflate(inflater, container, false);

        binding.friendsErrorText.setVisibility(View.GONE);

        viewModel.getToastMessage().observe(getViewLifecycleOwner(), this::handleToastMessage);
        viewModel.getToastMessageResId().observe(getViewLifecycleOwner(), this::handleToastMessage);
        viewModel.getPopupMessageResId().observe(getViewLifecycleOwner(), this::handlePopupMessage);

        binding.friendsUserList.init(getContext(), getViewLifecycleOwner(), viewModel);
        binding.friendsUserList.setOnItemClickListener(this::onUserClicked);

        binding.friendsSearchEditText.addTextChangedListener(this);

        View root = binding.getRoot();
        root.setPadding(0, Utils.getStatusBarHeight(getResources()), 0, 0);
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

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
    }

    @Override
    public void afterTextChanged(Editable s) {
        viewModel.updateSearchFor(s.toString().trim());
    }

    private void handlePopupMessage(@StringRes Integer stringResId) {
        if (stringResId == null) {
            binding.friendsErrorText.setVisibility(View.GONE);
        } else {
            binding.friendsErrorText.setVisibility(View.VISIBLE);
            binding.friendsErrorText.setText(stringResId);
        }
    }

    private void handleToastMessage(String message) {
        if (message == null) {
            return;
        }
        Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
    }

    private void handleToastMessage(Integer stringResId) {
        if (stringResId == null) {
            return;
        }
        Toast.makeText(getContext(), stringResId, Toast.LENGTH_LONG).show();
    }

    private void onUserClicked(int position) {
        UserProfile user = Objects.requireNonNull(viewModel.getUsers().getValue()).get(position);
        switch (viewModel.getModes().get(position)) {
            case FRIEND:
                viewFriend(user);
                break;
            case FRIEND_REQUEST:
                reviewRequest(user);
                break;
            case SEARCH:
                sendRequest(user);
                break;
            default:
                Log.e(TAG, "User of unknown mode is click");
                break;
        }
    }

    private void viewFriend(UserProfile user) {
        new AlertDialog.Builder(requireContext())
                .setTitle(user.getName())
                .setItems(new CharSequence[]{
                        getString(R.string.friends_view_profile),
                        getString(R.string.friends_delete)
                }, (dialog, which) -> {
                    if (which == 0) {
                        ProfileActivity.start(requireContext(), user);
                    } else {
                        viewModel.deleteFriend(user);
                    }
                })
                .create().show();
    }

    private void reviewRequest(UserProfile user) {
        new AlertDialog.Builder(requireContext())
                .setMessage(getString(R.string.friends_review_request, user.getName()))
                .setPositiveButton(R.string.friends_request_accept, (x, y) -> viewModel.acceptRequest(user))
                .setNegativeButton(R.string.friends_request_decline, (x, y) -> viewModel.declineRequest(user))
                .create().show();
    }

    private void sendRequest(UserProfile user) {
        if (!viewModel.canSendRequestTo(user)) {
            new AlertDialog.Builder(requireContext())
                    .setMessage(getString(R.string.friends_already_friend, user.getName()))
                    .setPositiveButton(R.string.common_ok, null)
                    .create().show();
            return;
        }
        new AlertDialog.Builder(requireContext())
                .setMessage(getString(R.string.friends_send_request, user.getName()))
                .setPositiveButton(R.string.common_yes, (x, y) -> viewModel.sendRequest(user))
                .setNegativeButton(R.string.common_no, null).create().show();
    }
}