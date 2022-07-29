package com.worldexplorationaction.android.utility;

import static androidx.test.espresso.intent.Intents.intending;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasAction;
import static androidx.test.espresso.intent.matcher.IntentMatchers.isInternal;

import static org.hamcrest.Matchers.not;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;

import androidx.appcompat.app.AppCompatActivity;
import androidx.test.core.app.ActivityScenario;
import androidx.test.core.app.ApplicationProvider;
import androidx.test.platform.app.InstrumentationRegistry;

import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.photo.PhotoService;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.trophy.TrophyBitmaps;
import com.worldexplorationaction.android.data.trophy.TrophyService;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.ui.trophy.EvaluatePhotoViewModel;
import com.worldexplorationaction.android.ui.trophy.TrophyDetailsActivity;

import java.io.IOException;
import java.util.List;

public class TrophyDetailsUtils {
    private static final Trophy trophy = new Trophy("ChIJAx7UL8xyhlQR86Iqc-fUncc", "The University of British Columbia",
            49.26060520000001, -123.2459939, 1, Trophy.Quality.GOLD, false);

    private static final Trophy trophy0 = new Trophy("ChIJycSMzHhxhlQRla5R4ZvYGEg", "St Regis Hotel",
            49.2830636, -123.1158965, 0, Trophy.Quality.GOLD, false);

    private static final Trophy trophy1 = new Trophy("ChIJycSMzHhxhlQRla5R4ZvYGEg", "St Regis Hotel",
            49.2830636, -123.1158965, 0, Trophy.Quality.GOLD, true);

    private static final Trophy trophy2 = new Trophy("ChIJgQmKXX9xhlQRXmNfRsbZ4w4", "Rosewood Hotel Georgia",
            49.28346500000001, -123.119031, 2, Trophy.Quality.GOLD, true);

    public static Intent stubImageCapture() {
        Resources resources = InstrumentationRegistry.getInstrumentation().getTargetContext().getResources();

        Intent resultData = new Intent();
        Bitmap photo = new TrophyBitmaps(resources).goldBitmap;
        resultData.putExtra("data", photo);
        Instrumentation.ActivityResult result = new Instrumentation.ActivityResult(Activity.RESULT_OK, resultData);
        intending(hasAction(MediaStore.ACTION_IMAGE_CAPTURE)).respondWith(result);
        return resultData;
    }

    public static boolean googleMaps() {

        Uri uri = Uri.parse("https://www.google.com/maps/search/");
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, uri);
        mapIntent.setPackage("com.google.android.apps.maps");
        intending(not(isInternal())).respondWith(new Instrumentation.ActivityResult(Activity.RESULT_OK, null));
        return true;
    }



    public static void startTrophyDetailsActivity() throws IOException {
        UserService.getService().testerLogin().execute();
        TrophyService.getService().resetTrophyUser().execute();
        Intent intent = TrophyDetailsActivity.getIntent(ApplicationProvider.getApplicationContext(), trophy, true);
        ActivityScenario.launch(intent);
    }


    public static void startTrophyDetailsActivity0() throws IOException {
        UserService.getService().testerLogin().execute();
        TrophyService.getService().resetTrophyUser().execute();
        Intent intent = TrophyDetailsActivity.getIntent(ApplicationProvider.getApplicationContext(), trophy0, true);
        ActivityScenario.launch(intent);
    }

    public static void startTrophyDetailsActivity2() throws IOException {
        UserService.getService().testerLogin().execute();
        TrophyService.getService().resetTrophyUser().execute();
        Intent intent = TrophyDetailsActivity.getIntent(ApplicationProvider.getApplicationContext(), trophy2, true);
        ActivityScenario.launch(intent);
    }

    public static void startTrophyDetailsActivity1() throws IOException {
        UserService.getService().testerLogin().execute();
        TrophyService.getService().resetTrophyUser().execute();
        Intent intent = TrophyDetailsActivity.getIntent(ApplicationProvider.getApplicationContext(), trophy, false);
        ActivityScenario.launch(intent);
    }


    public static void startTrophyDetailsActivity3() throws IOException {
        UserService.getService().testerLogin().execute();
        TrophyService.getService().resetTrophyUser().execute();
        Intent intent = TrophyDetailsActivity.getIntent(ApplicationProvider.getApplicationContext(), trophy1, false);
        ActivityScenario.launch(intent);
    }
}
