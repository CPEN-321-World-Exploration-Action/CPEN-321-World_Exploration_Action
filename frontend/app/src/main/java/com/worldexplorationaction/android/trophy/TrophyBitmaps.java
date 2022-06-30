package com.worldexplorationaction.android.trophy;

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
import com.worldexplorationaction.android.ui.utility.Utility;

import java.util.Objects;

public class TrophyBitmaps {
    public final BitmapDescriptor goldBitmapDescriptor;
    public final BitmapDescriptor silverBitmapDescriptor;
    public final BitmapDescriptor bronzeBitmapDescriptor;

    public TrophyBitmaps(Resources resources) {
        Drawable trophy = ResourcesCompat.getDrawable(resources, R.drawable.ic_map_trophy, null);
        Objects.requireNonNull(trophy);

        int gold = resources.getColor(R.color.map_trophy_gold, null);
        int silver = resources.getColor(R.color.map_trophy_silver, null);
        int bronze = resources.getColor(R.color.map_trophy_bronze, null);

        Bitmap goldBitmap = Utility.getBitmapFromVectorDrawable((VectorDrawable) trophy, new PorterDuffColorFilter(gold, PorterDuff.Mode.SRC_IN));
        Bitmap silverBitmap = Utility.getBitmapFromVectorDrawable((VectorDrawable) trophy, new PorterDuffColorFilter(silver, PorterDuff.Mode.SRC_IN));
        Bitmap bronzeBitmap = Utility.getBitmapFromVectorDrawable((VectorDrawable) trophy, new PorterDuffColorFilter(bronze, PorterDuff.Mode.SRC_IN));

        goldBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(goldBitmap);
        silverBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(silverBitmap);
        bronzeBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bronzeBitmap);
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
