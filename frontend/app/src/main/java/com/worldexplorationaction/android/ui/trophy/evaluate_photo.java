package com.worldexplorationaction.android.ui.trophy;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.databinding.EvaluatePhotosBinding;

public class evaluate_photo extends AppCompatActivity {
    private static final String TAG = evaluate_photo.class.getSimpleName();
    private static final String PHOTO_DETAILS_KEY = "PHOTO_DETAILS_KEY";
    private static final String TITLE_KEY = "TITLE_KEY";
    int score = 0;
    private EvaluatePhotoViewModel viewModel;
    private Photo photo;
    private EvaluatePhotosBinding binding;
    private boolean userLiked;

    public static void start(Context packageContext, Photo photo, String title) {
        Intent intent = new Intent(packageContext, evaluate_photo.class);
        intent.putExtra(PHOTO_DETAILS_KEY, photo);
        intent.putExtra(TITLE_KEY, title);
        packageContext.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.binding = EvaluatePhotosBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        this.photo = (Photo) getIntent().getSerializableExtra(PHOTO_DETAILS_KEY);
        // TODO: display profile image and name

        this.viewModel = new ViewModelProvider(this).get(EvaluatePhotoViewModel.class);

        viewModel.getToastMessage().observe(this, this::onToastMessage);

        binding.trophyNameEvaluate.setText(getIntent().getExtras().getString(TITLE_KEY));

        Glide.with(this).load(photo.getPhotoUrl()).into(binding.evaluatedPhoto);

        this.score = photo.getNumberOfLikes();
        this.userLiked = Boolean.TRUE.equals(photo.getUserLiked());

        binding.likeButton.setImageResource(userLiked ? R.drawable.active_like : R.drawable.inactive_like);

        binding.number.setText(String.valueOf(photo.getNumberOfLikes()));

        binding.likeButton.setOnClickListener(v -> {
            viewModel.likePhoto(photo.getPhotoId());

            if (userLiked) {
                binding.likeButton.setImageResource(R.drawable.inactive_like);
                score--;
            } else {
                binding.likeButton.setImageResource(R.drawable.active_like);
                score++;
            }
            binding.number.setText(String.valueOf(score));
            userLiked = !userLiked;
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        this.binding = null;
    }

//    private void onNewUser(UserProfile user) {
//        if (user == null) {
//            return;
//        }
//        // binding.profileName.setText(user.getName());
//        // binding.profileEmail.setText(user.getEmail());
//        //username.setText(user.getName());
//        //profilePic.setImageURI(Uri.parse(user.getImageUrl()));
//    }

    private void onToastMessage(String s) {
        if (s == null) {
            return;
        }
        Toast.makeText(this, s, Toast.LENGTH_LONG).show();
    }

}
