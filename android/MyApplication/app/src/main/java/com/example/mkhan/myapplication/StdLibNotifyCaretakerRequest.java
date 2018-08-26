package com.example.mkhan.myapplication;

import java.io.BufferedOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class StdLibNotifyCaretakerRequest implements StdLibRequest {

    private final String API_ENDPOINT = "https://elderly-monitoring-project-webapp.lib.id/Elderly-App@dev/notify-caretaker/";

    private final String seniorUsername;
    private final String message;
    private final long timestamp;
    private final int priority;

    public StdLibNotifyCaretakerRequest(String seniorUsername, String message, long timestamp, int priority){

        this.seniorUsername = seniorUsername;
        this.message = message;
        this.timestamp = timestamp;
        this.priority = priority;
    }

    @Override
    public void run() {
        String queryUrl = API_ENDPOINT + "?seniorUsername=" + seniorUsername +
                "&message=" + message + "&timestamp=" + timestamp +
                "&priority=" + priority;

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
