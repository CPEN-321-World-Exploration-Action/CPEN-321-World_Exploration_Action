package com.worldexplorationaction.android.ui.signin;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.fcm.WeaFirebaseMessagingService;
import com.worldexplorationaction.android.ui.utility.CustomCallback;
import com.worldexplorationaction.android.ui.utility.CommonUtils;

import java.util.function.BiConsumer;

public class SignInManager implements ActivityResultCallback<ActivityResult> {
    private static final String TAG = SignInManager.class.getSimpleName();
    private static final String TEST_USER_ID = "test_uid_001";
    public static String signedInUserId;
    private final GoogleSignInClient googleSignInClient;
    private final ActivityResultLauncher<Intent> googleSignInLauncher;
    private final UserService userService;
    private BiConsumer<Boolean, String> onSignInResultListener;

    /**
     * Must be called before the activity is started
     *
     * @param activity the activity
     */
    public SignInManager(AppCompatActivity activity) {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(activity.getString(R.string.google_client_id))
                .requestEmail()
                .build();
        this.googleSignInClient = GoogleSignIn.getClient(activity, gso);
        this.userService = UserService.getService();
        this.googleSignInLauncher = activity.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), this);
    }

    @Override
    public void onActivityResult(ActivityResult result) {
        Log.d(TAG, "Sign In Activity Result: " + result);
        if (result.getResultCode() != Activity.RESULT_OK) {
            String errorMessage = "Activity result code is not OK: " + result.getResultCode();
            Log.e(TAG, errorMessage);
            onSignInResultListener.accept(false, errorMessage);
            return;
        }

        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
        GoogleSignInAccount account;
        try {
            account = task.getResult(ApiException.class);
        } catch (ApiException e) {
            String statusCodeString = GoogleSignInStatusCodes.getStatusCodeString(e.getStatusCode());
            Log.e(TAG, "signInResult:failed code=" + e.getStatusCode() + ", reason=" + statusCodeString);
            onSignInResultListener.accept(false, statusCodeString);
            return;
        }

        if (account != null) {
            onSignInSuccess(account);
        } else {
            Log.e(TAG, "signInResult:failed null account");
            onSignInResultListener.accept(false, "null account");
        }
    }

    public String getSignedInUserId() {
        return signedInUserId;
    }

    public void setOnSignInResultListener(BiConsumer<Boolean, String> onSignInResultListener) {
        this.onSignInResultListener = onSignInResultListener;
    }

    public void signIn(AppCompatActivity activity, boolean checkLastAccount) {
        if (CommonUtils.isRunningUiTest()) {
            Log.w(TAG, "Skip login in UI tests.");
            signedInUserId = TEST_USER_ID;
            onSignInResultListener.accept(true, null);
            return;
        }

        if (checkLastAccount) {
            Log.d(TAG, "Getting last signed in account");
            GoogleSignInAccount lastAccount = GoogleSignIn.getLastSignedInAccount(activity);
            if (lastAccount != null) {
                Log.d(TAG, "has last signed in account " + lastAccount);
                onSignInSuccess(lastAccount);
                return;
            }
        } else {
            Log.d(TAG, "Skip last signed in account");
            googleSignInClient.signOut();
        }

        Log.d(TAG, "no last signed in account");
        googleSignInLauncher.launch(googleSignInClient.getSignInIntent());
    }

    public void logOut() {
        googleSignInClient.signOut();
        userService.logout().enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "userService.logout succeeded ");
        }, null, errorMessage -> {
            Log.e(TAG, "userService.logout failed " + errorMessage);
        }));
        signedInUserId = null;
    }

    private void onSignInSuccess(@NonNull GoogleSignInAccount account) {
        String idToken = account.getIdToken();

        Log.d(TAG, "ID Token: " + idToken);
        Log.d(TAG, "Pref Name: " + account.getDisplayName());
        Log.d(TAG, account.getGivenName() + " " + account.getFamilyName());

        userService.login(idToken).enqueue(new CustomCallback<>(responseBody -> {
            if (responseBody != null) {
                Log.e(TAG, "userService.login success");
                signedInUserId = responseBody;
                onSignInResultListener.accept(true, null);
                uploadFcmToken();
            } else {
                Log.i(TAG, "userService.login null body ");
                onSignInResultListener.accept(false, "userService.login failed: null response body");
            }
        }, null, errorMessage -> {
            Log.e(TAG, "userService.login failed " + errorMessage);
            onSignInResultListener.accept(false, errorMessage);
        }));
    }

    private void uploadFcmToken() {
        WeaFirebaseMessagingService.getToken().addOnCompleteListener(task -> {
            if (!task.isSuccessful()) {
                Log.e(TAG, "Cannot get FCM registration token: ", task.getException());
                return;
            }
            String token = task.getResult();
            Log.d(TAG, "FCM token: " + token);

            userService.uploadFcmToken(token).enqueue(new CustomCallback<>(responseBody -> {
                Log.i(TAG, "userService.uploadFcmToken success ");
            }, null, errorMessage -> {
                Log.e(TAG, "userService.uploadFcmToken failed " + errorMessage);
            }));
        });
    }
}
