package com.worldexplorationaction.android.data.photo;

import com.worldexplorationaction.android.ui.utility.RetrofitUtils;

import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface PhotoService {
    static PhotoService getService() {
        return PhotoService.Holder.instance;
    }

    @GET("sorting/user/{userId}")
    Call<List<Photo>> getPhotoIdsByUserId(@Path("userId") String userId);

    @PUT("managing/likes")
    Call<Void> userLikePhoto(@Query("userID") String userId, @Query("picID") String photoId);

    @GET("sorting/photo-ids")
    Call<List<Photo>> getPhotoIDsByTrophyID(@Query("trophyId") String trophyId, @Query("order") String order);

    @Multipart
    @POST("storing/{trophyId}/{userId}")
    Call<ResponseBody> uploadPhoto(@Path("userId") String userId, @Path("trophyId") String trophyId, @Part MultipartBody.Part multipartImage);

    class Holder {
        private static final PhotoService instance = RetrofitUtils.getRetrofit("photos/").create(PhotoService.class);
    }
}
