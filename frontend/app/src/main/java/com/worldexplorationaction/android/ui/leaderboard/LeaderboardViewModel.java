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
        users.setValue(Collections.emptyList()); /* Clear content first */
        if (type == LeaderboardType.GLOBAL) {
            List<UserProfile> dummy = new ArrayList<>();
            dummy.add(new UserProfile("id0", "https://m.media-amazon.com/images/M/MV5BMWFmYmRiYzMtMTQ4YS00NjA5LTliYTgtMmM3OTc4OGY3MTFkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg", "Borivoj Philomele", 2001));
            dummy.add(new UserProfile("id1", "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v937-aew-111_3.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8ce2cd03f94f2baddcb332cfb50f78b9", "Paul C. Ramos", 999));
            dummy.add(new UserProfile("id2", "https://www.saeinc.com/wp-content/uploads/2019/11/avatar-icon.png", "Paul L. Thoman", 998));
            dummy.add(new UserProfile("id3", "https://static.wikia.nocookie.net/roblox/images/d/d1/3.0avatar.png/revision/latest/scale-to-width-down/720?cb=20210710212949", "Kelsey T. Donovan", 990));
            dummy.add(new UserProfile("id4", "", "Paul L. Gregory", 800));
            dummy.add(new UserProfile("id5", "", "Mary R. Mercado", 700));
            dummy.add(new UserProfile("id6", "https://media.gettyimages.com/vectors/people-avatar-round-icon-set-profile-diverse-faces-for-social-network-vector-id1227566098?s=612x612", "Theresa N. Maki", 666));
            dummy.add(new UserProfile("id7", "https://www.adobe.com/express/create/media_1b4d6d299e47dc0415d8111e80f9bfbb14ccc7bf1.jpeg?width=400&format=jpeg&optimize=medium", "Rayen Gülnur", 555));
            dummy.add(new UserProfile("id8", "", "Dunstan Giusto", 550));
            dummy.add(new UserProfile("id9", "https://m.media-amazon.com/images/M/MV5BMWFmYmRiYzMtMTQ4YS00NjA5LTliYTgtMmM3OTc4OGY3MTFkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg", "Feofan Indie", 300));
            dummy.add(new UserProfile("id10", "", "Dunstan Giusto", 21));
            users.setValue(dummy);
        } else {
            List<UserProfile> dummy = new ArrayList<>();
            dummy.add(new UserProfile("id1", "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v937-aew-111_3.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=8ce2cd03f94f2baddcb332cfb50f78b9", "Paul C. Ramos", 999));
            dummy.add(new UserProfile("id2", "https://www.saeinc.com/wp-content/uploads/2019/11/avatar-icon.png", "Paul L. Thoman", 998));
            dummy.add(new UserProfile("id3", "https://static.wikia.nocookie.net/roblox/images/d/d1/3.0avatar.png/revision/latest/scale-to-width-down/720?cb=20210710212949", "Kelsey T. Donovan", 990));
            dummy.add(new UserProfile("id6", "https://media.gettyimages.com/vectors/people-avatar-round-icon-set-profile-diverse-faces-for-social-network-vector-id1227566098?s=612x612", "Theresa N. Maki", 666));
            dummy.add(new UserProfile("id7", "https://www.adobe.com/express/create/media_1b4d6d299e47dc0415d8111e80f9bfbb14ccc7bf1.jpeg?width=400&format=jpeg&optimize=medium", "Rayen Gülnur", 555));
            dummy.add(new UserProfile("id9", "https://m.media-amazon.com/images/M/MV5BMWFmYmRiYzMtMTQ4YS00NjA5LTliYTgtMmM3OTc4OGY3MTFkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg", "Feofan Indie", 300));
            users.setValue(dummy);
        }
    }
}