package com.worldexplorationaction.android.frontend;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.doesNotExist;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.is;

import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.WindowManager;

import androidx.test.espresso.DataInteraction;
import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.espresso.Root;
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

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class ManageFriendsTests {

    private static final IdlingResource okHttpResource = new OkHttpClientIdlingResources("OkHttp", RetrofitUtils.getClient());
    private static final long INIT_WAIT_TIME = 2_000L; // in millisecond, 2 seconds
    private static final String TAG = ManageFriendsTests.class.getSimpleName();;

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
    public void manageFriendScreen() {
        openFriendView();

        /* Check elements to make sure the friends fragment is displayed */
        ViewInteraction editText = onView(
                allOf(withId(R.id.friends_search_edit_text),
                        withParent(withParent(withId(R.id.friends_search_bar_background))),
                        isDisplayed()));
        editText.check(matches(isDisplayed()));
    }

    @Test
    public void sendFriendRequest() {
        openFriendView();
        SystemClock.sleep(5000); /* Wait for existing toasts to disappear */

        ViewInteraction searchEditText = onView(
                allOf(withId(R.id.friends_search_edit_text),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.friends_search_bar_background),
                                        0),
                                1),
                        isDisplayed()));
        searchEditText.perform(replaceText("Test User 3"), closeSoftKeyboard());


        onView(withId(R.id.friends_user_list))
                .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));


        onView(withText("Yes"))
                .inRoot(isDialog())
                .perform(scrollTo(), click());

        onView(withText("Successfully sent a friend request to Test User 3")).inRoot(new ToastMatcher())
                .check(matches(isDisplayed()));

    }


        @Test
        public void acceptFriendRequest() {
            openFriendView();

                ViewInteraction requestView = onView(
                        allOf(childAtPosition(
                                        allOf(withId(R.id.friends_user_list),
                                                childAtPosition(
                                                        withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                        2)),
                                        0),
                                isDisplayed()));
                requestView.perform(click());

                ViewInteraction acceptButton = onView(
                        allOf(withId(android.R.id.button1), withText("Accept"),
                                childAtPosition(
                                        childAtPosition(
                                                withId(androidx.appcompat.R.id.buttonPanel),
                                                0),
                                        3)));
                acceptButton.perform(scrollTo(), click());

                onView(withText("Successfully accepted Test User 4's friend request")).inRoot(new ToastMatcher())
                    .check(matches(isDisplayed()));

                onView(withId(R.id.friends_user_list)).check(matches(isDisplayed()));
        }

        @Test
        public void declineFriendRequest() {
            openFriendView();

                onView(withId(R.id.friends_user_list))
                        .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));


                ViewInteraction declineButton = onView(
                        allOf(withId(android.R.id.button2), withText("Decline"),
                                childAtPosition(
                                        childAtPosition(
                                                withId(androidx.appcompat.R.id.buttonPanel),
                                                0),
                                        2)));
                declineButton.perform(scrollTo(), click());

                onView(withText("Successfully declined Test User 4's friend request")).inRoot(new ToastMatcher())
                    .check(matches(isDisplayed()));
        }

    @Test
    public void viewProfile() {
        openFriendView();

        ViewInteraction userView = onView(
                allOf(childAtPosition(
                                allOf(withId(R.id.friends_user_list),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                2)),
                                1),
                        isDisplayed()));
        userView.perform(click());


        DataInteraction profileButton = onData(anything())
                .inAdapterView(allOf(withId(androidx.appcompat.R.id.select_dialog_listview),
                        childAtPosition(
                                withId(androidx.appcompat.R.id.contentPanel),
                                0)))
                .atPosition(0);
        profileButton.perform(click());

        onView(withId(R.id.profile_layout)).check(matches(isDisplayed()));
    }


        @Test
        public void deleteFriend() {
            openFriendView();

                ViewInteraction userView = onView(
                        allOf(childAtPosition(
                                        allOf(withId(R.id.friends_user_list),
                                                childAtPosition(
                                                        withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                        2)),
                                        1),
                                isDisplayed()));
                userView.perform(click());

                DataInteraction deleteButton = onData(anything())
                        .inAdapterView(allOf(withId(androidx.appcompat.R.id.select_dialog_listview),
                                childAtPosition(
                                        withId(androidx.appcompat.R.id.contentPanel),
                                        0)))
                        .atPosition(1);
                deleteButton.perform(click());

                onView(withText("Successfully deleted friend Test User 2")).inRoot(new ToastMatcher())
                    .check(matches(isDisplayed()));
        }


    @Test
    public void noFriends() {
        openFriendView();

        ViewInteraction userView = onView(
                allOf(childAtPosition(
                                allOf(withId(R.id.friends_user_list),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                2)),
                                1),
                        isDisplayed()));
        userView.perform(click());

        DataInteraction deleteButton = onData(anything())
                .inAdapterView(allOf(withId(androidx.appcompat.R.id.select_dialog_listview),
                        childAtPosition(
                                withId(androidx.appcompat.R.id.contentPanel),
                                0)))
                .atPosition(1);
        deleteButton.perform(click());

        onView(withId(R.id.friends_user_list))
                .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));


        ViewInteraction declineButton = onView(
                allOf(withId(android.R.id.button2), withText("Decline"),
                        childAtPosition(
                                childAtPosition(
                                        withId(androidx.appcompat.R.id.buttonPanel),
                                        0),
                                2)));
        declineButton.perform(scrollTo(), click());
        onView(withId(R.id.friends_error_text)).check(matches(isDisplayed()));

    }

    @Test
    public void searchForNonExistedUser() {
        openFriendView();

        onView(withId(R.id.friends_search_edit_text)).perform(typeText("John"));
        onView(withText(R.string.friends_search_no_found)).check(matches(isDisplayed()));

    }

    @Test
    public void searchForAlreadyFriendUser() {
        openFriendView();

        ViewInteraction requestView = onView(
                allOf(childAtPosition(
                                allOf(withId(R.id.friends_user_list),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                2)),
                                0),
                        isDisplayed()));
        requestView.perform(click());

        ViewInteraction acceptButton = onView(
                allOf(withId(android.R.id.button1), withText("Accept"),
                        childAtPosition(
                                childAtPosition(
                                        withId(androidx.appcompat.R.id.buttonPanel),
                                        0),
                                3)));
        acceptButton.perform(scrollTo(), click());

        onView(withId(R.id.friends_search_edit_text)).perform(typeText("Test User 4"));
        onView(withText(R.string.friends_search_no_found)).check(matches(isDisplayed()));

    }

    @Test
    public void searchForExistedUser() {
        openFriendView();

        onView(withId(R.id.friends_search_edit_text)).perform(typeText("Test User 3"));
        onView(withId(R.id.friends_user_list)).check(matches(isDisplayed()));
    }

    @Test
    public void sendFriendRequestResponseNo() {
        openFriendView();

        ViewInteraction searchEditText = onView(
                allOf(withId(R.id.friends_search_edit_text),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.friends_search_bar_background),
                                        0),
                                1),
                        isDisplayed()));
        searchEditText.perform(replaceText("Test User 1"), closeSoftKeyboard());


        onView(withId(R.id.friends_user_list))
                .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));


        onView(withText("No"))
                .inRoot(isDialog())
                .perform(scrollTo(), click());

        onView(withText("No")).check(doesNotExist());

    }


    private static void openFriendView() {
        onView(allOf(withId(R.id.navigation_friends),
                withContentDescription("Friends")))
                .check(matches(isDisplayed()))
                .perform(click());
    }


    public class ToastMatcher extends TypeSafeMatcher<Root> {

        @Override
        public boolean matchesSafely(Root root) {
            int type = root.getWindowLayoutParams().get().type;
            if ((type == WindowManager.LayoutParams.TYPE_TOAST)) {
                IBinder windowToken = root.getDecorView().getWindowToken();
                IBinder appToken = root.getDecorView().getApplicationWindowToken();
                if (windowToken == appToken) {
                    return true;
                    //means this window isn't contained by any other windows.
                }
            }
            return false;
        }

        @Override
        public void describeTo(Description description) {
            Log.d(TAG, "describeTo method");
        }
    }
}
