package com.worldexplorationaction.android.data.trophy;

import com.worldexplorationaction.android.ui.utility.RetrofitUtility;

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

    @POST("{trophyId}/collect")
    Call<Boolean> collectTrophy(@Path("userId") String userId, @Path("trophyId") String trophyId);

    @GET("user-trophies")
    Call<List<Trophy>> getTrophiesUser(@Query("user_latitude") double latitude, @Query("user_longitude") double longitude);

    class Holder {
        private static final TrophyService instance = RetrofitUtility.getRetrofit("trophies/").create(TrophyService.class);
    }
}
