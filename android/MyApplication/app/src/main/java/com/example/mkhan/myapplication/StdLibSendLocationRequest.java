package com.example.mkhan.myapplication;

import android.util.Log;

import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class StdLibSendLocationRequest implements StdLibRequest {
    private final String SEND_LOCATION_ENDPOINT = "https://elderly-monitoring-project-webapp.lib.id/Elderly-App@dev/publish-location/";

    private final String seniorUsername;
    private final long timestamp;
    private final String latitude;
    private final String longitude;

    public StdLibSendLocationRequest(String seniorUsername, long timestamp, String latitude, String longitude){
        this.seniorUsername = seniorUsername;
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public void run(){
        String queryUrl = SEND_LOCATION_ENDPOINT + "?username=" + seniorUsername +
                "&timestamp=" + timestamp + "&latitude=" + latitude +
                "&longitude=" + longitude;

        Log.d("MainActivity", "url: + " + queryUrl);

        try {
            URL url = new URL(queryUrl);
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            // setting the  Request Method Type
            httpURLConnection.setRequestMethod("POST");
            // adding the headers for request
            httpURLConnection.setRequestProperty("Content-Type", "application/json");
            try {
                //to tell the connection object that we will be writing some data on the server and then will fetch the output result
                httpURLConnection.setDoOutput(true);
                // this is used for just in case we don't know about the data size associated with our request
                httpURLConnection.setChunkedStreamingMode(0);

                // to write tha data in our request
                OutputStream outputStream = new BufferedOutputStream(httpURLConnection.getOutputStream());
                OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream);
                outputStreamWriter.write("");
                outputStreamWriter.flush();
                outputStreamWriter.close();

            } catch (Exception e) {
                httpURLConnection.disconnect();
                e.printStackTrace();
            } finally {
                // this is done so that there are no open connections left when this task is going to complete
                httpURLConnection.disconnect();
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
