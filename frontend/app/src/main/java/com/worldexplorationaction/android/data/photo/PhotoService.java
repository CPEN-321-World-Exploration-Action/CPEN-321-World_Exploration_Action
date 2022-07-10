package com.worldexplorationaction.android.data.photo;

import com.worldexplorationaction.android.ui.utility.RetrofitUtility;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface PhotoService {
    static PhotoService getService() {
        return PhotoService.Holder.instance;
    }

    @GET("sorting/user/{userId}")
    Call<List<Photo>> getPhotoIdsByUserId(@Path("userId") String userId);

    @PUT("managing/likes")
    Call<Void> userLikePhoto(@Path("userId") String userId, @Path("picID") String photoId);

    @GET("sorting/photo-ids")
    Call<List<Photo>> getPhotoIDsByTrophyID(@Path("trophyId") String trophyId, @Path ("order") String order);

    @POST("storing/{trophyId}/{userId}")
    Call<Void> uploadPhoto(@Path("userId") String userId, @Path("trophyId") String trophyId, @Path("picID") String photoId);

    class Holder {
        private static final PhotoService instance = RetrofitUtility.getRetrofit("photos/").create(PhotoService.class);
    }
}
