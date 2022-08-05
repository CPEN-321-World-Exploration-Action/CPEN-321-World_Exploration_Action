package com.worldexplorationaction.android.ui.trophy;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.animation.AnimationUtils;
import android.view.animation.DecelerateInterpolator;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.ColorRes;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.gridlayout.widget.GridLayout;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.databinding.TrophyDetailsBinding;

import java.util.List;
import java.util.Objects;

public class TrophyDetailsActivity extends AppCompatActivity {
    private static final String TAG = TrophyDetailsActivity.class.getSimpleName();
    private static final String TROPHY_DETAILS_KEY = "TROPHY_DETAILS_KEY";
    private static final String USER_AT_LOCATION_KEY = "USER_AT_LOCATION_KEY";
    private static final int REQUEST_IMAGE_CAPTURE = 1;
    private static TrophyDetailsViewModel viewModel;
    GridLayout trophyGrid;
    private TrophyDetailsBinding binding;
    private boolean userAtLocation;

    public static void start(Context packageContext, Trophy trophy, Boolean userAtLocation) {
        packageContext.startActivity(getIntent(packageContext, trophy, userAtLocation));
    }

    public static Intent getIntent(Context packageContext, Trophy trophy, Boolean userAtLocation) {
        System.out.println("AAAAAA" + trophy);
        Intent intent = new Intent(packageContext, TrophyDetailsActivity.class);
        intent.putExtra(TROPHY_DETAILS_KEY, trophy);
        intent.putExtra(USER_AT_LOCATION_KEY, userAtLocation);
        return intent;
    }

    public static List<Photo> getPhotos() {
        return viewModel.getPhotos().getValue();
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
        binding.trophyDetailsMapsButton.setOnClickListener(this::onMapsButtonClicked);

        binding.bigTrophy.setVisibility(View.GONE);

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

    private void onSortPhotoClicked(View unused) {
        Log.d(TAG, "onSortPhotoClicked");
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

    @SuppressLint("DefaultLocale")
    private void onMapsButtonClicked(View unused) {
        Log.d(TAG, "onMapsButtonClicked");
        Uri uri = Uri.parse("https://www.google.com/maps/search/")
                .buildUpon()
                .appendQueryParameter("api", "1")
                .appendQueryParameter("query", getTrophy().getTitle())
                .appendQueryParameter("query_place_id", getTrophy().getGooglePlaceId())
                .build();
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, uri);
        mapIntent.setPackage("com.google.android.apps.maps");
        startActivity(mapIntent);
    }

    private void onTrophyActionButtonClicked(View unused) {
        Log.d(TAG, "onTrophyActionButtonClicked");
        if (!userAtLocation) {
            Log.d(TAG, "Too far away");
            animateTrophyActionButtonVibration();
            Toast.makeText(this, "You are too far away", Toast.LENGTH_SHORT).show();
            return;
        }
        if (Boolean.TRUE.equals(viewModel.getTrophyCollected().getValue())) {
            Log.d(TAG, "Take a photo clicked");
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
            Log.d(TAG, "Collect trophy clicked");
            viewModel.collectTrophy();
            animateTrophyCollection();
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
            binding.sortIcon.setVisibility(View.GONE);
            binding.sortBy.setVisibility(View.GONE);
            binding.sortPhotos.setVisibility(View.GONE);
            binding.trophyDetailsNoPhotoText.setVisibility(View.VISIBLE);

            if (userAtLocation) {
                binding.trophyDetailsNoPhotoText.setText(R.string.trophy_details_no_picture_at_location_text);
            } else {
                binding.trophyDetailsNoPhotoText.setText(R.string.trophy_details_no_picture_not_at_location_text);
            }
        } else {
            binding.sortIcon.setVisibility(View.VISIBLE);
            binding.sortBy.setVisibility(View.VISIBLE);
            binding.sortPhotos.setVisibility(View.VISIBLE);
            binding.trophyDetailsNoPhotoText.setVisibility(View.GONE);
        }

        for (int i = 0; i < trophyGrid.getChildCount(); i++) {
            ImageView imageView = (ImageView) trophyGrid.getChildAt(i);
            int index = i;
            if (i < photos.size()) {
                String url = photos.get(i).getPhotoUrl();
                Glide.with(this)
                        .load(url)
                        .placeholder(R.drawable.ic_default_avatar_35dp)
                        .into(imageView);
                imageView.setOnClickListener(v -> {
                    EvaluatePhotoActivity.start(this, photos.get(index), getTrophy().getTitle());
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

    private void animateTrophyActionButtonVibration() {
        binding.trophyActionButton.startAnimation(AnimationUtils.loadAnimation(this, R.anim.vibrate));
    }

    private void animateTrophyCollection() {
        /* Reset view status first */
        updateBigTrophyColor();
        binding.bigTrophy.setScaleX(1.0f);
        binding.bigTrophy.setScaleY(1.0f);
        binding.bigTrophy.setTranslationY(0.0f);
        binding.bigTrophy.setAlpha(0.0f);
        binding.bigTrophy.setVisibility(View.VISIBLE);

        binding.bigTrophy.startAnimation(AnimationUtils.loadAnimation(this, R.anim.trophy_collection));
        binding.bigTrophy.animate()
                .alpha(1.0f)
                .scaleXBy(1.0f)
                .scaleYBy(1.0f)
                .setDuration(200)
                .withEndAction(() -> new Handler().postDelayed(() -> binding.bigTrophy.animate()
                                .alpha(0.0f)
                                .scaleXBy(-1.5f)
                                .scaleYBy(-1.5f)
                                .setDuration(300)
                                .setInterpolator(new DecelerateInterpolator())
                                .translationYBy(700.0f)
                                .withEndAction(() -> binding.bigTrophy.setVisibility(View.GONE))
                                .start(),
                        800)
                )
                .start();
    }

    private void updateBigTrophyColor() {
        switch (getTrophy().getQuality()) {
            case GOLD:
                binding.bigTrophy.setImageResource(R.drawable.ic_map_trophy_gold);
                break;
            case SILVER:
                binding.bigTrophy.setImageResource(R.drawable.ic_map_trophy_silver);
                break;
            case BRONZE:
                binding.bigTrophy.setImageResource(R.drawable.ic_map_trophy_bronze);
                break;
            default:
                throw new IllegalStateException();
        }
    }
}
