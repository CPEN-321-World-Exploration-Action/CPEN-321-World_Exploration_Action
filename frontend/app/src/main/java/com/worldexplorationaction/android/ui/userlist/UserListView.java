package com.worldexplorationaction.android.ui.userlist;

import android.content.Context;
import android.util.AttributeSet;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.worldexplorationaction.android.user.UserProfile;

import java.util.List;

public class UserListView extends RecyclerView {
    UserListViewAdapter adapter;

    public UserListView(@NonNull Context context) {
        super(context);
    }

    public UserListView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public UserListView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void init(UserListMode mode, Context context, LifecycleOwner lifecycleOwner, UserListViewModel viewModel) {
        this.adapter = new UserListViewAdapter(mode, context, viewModel);
        setAdapter(adapter);
        setLayoutManager(new LinearLayoutManager(context));

        viewModel.getUsers().observe(lifecycleOwner, this::displayingUsersUpdated);
    }

    private void displayingUsersUpdated(List<UserProfile> newDisplayingUsers) {
        adapter.updateDisplayingUsers(newDisplayingUsers);
    }
}
