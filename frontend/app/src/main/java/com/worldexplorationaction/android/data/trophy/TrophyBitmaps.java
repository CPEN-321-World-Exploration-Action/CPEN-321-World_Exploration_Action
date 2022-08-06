package com.worldexplorationaction.android.data.trophy;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;

import androidx.core.content.res.ResourcesCompat;

import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.ui.utility.CommonUtils;

/**
 * Manager of {@link BitmapDescriptor}s for images of different types of trophies.
 */
public class TrophyBitmaps {
    public final Bitmap goldBitmap;
    public final Bitmap silverBitmap;
    public final Bitmap bronzeBitmap;
    public final BitmapDescriptor goldBitmapDescriptor;
    public final BitmapDescriptor silverBitmapDescriptor;
    public final BitmapDescriptor bronzeBitmapDescriptor;

    public TrophyBitmaps(Resources resources) {
        Drawable goldDrawable = ResourcesCompat.getDrawable(resources, R.drawable.ic_map_trophy_gold, null);
        Drawable silverDrawable = ResourcesCompat.getDrawable(resources, R.drawable.ic_map_trophy_silver, null);
        Drawable bronzeDrawable = ResourcesCompat.getDrawable(resources, R.drawable.ic_map_trophy_bronze, null);

        this.goldBitmap = CommonUtils.getBitmapFromVectorDrawable(goldDrawable, null, null);
        this.silverBitmap = CommonUtils.getBitmapFromVectorDrawable(silverDrawable, null, null);
        this.bronzeBitmap = CommonUtils.getBitmapFromVectorDrawable(bronzeDrawable, null, null);

        this.goldBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(goldBitmap);
        this.silverBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(silverBitmap);
        this.bronzeBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bronzeBitmap);
    }

    public BitmapDescriptor getBitmapDescriptorForTrophy(Trophy.Quality quality) {
        switch (quality) {
            case GOLD:
                return goldBitmapDescriptor;
            case SILVER:
                return silverBitmapDescriptor;
            case BRONZE:
                return bronzeBitmapDescriptor;
            default:
                throw new IllegalArgumentException("Unknown quality");
        }
    }
}
