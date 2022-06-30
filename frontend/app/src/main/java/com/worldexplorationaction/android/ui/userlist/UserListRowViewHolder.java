package com.worldexplorationaction.android.ui.userlist;

import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.user.UserProfile;

import java.util.Locale;

class UserListRowViewHolder extends RecyclerView.ViewHolder {
    FrameLayout rankView;
    FrameLayout rankViewTopView;
    ImageView rankViewTopImageView;
    TextView rankViewTopNumberTextView;
    FrameLayout rankViewNormalVew;
    TextView rankViewNormalTextView;

    ImageView profileImageView;
    TextView nameTextView;

    FrameLayout scoreView;
    TextView scoreTextView;

    public UserListRowViewHolder(@NonNull View itemView, UserListView.OnItemClickListener onClickListener) {
        super(itemView);
        rankView = itemView.findViewById(R.id.user_list_row_rank_view);
        rankViewTopView = itemView.findViewById(R.id.user_list_row_rank_top);
        rankViewTopImageView = itemView.findViewById(R.id.user_list_row_rank_top_icon);
        rankViewTopNumberTextView = itemView.findViewById(R.id.user_list_row_rank_number_top);
        rankViewNormalVew = itemView.findViewById(R.id.user_list_row_rank_normal);
        rankViewNormalTextView = itemView.findViewById(R.id.user_list_row_rank_number_normal);

        profileImageView = itemView.findViewById(R.id.user_list_row_profile_picture);
        nameTextView = itemView.findViewById(R.id.user_list_row_name);

        scoreView = itemView.findViewById(R.id.user_list_row_score_view);
        scoreTextView = itemView.findViewById(R.id.user_list_row_score_text);

        itemView.setOnClickListener(v -> onClickListener.onItemClick(getLayoutPosition()));
    }

    public void setMode(UserListMode mode) {
        switch (mode) {
            case LEADERBOARD:
                rankView.setVisibility(View.VISIBLE);
                break;
            case FRIENDS:
                rankView.setVisibility(View.GONE);
                break;
            case SEARCH:
                rankView.setVisibility(View.GONE);
                break;
        }
    }

    public void setUser(UserProfile userProfile) {
        nameTextView.setText(userProfile.name);
        scoreTextView.setText(String.format(Locale.getDefault(), "%d", userProfile.score));
    }

    public void setRank(int rank) {
        if (rank <= 0) {
            throw new IllegalArgumentException("Invalid rank");
        } else if (rank <= 3) {
            rankViewTopView.setVisibility(View.VISIBLE);
            rankViewNormalVew.setVisibility(View.GONE);
            rankViewTopNumberTextView.setText(String.format(Locale.getDefault(), "%d", rank));
            int color;
            switch (rank) {
                case 1:
                    color = R.color.leaderboard_rank_gold;
                    break;
                case 2:
                    color = R.color.leaderboard_rank_silver;
                    break;
                case 3:
                    color = R.color.leaderboard_rank_bronze;
                    break;
                default:
                    throw new IllegalStateException("Unexpected value: " + rank);
            }
            rankViewTopImageView.setColorFilter(ContextCompat.getColor(itemView.getContext(), color), android.graphics.PorterDuff.Mode.SRC_IN);
        } else {
            rankViewTopView.setVisibility(View.GONE);
            rankViewNormalVew.setVisibility(View.VISIBLE);
            rankViewNormalTextView.setText(String.format(Locale.getDefault(), "%d", rank));
        }
    }
}
