package com.worldexplorationaction.android.ui.userlist;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.user.UserProfile;

import java.util.List;

class UserListViewAdapter extends RecyclerView.Adapter<UserListRowViewHolder> {
    private final Context context;
    private final UserListView.OnItemClickListener onItemClickListener;
    private List<UserProfile> displayingUsers;
    private List<UserListMode> modes;

    public UserListViewAdapter(Context context, UserListView.OnItemClickListener onItemClickListener) {
        this.context = context;
        this.onItemClickListener = onItemClickListener;

        setHasStableIds(true);
    }

    @NonNull
    @Override
    public UserListRowViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View row = inflater.inflate(R.layout.view_user_list_row, parent, false);
        return new UserListRowViewHolder(row, context, onItemClickListener);
    }

    @Override
    public void onBindViewHolder(@NonNull UserListRowViewHolder holder, int position) {
        holder.setMode(modes.get(position));
        holder.setUser(displayingUsers.get(position));
        holder.setRank(position + 1);
    }

    @Override
    public long getItemId(int position) {
        return displayingUsers.get(position).getId().hashCode();
    }

    @Override
    public int getItemCount() {
        return displayingUsers.size();
    }

    /**
     * Display a new list of users
     *
     * @param newDisplayingUsers users to display
     */
    @SuppressLint("NotifyDataSetChanged")
    public void updateDisplayingUsers(List<UserProfile> newDisplayingUsers, List<UserListMode> modes) {
        this.displayingUsers = newDisplayingUsers;
        this.modes = modes;
        notifyDataSetChanged();
    }
}
