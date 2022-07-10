package com.worldexplorationaction.android.ui.trophy;

import static com.worldexplorationaction.android.ui.map.MapFragment.trophyTitle;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.user.UserProfile;

public class evaluate_photo extends AppCompatActivity {

    ImageView evaluatePhoto;
    TextView trophyName1;
    ImageButton like;
    TextView like_number;
    TextView username;
    ImageView profilePic;
    int score = 0;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.evaluate_photos);

        EvaluatePhotoViewModel viewModel =
                new ViewModelProvider(this).get(EvaluatePhotoViewModel.class);

        like = findViewById(R.id.like_button);
        like_number = findViewById(R.id.number);

        username = findViewById(R.id.name_evaluate);
        profilePic = findViewById(R.id.profile_image_evaluate);

        trophyName1=findViewById(R.id.trophy_name_evaluate);
        trophyName1.setText(viewModel.getTrophyDetails().getValue().getTitle());
        //trophyName1.setText(trophyTitle);

        evaluatePhoto = (ImageView) findViewById(R.id.evaluated_photo);
        Intent intent = getIntent();
        Uri photoUri = (Uri) intent.getParcelableExtra("photoUrl");
        String photoId = intent.getExtras().getString("photoId");
        int likes = intent.getIntExtra("numberLikes", 0);
        evaluatePhoto.setImageURI(photoUri);

        photoUserDetails (viewModel.getUserProfile().getValue(), viewModel.getUserProfile().getValue().getImageUrl());

        //viewModel.displayingPhotoInfo(viewModel.getTrophyDetails().getValue().getId());
        score = likes;

        like.setOnClickListener
                (new View.OnClickListener()
                 {
                     public void onClick (View v)
                     {
                         viewModel.likePhoto(viewModel.getUserProfile().getValue().getId(),photoId);
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

    private void photoUserDetails (UserProfile user, String photoUri){
        username.setText(user.getName());
        profilePic.setImageURI(Uri.parse(user.getImageUrl()));
    }

}
