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
import android.widget.GridLayout;
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
    GridLayout trophyGrid;
    private Button collectTrophyButton;
    ImageButton sortPhotos;
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

        sortPhotos = findViewById(R.id.sort_photos);
        collectorsNumber = findViewById(R.id.collectors);
        trophyGrid = findViewById(R.id.trophy_images_grid);

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

        for (int i =0; i< trophyGrid.getChildCount(); i++){
            ImageButton button = (ImageButton) trophyGrid.getChildAt(i);
            button.setOnClickListener
                    (new View.OnClickListener()
                     {
                         public void onClick (View v)
                         {
                             Drawable drawable = button.getDrawable();
                             Bitmap bitmap = ((BitmapDrawable)drawable).getBitmap();
                             Intent evaluate_photo_intent = new Intent(trophy_details.this, evaluate_photo.class);
                             evaluate_photo_intent.putExtra("Bitmap", bitmap);
                             startActivity(evaluate_photo_intent);
                         }
                     }
                    );

        }

        TrophyDetailsViewModel viewModel =
                new ViewModelProvider(this).get(TrophyDetailsViewModel.class);

        viewModel.getTrophyDetails().observe(this, this::onNewTrophy);
        viewModel.getPhotos().observe(this, this::onNewPhotos);

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

    private void onNewPhotos(List<Photo> photos) {
        for (int i = 0; i < trophyGrid.getChildCount(); i++) {
            ImageView imageView = (ImageView) trophyGrid.getChildAt(i);
            if (i < photos.size()) {
                Glide.with(this)
                        .load(photos.get(i).getPhotoUrl())
                        .placeholder(R.drawable.ic_default_avatar_35dp)
                        .into(imageView);
            } else {
                Glide.with(this)
                        .clear(imageView);
            }
        }
    }

}
