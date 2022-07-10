package com.worldexplorationaction.android.ui.trophy;



import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.MainActivity;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.databinding.FragmentProfileBinding;
import com.worldexplorationaction.android.ui.profile.ProfileActivity;
import com.worldexplorationaction.android.ui.profile.ProfileFragment;
import com.worldexplorationaction.android.ui.profile.ProfileViewModel;

import java.util.List;

public class trophy_details extends AppCompatActivity {
    private FragmentProfileBinding binding;
    private static final String TAG = trophy_details.class.getSimpleName();
    TextView trophyName;
    TextView collectorsNumber;
    private Button collectTrophyButton;
    ImageButton sortPhotos;
    ImageButton trophyImage1;
    ImageButton trophyImage2;
    ImageButton trophyImage3;
    ImageButton trophyImage4;
    ImageButton trophyImage5;
    ImageButton trophyImage6;
    /*
    private static final int[] BUTTONS = {
            R.id.trophy_image1,
            R.id.trophy_image2,
            R.id.trophy_image3,
            R.id.trophy_image4,
            R.id.trophy_image5,
            R.id.trophy_image6
};
*/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // requestWindowFeature(Window.FEATURE_NO_TITLE);
        //this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.trophy_details);

        sortPhotos = findViewById(R.id.sort_photos);
        collectorsNumber = findViewById(R.id.collectors);

        trophyName = findViewById(R.id.trophy_name_evaluate);
        //trophyName.setText(trophyTitle);

        collectTrophyButton = findViewById(R.id.collect_trophy_button);
        collectTrophyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent collecTrophyIntent = new Intent(trophy_details.this, collect_trophy.class);
                startActivity(collecTrophyIntent);
            }
        });
        //dummy images
    /*    trophyImage1 = findViewById(R.id.trophy_image1);
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
        trophyImage6.setImageResource(R.drawable.t2);*/
/*
        for (int i =0; i< BUTTONS.length; i++){
            ImageButton button = findViewById (BUTTONS[i]);
            button.setOnClickListener
                    (new View.OnClickListener()
                     {
                         public void onClick (View v)
                         {
                             Drawable drawable = button.getDrawable();
                             Bitmap bitmap = ((BitmapDrawable)drawable).getBitmap();
                             Intent evaluate_photo_intent = new Intent(trophy_details.this, evaluate_photo.class);
                             //evaluate_photo_intent.putExtra("Bitmap", bitmap);
                             //startActivity(evaluate_photo_intent);
                             test.setImageBitmap(bitmap);
                         }
                     }
                    );

        }
*/
        TrophyDetailsViewModel viewModel =
                new ViewModelProvider(this).get(TrophyDetailsViewModel.class);

        viewModel.getTrophyDetails().observe(this, this::onNewTrophy);

        viewModel.fetchTrophy(viewModel.getTrophyDetails().getValue().getId());
        sortPhotos.setOnClickListener(v -> {
                viewModel.fetchTrophyPhotos(viewModel.getTrophyDetails().getValue().getId(),
                        "time");
            });
        }


    private void onNewTrophy(Trophy trophy) {

        if (trophy == null) {
            return;
        }
        trophyName.setText(trophy.getTitle());
        collectorsNumber.setText(trophy.getNumberOfCollectors());

    }

    

    public void onClick(View v) {
        switch (v.getId())
        {
            case R.id.trophy_image1:
                ImageButton button1 = findViewById (R.id.trophy_image1);
                Drawable drawable1 = button1.getDrawable();
                Bitmap bitmap1 = ((BitmapDrawable)drawable1).getBitmap();
                Intent evaluate_photo_intent1 = new Intent(trophy_details.this, evaluate_photo.class);
                evaluate_photo_intent1.putExtra("Bitmap", bitmap1);
                startActivity(evaluate_photo_intent1);
                break;
            case R.id.trophy_image2:
                ImageButton button2 = findViewById (R.id.trophy_image2);
                Drawable drawable2 = button2.getDrawable();
                Bitmap bitmap2 = ((BitmapDrawable)drawable2).getBitmap();
                Intent evaluate_photo_intent2 = new Intent(trophy_details.this, evaluate_photo.class);
                evaluate_photo_intent2.putExtra("Bitmap", bitmap2);
                startActivity(evaluate_photo_intent2);
                break;
            case R.id.trophy_image3:
                ImageButton button3 = findViewById (R.id.trophy_image3);
                Drawable drawable3 = button3.getDrawable();
                Bitmap bitmap3 = ((BitmapDrawable)drawable3).getBitmap();
                Intent evaluate_photo_intent3 = new Intent(trophy_details.this, evaluate_photo.class);
                evaluate_photo_intent3.putExtra("Bitmap", bitmap3);
                startActivity(evaluate_photo_intent3);
                break;
            case R.id.trophy_image4:
                ImageButton button4 = findViewById (R.id.trophy_image4);
                Drawable drawable4 = button4.getDrawable();
                Bitmap bitmap4 = ((BitmapDrawable)drawable4).getBitmap();
                Intent evaluate_photo_intent4 = new Intent(trophy_details.this, evaluate_photo.class);
                evaluate_photo_intent4.putExtra("Bitmap", bitmap4);
                startActivity(evaluate_photo_intent4);
                break;
            case R.id.trophy_image5:
                ImageButton button5 = findViewById (R.id.trophy_image5);
                Drawable drawable5 = button5.getDrawable();
                Bitmap bitmap5 = ((BitmapDrawable)drawable5).getBitmap();
                Intent evaluate_photo_intent5 = new Intent(trophy_details.this, evaluate_photo.class);
                evaluate_photo_intent5.putExtra("Bitmap", bitmap5);
                startActivity(evaluate_photo_intent5);
                break;
            case R.id.trophy_image6:
                ImageButton button6 = findViewById (R.id.trophy_image6);
                Drawable drawable6 = button6.getDrawable();
                Bitmap bitmap6 = ((BitmapDrawable)drawable6).getBitmap();
                Intent evaluate_photo_intent6 = new Intent(trophy_details.this, evaluate_photo.class);
                evaluate_photo_intent6.putExtra("Bitmap", bitmap6);
                startActivity(evaluate_photo_intent6);
                break;
        }
    }
}
