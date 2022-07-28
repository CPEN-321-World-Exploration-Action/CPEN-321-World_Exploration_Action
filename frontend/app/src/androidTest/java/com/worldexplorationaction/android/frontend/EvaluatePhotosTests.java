package com.worldexplorationaction.android.frontend;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.IdlingRegistry;
import androidx.test.espresso.IdlingResource;
import androidx.test.espresso.ViewInteraction;
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
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.IOException;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class EvaluatePhotosTests {
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
    public void evaluatePhotoScreen() throws IOException {
        TrophyDetailsUtils.startTrophyDetailsActivity();

        ViewInteraction photo = onView(
                allOf(childAtPosition(
                                allOf(withId(R.id.images_grid),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                9)),
                                0),
                        isDisplayed()));
        photo.perform(click());
        onView(withId(R.id.trophy_name_evaluate)).check(matches(isDisplayed()));
        onView(withId(R.id.evaluated_photo)).check(matches(isDisplayed()));
        onView(withId(R.id.number)).check(matches(isDisplayed()));
        onView(withId(R.id.like_button)).check(matches(isDisplayed()));
    }

    @Test
    public void likeUnLike() throws IOException {
        TrophyDetailsUtils.startTrophyDetailsActivity();

        ViewInteraction photo = onView(
                allOf(childAtPosition(
                                allOf(withId(R.id.images_grid),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                9)),
                                0),
                        isDisplayed()));
        photo.perform(click());

        ViewInteraction likeButton = onView(withId(R.id.like_button));
        likeButton.perform(click());
        onView(withId(R.id.number)).check(matches(withText("1")));

        ViewInteraction likeButton1 = onView(
                allOf(withId(R.id.like_button),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                4),
                        isDisplayed()));
        likeButton1.perform(click());
        onView(withId(R.id.number)).check(matches(withText("0")));
    }
}
