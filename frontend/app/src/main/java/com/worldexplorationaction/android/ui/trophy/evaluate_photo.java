package com.worldexplorationaction.android.ui.trophy;

import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.worldexplorationaction.android.R;

public class evaluate_photo extends AppCompatActivity {

    ImageView evaluatePhoto;
    TextView trophyName1;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.evaluate_photos);
        trophyName1=findViewById(R.id.trophy_name_evaluate);
        trophyName1.setText(trophyTitle);
        evaluatePhoto = (ImageView) findViewById(R.id.evaluated_photo);
        Intent intent = getIntent();
        Bitmap bitmap = (Bitmap) intent.getParcelableExtra("Bitmap");
        evaluatePhoto.setImageBitmap(bitmap);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        //Clear the Activity's bundle of the subsidiary fragments' bundles.
        outState.clear();
    }

}
