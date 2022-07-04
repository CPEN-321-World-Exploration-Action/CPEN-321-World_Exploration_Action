package com.worldexplorationaction.android.data.user;

import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;

public interface UserService {
    static UserService getService() {
        return Utility.getRetrofit("users/").create(UserService.class);
    }

    @GET("leaderboard/global")
    Call<List<UserProfile>> getGlobalLeaderboard();
}
