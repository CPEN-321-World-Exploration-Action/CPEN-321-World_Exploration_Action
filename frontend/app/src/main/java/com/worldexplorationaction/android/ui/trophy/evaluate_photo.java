package com.worldexplorationaction.android.ui.trophy;

import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.databinding.EvaluatePhotosBinding;
import com.worldexplorationaction.android.databinding.TrophyDetailsBinding;
import com.worldexplorationaction.android.ui.signin.SignInManager;

import java.util.Objects;

public class evaluate_photo extends AppCompatActivity {

    private static final String TAG = evaluate_photo.class.getSimpleName();;
    private static final String PHOTO_DETAILS_KEY = "PHOTO_DETAILS_KEY";
    ImageView evaluatePhoto;
    TextView trophyName1;
    ImageButton like;
    TextView like_number;
    TextView username;
    ImageView profilePic;
    private Photo photo;
    private Trophy trophy;
    private TrophyDetailsBinding binding;
    private String userId;
    int score = 0;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //this.binding = EvaluatePhotosBinding.inflate(getLayoutInflater());
        setContentView(R.layout.evaluate_photos);
        userId = Objects.requireNonNull(SignInManager.signedInUserId);
        photo = (Photo) getIntent().getSerializableExtra(PHOTO_DETAILS_KEY);

        //onNewTrophy(trophy);

        EvaluatePhotoViewModel viewModel =
                new ViewModelProvider(this).get(EvaluatePhotoViewModel.class);

        like = findViewById(R.id.like_button);
        like_number = findViewById(R.id.number);
        username = findViewById(R.id.name_evaluate);
        profilePic = findViewById(R.id.profile_image_evaluate);
        trophyName1=findViewById(R.id.trophy_name_evaluate);
        evaluatePhoto = (ImageView) findViewById(R.id.evaluated_photo);


        Intent intent = getIntent();
        String title = intent.getExtras().getString("title");
        trophyName1.setText(title);

        //int likes = intent.getIntExtra("numberLikes", 0);
        //evaluatePhoto.setImageURI(Uri.parse(photo.getPhotoUrl()));

        //photoUserDetails (viewModel.getUserProfile().getValue());
        //viewModel.getUserProfile().observe(this, this::onNewUser);

        score = photo.getNumberOfLikes();

        like.setOnClickListener
                (new View.OnClickListener()
                 {
                     public void onClick (View v)
                     {
                         viewModel.likePhoto(userId,photo.getPhotoId());
                         Integer integer = (Integer) like.getTag();
                         integer = integer == null ? 0 : integer;

                         switch(integer) {
                             case R.drawable.active_like:
                                 like.setImageResource(R.drawable.inactive_like);
                                 like.setTag(R.drawable.inactive_like);
                                 score--;
                                 String num1 = String.valueOf(score);
                                 like_number.setText(num1);
                                 break;
                             case R.drawable.inactive_like:
                             default:
                                 like.setImageResource(R.drawable.active_like);
                                 like.setTag(R.drawable.active_like);
                                 score++;
                                 String num = String.valueOf(score);
                                 like_number.setText(num);
                                 break;
                         }
                     }
                 }
                );

    }

    private void onNewTrophy(Trophy trophy) {
        Log.i(TAG, "onNewTrophy " + trophy);
        if (trophy == null) {
            return;
        }
        trophyName1.setText(trophy.getTitle());
    }

    private void onNewUser(UserProfile user) {
        if (user == null) {
            return;
        }
       // binding.profileName.setText(user.getName());
       // binding.profileEmail.setText(user.getEmail());
        username.setText(user.getName());
        profilePic.setImageURI(Uri.parse(user.getImageUrl()));
    }

}
