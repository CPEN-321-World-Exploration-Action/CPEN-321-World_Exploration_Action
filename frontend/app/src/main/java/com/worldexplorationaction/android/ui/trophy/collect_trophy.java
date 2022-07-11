package com.worldexplorationaction.android.ui.trophy;

import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.GridLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.ui.friends.FriendsViewModel;

import java.util.List;

public class collect_trophy extends AppCompatActivity {

    TextView trophyName;
    TextView collectorsNumber;
    GridLayout trophyGrid;
    ImageButton sortPhotos;
    ImageButton buttonCapture;
    private CollectTrophyViewModel viewModel;
    static final int REQUEST_IMAGE_CAPTURE = 1;
    private static final String TAG = collect_trophy.class.getSimpleName();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.collect_trophy);

        sortPhotos = findViewById(R.id.sort_photos_collect);
        collectorsNumber = findViewById(R.id.collectors1);
        trophyGrid = findViewById(R.id.collect_images_grid);
        trophyName=findViewById(R.id.trophy_name_collect);
        //trophyName.setText(trophyTitle);

        this.viewModel =
                new ViewModelProvider(this).get(CollectTrophyViewModel.class);

        buttonCapture = findViewById(R.id.button_capture);
        buttonCapture.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                dispatchTakePictureIntent();
            }
        });

        viewModel.getTrophyDetails().observe(this, this::onNewTrophy);
        viewModel.getPhotos().observe(this, this::onNewPhotos);
        viewModel.fetchTrophy(viewModel.getTrophyDetails().getValue().getId());
        //evaluatePhotos(List<Photo> photos)

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
                String url = photos.get(i).getPhotoUrl();
                Glide.with(this)
                        .load(url)
                        .placeholder(R.drawable.ic_default_avatar_35dp)
                        .into(imageView);
                imageView.setOnClickListener(v -> {
                    Intent evaluate_photo_intent = new Intent(collect_trophy.this, evaluate_photo.class);
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

    private void dispatchTakePictureIntent() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        try {
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        } catch (ActivityNotFoundException e) {
            // display error state to the user
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            Toast.makeText(collect_trophy.this, "Image is taken successfully", Toast.LENGTH_LONG).show();
            viewModel.uploadPhoto(viewModel.getUserProfile().getValue().getId(),
                                  viewModel.getTrophyDetails().getValue().getId(), "");

        }
    }

}