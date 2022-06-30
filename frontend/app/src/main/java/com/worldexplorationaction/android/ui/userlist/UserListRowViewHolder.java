package com.worldexplorationaction.android.ui.userlist;

import android.content.Context;
import android.graphics.Paint;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.CircularProgressDrawable;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.ui.utility.Utility;
import com.worldexplorationaction.android.user.UserProfile;

import java.util.Locale;

class UserListRowViewHolder extends RecyclerView.ViewHolder {
    private final Context context;
    private final FrameLayout rankView;
    private final FrameLayout rankViewTopView;
    private final ImageView rankViewTopImageView;
    private final TextView rankViewTopNumberTextView;
    private final FrameLayout rankViewNormalVew;
    private final TextView rankViewNormalTextView;
    private final ImageView profileImageView;
    private final TextView nameTextView;
    private final FrameLayout scoreView;
    private final TextView scoreTextView;

    private final RequestOptions imageLoadOptions;

    UserListRowViewHolder(@NonNull View itemView, Context context, UserListView.OnItemClickListener onClickListener) {
        super(itemView);

        this.context = context;

        this.rankView = itemView.findViewById(R.id.user_list_row_rank_view);
        this.rankViewTopView = itemView.findViewById(R.id.user_list_row_rank_top);
        this.rankViewTopImageView = itemView.findViewById(R.id.user_list_row_rank_top_icon);
        this.rankViewTopNumberTextView = itemView.findViewById(R.id.user_list_row_rank_number_top);
        this.rankViewNormalVew = itemView.findViewById(R.id.user_list_row_rank_normal);
        this.rankViewNormalTextView = itemView.findViewById(R.id.user_list_row_rank_number_normal);
        this.profileImageView = itemView.findViewById(R.id.user_list_row_profile_picture);
        this.nameTextView = itemView.findViewById(R.id.user_list_row_name);
        this.scoreView = itemView.findViewById(R.id.user_list_row_score_view);
        this.scoreTextView = itemView.findViewById(R.id.user_list_row_score_text);

        this.imageLoadOptions = new RequestOptions()
                .placeholder(getProfileImagePlaceholder())
                .fallback(R.drawable.ic_default_avatar_35dp)
                .error(R.drawable.ic_default_avatar_35dp);

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
        Glide.with(context)
                .load(userProfile.image)
                .apply(imageLoadOptions)
                .into(profileImageView);
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

    private Drawable getProfileImagePlaceholder() {
        CircularProgressDrawable drawable = new CircularProgressDrawable(context);
        drawable.setColorSchemeColors(context.getColor(R.color.purple_700));
        drawable.setCenterRadius(Utility.dpToPx(context.getResources(), 9.0f));
        drawable.setStrokeWidth(Utility.dpToPx(context.getResources(), 1.5f));
        drawable.setStrokeCap(Paint.Cap.ROUND);
        drawable.start();
        return drawable;
    }
}
