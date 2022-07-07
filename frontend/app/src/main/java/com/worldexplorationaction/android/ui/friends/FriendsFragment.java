package com.worldexplorationaction.android.ui.friends;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.StringRes;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.worldexplorationaction.android.databinding.FragmentFriendsBinding;
import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.Objects;

public class FriendsFragment extends Fragment implements TextWatcher {
    private FriendsViewModel viewModel;
    private FragmentFriendsBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        this.viewModel = new ViewModelProvider(this).get(FriendsViewModel.class);
        this.binding = FragmentFriendsBinding.inflate(inflater, container, false);

        binding.friendsErrorText.setVisibility(View.GONE);

        viewModel.updateSearchFor("");

        viewModel.getErrorMessage().observe(getViewLifecycleOwner(), this::handleErrorMessage);
        viewModel.getPopupMessageResId().observe(getViewLifecycleOwner(), this::handlePopupMessage);

        binding.friendsUserList.init(getContext(), getViewLifecycleOwner(), viewModel);
        binding.friendsUserList.setOnItemClickListener(itemPosition ->
                Toast.makeText(getContext(),
                        Objects.requireNonNull(viewModel.getUsers().getValue())
                                .get(itemPosition).toString(),
                        Toast.LENGTH_SHORT
                ).show()
        );

        binding.friendsSearchEditText.addTextChangedListener(this);

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

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
    }

    @Override
    public void afterTextChanged(Editable s) {
        viewModel.updateSearchFor(s.toString());
    }

    private void handlePopupMessage(@StringRes Integer stringResId) {
        if (stringResId == null) {
            binding.friendsErrorText.setVisibility(View.GONE);
        } else {
            binding.friendsErrorText.setVisibility(View.VISIBLE);
            binding.friendsErrorText.setText(stringResId);
        }
    }

    private void handleErrorMessage(String errorMessage) {
        if (errorMessage == null) {
            return;
        }
        Toast.makeText(getContext(), errorMessage, Toast.LENGTH_SHORT).show();
    }
}