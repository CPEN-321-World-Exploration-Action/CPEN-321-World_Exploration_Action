package com.worldexplorationaction.android.ui.utility;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.CookieJar;
import okhttp3.Cookie;
import okhttp3.HttpUrl;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitUtility {
    public static final String BASE_URL = "http://10.0.2.2:8081/";
    private static final OkHttpClient CLIENT = new OkHttpClient.Builder()
            .cookieJar(new CookieJar() {
                private final HashMap<HttpUrl, List<Cookie>> cookieStore = new HashMap<>();

                @Override
                public void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
                    cookieStore.put(url, cookies);
                }

                @Override
                public List<Cookie> loadForRequest(HttpUrl url) {
                    List<Cookie> cookies = cookieStore.get(url);
                    return cookies != null ? cookies : new ArrayList<Cookie>();
                }
            })
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
