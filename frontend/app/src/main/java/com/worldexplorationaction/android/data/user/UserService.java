package com.worldexplorationaction.android.data.user;

import com.worldexplorationaction.android.ui.utility.RetrofitUtility;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface UserService {
    static UserService getService() {
        return Holder.instance;
    }

    @POST("accounts/logout")
    Call<UserProfile> logout();

    @GET("accounts/profiles/{userId}")
    Call<UserProfile> getUserProfile(@Path("userId") String userId);

    @GET("accounts/search")
    Call<List<UserProfile>> searchNewFriends(@Query("query") String query);

    @GET("leaderboard/global")
    Call<List<UserProfile>> getGlobalLeaderboard();

    @GET("leaderboard/friend")
    Call<List<UserProfile>> getFriendLeaderboard();

    @PUT("leaderboard/subscribe-update")
    Call<ExpireTime> subscribeLeaderboardUpdate(@Query("fcmToken") String fcmToken);

    @GET("friends/list")
    Call<List<UserProfile>> getFriendProfiles();

    @GET("friends/requests")
    Call<List<UserProfile>> getFriendRequests();

    @POST("friends/send-request")
    Call<Void> sendRequest(@Query("targetUserId") String targetUserId);

    @POST("friends/delete")
    Call<Void> deleteFriend(@Query("friendId") String friendId);

    @POST("friends/accept-request")
    Call<Void> acceptRequest(@Query("requesterUserId") String requesterUserId);

    @POST("friends/decline-request")
    Call<Void> declineRequest(@Query("requesterUserId") String requesterUserId);

    class Holder {
        private static final UserService instance = RetrofitUtility.getRetrofit("users/").create(UserService.class);
    }
}
