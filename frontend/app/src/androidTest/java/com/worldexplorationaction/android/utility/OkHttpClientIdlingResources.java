package com.worldexplorationaction.android.utility;

import androidx.test.espresso.IdlingResource;

import okhttp3.Dispatcher;
import okhttp3.OkHttpClient;

public class OkHttpClientIdlingResources implements IdlingResource {
    private final String name;
    private final Dispatcher dispatcher;
    private volatile IdlingResource.ResourceCallback callback;

    public OkHttpClientIdlingResources(String name, OkHttpClient client) {
        this.name = name;
        this.dispatcher = client.dispatcher();

        dispatcher.setIdleCallback(() -> {
            if (callback != null) {
                callback.onTransitionToIdle();
            }
        });
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public boolean isIdleNow() {
        return dispatcher.runningCallsCount() == 0;
    }

    @Override
    public void registerIdleTransitionCallback(IdlingResource.ResourceCallback callback) {
        this.callback = callback;
    }
}
