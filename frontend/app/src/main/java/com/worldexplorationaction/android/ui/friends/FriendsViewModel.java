package com.worldexplorationaction.android.ui.friends;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.fcm.WeaFirebaseMessagingService;
import com.worldexplorationaction.android.ui.userlist.UserListMode;
import com.worldexplorationaction.android.ui.userlist.UserListViewModel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FriendsViewModel extends ViewModel implements UserListViewModel {
    private static final String TAG = FriendsViewModel.class.getSimpleName();

    private final UserService userService;

    private final MutableLiveData<String> toastMessage;
    private final MutableLiveData<Integer> toastMessageResId;
    private final MutableLiveData<Integer> popupMessageResId;
    private final MediatorLiveData<List<UserProfile>> displayingUsers;
    private boolean isSearching;
    private List<UserProfile> friends;
    private List<UserProfile> friendRequests;
    private Call<List<UserProfile>> fetchFriendsCall;
    private Call<List<UserProfile>> fetchFriendRequestsCall;
    private Call<List<UserProfile>> searchFriendsCall;

    public FriendsViewModel() {
        this.userService = UserService.getService();
        this.toastMessage = new MutableLiveData<>();
        this.toastMessageResId = new MutableLiveData<>();
        this.popupMessageResId = new MutableLiveData<>();
        this.displayingUsers = new MediatorLiveData<>();
        this.friends = Collections.emptyList();
        this.friendRequests = Collections.emptyList();

        displayingUsers.setValue(Collections.emptyList());
        displayingUsers.addSource(WeaFirebaseMessagingService.getFriendUpdate(), unused -> {
            fetchFriends();
            fetchFriendRequests();
        });
    }

    @Override
    public LiveData<List<UserProfile>> getUsers() {
        return displayingUsers;
    }

    @Override
    public List<UserListMode> getModes() {
        if (displayingUsers.getValue() == null) {
            return Collections.emptyList();
        }
        if (isSearching) {
            int size = displayingUsers.getValue().size();
            List<UserListMode> modes = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                modes.add(UserListMode.SEARCH);
            }
            return modes;
        } else {
            List<UserListMode> modes = new ArrayList<>(displayingUsers.getValue().size());
            for (int i = 0; i < friendRequests.size(); i++) {
                modes.add(UserListMode.FRIEND_REQUEST);
            }
            for (int i = 0; i < friends.size(); i++) {
                modes.add(UserListMode.FRIEND);
            }
            return modes;
        }
    }

    public LiveData<String> getToastMessage() {
        return toastMessage;
    }

    public LiveData<Integer> getToastMessageResId() {
        return toastMessageResId;
    }

    public LiveData<Integer> getPopupMessageResId() {
        return popupMessageResId;
    }

    public boolean canSendRequestTo(UserProfile user) {
        return !friends.contains(user) && !friendRequests.contains(user);
    }

    public void updateSearchFor(String query) {
        Log.d(TAG, "Searching " + query);
        cancelAllRequests();
        if (query.isEmpty()) {
            this.isSearching = false;
            fetchFriends();
            fetchFriendRequests();
        } else {
            this.isSearching = true;
            fetchSearchResult(query);
        }
    }

    private void fetchFriends() {
        fetchFriendsCall = userService.getFriendProfiles();
        fetchFriendsCall.enqueue(new Callback<List<UserProfile>>() {
            @Override
            public void onResponse(@NonNull Call<List<UserProfile>> call, @NonNull Response<List<UserProfile>> response) {
                if (response.isSuccessful()) {
                    friends = response.body();
                } else {
                    Log.e(TAG, "userService.getFriendProfiles failed with code " + response.code() + " body: " + response.errorBody());
                    friends = Collections.emptyList();
                    handleFetchFailure("Error code " + response.code());
                }
                displayFriendList();
            }

            @Override
            public void onFailure(@NonNull Call<List<UserProfile>> call, @NonNull Throwable t) {
                if (call.isCanceled()) {
                    Log.i(TAG, "userService.getFriendProfiles canceled");
                    return;
                }
                Log.e(TAG, "userService.getFriendProfiles failed: " + t);
                friends = Collections.emptyList();
                displayFriendList();
                handleFetchFailure(t.getLocalizedMessage());
            }
        });
    }

    private void fetchFriendRequests() {
        fetchFriendRequestsCall = userService.getFriendRequests();
        fetchFriendRequestsCall.enqueue(new Callback<List<UserProfile>>() {
            @Override
            public void onResponse(@NonNull Call<List<UserProfile>> call, @NonNull Response<List<UserProfile>> response) {
                if (response.isSuccessful()) {
                    friendRequests = response.body();
                } else {
                    Log.e(TAG, "userService.getFriendRequests failed with code " + response.code() + " body: " + response.errorBody());
                    friendRequests = Collections.emptyList();
                    handleFetchFailure("Error code " + response.code());
                }
                displayFriendList();
            }

            @Override
            public void onFailure(@NonNull Call<List<UserProfile>> call, @NonNull Throwable t) {
                if (call.isCanceled()) {
                    Log.i(TAG, "userService.getFriendRequests canceled");
                    return;
                }
                Log.e(TAG, "userService.getFriendRequests failed: " + t);
                friendRequests = Collections.emptyList();
                handleFetchFailure(t.getLocalizedMessage());
                displayFriendList();
            }
        });
    }

    private void fetchSearchResult(String query) {
        searchFriendsCall = userService.searchNewFriends(query);
        searchFriendsCall.enqueue(new Callback<List<UserProfile>>() {
            @Override
            public void onResponse(@NonNull Call<List<UserProfile>> call, @NonNull Response<List<UserProfile>> response) {
                if (response.isSuccessful()) {
                    handleSearchResult(Objects.requireNonNull(response.body()));
                } else {
                    Log.e(TAG, "userService.searchNewFriends failed with code " + response.code() + " body: " + response.errorBody());
                    handleSearchResult(Collections.emptyList());
                    handleFetchFailure("Error code " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<UserProfile>> call, @NonNull Throwable t) {
                if (call.isCanceled()) {
                    Log.i(TAG, "userService.getFriendRequests canceled");
                    return;
                }
                Log.e(TAG, "userService.getFriendRequests failed: " + t);
                handleSearchResult(Collections.emptyList());
                handleFetchFailure(t.getLocalizedMessage());
            }
        });
    }

    private void handleSearchResult(List<UserProfile> results) {
        if (!isSearching) {
            return;
        }
        List<UserProfile> filtered = results.stream()
                .filter(user -> !friends.contains(user))
                .collect(Collectors.toList());
        if (filtered.isEmpty()) {
            popupMessageResId.setValue(R.string.friends_search_no_found);
        } else {
            popupMessageResId.setValue(null);
        }
        displayingUsers.setValue(filtered);
    }

    private void displayFriendList() {
        if (isSearching) {
            return;
        }
        List<UserProfile> users = new ArrayList<>();
        users.addAll(friendRequests);
        users.addAll(friends);
        if (users.isEmpty()) {
            popupMessageResId.setValue(R.string.friends_no_friend);
        } else {
            popupMessageResId.setValue(null);
        }
        displayingUsers.setValue(users);
    }

    private void handleFetchFailure(String message) {
        toastMessage.setValue(message);
        toastMessage.setValue(null);
    }

    private void cancelAllRequests() {
        if (searchFriendsCall != null) {
            searchFriendsCall.cancel();
            searchFriendsCall = null;
        }
        if (fetchFriendsCall != null) {
            fetchFriendsCall.cancel();
            fetchFriendsCall = null;
        }
        if (fetchFriendRequestsCall != null) {
            fetchFriendRequestsCall.cancel();
            fetchFriendRequestsCall = null;
        }
    }
}