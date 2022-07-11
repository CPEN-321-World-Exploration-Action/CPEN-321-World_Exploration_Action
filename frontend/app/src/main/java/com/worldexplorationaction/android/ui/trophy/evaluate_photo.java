package com.worldexplorationaction.android.ui.trophy;

import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import android.content.Context;
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
    //TextView username;
    //ImageView profilePic;
    private Photo photo;
    private Trophy trophy;
    private TrophyDetailsBinding binding;
    private String userId;
    int score = 0;

    public static void start(Context packageContext, Photo photo) {
        Intent intent = new Intent(packageContext, evaluate_photo.class);
        intent.putExtra(PHOTO_DETAILS_KEY, photo);
        packageContext.startActivity(intent);
    }

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.evaluate_photos);
        userId = Objects.requireNonNull(SignInManager.signedInUserId);
        photo = (Photo) getIntent().getSerializableExtra(PHOTO_DETAILS_KEY);

        EvaluatePhotoViewModel viewModel =
                new ViewModelProvider(this).get(EvaluatePhotoViewModel.class);

        like = findViewById(R.id.like_button);
        like_number = findViewById(R.id.number);
        trophyName1=findViewById(R.id.trophy_name_evaluate);
        evaluatePhoto = (ImageView) findViewById(R.id.evaluated_photo);


        Intent intent = getIntent();
        String title = intent.getExtras().getString("title");
        trophyName1.setText(title);

        String uri = intent.getExtras().getString("photoUrl");
        String id = intent.getExtras().getString("photoId");


        int likes = intent.getIntExtra("likes", 0);
        Log.i(TAG, "uri:" + uri);
        Glide.with(this).load(uri).into(evaluatePhoto);

        score = likes;

        like.setOnClickListener
                (new View.OnClickListener()
                 {
                     public void onClick (View v)
                     {
                         viewModel.likePhoto(userId,id);
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
        //username.setText(user.getName());
        //profilePic.setImageURI(Uri.parse(user.getImageUrl()));
    }

}
