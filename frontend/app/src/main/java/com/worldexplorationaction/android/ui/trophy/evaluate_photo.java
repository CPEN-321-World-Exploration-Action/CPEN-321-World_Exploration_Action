package com.worldexplorationaction.android.ui.trophy;

import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.worldexplorationaction.android.R;

public class evaluate_photo extends AppCompatActivity {

    ImageView evaluatePhoto;
    TextView trophyName1;
    ImageButton like;
    TextView like_number;
    int score = 0;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.evaluate_photos);

        like = findViewById(R.id.like_button);
        like_number = findViewById(R.id.number);

        trophyName1=findViewById(R.id.trophy_name_evaluate);
        trophyName1.setText(trophyTitle);

        evaluatePhoto = (ImageView) findViewById(R.id.evaluated_photo);
        Intent intent = getIntent();
        Bitmap bitmap = (Bitmap) intent.getParcelableExtra("Bitmap");
        evaluatePhoto.setImageBitmap(bitmap);

        like.setOnClickListener
                (new View.OnClickListener()
                 {
                     public void onClick (View v)
                     {
                         Integer integer = (Integer) like.getTag();
                         integer = integer == null ? 0 : integer;

                         switch(integer) {
                             case R.drawable.active_like:
                                 like.setImageResource(R.drawable.inactive_like);
                                 like.setTag(R.drawable.inactive_like);
                                 score--;
                                 String num1 = String.valueOf(score);
                                 like_number.setText(num1);
                                 break;
                             case R.drawable.inactive_like:
                             default:
                                 like.setImageResource(R.drawable.active_like);
                                 like.setTag(R.drawable.active_like);
                                 score++;
                                 String num = String.valueOf(score);
                                 like_number.setText(num);
                                 break;
                         }
                     }
                 }
                );
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        //Clear the Activity's bundle of the subsidiary fragments' bundles.
        outState.clear();
    }

}
