package com.worldexplorationaction.android.ui.friends;

import android.util.Log;

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
import com.worldexplorationaction.android.ui.utility.CustomCallback;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import retrofit2.Call;

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
        displayingUsers.addSource(WeaFirebaseMessagingService.getFriendUpdate(), x -> fetchFriendsAndRequests());
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
        Log.d(TAG, "Searching \"" + query + "\"");
        cancelAllFetchRequests();
        if (query.isEmpty()) {
            this.isSearching = false;
            fetchFriendsAndRequests();
        } else {
            this.isSearching = true;
            fetchSearchResult(query);
        }
    }

    public void sendRequest(UserProfile user) {
        userService.sendRequest(user.getId()).enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "sendRequest succeeded");
            showToastMessage("Successfully sent a friend request to " + user.getName());
        }, null, errorMessage -> {
            Log.e(TAG, "sendRequest failed " + errorMessage);
            showToastMessage("Could not send request to " + user.getName() + " because " + errorMessage);
        }));
    }

    public void deleteFriend(UserProfile friend) {
        userService.deleteFriend(friend.getId()).enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "deleteFriend succeeded");
            showToastMessage("Successfully deleted friend " + friend.getName());
            fetchFriendsAndRequests();
        }, null, errorMessage -> {
            Log.e(TAG, "deleteFriend failed " + errorMessage);
            showToastMessage("Could not delete friend " + friend.getName() + " because " + errorMessage);
        }));
    }

    public void acceptRequest(UserProfile user) {
        userService.acceptRequest(user.getId()).enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "acceptRequest succeeded");
            showToastMessage("Successfully accepted " + user.getName() + "'s friend request");
            fetchFriendsAndRequests();
        }, null, errorMessage -> {
            Log.e(TAG, "acceptRequest failed " + errorMessage);
            showToastMessage("Could not accept " + user.getName() + "'s friend request because " + errorMessage);
        }));
    }

    public void declineRequest(UserProfile user) {
        userService.declineRequest(user.getId()).enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "declineRequest succeeded");
            showToastMessage("Successfully declined " + user.getName() + "'s friend request");
            fetchFriendsAndRequests();
        }, null, errorMessage -> {
            Log.e(TAG, "declineRequest failed " + errorMessage);
            showToastMessage("Could not decline " + user.getName() + "'s friend request because " + errorMessage);
        }));
    }

    private void fetchFriendsAndRequests() {
        /* Fetch friends */
        Log.i(TAG, "Fetching friends");
        fetchFriendsCall = userService.getFriendProfiles();
        fetchFriendsCall.enqueue(new CustomCallback<>(responseBody -> {
            Log.i(TAG, "userService.getFriendProfiles succeeded");
            friends = responseBody;
            displayFriendList();
        }, () -> {
            Log.i(TAG, "userService.getFriendProfiles canceled");
        }, errorMessage -> {
            Log.e(TAG, "userService.getFriendProfiles failed: " + errorMessage);
            friends = Collections.emptyList();
            displayFriendList();
            showToastMessage(errorMessage);
        }));

        /* Fetch friend requests */
        Log.i(TAG, "Fetching friend requests");
        fetchFriendRequestsCall = userService.getFriendRequests();
        fetchFriendRequestsCall.enqueue(new CustomCallback<>(responseBody -> {
            friendRequests = responseBody;
            displayFriendList();
        }, () -> {
            Log.i(TAG, "userService.getFriendRequests canceled");
        }, errorMessage -> {
            Log.e(TAG, "userService.getFriendRequests failed: " + errorMessage);
            friendRequests = Collections.emptyList();
            showToastMessage(errorMessage);
            displayFriendList();
        }));
    }

    private void fetchSearchResult(String query) {
        searchFriendsCall = userService.searchNewFriends(query);
        searchFriendsCall.enqueue(new CustomCallback<>(responseBody -> {
            handleSearchResult(Objects.requireNonNull(responseBody));
        }, () -> {
            Log.i(TAG, "userService.getFriendRequests canceled");
        }, errorMessage -> {
            Log.e(TAG, "userService.searchNewFriends failed " + errorMessage);
            handleSearchResult(Collections.emptyList());
            showToastMessage(errorMessage);
        }));
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

    private void cancelAllFetchRequests() {
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

    private void showToastMessage(String value) {
        toastMessage.setValue(value);
        toastMessage.setValue(null);
    }
}