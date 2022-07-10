package com.worldexplorationaction.android.ui.profile;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.worldexplorationaction.android.data.user.UserProfile;

/**
 * For displaying a friend's profile
 */
public class ProfileActivity extends AppCompatActivity {
    private static final String USER_PROFILE_KEY = "user_profile";
    private UserProfile profile;

    public static void start(Context packageContext, UserProfile profile) {
        Intent intent = new Intent(packageContext, ProfileActivity.class);
        intent.putExtra(USER_PROFILE_KEY, profile);
        packageContext.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.profile = (UserProfile) getIntent().getSerializableExtra(USER_PROFILE_KEY);

        LinearLayout layout = new LinearLayout(this);
        layout.setId(View.generateViewId());
        getSupportFragmentManager().beginTransaction().add(layout.getId(), new ProfileFragment()).commitNow();
        setContentView(layout);
    }

    UserProfile getUser() {
        return profile;
    }
}
