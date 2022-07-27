package com.worldexplorationaction.android.nonfunctional;


import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.intent.Intents.intended;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasComponent;
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
import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.espresso.ViewInteraction;
import androidx.test.espresso.contrib.RecyclerViewActions;
import androidx.test.espresso.intent.Intents;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.GrantPermissionRule;

import com.worldexplorationaction.android.MainActivity;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.ui.trophy.EvaluatePhotoActivity;
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
import java.util.concurrent.atomic.AtomicInteger;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class UsabilityTest {
    private static final int OPERATION_COUNT_LIMIT = 5;
    private static final long INIT_WAIT_TIME = 2_000L; // in millisecond, 2 seconds
    private static final IdlingResource okHttpResource = new OkHttpClientIdlingResources("OkHttp", RetrofitUtils.getClient());

    private final AtomicInteger operationCount = new AtomicInteger(0);

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

    private void increaseOperationCount(int value) {
        int newCount = operationCount.addAndGet(value);
        Assert.assertTrue("Too many operations", newCount <= OPERATION_COUNT_LIMIT);
    }

    private void runOneOperation(Runnable task) {
        InstrumentationRegistry.getInstrumentation().waitForIdleSync();
        increaseOperationCount(1);
        task.run();
    }

    private void openFriendView() {
        runOneOperation(() ->
                onView(allOf(ViewMatchers.withId(R.id.navigation_friends),
                        withContentDescription("Friends")))
                        .check(matches(isDisplayed()))
                        .perform(click())
        );
    }

    @Before
    public void setUp() {
        Intents.init();
        operationCount.set(0);
        SystemClock.sleep(INIT_WAIT_TIME); /* Things are too slow when the app is just started */
    }

    @After
    public void tearDown() {
        Intents.release();
    }

    @Test
    public void viewProfile() {
        runOneOperation(() -> {
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
    }

    @Test
    public void logOut() {
        viewProfile();

        runOneOperation(() -> {
            ViewInteraction logoutButton = onView(withId(R.id.profile_logout_button));
            logoutButton.perform(click());
        });
    }

    @Test
    public void watchLeaderboard() {
        runOneOperation(() -> {
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

        runOneOperation(() -> {
            ViewInteraction leaderboardFriendsButton = onView(withId(R.id.leaderboard_friends_button));
            leaderboardFriendsButton.perform(click());
        });

        runOneOperation(() -> {
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
    }

    @Test
    public void browseTrophiesOnMap() {
        runOneOperation(() -> {
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
    public void sortPhotosByTime() throws IOException {
        increaseOperationCount(1);
        TrophyDetailsUtils.startTrophyDetailsActivity();

        /* Sometimes the sort photos button is not clicked */
        SystemClock.sleep(1000);

        runOneOperation(() -> {
            onView(withId(R.id.sort_photos))
                    .check(matches(isDisplayed()))
                    .perform(click());
        });

        runOneOperation(() -> {
            onView(withText("Time"))
                    .inRoot(isDialog())
                    .perform(click());
        });
    }

    @Test
    public void sortPhotosByLikeNumber() throws IOException {
        increaseOperationCount(1);
        TrophyDetailsUtils.startTrophyDetailsActivity();

        /* Sometimes the sort photos button is not clicked */
        SystemClock.sleep(1000);

        runOneOperation(() -> {
            onView(withId(R.id.sort_photos))
                    .check(matches(isDisplayed()))
                    .perform(click());
        });

        runOneOperation(() -> {
            onView(withText("Like Number"))
                    .inRoot(isDialog())
                    .perform(click());
        });
    }

    @Test
    public void trophyDetailsNavigation() throws IOException {
        increaseOperationCount(1);
        TrophyDetailsUtils.startTrophyDetailsActivity();

        runOneOperation(() -> {
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
    public void evaluatePhoto() throws IOException {
        increaseOperationCount(1);
        TrophyDetailsUtils.startTrophyDetailsActivity();

        runOneOperation(() -> {
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

        intended(hasComponent(EvaluatePhotoActivity.class.getName()));

        runOneOperation(() -> {
            onView(withId(R.id.like_button))
                    .perform(click());
        });
    }

    @Test
    public void collectTrophy() throws IOException {
        increaseOperationCount(1);
        TrophyDetailsUtils.startTrophyDetailsActivity();

        runOneOperation(() -> {
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
    }

    @Test
    public void takePhoto() throws IOException {
        increaseOperationCount(1);
        TrophyDetailsUtils.startTrophyDetailsActivity();
        TrophyDetailsUtils.stubImageCapture();

        SystemClock.sleep(1000);

        /* This does not count as an operation because it belongs to Collect Trophy */
        onView(allOf(withId(R.id.trophy_action_button), withText("Collect Trophy")))
                .perform(click());

        SystemClock.sleep(1000);

        runOneOperation(() -> {
            onView(allOf(withId(R.id.trophy_action_button), withText("Take a Photo")))
                    .perform(click());
        });

        runOneOperation(() -> {
            onView(allOf(withId(android.R.id.button1), withText("Replace")))
                    .inRoot(isDialog())
                    .perform(scrollTo(), click());
        });

        // 2 for image capture
        increaseOperationCount(2);
    }

    @Test
    public void manageFriendsSendRequest() {
        openFriendView();

        runOneOperation(() -> {
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

        runOneOperation(() -> {
            onView(withId(R.id.friends_user_list))
                    .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));
        });

        runOneOperation(() -> {
            onView(withText("Yes"))
                    .inRoot(isDialog())
                    .perform(scrollTo(), click());
        });
    }

    @Test
    public void manageFriendsAcceptRequest() {
        openFriendView();

        runOneOperation(() -> {
            onView(withId(R.id.friends_user_list))
                    .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));
        });

        runOneOperation(() -> {
            ViewInteraction acceptButton = onView(allOf(withId(android.R.id.button1), withText("Accept")));
            acceptButton.perform(scrollTo(), click());
        });
    }

    @Test
    public void manageFriendsDeclineRequest() {
        openFriendView();

        runOneOperation(() -> {
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

        runOneOperation(() -> {
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

        runOneOperation(() -> {
            ViewInteraction userView = onView(childAtPosition(withId(R.id.friends_user_list), 1));
            userView.perform(click());
        });

        runOneOperation(() -> {
            DataInteraction profileButton = onData(anything())
                    .inAdapterView(allOf(withId(androidx.appcompat.R.id.select_dialog_listview),
                            childAtPosition(
                                    withId(androidx.appcompat.R.id.contentPanel),
                                    0)))
                    .atPosition(0);
            profileButton.perform(click());
        });
    }

    @Test
    public void manageFriendsDeleteFriend() {
        openFriendView();

        runOneOperation(() -> {
            ViewInteraction userView = onView(
                    childAtPosition(
                            allOf(withId(R.id.friends_user_list),
                                    childAtPosition(
                                            withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                            2)),
                            1));
            userView.perform(click());
        });

        runOneOperation(() -> {
            DataInteraction deleteButton = onData(anything())
                    .inAdapterView(withId(androidx.appcompat.R.id.select_dialog_listview))
                    .atPosition(1);
            deleteButton.perform(click());
        });
    }
}
