package com.worldexplorationaction.android.fcm;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class WeaFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = WeaFirebaseMessagingService.class.getSimpleName();

    @NonNull
    public static Task<String> getToken() {
        return FirebaseMessaging.getInstance().getToken();
    }

    @Override
    public void onNewToken(@NonNull String newToken) {
        super.onNewToken(newToken);

        Log.d(TAG, "Refreshed token: " + newToken);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

        Log.d(TAG, "Received message: " + message.getData());
    }
}
