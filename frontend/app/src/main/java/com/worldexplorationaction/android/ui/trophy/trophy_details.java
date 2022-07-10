package com.worldexplorationaction.android.ui.trophy;



import androidx.appcompat.app.AppCompatActivity;
import androidx.gridlayout.widget.GridLayout;
import androidx.lifecycle.ViewModelProvider;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
//import android.gridlayout.widget.GridLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.databinding.FragmentProfileBinding;

import java.util.List;

public class trophy_details extends AppCompatActivity {
    private FragmentProfileBinding binding;
    private static final String TAG = trophy_details.class.getSimpleName();
    TextView trophyName;
    TextView collectorsNumber;
    GridLayout trophyGrid;
    private Button collectTrophyButton;
    ImageButton sortPhotos;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.trophy_details);

        sortPhotos = findViewById(R.id.sort_photos);
        collectorsNumber = findViewById(R.id.collectors);
        trophyGrid = findViewById(R.id.images_grid);

        trophyName = findViewById(R.id.trophy_name_evaluate);
        //trophyName.setText(trophyTitle);

        collectTrophyButton = findViewById(R.id.collect_trophy_button);

        TrophyDetailsViewModel viewModel =
                new ViewModelProvider(this).get(TrophyDetailsViewModel.class);

        viewModel.getTrophyDetails().observe(this, this::onNewTrophy);
        viewModel.getPhotos().observe(this, this::onNewPhotos);

        viewModel.fetchTrophy(viewModel.getTrophyDetails().getValue().getId());
        sortPhotos.setOnClickListener(v -> {
                viewModel.fetchTrophyPhotos(viewModel.getTrophyDetails().getValue().getId(),
                        "time");
            });

        collectTrophyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewModel.collectTrophy(viewModel.getUserProfile().getValue().getId(),
                        viewModel.getTrophyDetails().getValue().getId());
                Intent collecTrophyIntent = new Intent(trophy_details.this, collect_trophy.class);
                startActivity(collecTrophyIntent);
            }
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
                String url = photos.get(i).getPhotoUrl();
                Glide.with(this)
                        .load(url)
                        .placeholder(R.drawable.ic_default_avatar_35dp)
                        .into(imageView);
                imageView.setOnClickListener(v -> {
                    Intent evaluate_photo_intent = new Intent(trophy_details.this, evaluate_photo.class);
                    evaluate_photo_intent.putExtra("photoUrl", url);
                    startActivity(evaluate_photo_intent);
                });
            } else {
                Glide.with(this)
                        .clear(imageView);
                imageView.setClickable(false);
            }
        }
    }

}
