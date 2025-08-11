package com.glutenscanner.app;

import android.os.Bundle;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Remove the FLAG_SECURE flag to allow screenshots
        // This is the key change to enable screenshots
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
        
        // Optional: You can also explicitly allow screenshots
        // by not setting the FLAG_SECURE flag at all
    }
}