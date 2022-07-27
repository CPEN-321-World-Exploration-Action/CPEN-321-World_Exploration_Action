package com.worldexplorationaction.android.data.trophy;

import com.worldexplorationaction.android.ui.utility.RetrofitUtils;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface TrophyService {
    static TrophyService getService() {
        return Holder.instance;
    }

    @POST("{userId}/{trophyId}")
    Call<Void> collectTrophy(@Path("userId") String userId, @Path("trophyId") String trophyId);

    @GET("user-trophies")
    Call<List<Trophy>> getTrophiesUser(@Query("user_latitude") double latitude, @Query("user_longitude") double longitude);

    @GET("{trophyId}")
    Call<Trophy> getTrophyDetails(@Path("trophyId") String trophyId);

    // For UI tests only
    @POST("reset-trophy-user")
    Call<Void> resetTrophyUser();

    class Holder {
        private static final TrophyService instance = RetrofitUtils.getRetrofit("trophies/").create(TrophyService.class);
    }
}
