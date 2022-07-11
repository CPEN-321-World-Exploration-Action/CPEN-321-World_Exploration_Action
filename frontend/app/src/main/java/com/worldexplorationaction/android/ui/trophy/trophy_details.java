package com.worldexplorationaction.android.ui.trophy;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.gridlayout.widget.GridLayout;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.ui.signin.SignInManager;

import java.util.List;
import java.util.Objects;

public class trophy_details extends AppCompatActivity {
    private static final String TAG = trophy_details.class.getSimpleName();
    private static final String TROPHY_DETAILS_KEY = "TROPHY_DETAILS_KEY";
    private static final String USER_AT_LOCATION_KEY = "USER_AT_LOCATION_KEY";
    TextView trophyName;
    TextView collectorsNumber;
    GridLayout trophyGrid;
    ImageButton sortPhotos;
    private TrophyDetailsViewModel viewModel;
    private Trophy trophy;
    private String userId;
    private Button collectTrophyButton;
    private boolean userAtLocation;

    public static void start(Context packageContext, Trophy trophy, Boolean userAtLocation) {
        Intent intent = new Intent(packageContext, trophy_details.class);
        intent.putExtra(TROPHY_DETAILS_KEY, trophy);
        intent.putExtra(USER_AT_LOCATION_KEY, userAtLocation);
        packageContext.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.trophy_details);

        userId = Objects.requireNonNull(SignInManager.signedInUserId);
        trophy = (Trophy) getIntent().getSerializableExtra(TROPHY_DETAILS_KEY);
        userAtLocation = getIntent().getBooleanExtra(USER_AT_LOCATION_KEY, false);

        sortPhotos = findViewById(R.id.sort_photos);
        collectorsNumber = findViewById(R.id.collectors);
        trophyGrid = findViewById(R.id.images_grid);

        trophyName = findViewById(R.id.trophy_name_evaluate);

        collectTrophyButton = findViewById(R.id.collect_trophy_button);

        onNewTrophy(trophy);

        viewModel = new ViewModelProvider(this).get(TrophyDetailsViewModel.class);

        viewModel.getToastMessage().observe(this, this::onToastMessage);
        viewModel.getTrophyDetails().observe(this, this::onNewTrophy);
        viewModel.getTrophyCollected().observe(this, this::onCollectedUpdate);
        viewModel.getPhotos().observe(this, this::onNewPhotos);

        viewModel.fetchTrophy(trophy.getId());
        viewModel.fetchTrophyPhotos(trophy.getId(), "random");
        sortPhotos.setOnClickListener(this::onSortPhotoClicked);

        collectTrophyButton.setOnClickListener(this::onCollectTrophyButtonClicked);
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
                    viewModel.fetchTrophyPhotos(trophy.getId(), order);
                })
                .create().show();
    }

    private void onCollectTrophyButtonClicked(View v) {
        if (userAtLocation) {
            viewModel.collectTrophy(userId, trophy.getId());
        } else {
            Toast.makeText(this, "You are too far away", Toast.LENGTH_SHORT).show();
        }
    }

    private void onCollectedUpdate(boolean collected) {
        if (collected) {
            Intent intent = new Intent(trophy_details.this, collect_trophy.class);
            startActivity(intent);
        }
    }

    private void onNewTrophy(Trophy trophy) {
        Log.i(TAG, "onNewTrophy " + trophy);
        if (trophy == null) {
            return;
        }
        trophyName.setText(trophy.getTitle());
        collectorsNumber.setText(String.valueOf(trophy.getNumberOfCollectors()));
    }

    private void onNewPhotos(List<Photo> photos) {
        Log.i(TAG, "onNewPhotos " + photos);
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
