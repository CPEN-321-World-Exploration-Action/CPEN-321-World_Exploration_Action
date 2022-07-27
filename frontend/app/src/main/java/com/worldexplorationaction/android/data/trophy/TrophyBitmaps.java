package com.worldexplorationaction.android.data.trophy;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.VectorDrawable;

import androidx.core.content.res.ResourcesCompat;

import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.ui.utility.CommonUtils;

import java.util.Objects;

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
        Drawable trophy = ResourcesCompat.getDrawable(resources, R.drawable.ic_map_trophy, null);
        Objects.requireNonNull(trophy);

        int gold = resources.getColor(R.color.map_trophy_gold, null);
        int silver = resources.getColor(R.color.map_trophy_silver, null);
        int bronze = resources.getColor(R.color.map_trophy_bronze, null);

        this.goldBitmap = CommonUtils.getBitmapFromVectorDrawable((VectorDrawable) trophy, new PorterDuffColorFilter(gold, PorterDuff.Mode.SRC_IN));
        this.silverBitmap = CommonUtils.getBitmapFromVectorDrawable((VectorDrawable) trophy, new PorterDuffColorFilter(silver, PorterDuff.Mode.SRC_IN));
        this.bronzeBitmap = CommonUtils.getBitmapFromVectorDrawable((VectorDrawable) trophy, new PorterDuffColorFilter(bronze, PorterDuff.Mode.SRC_IN));

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
