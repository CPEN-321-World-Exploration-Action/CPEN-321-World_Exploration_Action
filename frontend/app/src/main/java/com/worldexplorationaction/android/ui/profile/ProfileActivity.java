package com.worldexplorationaction.android.ui.profile;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.worldexplorationaction.android.data.user.UserProfile;

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
    }

    UserProfile getUser() {
        return profile;
    }
}
