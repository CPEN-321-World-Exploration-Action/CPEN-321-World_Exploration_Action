package com.worldexplorationaction.android.fcm;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

public class WeaFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = WeaFirebaseMessagingService.class.getSimpleName();
    private static final MutableLiveData<Void> leaderboardUpdate = new MutableLiveData<>();
    private static final MutableLiveData<Void> friendUpdate = new MutableLiveData<>();

    @NonNull
    public static Task<String> getToken() {
        return FirebaseMessaging.getInstance().getToken();
    }

    public static LiveData<Void> getLeaderboardUpdate() {
        return leaderboardUpdate;
    }

    public static LiveData<Void> getFriendUpdate() {
        return friendUpdate;
    }

    @Override
    public void onNewToken(@NonNull String newToken) {
        super.onNewToken(newToken);

        Log.d(TAG, "Refreshed token: " + newToken);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

        Map<String, String> data = message.getData();

        Log.d(TAG, "Received message: " + message);
        if ("update".equals(data.get("type"))) {
            if ("leaderboard".equals(data.get("update"))) {
                Log.d(TAG, "Receive leaderboard updated message");
                leaderboardUpdate.postValue(null);
            }
        }
    }
}
