package com.worldexplorationaction.android.ui.utility;

import android.content.res.Resources;

import androidx.annotation.NonNull;

public class Utility {
    private static final String TAG = Utility.class.getSimpleName();

    /**
     * Get the height of the status bar in an activity.
     * Source: https://stackoverflow.com/a/3356263
     *
     * @param resources where the height of the status bar will be obtained from.
     * @return height of the status bar in the activity.
     */
    public static int getStatusBarHeight(@NonNull Resources resources) {
        int resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            return resources.getDimensionPixelSize(resourceId);
        } else {
            return 0;
        }
    }
}
