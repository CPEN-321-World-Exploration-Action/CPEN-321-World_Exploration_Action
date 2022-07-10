package com.worldexplorationaction.android.data.trophy;

import com.worldexplorationaction.android.ui.utility.RetrofitUtility;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface TrophyService {

    static TrophyService getService() {
        return TrophyService.Holder.instance;
    }

    @POST("/{trophyId}/collect")
    Call<Boolean> collectTrophy(@Path("userId")String userId, @Path("trophyId")String trophyId);

    @GET("/{userId}/trophies")
    Call<List<Trophy>> getTrophiesUser(@Path("userId")String userId, @Path("user_latitude")double user_latitude,
                                       @Path("user_longitude")double user_longitude);

    class Holder {
        private static final TrophyService instance = RetrofitUtility.getRetrofit("trophies/").create(TrophyService.class);
    }
}
