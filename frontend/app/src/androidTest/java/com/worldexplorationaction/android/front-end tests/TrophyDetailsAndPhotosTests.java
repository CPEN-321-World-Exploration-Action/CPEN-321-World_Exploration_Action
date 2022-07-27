package com.worldexplorationaction.android;

import android.os.IBinder;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.espresso.Root;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.GrantPermissionRule;

import com.worldexplorationaction.android.ui.utility.RetrofitUtils;
import com.worldexplorationaction.android.utility.OkHttpClientIdlingResources;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.runner.RunWith;



import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.WindowManager;

import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.espresso.ViewInteraction;
import androidx.test.espresso.intent.Intents;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.GrantPermissionRule;

import com.worldexplorationaction.android.ui.utility.RetrofitUtils;
import com.worldexplorationaction.android.utility.OkHttpClientIdlingResources;
import com.worldexplorationaction.android.utility.TrophyDetailsUtils;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.IOException;

    @LargeTest
    @RunWith(AndroidJUnit4.class)
    public class TrophyDetailsAndPhotosTests {
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
        @After
        public void tearDown() {
            Intents.release();
        }


        @Test
        public void trophyDetailsScreen() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity();

            onView(withId(R.id.trophy_name_evaluate)).check(matches(isDisplayed()));
            onView(withId(R.id.textView7)).check(matches(isDisplayed()));
            onView(withId(R.id.collectors)).check(matches(isDisplayed()));
            onView(withId(R.id.images_grid)).check(matches(isDisplayed()));
            onView(withId(R.id.trophy_action_button)).check(matches(isDisplayed()));
            onView(withId(R.id.trophy_details_maps_button)).check(matches(isDisplayed()));
        }


        @Test
        public void farAwayTrophy() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity1();

            ViewInteraction collectTrophyButton = onView(
                    allOf(withId(R.id.trophy_action_button), withText("Collect Trophy"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    5),
                            isDisplayed()));
            collectTrophyButton.perform(click());

            onView(withText("You are too far away")).inRoot(new ToastMatcher()).check(matches(isDisplayed()));
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
                    }
                }
                return false;
            }

            @Override
            public void describeTo(Description description) {

            }
        }

    }
