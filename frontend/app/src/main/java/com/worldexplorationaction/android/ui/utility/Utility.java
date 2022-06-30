package com.worldexplorationaction.android.ui.utility;

import android.app.Activity;
import android.graphics.Rect;
import android.util.Log;
import android.view.Window;

import androidx.annotation.NonNull;

public class Utility {
    private static final String TAG = Utility.class.getSimpleName();

    /**
     * Get the height of the status bar in an activity.
     * Source: https://stackoverflow.com/a/3356263
     *
     * @param activity where the height of the status bar will be obtained from.
     * @return height of the status bar in the activity.
     */
    public static int getStatusBarHeight(@NonNull Activity activity) {
        Rect rectangle = new Rect();
        Window window = activity.getWindow();
        window.getDecorView().getWindowVisibleDisplayFrame(rectangle);
        int contentViewTop = window.findViewById(Window.ID_ANDROID_CONTENT).getTop();
        int statusBarHeight = rectangle.top - contentViewTop;
        Log.d(TAG, "Height of status bar: " + statusBarHeight);
        return statusBarHeight;
    }
}
