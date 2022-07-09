package com.worldexplorationaction.android.ui.trophy;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.worldexplorationaction.android.R;

public class evaluate_photo extends AppCompatActivity {

    ImageView evaluatePhoto;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.evaluate_photos);
        //evaluatePhoto = findViewById(R.id.evaluate_photo);

        Bundle b2=getIntent().getExtras();
        if(b2!=null)
        {
            showImage(b2.getInt("id"));
        }
    }

    private void showImage(int id) {
        Toast.makeText(evaluate_photo.this, "id" + id, Toast.LENGTH_LONG).show();
        //evaluatePhoto=


    }

}
