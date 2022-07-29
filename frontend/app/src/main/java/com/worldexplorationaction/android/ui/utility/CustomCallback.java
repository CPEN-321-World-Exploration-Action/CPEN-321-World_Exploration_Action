package com.worldexplorationaction.android.ui.utility;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.function.Consumer;

import retrofit2.Call;
import retrofit2.Response;

/**
 * A simple wrapper for retrofit2.Callback
 *
 * @param <T> type of the response body
 */
public class CustomCallback<T> implements retrofit2.Callback<T> {
    private final Consumer<T> onSuccess;
    private final Runnable onCanceled;
    private final Consumer<String> onFailure;

    public CustomCallback(@Nullable Consumer<T> onSuccess, @Nullable Runnable onCanceled, @Nullable Consumer<String> onFailure) {
        this.onSuccess = onSuccess;
        this.onCanceled = onCanceled;
        this.onFailure = onFailure;
    }

    @Override
    public void onResponse(@NonNull Call<T> call, @NonNull Response<T> response) {
        if (response.isSuccessful()) {
            if (onSuccess != null) {
                onSuccess.accept(response.body());
            }
        } else {
            if (onFailure != null) {
                String errorMessage = "Code " + response.code();
                if (response.errorBody() != null) {
                    try {
                        JSONObject json = new JSONObject(response.errorBody().string());
                        errorMessage += ", Message: " + json.getString("message");
                    } catch (JSONException | IOException ignored) {
                    }
                }
                onFailure.accept(errorMessage);
            }
        }
    }

    @Override
    public void onFailure(@NonNull Call<T> call, @NonNull Throwable t) {
        if (call.isCanceled()) {
            if (onCanceled != null) {
                onCanceled.run();
            }
        } else {
            if (onFailure != null) {
                onFailure.accept(t.getLocalizedMessage());
            }
        }
    }
}
