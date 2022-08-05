package com.worldexplorationaction.android.ui.utility;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.util.Size;
import android.util.TypedValue;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.maps.model.LatLng;

public class CommonUtils {
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

    /**
     * Convert Density-independent Pixels to Pixels
     */
    public static float dpToPx(Resources resources, float dp) {
        return TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                dp,
                resources.getDisplayMetrics()
        );
    }

    /**
     * Convert a drawable to a bitmap
     *
     * @param drawable    source drawable
     * @param size        the size of the bitmap. If null is provided,
     *                    the size will be the intrinsic size of the drawable
     * @param colorFilter color filter to apply, may be null.
     * @return the bitmap containing the image as defined in the drawable
     */
    public static Bitmap getBitmapFromVectorDrawable(Drawable drawable, @Nullable Size size, @Nullable ColorFilter colorFilter) {
        if (size == null) {
            size = new Size(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
        }
        Bitmap bitmap = Bitmap.createBitmap(size.getWidth(), size.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        if (colorFilter != null) {
            drawable.setColorFilter(colorFilter);
        }
        drawable.draw(canvas);
        return bitmap;
    }

    public static float getDistance(Location location, LatLng latLng) {
        Location location2 = new Location(location);
        location2.setLatitude(latLng.latitude);
        location2.setLongitude(latLng.longitude);
        return location.distanceTo(location2);
    }

    public static boolean isRunningUiTest() {
        try {
            Class.forName("androidx.test.espresso.Espresso");
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }
}
