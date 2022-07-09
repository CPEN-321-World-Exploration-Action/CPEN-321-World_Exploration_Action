package com.worldexplorationaction.android.data.photo;

import com.worldexplorationaction.android.ui.utility.RetrofitUtility;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface PhotoService {
    static PhotoService getService() {
        return PhotoService.Holder.instance;
    }

    @GET("sorting/user/{userId}")
    Call<List<Photo>> getPhotoIdsByUserId(@Path("userId") String userId);

    class Holder {
        private static final PhotoService instance = RetrofitUtility.getRetrofit("photos/").create(PhotoService.class);
    }
}
