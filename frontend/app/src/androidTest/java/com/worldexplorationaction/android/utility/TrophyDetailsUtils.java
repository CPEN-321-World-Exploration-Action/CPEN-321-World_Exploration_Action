package com.worldexplorationaction.android.utility;

import static androidx.test.espresso.intent.Intents.intending;
import static androidx.test.espresso.intent.matcher.IntentMatchers.hasAction;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.provider.MediaStore;

import androidx.test.core.app.ActivityScenario;
import androidx.test.core.app.ApplicationProvider;
import androidx.test.platform.app.InstrumentationRegistry;

import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.trophy.TrophyBitmaps;
import com.worldexplorationaction.android.data.trophy.TrophyService;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.ui.trophy.TrophyDetailsActivity;

import java.io.IOException;

public class TrophyDetailsUtils {
    private static final Trophy trophy = new Trophy("ChIJAx7UL8xyhlQR86Iqc-fUncc", "The University of British Columbia",
            49.26060520000001, -123.2459939, 1, Trophy.Quality.GOLD, false);

    public static void stubImageCapture() {
        Resources resources = InstrumentationRegistry.getInstrumentation().getTargetContext().getResources();

        Intent resultData = new Intent();
        Bitmap photo = new TrophyBitmaps(resources).goldBitmap;
        resultData.putExtra("data", photo);

        Instrumentation.ActivityResult result = new Instrumentation.ActivityResult(Activity.RESULT_OK, resultData);

        intending(hasAction(MediaStore.ACTION_IMAGE_CAPTURE)).respondWith(result);
    }

    public static void startTrophyDetailsActivity() throws IOException {
        UserService.getService().testerLogin().execute();
        TrophyService.getService().resetTrophyUser().execute();
        Intent intent = TrophyDetailsActivity.getIntent(ApplicationProvider.getApplicationContext(), trophy, true);
        ActivityScenario.launch(intent);
    }

    public static void startTrophyDetailsActivity1() throws IOException {
        UserService.getService().testerLogin().execute();
        TrophyService.getService().resetTrophyUser().execute();
        Intent intent = TrophyDetailsActivity.getIntent(ApplicationProvider.getApplicationContext(), trophy, false);
        ActivityScenario.launch(intent);
    }
}
