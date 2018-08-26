package com.example.mkhan.myapplication;

import android.os.AsyncTask;

import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class StdLib extends AsyncTask<StdLibRequest,Integer,String> {

    @Override
    protected String doInBackground(StdLibRequest... requests) {
        for (StdLibRequest request : requests){
            request.run();
        }
        return "PASS";
    }
}
