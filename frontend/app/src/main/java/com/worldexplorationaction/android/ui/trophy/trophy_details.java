package com.worldexplorationaction.android.ui.trophy;



import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Html;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import com.worldexplorationaction.android.R;

public class trophy_details extends AppCompatActivity {

    TextView trophyName;
    private Button collectTrophyButton;
    ImageButton trophyImage1;
    ImageButton trophyImage2;
    ImageButton trophyImage3;
    ImageButton trophyImage4;
    ImageButton trophyImage5;
    ImageButton trophyImage6;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
       // requestWindowFeature(Window.FEATURE_NO_TITLE);
        //this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.trophy_details);
        trophyName=findViewById(R.id.trophy_name);
        trophyName.setText(trophyTitle);

        collectTrophyButton = findViewById(R.id.collect_trophy_button);
        collectTrophyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent collecTrophyIntent = new Intent (trophy_details.this, collect_trophy.class);
                startActivity(collecTrophyIntent);
            }
        });
        //dummy images
        trophyImage1 = findViewById(R.id.trophy_image1);
        trophyImage2 = findViewById(R.id.trophy_image2);
        trophyImage3 = findViewById(R.id.trophy_image3);
        trophyImage4 = findViewById(R.id.trophy_image4);
        trophyImage5 = findViewById(R.id.trophy_image5);
        trophyImage6 = findViewById(R.id.trophy_image6);

        trophyImage1.setImageResource(R.drawable.t1);
        trophyImage2.setImageResource(R.drawable.t2);
        trophyImage3.setImageResource(R.drawable.t3);
        trophyImage4.setImageResource(R.drawable.t3);
        trophyImage5.setImageResource(R.drawable.t1);
        trophyImage6.setImageResource(R.drawable.t2);

        trophyImage1.setOnClickListener
                (new View.OnClickListener()
                 {
                     public void onClick(View v)
                     {
                         if(v.getId()==R.id.trophy_image1)
                         {
                             startActivity(new Intent(trophy_details.this,evaluate_photo.class).putExtra("id",1));
                         }
                     }
                 }
                );

        trophyImage2.setOnClickListener
                (new View.OnClickListener()
                 {
                     public void onClick(View v)
                     {
                         if(v.getId()==R.id.trophy_image2)
                         {
                             startActivity(new Intent(trophy_details.this,evaluate_photo.class).putExtra("id",2));
                         }
                     }
                 }
                );

    }
}
