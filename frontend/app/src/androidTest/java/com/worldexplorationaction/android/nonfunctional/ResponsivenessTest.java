package com.worldexplorationaction.android.nonfunctional;


import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.is;

import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.DataInteraction;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.espresso.ViewInteraction;
import androidx.test.espresso.contrib.RecyclerViewActions;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.GrantPermissionRule;

import com.worldexplorationaction.android.MainActivity;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.ui.utility.RetrofitUtils;
import com.worldexplorationaction.android.utility.OkHttpClientIdlingResources;
import com.worldexplorationaction.android.utility.TrophyDetailsUtils;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.IOException;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class ResponsivenessTest {
    private static final long MAX_DELAY = 2_000_000_000L; // in nanosecond, 2 seconds
    private static final long INIT_WAIT_TIME = 2_000L; // in millisecond, 2 seconds
    private static final IdlingResource okHttpResource = new OkHttpClientIdlingResources("OkHttp", RetrofitUtils.getClient());

    @Rule
    public ActivityScenarioRule<MainActivity> mActivityScenarioRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Rule
    public GrantPermissionRule mGrantPermissionRule =
            GrantPermissionRule.grant(
                    "android.permission.ACCESS_FINE_LOCATION",
                    "android.permission.ACCESS_COARSE_LOCATION");

    @BeforeClass
    public static void beforeClass() {
        IdlingRegistry.getInstance().register(okHttpResource);
    }

    @AfterClass
    public static void afterClass() {
        IdlingRegistry.getInstance().unregister(okHttpResource);
    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }

    private static void runWithRuntimeCheck(Runnable task) {
        long startTime = System.nanoTime();
        task.run();
        long endTime = System.nanoTime();
        long duration = (endTime - startTime);
        System.out.println("runtime: " + duration);
        Assert.assertTrue("Not Sufficiently responsive, delay=" + duration, duration < MAX_DELAY);
    }

    private static void openFriendView() {
        runWithRuntimeCheck(() ->
                onView(allOf(withId(R.id.navigation_friends),
                        withContentDescription("Friends")))
                        .check(matches(isDisplayed()))
                        .perform(click())
        );
    }

    @Before
    public void setUp() {
        Intents.init();
        SystemClock.sleep(INIT_WAIT_TIME); /* Things are too slow when the app is just started */
    }

    @After
    public void tearDown() {
        Intents.release();
    }

    @Test
    public void viewProfile() {
        runWithRuntimeCheck(() -> {
            ViewInteraction profileButton = onView(
                    allOf(withId(R.id.navigation_profile), withContentDescription("Profile"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(R.id.nav_view),
                                            0),
                                    0),
                            isDisplayed()));
            profileButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction logoutButton = onView(
                    allOf(withId(R.id.profile_logout_button),
                            childAtPosition(
                                    childAtPosition(
                                            withId(R.id.nav_host_fragment_activity_main),
                                            0),
                                    9),
                            isDisplayed()));
            logoutButton.perform(click());
        });
    }

    @Test
    public void watchLeaderboard() {
        runWithRuntimeCheck(() -> {
            ViewInteraction leaderboardButton = onView(
                    allOf(withId(R.id.navigation_leaderboard), withContentDescription("Leaderboard"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(R.id.nav_view),
                                            0),
                                    2),
                            isDisplayed()));
            leaderboardButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction leaderboardFriendsButton = onView(
                    allOf(withId(R.id.leaderboard_friends_button), withText("Friends"),
                            childAtPosition(
                                    allOf(withId(R.id.linearLayout),
                                            childAtPosition(
                                                    withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                    1)),
                                    1),
                            isDisplayed()));
            leaderboardFriendsButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction leaderboardGlobalButton = onView(
                    allOf(withId(R.id.leaderboard_global_button), withText("Global"),
                            childAtPosition(
                                    allOf(withId(R.id.linearLayout),
                                            childAtPosition(
                                                    withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                    1)),
                                    0),
                            isDisplayed()));
            leaderboardGlobalButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction leaderboardFriendsButton = onView(
                    allOf(withId(R.id.leaderboard_friends_button), withText("Friends"),
                            childAtPosition(
                                    allOf(withId(R.id.linearLayout),
                                            childAtPosition(
                                                    withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                    1)),
                                    1),
                            isDisplayed()));
            leaderboardFriendsButton.perform(click());
        });
    }

    @Test
    public void browseTrophiesOnMap() {
        /* Switch to other views and switch back to verify the responsiveness */
        runWithRuntimeCheck(() -> {
            ViewInteraction profileButton = onView(
                    allOf(withId(R.id.navigation_profile), withContentDescription("Profile"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(R.id.nav_view),
                                            0),
                                    0),
                            isDisplayed()));
            profileButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction mapButton = onView(
                    allOf(withId(R.id.navigation_map), withContentDescription("Map"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(R.id.nav_view),
                                            0),
                                    1),
                            isDisplayed()));
            mapButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction myLocationButton = onView(
                    allOf(withContentDescription("My Location"),
                            childAtPosition(
                                    childAtPosition(
                                            withClassName(is("android.widget.FrameLayout")),
                                            2),
                                    0),
                            isDisplayed()));
            myLocationButton.perform(click());
        });
    }

    @Test
    public void reviewTrophyDetailsAndPhotos() throws IOException {
        TrophyDetailsUtils.startTrophyDetailsActivity();

        runWithRuntimeCheck(() -> {
            onView(withId(R.id.sort_photos))
                    .check(matches(isDisplayed()))
                    .perform(click());
        });

        runWithRuntimeCheck(() -> {
            onView(withText("Time"))
                    .inRoot(isDialog())
                    .perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction sortButton = onView(
                    allOf(withId(R.id.sort_photos),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    6),
                            isDisplayed()));
            sortButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            onView(withText("Like Number"))
                    .inRoot(isDialog())
                    .perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction navigationButton = onView(
                    allOf(withId(R.id.trophy_details_maps_button),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    10),
                            isDisplayed()));
            navigationButton.perform(click());
        });
    }

    @Test
    public void evaluatePhotos() throws IOException {
        TrophyDetailsUtils.startTrophyDetailsActivity();

        runWithRuntimeCheck(() -> {
            ViewInteraction photo = onView(
                    allOf(childAtPosition(
                                    allOf(withId(R.id.images_grid),
                                            childAtPosition(
                                                    withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                    9)),
                                    0),
                            isDisplayed()));
            photo.perform(click());
        });

        runWithRuntimeCheck(() -> {
            onView(withId(R.id.like_button))
                    .perform(click());
        });

        runWithRuntimeCheck(() -> {
            onView(withId(R.id.like_button))
                    .perform(click());
        });
    }

    @Test
    public void collectTrophy() throws IOException {
        TrophyDetailsUtils.startTrophyDetailsActivity();
        TrophyDetailsUtils.stubImageCapture();

        runWithRuntimeCheck(() -> {
            ViewInteraction collectTrophyButton = onView(
                    allOf(withId(R.id.trophy_action_button), withText("Collect Trophy"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    5),
                            isDisplayed()));
            collectTrophyButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction takeAPhotoButton = onView(
                    allOf(withId(R.id.trophy_action_button), withText("Take a Photo"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    5),
                            isDisplayed()));
            takeAPhotoButton.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction replaceButton = onView(
                    allOf(withId(android.R.id.button1), withText("Replace"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(androidx.appcompat.R.id.buttonPanel),
                                            0),
                                    3)));
            replaceButton.perform(scrollTo(), click());
        });
    }

    @Test
    public void manageFriendsSendRequest() {
        openFriendView();

        runWithRuntimeCheck(() -> {
            ViewInteraction searchEditText = onView(
                    allOf(withId(R.id.friends_search_edit_text),
                            childAtPosition(
                                    childAtPosition(
                                            withId(R.id.friends_search_bar_background),
                                            0),
                                    1),
                            isDisplayed()));
            searchEditText.perform(replaceText("Test User 3"), closeSoftKeyboard());
        });

        runWithRuntimeCheck(() -> {
            onView(withId(R.id.friends_user_list))
                    .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));
        });

        runWithRuntimeCheck(() -> {
            onView(withText("Yes"))
                    .inRoot(isDialog())
                    .perform(scrollTo(), click());
        });
    }

    @Test
    public void manageFriendsAcceptRequest() {
        openFriendView();

        runWithRuntimeCheck(() -> {
            ViewInteraction requestView = onView(
                    allOf(childAtPosition(
                                    allOf(withId(R.id.friends_user_list),
                                            childAtPosition(
                                                    withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                    2)),
                                    0),
                            isDisplayed()));
            requestView.perform(click());
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction acceptButton = onView(
                    allOf(withId(android.R.id.button1), withText("Accept"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(androidx.appcompat.R.id.buttonPanel),
                                            0),
                                    3)));
            acceptButton.perform(scrollTo(), click());
        });
    }

    @Test
    public void manageFriendsDeclineRequest() {
        openFriendView();

        runWithRuntimeCheck(() -> {
            onView(withId(R.id.friends_user_list))
                    .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));
        });

        runWithRuntimeCheck(() -> {
            ViewInteraction declineButton = onView(
                    allOf(withId(android.R.id.button2), withText("Decline"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(androidx.appcompat.R.id.buttonPanel),
                                            0),
                                    2)));
            declineButton.perform(scrollTo(), click());
        });
    }

    @Test
    public void manageFriendsViewProfile() {
        openFriendView();

        runWithRuntimeCheck(() -> {
            ViewInteraction userView = onView(
                    allOf(childAtPosition(
                                    allOf(withId(R.id.friends_user_list),
                                            childAtPosition(
                                                    withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                    2)),
                                    1),
                            isDisplayed()));
            userView.perform(click());
        });

        runWithRuntimeCheck(() -> {
            DataInteraction profileButton = onData(anything())
                    .inAdapterView(allOf(withId(androidx.appcompat.R.id.select_dialog_listview),
                            childAtPosition(
                                    withId(androidx.appcompat.R.id.contentPanel),
                                    0)))
                    .atPosition(0);
            profileButton.perform(click());
        });

        runWithRuntimeCheck(Espresso::pressBack);
    }

    @Test
    public void manageFriendsDeleteFriend() {
        openFriendView();

        runWithRuntimeCheck(() -> {
            ViewInteraction userView = onView(
                    allOf(childAtPosition(
                                    allOf(withId(R.id.friends_user_list),
                                            childAtPosition(
                                                    withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                    2)),
                                    1),
                            isDisplayed()));
            userView.perform(click());
        });

        runWithRuntimeCheck(() -> {
            DataInteraction deleteButton = onData(anything())
                    .inAdapterView(allOf(withId(androidx.appcompat.R.id.select_dialog_listview),
                            childAtPosition(
                                    withId(androidx.appcompat.R.id.contentPanel),
                                    0)))
                    .atPosition(1);
            deleteButton.perform(click());
        });
    }
}
