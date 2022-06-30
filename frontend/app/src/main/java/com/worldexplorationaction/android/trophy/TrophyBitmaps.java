package com.worldexplorationaction.android.trophy;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.worldexplorationaction.android.R;

public class TrophyBitmaps {
    public final Bitmap goldTrophyBitmap;
    public final BitmapDescriptor goldTrophyBitmapDescriptor;

    public TrophyBitmaps(Resources resources) {
        goldTrophyBitmap = BitmapFactory.decodeResource(resources, R.mipmap.ic_trophy_gold);
        goldTrophyBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(goldTrophyBitmap);
    }
}
