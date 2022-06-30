package com.worldexplorationaction.android.ui.leaderboard;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.ui.userlist.UserListViewModel;
import com.worldexplorationaction.android.user.UserProfile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LeaderboardViewModel extends ViewModel implements UserListViewModel {
    private final MutableLiveData<List<UserProfile>> users;
    private final MutableLiveData<LeaderboardType> leaderboardType;

    public LeaderboardViewModel() {
        users = new MutableLiveData<>(Collections.emptyList());
        leaderboardType = new MutableLiveData<>();
    }

    @Override
    public LiveData<List<UserProfile>> getUsers() {
        return users;
    }

    public LiveData<LeaderboardType> getLeaderboardType() {
        return leaderboardType;
    }

    public void notifySwitchLeaderboardType(LeaderboardType type) {
        if (type == getLeaderboardType().getValue()) {
            return;
        }
        leaderboardType.setValue(type);
        if (type == LeaderboardType.GLOBAL) {
            List<UserProfile> dummy = new ArrayList<>();
            dummy.add(new UserProfile("id0", "", "Borivoj Philomele", 2001));
            dummy.add(new UserProfile("id1", "", "Paul C. Ramos", 999));
            dummy.add(new UserProfile("id2", "", "Paul L. Thoman", 998));
            dummy.add(new UserProfile("id3", "", "Kelsey T. Donovan", 990));
            dummy.add(new UserProfile("id4", "", "Paul L. Gregory", 800));
            dummy.add(new UserProfile("id5", "", "Mary R. Mercado", 700));
            dummy.add(new UserProfile("id6", "", "Theresa N. Maki", 666));
            dummy.add(new UserProfile("id7", "", "Rayen Gülnur", 555));
            dummy.add(new UserProfile("id8", "", "Dunstan Giusto", 550));
            dummy.add(new UserProfile("id9", "", "Feofan Indie", 300));
            dummy.add(new UserProfile("id10", "", "Dunstan Giusto", 21));
            users.setValue(dummy);
        } else {
            List<UserProfile> dummy = new ArrayList<>();
            dummy.add(new UserProfile("id1", "", "Paul C. Ramos", 999));
            dummy.add(new UserProfile("id2", "", "Paul L. Thoman", 998));
            dummy.add(new UserProfile("id3", "", "Kelsey T. Donovan", 990));
            dummy.add(new UserProfile("id6", "", "Theresa N. Maki", 666));
            dummy.add(new UserProfile("id7", "", "Rayen Gülnur", 555));
            dummy.add(new UserProfile("id9", "", "Feofan Indie", 300));
            users.setValue(dummy);
        }
    }
}