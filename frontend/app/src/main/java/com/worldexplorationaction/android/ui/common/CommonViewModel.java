package com.worldexplorationaction.android.ui.common;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class CommonViewModel extends ViewModel {
    protected final MutableLiveData<String> toastMessage;

    public CommonViewModel() {
        this.toastMessage = new MutableLiveData<>();
    }

    public LiveData<String> getToastMessage() {
        return toastMessage;
    }

    protected void showToastMessage(String value) {
        toastMessage.setValue(value);
        toastMessage.setValue(null);
    }
}
