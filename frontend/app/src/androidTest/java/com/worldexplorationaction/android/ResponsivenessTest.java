package com.worldexplorationaction.android;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.espresso.ViewInteraction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.GrantPermissionRule;

import com.worldexplorationaction.android.ui.utility.RetrofitUtils;
import com.worldexplorationaction.android.utility.OkHttpClientIdlingResources;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class ResponsivenessTest {
    private static final long MAX_DELAY = 2_000_000_000L; // in nanosecond, 2 seconds
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

    @Test
    public void viewProfile() {

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
}
