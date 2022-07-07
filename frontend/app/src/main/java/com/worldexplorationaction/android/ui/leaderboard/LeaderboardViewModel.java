package com.worldexplorationaction.android.ui.leaderboard;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.fcm.WeaFirebaseMessagingService;
import com.worldexplorationaction.android.ui.userlist.UserListMode;
import com.worldexplorationaction.android.ui.userlist.UserListViewModel;
import com.worldexplorationaction.android.ui.utility.CustomCallback;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;

public class LeaderboardViewModel extends ViewModel implements UserListViewModel {
    private static final String TAG = LeaderboardViewModel.class.getSimpleName();
    private final Handler handler;
    private final UserService userService;
    private final MediatorLiveData<List<UserProfile>> users;
    private final MutableLiveData<LeaderboardType> leaderboardType;
    private final MutableLiveData<String> leaderboardFetchError;
    private boolean subscribing;
    private Call<List<UserProfile>> fetchLeaderboardCall;

    public LeaderboardViewModel() {
        this.handler = new Handler(Looper.getMainLooper());
        this.userService = UserService.getService();
        this.users = new MediatorLiveData<>();
        this.leaderboardType = new MutableLiveData<>();
        this.leaderboardFetchError = new MutableLiveData<>();
        this.subscribing = false;

        users.setValue(Collections.emptyList());
        users.addSource(WeaFirebaseMessagingService.getLeaderboardUpdate(), unused -> {
            Log.i(TAG, "Received leaderboard update message");
            fetchLeaderboard();
        });

        subscribeLeaderboardUpdate();
    }

    @Override
    protected void onCleared() {
        super.onCleared();
    }

    @Override
    public LiveData<List<UserProfile>> getUsers() {
        return users;
    }

    @Override
    public List<UserListMode> getModes() {
        if (users.getValue() == null) {
            return Collections.emptyList();
        }
        List<UserListMode> modes = new ArrayList<>(users.getValue().size());
        for (int i = 0; i < users.getValue().size(); i++) {
            modes.add(UserListMode.LEADERBOARD);
        }
        return modes;
    }

    public LiveData<LeaderboardType> getLeaderboardType() {
        return leaderboardType;
    }

    public LiveData<String> getLeaderboardFetchError() {
        return leaderboardFetchError;
    }

    /**
     * Notify the view model that the user wants to change the leaderboard type
     *
     * @param type new leaderboard type
     */
    public void notifySwitchLeaderboardType(LeaderboardType type) {
        if (type == getLeaderboardType().getValue()) {
            return;
        }
        leaderboardType.setValue(type);
        fetchLeaderboard();
    }

    /**
     * Indicate the leaderboard should update in real-time
     */
    public void subscribeLeaderboardUpdate() {
        if (subscribing) {
            return;
        }
        Log.i(TAG, "subscribeLeaderboardUpdate");
        subscribing = true;
        getFcmTokenAndSubscribeUpdate();
    }

    /**
     * Indicate it is no longer needed to update the leaderboard
     */
    public void unsubscribeLeaderboardUpdate() {
        if (!subscribing) {
            return;
        }
        Log.i(TAG, "unsubscribeLeaderboardUpdate");
        subscribing = false;
    }

    /**
     * Get the leaderboard from the server
     */
    public void fetchLeaderboard() {
        // TODO: add a loading animation
        Log.i(TAG, "Fetching leaderboard");
        if (fetchLeaderboardCall != null) {
            fetchLeaderboardCall.cancel();
        }
        if (leaderboardType.getValue() == LeaderboardType.GLOBAL) {
            fetchLeaderboardCall = userService.getGlobalLeaderboard();
        } else if (leaderboardType.getValue() == LeaderboardType.FRIENDS) {
            fetchLeaderboardCall = userService.getFriendLeaderboard();
        } else {
            throw new IllegalStateException("Unknown LeaderboardType");
        }
        fetchLeaderboardCall.enqueue(new CustomCallback<>(responseBody -> {
            Log.i(TAG, "userService.getGlobalLeaderboard succeeded");
            users.setValue(responseBody);
        }, () -> {
            Log.i(TAG, "userService.getGlobalLeaderboard canceled");
        }, errorMessage -> {
            Log.e(TAG, "userService.getGlobalLeaderboard " + errorMessage);
            handleLeaderboardFailure(errorMessage);
        }));
    }

    /**
     * Send requests to the server to indicate that the app wants to
     * get a message when the leaderboard is update.
     */
    private void getFcmTokenAndSubscribeUpdate() {
        if (!subscribing) {
            return;
        }
        Log.i(TAG, "doSubscribeLeaderboardUpdate");
        WeaFirebaseMessagingService.getToken().addOnCompleteListener(task -> {
            if (!task.isSuccessful()) {
                Log.e(TAG, "Cannot get FCM registration token: ", task.getException());
                return;
            }
            String token = task.getResult();
            Log.d(TAG, "FCM token: " + token);

            subscribeLeaderboardUpdate(token);
        });
    }

    private void subscribeLeaderboardUpdate(String fcmToken) {
        userService.subscribeLeaderboardUpdate(fcmToken).enqueue(new CustomCallback<>(responseBody -> {
            if (responseBody == null) {
                Log.e(TAG, "userService.subscribeLeaderboardUpdate succeeded with a null body");
                return;
            }
            if (subscribing) {
                long expireMillis = responseBody.getExpireTime();
                long delayMillis = Math.max(0, expireMillis - System.currentTimeMillis() - 1000 * 5);
                Log.i(TAG, "Delay until next subscription: " + delayMillis + "ms");
                handler.postDelayed(LeaderboardViewModel.this::getFcmTokenAndSubscribeUpdate, delayMillis);
            }
        }, null, errorMessage -> {
            Log.e(TAG, "userService.subscribeLeaderboardUpdate" + errorMessage);
        }));
    }

    private void handleLeaderboardFailure(String errorMessage) {
        users.setValue(Collections.emptyList());
        leaderboardFetchError.setValue(errorMessage);
        leaderboardFetchError.setValue(null);
    }
}