package com.example.mkhan.myapplication;

import android.Manifest;
import android.app.PendingIntent;
import android.content.Intent;
import android.location.Location;
import android.net.Uri;
import android.os.StrictMode;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

public class MainActivity extends AppCompatActivity {

    public static final String TAG = "MainActivity";
    public static final String GEOFENCE_ID = "HomePerimeter";

    public static String username;

    public static ImageView imageView;

    GoogleApiClient googleApiClient = null;

    private Button directionMap;
    private Button startLocationMonitoring;

    // TODO: make a server side function call to retrieve residence coordinates
    double topHatLatitude = 43.668579;
    double topHatLongitude = -79.393234;
    float perimeterRadius = 100; // radius in meters

    public static final String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        username = getIntent().getStringExtra("username");

        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        setContentView(R.layout.activity_main);

        // setup location and geofence related buttons
        startLocationMonitoring = findViewById(R.id.startLocationMonitoring);
        startLocationMonitoring.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startLocationMonitoring();
                startGeofenceMonitoring();

                imageView = findViewById(R.id.houseIcon);
                imageView.setImageDrawable(getDrawable(R.drawable.icon_green));
            }
        });

        directionMap = (Button)findViewById(R.id.maps);
        directionMap.setOnClickListener(new View.OnClickListener(){
            public void onClick (View v){
                Intent maps = new Intent (Intent.ACTION_VIEW, Uri.parse("google.navigation:q=" + Double.toString(topHatLatitude) + "," + Double.toString(topHatLongitude) + "&mode=w"));
                maps.setPackage("com.google.android.apps.maps");
                startActivity(maps);
            }

        });

        // FINE_LOCATION uses gps, COARSE_LOCATION uses wifi
        // FINE_LOCATION consumes more battery but is more accurate and doesn't require wifi access

        // request location permission from user
        requestPermissions(new String[] {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, 1234);
        //requestPermissions(new String[] {Manifest.permission.INTERNET}, 1234);

        // build Google API
        googleApiClient = new GoogleApiClient.Builder(this)
                .addApi(LocationServices.API)
                .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
                    @Override
                    public void onConnected(Bundle bundle) {
                        Log.d(TAG, "Connected to GoogleApiClient");
                    }
                    @Override
                    public void onConnectionSuspended(int i) {
                        Log.d(TAG, "Suspended connection to GoogleApiClient");
                    }
                })
                .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
                    @Override
                    public void onConnectionFailed(ConnectionResult connectionResult) {
                    Log.d(TAG, "Failed to connect to GoogleApiClient - " + connectionResult.getErrorMessage());
                    }
                })
                .build();
    }

    // called whenever app is resumed, re-establish connection to Google API
    @Override
    protected void onResume() {
        Log.d(TAG, "Function Call: onResume()");
        super.onResume();

        int response = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this);
        if(response != ConnectionResult.SUCCESS) {
            Log.d(TAG, "Google Play Services not available - show dialog to ask user to download it.");
            GoogleApiAvailability.getInstance().getErrorDialog(this, response, 1).show();
        } else {
            Log.d(TAG, "Google Play Services is available - no action is required");
        }
    }

    // called whenever app is opened from terminated state, reconnect to Google API
    @Override
    protected void onStart() {
        Log.d(TAG, "Function Call: onStart()");
        super.onStart();
        googleApiClient.reconnect();
    }

    // called whenever app is closed, disconnect from Google API
    @Override
    protected void onStop() {
        Log.d(TAG, "Function Call: onStop()");
        super.onStop();
        googleApiClient.disconnect();
    }

    // method to setup location monitoring specifications
    private void startLocationMonitoring() {
        Log.d(TAG, "Function Call: startLocationMonitoring()");

        try {
            // check location every 10 seconds in general, 5 second fastest interval
            LocationRequest locationRequest = LocationRequest.create()
                    .setInterval(10000)
                    .setFastestInterval(5000)
                    .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

            // ignore the warning there, ideally we should check explicitly if we have location permission
            LocationServices.FusedLocationApi.requestLocationUpdates(googleApiClient, locationRequest, new LocationListener() {
                @Override
                public void onLocationChanged(Location location) {
                    Log.d(TAG, "Location Update: Latitude " + location.getLatitude() + " Longitude " + location.getLongitude());

                    TextView coordTxtbox = findViewById(R.id.coordinatesTxtbox);
                    coordTxtbox.setText("(" + location.getLatitude() + ", " + location.getLongitude() + ")");

                    long unixTimestamp = System.currentTimeMillis() / 1000L;
                    StdLibSendLocationRequest request = new StdLibSendLocationRequest("Bob", unixTimestamp, Double.toString(location.getLatitude()), Double.toString(location.getLongitude()));
                    new StdLib().doInBackground(request);
                }
            });
        } catch (Error error) {

        }
    }

    // method to setup geofence specifications
    private void startGeofenceMonitoring(){
        Log.d(TAG, "Function Call: startGeofenceMonitoring()");
        try{
            // create a circular geofence perimeter
            Geofence geofence = new Geofence.Builder()
                    .setRequestId(GEOFENCE_ID)
                    .setCircularRegion(topHatLatitude, topHatLongitude, perimeterRadius) // sets the region of this geofence
                    .setExpirationDuration(Geofence.NEVER_EXPIRE) // sets the expiration duration of geofence
                    .setNotificationResponsiveness(1000) // sets the best-effort notification responsiveness of the geofence
                    .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER | Geofence.GEOFENCE_TRANSITION_EXIT)
                    .build();

            // add geofence
            GeofencingRequest geofenceRequest = new GeofencingRequest.Builder()
                    .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER)
                    .addGeofence(geofence)
                    .build();

            // create an Intent Service of GeofenceService
            Intent intent = new Intent(this, GeofenceService.class);
            PendingIntent pendingIntent = PendingIntent.getService(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

            if (!googleApiClient.isConnected()){
                Log.d(TAG, "GoogleApiClient is not connected");
            } else {
                // ignore the warning there, ideally we should check explicitly if we have location permission
                LocationServices.GeofencingApi.addGeofences(googleApiClient, geofenceRequest, pendingIntent)
                        .setResultCallback(new ResultCallback<Status>() {
                            @Override
                            public void onResult(Status status) {
                                if (status.isSuccess()){
                                    Log.d(TAG,"Successfully added geofence");
                                } else {
                                    Log.d(TAG, "Failed to add geofence + " + status.getStatus());
                                }
                            }
                        });
            }
        } catch (Error error){}
    }

//    // we can call this method to remove existing geofences
//    private void stopGeofenceMonitoring(){
//        Log.d(TAG, "Function Call: stopMonitoring()");
//        ArrayList<String> geofenceIds = new ArrayList<String>();
//        geofenceIds.add(GEOFENCE_ID);
//
//        // ignore the fact that this is a deprecated function for now
//        LocationServices.GeofencingApi.removeGeofences(googleApiClient, geofenceIds);
//    }

}
