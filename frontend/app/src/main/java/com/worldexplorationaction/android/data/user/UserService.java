package com.worldexplorationaction.android.data.user;

import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.PUT;
import retrofit2.http.Query;

public interface UserService {
    static UserService getService() {
        return Holder.instance;
    }

    @GET("leaderboard/global")
    Call<List<UserProfile>> getGlobalLeaderboard();

    @GET("leaderboard/friend")
    Call<List<UserProfile>> getFriendLeaderboard();

    @PUT("leaderboard/subscribe-update")
    Call<ExpireTime> subscribeLeaderboardUpdate(@Query("fcmToken") String fcmToken);

    @GET("account/me/friends")
    Call<List<UserProfile>> getFriendProfiles();

    class Holder {
        public static UserService instance = Utility.getRetrofit("users/").create(UserService.class);
    }
}
