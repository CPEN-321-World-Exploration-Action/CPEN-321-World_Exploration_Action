package com.worldexplorationaction.android.ui.userlist;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.user.UserProfile;

import java.util.List;

public class UserListViewAdapter extends RecyclerView.Adapter<UserListRowViewHolder> {
    private final UserListMode mode;
    private final Context context;
    private List<UserProfile> displayingUsers;

    public UserListViewAdapter(UserListMode mode, Context context, UserListViewModel viewModel) {
        this.mode = mode;
        this.context = context;
    }

    @NonNull
    @Override
    public UserListRowViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View row = inflater.inflate(R.layout.view_user_list_row, parent, false);
        UserListRowViewHolder viewHolder = new UserListRowViewHolder(row);
        viewHolder.setMode(mode);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull UserListRowViewHolder holder, int position) {
        holder.setUser(displayingUsers.get(position));
        holder.setRank(position + 1);
    }

    @Override
    public int getItemCount() {
        return displayingUsers.size();
    }

    @SuppressLint("NotifyDataSetChanged")
    public void updateDisplayingUsers(List<UserProfile> newDisplayingUsers) {
        // TODO: animate this
        this.displayingUsers = newDisplayingUsers;
        notifyDataSetChanged();
    }
}
