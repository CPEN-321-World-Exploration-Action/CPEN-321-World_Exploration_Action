package com.worldexplorationaction.android.ui.utility;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitUtility {
    public static final String BASE_URL = "http://10.0.2.2:8081/";
    private static final OkHttpClient CLIENT = new OkHttpClient.Builder()
            .connectTimeout(3, TimeUnit.SECONDS)
            .build();

    public static Retrofit getRetrofit(String path) {
        return new Retrofit.Builder()
                .baseUrl(BASE_URL + path)
                .client(CLIENT)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }
}
