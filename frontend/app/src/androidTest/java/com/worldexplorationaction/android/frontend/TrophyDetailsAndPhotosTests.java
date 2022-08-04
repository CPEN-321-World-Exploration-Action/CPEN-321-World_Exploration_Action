package com.worldexplorationaction.android.frontend;

import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;
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

import com.worldexplorationaction.android.MainActivity;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.ui.trophy.TrophyDetailsActivity;
import com.worldexplorationaction.android.ui.utility.RetrofitUtils;
import com.worldexplorationaction.android.utility.OkHttpClientIdlingResources;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.runner.RunWith;



import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.assertion.ViewAssertions.doesNotExist;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.RootMatchers.isDialog;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;

import android.view.WindowManager;


import androidx.test.espresso.ViewInteraction;

import com.worldexplorationaction.android.utility.TrophyDetailsUtils;


import org.junit.Test;
import java.io.IOException;
import java.util.Date;

@LargeTest
    @RunWith(AndroidJUnit4.class)
    public class TrophyDetailsAndPhotosTests {
        private static final IdlingResource okHttpResource = new OkHttpClientIdlingResources("OkHttp", RetrofitUtils.getClient());
        private static final long INIT_WAIT_TIME = 2_000L; // in millisecond, 2 seconds
        private static final String TAG = TrophyDetailsAndPhotosTests.class.getSimpleName();;

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
        public void noPictures() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity0();
            onView(withId(R.id.trophy_details_no_photo_text)).check(matches(withText(R.string.trophy_details_no_picture_at_location_text)));
        }

        @Test
        public void collectTrophyNoPicturesFarTrophy() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity3();
            onView(withText(R.string.trophy_details_no_picture_not_at_location_text)).check(matches(isDisplayed()));
        }


        @Test
        public void collectTrophywithPictures() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity();

            ViewInteraction collectTrophyButton = onView(
                    allOf(withId(R.id.trophy_action_button), withText("Collect Trophy"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    5),
                            isDisplayed()));
            collectTrophyButton.perform(click());

            onView(withText("You have collected this trophy")).inRoot(new ToastMatcher()).check(matches(isDisplayed()));
            onView(withId(R.id.trophy_action_button)).check(matches(withText("Take a Photo")));
            onView(withId(R.id.images_grid)).check(matches(isDisplayed()));
        }


        @Test
        public void addPictureAgain() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity2();
            TrophyDetailsUtils.stubImageCapture();

                ViewInteraction takeAPhotoButton = onView(
                        allOf(withId(R.id.trophy_action_button), withText("Take a Photo"),
                                childAtPosition(
                                        childAtPosition(
                                                withId(android.R.id.content),
                                                0),
                                        5),
                                isDisplayed()));
                takeAPhotoButton.perform(click());
                Date time1 = TrophyDetailsActivity.getPhotos ().get (0).getTime();
                Log.d(TAG, "Before replacing:" + time1);


                ViewInteraction replaceButton = onView(
                        allOf(withId(android.R.id.button1), withText("Replace"),
                                childAtPosition(
                                        childAtPosition(
                                                withId(androidx.appcompat.R.id.buttonPanel),
                                                0),
                                        3)));
                replaceButton.perform(scrollTo(), click());

                Log.d(TAG, "After replacing:" + TrophyDetailsActivity.getPhotos ().get (0));
                Assert.assertNotEquals(time1, TrophyDetailsActivity.getPhotos ().get (0).getTime());
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

        @Test
        public void addPictureAgainCancel() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity2();


            ViewInteraction materialButton = onView(
                    allOf(withId(R.id.trophy_action_button), withText("Take a Photo"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    5),
                            isDisplayed()));
            materialButton.perform(click());

            ViewInteraction materialButton2 = onView(
                    allOf(withId(android.R.id.button2), withText("Cancel"),
                            childAtPosition(
                                    childAtPosition(
                                            withId(androidx.appcompat.R.id.buttonPanel),
                                            0),
                                    2)));
            materialButton2.perform(scrollTo(), click());

            onView(withText("Cancel")).check(doesNotExist());

        }

        @Test
        public void sortBy() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity();

            onView(withId(R.id.sort_photos))
                    .check(matches(isDisplayed()))
                    .perform(click());

            onView(withText("Time")).check(matches(isDisplayed()));
            onView(withText("Like Number")).check(matches(isDisplayed()));
        }

        @Test
        public void sortByTime() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity();

                onView(withId(R.id.sort_photos))
                        .check(matches(isDisplayed()))
                        .perform(click());

            Date time1 = TrophyDetailsActivity.getPhotos ().get (0).getTime();
            Date time2 = TrophyDetailsActivity.getPhotos ().get (1).getTime();
            String id1 = TrophyDetailsActivity.getPhotos ().get (0).getPhotoId();
            String id2 = TrophyDetailsActivity.getPhotos ().get (1).getPhotoId();

            Log.d(TAG, "time1:" + time1);
            Log.d(TAG, "id1" + id1);
            Log.d(TAG, "time2:" + time2);
            Log.d(TAG, "id2:" + id2);

            onView(withText("Time"))
                    .inRoot(isDialog())
                    .perform(click());

            Assert.assertEquals(id1, TrophyDetailsActivity.getPhotos ().get (0).getPhotoId());
        }

        @Test
        public void sortByLike() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity();

            ViewInteraction sortButton = onView(
                    allOf(withId(R.id.sort_photos),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    6),
                            isDisplayed()));
            sortButton.perform(click());

            int numLike1 = TrophyDetailsActivity.getPhotos ().get (0).getNumberOfLikes();
            int numLike2 = TrophyDetailsActivity.getPhotos ().get (1).getNumberOfLikes();
            String id1 = TrophyDetailsActivity.getPhotos ().get (0).getPhotoId();
            String id2 = TrophyDetailsActivity.getPhotos ().get (1).getPhotoId();

            Log.d(TAG, "num of likes1:" + numLike1);
            Log.d(TAG, "id1" + id1);
            Log.d(TAG, "num of likes2:" + numLike2);
            Log.d(TAG, "id2:" + id2);

            onView(withText("Like Number"))
                    .inRoot(isDialog())
                    .perform(click());

            Assert.assertEquals(id1, TrophyDetailsActivity.getPhotos ().get (1).getPhotoId());
        }

        @Test
        public void mapButton() throws IOException {
            TrophyDetailsUtils.startTrophyDetailsActivity();

            ViewInteraction navigationButton = onView(
                    allOf(withId(R.id.trophy_details_maps_button),
                            childAtPosition(
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0),
                                    10),
                            isDisplayed()));
            navigationButton.perform(click());

            Assert.assertTrue(TrophyDetailsUtils.googleMaps());
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
                Log.d(TAG, "describeTo method");
            }
        }

    }
