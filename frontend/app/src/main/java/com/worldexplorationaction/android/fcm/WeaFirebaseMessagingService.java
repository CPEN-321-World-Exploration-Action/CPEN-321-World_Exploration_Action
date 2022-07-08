package com.worldexplorationaction.android.fcm;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.worldexplorationaction.android.MainActivity;
import com.worldexplorationaction.android.R;

import java.util.Map;

public class WeaFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = WeaFirebaseMessagingService.class.getSimpleName();
    private static final MutableLiveData<Void> leaderboardUpdate = new MutableLiveData<>();
    private static final MutableLiveData<Void> friendUpdate = new MutableLiveData<>();
    private static final String channelId = "Default";
    private static final String channelName = "Default channel";

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

        Log.d(TAG, "Received message: " + message);

        Map<String, String> data = message.getData();
        if ("update".equals(data.get("type"))) {
            if ("leaderboard".equals(data.get("update"))) {
                Log.d(TAG, "Receive leaderboard updated message");
                leaderboardUpdate.postValue(null);
            } else if ("friends".equals(data.get("update"))) {
                Log.d(TAG, "Receive friends/requests updated message");
                friendUpdate.postValue(null);
            }
        }

        RemoteMessage.Notification notification = message.getNotification();
        if (notification != null) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

            PendingIntent pendingIntent = PendingIntent.getActivity(
                    this,
                    0,
                    intent,
                    PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_ONE_SHOT
            );

            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            manager.createNotificationChannel(new NotificationChannel(
                    channelId,
                    channelName,
                    NotificationManager.IMPORTANCE_DEFAULT)
            );
            manager.notify(
                    0,
                    new NotificationCompat.Builder(this, channelId)
                            .setSmallIcon(R.mipmap.ic_launcher)
                            .setContentTitle(notification.getTitle())
                            .setContentText(notification.getBody())
                            .setAutoCancel(true)
                            .setContentIntent(pendingIntent)
                            .build()
            );
        }
    }
}
