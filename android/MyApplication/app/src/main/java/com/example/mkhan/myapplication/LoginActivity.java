package com.example.mkhan.myapplication;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.gms.location.LocationServices;

import java.util.ArrayList;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_login);

        final Button button = findViewById(R.id.loginButton);
        final TextView usernameTxtbox = findViewById(R.id.nameTxtbox);
        final TextView passwordTxtbox = findViewById(R.id.passwordTxtbox);
        final TextView errorLabel = findViewById(R.id.errorLabel);

        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.d("LoginActivity", usernameTxtbox.getText() + " | " + passwordTxtbox.getText());
                if (usernameTxtbox.getText().toString().equals("Bob") && passwordTxtbox.getText().toString().equals("12345")) {
                    errorLabel.setVisibility(View.INVISIBLE);

                    Intent newIntent = new Intent(getApplicationContext(), MainActivity.class);
                    newIntent.putExtra("username", usernameTxtbox.getText());
                    startActivity(newIntent);
                }
                else {
                    errorLabel.setVisibility(View.VISIBLE);
                    errorLabel.setText("Invalid username or password. Please try again");
                }
            }
        });
    }
}
