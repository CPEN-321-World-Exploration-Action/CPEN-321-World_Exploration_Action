package com.worldexplorationaction.android.ui.trophy;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.gridlayout.widget.GridLayout;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.databinding.TrophyDetailsBinding;

import java.util.List;
import java.util.Objects;

public class TrophyDetailsActivity extends AppCompatActivity {
    private static final String TAG = TrophyDetailsActivity.class.getSimpleName();
    private static final String TROPHY_DETAILS_KEY = "TROPHY_DETAILS_KEY";
    private static final String USER_AT_LOCATION_KEY = "USER_AT_LOCATION_KEY";
    private static final String PHOTO_DETAILS_KEY = "PHOTO_DETAILS_KEY";
    private static final int REQUEST_IMAGE_CAPTURE = 1;
    GridLayout trophyGrid;
    private TrophyDetailsBinding binding;
    private TrophyDetailsViewModel viewModel;
    private boolean userAtLocation;
    private Photo photo;
    public String user_name;
    public String user_photo;

    public static void start(Context packageContext, Trophy trophy, Boolean userAtLocation) {
        Intent intent = new Intent(packageContext, TrophyDetailsActivity.class);
        intent.putExtra(TROPHY_DETAILS_KEY, trophy);
        intent.putExtra(USER_AT_LOCATION_KEY, userAtLocation);
        packageContext.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.binding = TrophyDetailsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        Trophy trophy = (Trophy) getIntent().getSerializableExtra(TROPHY_DETAILS_KEY);

        userAtLocation = getIntent().getBooleanExtra(USER_AT_LOCATION_KEY, false);

        trophyGrid = findViewById(R.id.images_grid);

        onNewTrophy(trophy);

        viewModel = new ViewModelProvider(this).get(TrophyDetailsViewModel.class);

        viewModel.getToastMessage().observe(this, this::onToastMessage);
        viewModel.getTrophyDetails().observe(this, this::onNewTrophy);
        viewModel.getTrophyCollected().observe(this, this::onCollectedUpdate);
        viewModel.getPhotos().observe(this, this::onNewPhotos);

        viewModel.setTrophyFromMap(trophy);

        viewModel.fetchTrophy(trophy.getId());
        viewModel.fetchTrophyPhotos(trophy.getId(), "random");
        binding.sortPhotos.setOnClickListener(this::onSortPhotoClicked);

        binding.trophyActionButton.setOnClickListener(this::onTrophyActionButtonClicked);

        if (!userAtLocation) {
            binding.trophyActionButton.setBackgroundColor(0xFFAAAAAA);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        viewModel.reloadPhotos();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        this.binding = null;
    }

    private void onToastMessage(String s) {
        if (s == null) {
            return;
        }
        Toast.makeText(this, s, Toast.LENGTH_LONG).show();
    }

    private void onSortPhotoClicked(View v) {
        new AlertDialog.Builder(this)
                .setTitle("Sort By")
                .setItems(new CharSequence[]{
                        "Time",
                        "Like Number"
                }, (dialog, which) -> {
                    String order = which == 0 ? "time" : "like";
                    viewModel.fetchTrophyPhotos(getTrophy().getId(), order);
                })
                .create().show();
    }

    private void onTrophyActionButtonClicked(View v) {
        if (!userAtLocation) {
            Toast.makeText(this, "You are too far away", Toast.LENGTH_SHORT).show();
            return;
        }
        if (Boolean.TRUE.equals(viewModel.getTrophyCollected().getValue())) {
            if (!viewModel.getUserHasTakenPhoto()) {
                dispatchTakePictureIntent();
            } else {
                new AlertDialog.Builder(this)
                        .setMessage("You have already taken a photo for this trophy. Do you want to replace the old one?")
                        .setPositiveButton("Replace", (d, w) -> dispatchTakePictureIntent())
                        .setNegativeButton("Cancel", null)
                        .create().show();
            }
        } else {
            viewModel.collectTrophy();
        }
    }

    private void onCollectedUpdate(boolean collected) {
        if (collected) {
            binding.trophyActionButton.setText("Take a Photo");
        }
    }

    private void onNewTrophy(Trophy trophy) {
        Log.i(TAG, "onNewTrophy " + trophy);
        if (trophy == null) {
            return;
        }
        binding.trophyNameEvaluate.setText(trophy.getTitle());
        binding.collectors.setText(String.valueOf(trophy.getNumberOfCollectors()));
    }

    private void onNewPhotos(List<Photo> photos) {
        Log.i(TAG, "onNewPhotos " + photos);
        if (photos.isEmpty()) {
            binding.imageView.setVisibility(View.GONE);
            binding.sortBy.setVisibility(View.GONE);
            binding.sortPhotos.setVisibility(View.GONE);
            binding.trophyDetailsNoPhotoText.setVisibility(View.VISIBLE);

            if (userAtLocation) {
                binding.trophyDetailsNoPhotoText.setText("Take a picture now to be the first one!");
            } else {
                binding.trophyDetailsNoPhotoText.setText("Seems nobody else has come to this place yet");
            }
        } else {
            binding.imageView.setVisibility(View.VISIBLE);
            binding.sortBy.setVisibility(View.VISIBLE);
            binding.sortPhotos.setVisibility(View.VISIBLE);
            binding.trophyDetailsNoPhotoText.setVisibility(View.GONE);
        }

        for (int i = 0; i < trophyGrid.getChildCount(); i++) {
            ImageView imageView = (ImageView) trophyGrid.getChildAt(i);
            int index = i;
            if (i < photos.size()) {
                String url = photos.get(i).getPhotoUrl();
                String id = photos.get(i).getPhotoId();
                int likes = photos.get(i).getNumberOfLikes();
                Glide.with(this)
                        .load(url)
                        .placeholder(R.drawable.ic_default_avatar_35dp)
                        .into(imageView);
                imageView.setOnClickListener(v -> {
                    Intent evaluate_photo_intent = new Intent(TrophyDetailsActivity.this, evaluate_photo.class);
                    evaluate_photo_intent.putExtra("photoUrl", url);
                    evaluate_photo_intent.putExtra("photoId", id);
                    evaluate_photo_intent.putExtra(PHOTO_DETAILS_KEY, photos.get(index));
                    evaluate_photo_intent.putExtra("title", getTrophy().getTitle());
                    evaluate_photo_intent.putExtra("likes", likes);
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
            Toast.makeText(this, e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_IMAGE_CAPTURE) {
            if (resultCode == RESULT_OK) {
                Bitmap photo = (Bitmap) data.getExtras().get("data");
                viewModel.uploadPhoto(photo);
            } else if (resultCode == RESULT_CANCELED) {
                Toast.makeText(this, "No photo taken", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(this, "Error: resultCode=" + resultCode, Toast.LENGTH_LONG).show();
            }
        } else {
            Toast.makeText(this, "Unknown requestCode=" + requestCode, Toast.LENGTH_LONG).show();
        }
    }

    private Trophy getTrophy() {
        return Objects.requireNonNull(viewModel.getTrophyDetails().getValue());
    }
}