package com.worldexplorationaction.android.ui.utility;

import androidx.annotation.NonNull;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitUtils {
    public static final String BASE_URL = "http://20.214.147.25:8081/";
    private static final OkHttpClient CLIENT = new OkHttpClient.Builder()
            .cookieJar(new InMemoryCookieJar())
            .connectTimeout(3, TimeUnit.SECONDS)
            .build();

    public static Retrofit getRetrofit(String path) {
        return new Retrofit.Builder()
                .baseUrl(BASE_URL + path)
                .client(CLIENT)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    public static OkHttpClient getClient() {
        return CLIENT;
    }

    private static class InMemoryCookieJar implements CookieJar {
        private final HashMap<String, List<Cookie>> cookieStore = new HashMap<>();

        @Override
        public void saveFromResponse(HttpUrl url, @NonNull List<Cookie> cookies) {
            cookieStore.put(url.host(), cookies);
        }

        @NonNull
        @Override
        public List<Cookie> loadForRequest(HttpUrl url) {
            List<Cookie> cookies = cookieStore.get(url.host());
            return cookies != null ? cookies : Collections.emptyList();
        }
    }
}
