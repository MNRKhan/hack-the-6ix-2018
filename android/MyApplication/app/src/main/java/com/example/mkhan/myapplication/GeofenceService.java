package com.example.mkhan.myapplication;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

import java.util.List;

/**
 * Created by MKhan on 8/25/2018.
 */

public class GeofenceService extends IntentService {

    public static final String TAG = "GeofenceService";

    public GeofenceService(){
        super(TAG);
    }

    // called whenever an geofence event is triggered (i.e. entered/exited)
    @Override
    protected void onHandleIntent(Intent intent) {
        GeofencingEvent event = GeofencingEvent.fromIntent(intent);
        if (event.hasError()){
            // Handle error here?
        } else {
            int transition = event.getGeofenceTransition();
            List<Geofence> geofences = event.getTriggeringGeofences();
            Geofence geofence = geofences.get(0);
            String requestId = geofence.getRequestId();

            if (transition == Geofence.GEOFENCE_TRANSITION_ENTER){
                Log.d(TAG, "Entering geofence - " + requestId);
            } else {
                Log.d(TAG, "Exiting geofence - " + requestId);
                // TODO voice prompt user regarding leaving perimeter

                // TODO receive voice input from user

                // TODO convert voice input to text

                // TODO identify affirmative/negative/unclear meaning from user input

                // TODO affirmative "Lost" or unclear meaning should make server-side function call to inform nurse

                // TODO negative should direct user to Google Maps app if available

            }
        }


    }
}
