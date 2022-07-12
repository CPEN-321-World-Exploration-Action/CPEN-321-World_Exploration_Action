package com.worldexplorationaction.android.ui.utility;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.drawable.VectorDrawable;
import android.location.Location;
import android.util.TypedValue;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.maps.model.LatLng;

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
     * Convert a vector drawable to a bitmap
     *
     * @param drawable    source drawable
     * @param colorFilter color filter to apply, may be null.
     * @return the bitmap containing the image as defined in the drawable
     */
    public static Bitmap getBitmapFromVectorDrawable(VectorDrawable drawable, @Nullable ColorFilter colorFilter) {
        Bitmap bitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
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
}
