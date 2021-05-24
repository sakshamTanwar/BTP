
# Land Records Retrieval System

This project is carried out as part of Bachelor Dissertation Project, from Jan 2021 to May 2021, as part of the BTech in Computer Science and Engineering program at IIT Indore. This project is a joint work between Naman Jain, Pranshu Maheshwari, Saksham Tanwar and our project guide Dr. Gourinath banda.

## Overall Architecture
![](https://github.com/sakshamTanwar/BTP/blob/master/Design%20Artifacts/overall_architecture.jpeg)

## Modules
- **Smartphone Application** :- Provides a user interface for users to interact with where users can request land records for a particular land by marking the point on the map.
-  **Land Records Retrieval Service** :- Allows users to get an ownership history of a particular land by providing GPS coordinates.
-   **Records Server** :- Serves a web application that allows the Land Registration Department to enter land records.
-   **Verification Server** :- Serves a web application that allows users to verify the land records and obtain certificates which are digitally signed by the Land Registration Department.
-  **Blockchain** :- Used as an immutable database that stores all the land records.
- **IPFS** :- Peer-to-peer based File System to store scanned documents and certificates related to the land records.

## Project Organization
-   *blockchain/contract* - Contains code for smart contract
-   *blockchain/application-land-reg* - Contains code for records server
-   *verification* - Contains code for verification server
-   *ipfs-cluster* - Contains docker-compose file for setting up IPFS cluster
- *server* - Contains code for LRRP server  
-  *app* - Contains code for smartphone application

##  Land Records Retrieval Service
### Server
Located in the server folder in the project repo.
It is a Node server that interacts with the application to provide the requested land record to the user. It takes GPS coordinates from the application, resolves it and fetches the corresponding land record information from the Blockchain. The land record is mailed to the user once the user completes the payment. It supports HTTPS for secured interaction.

Following are the HTTPS endpoints exposed by the LRRS server:
-   POST /signup: This endpoint is used to register a new user to the LRRS server.
-   POST /login: This endpoint is used to get the JWT access token to access endpoints which require authentication. The JWT token expires in 1 hour.
 -   GET /landrecord: This endpoint is used to get the land information like Khasra No, etc. that corresponds to a particular GPS coordinate (represented by a pair of Latitude and Longitude).
-   GET /payment/initiate: This endpoint is used to initiate a payment request.
-   GET /payment/verify: This endpoint verifies the payment and mail the land record to the user accordingly.

External Dependencies :-
-   MongoDb :- A running MongoDb instance is required for user authentication purposes. Provide the URI to the mongodb database in the file src/setup/db.ts. To set up a Mongodb instance locally, follow [this](https://docs.mongodb.com/manual/installation/).
-   Reverse Geocoding Service :- The server is using MapMyIndia Reverse geocoding service. Provide the MapMyIndia API Key in the file src/services/coordResolver.ts    
-   RazorPay Payment Integration :- RazorPay Payment service is used to initiate and verify the payment.

Following environment variables are required by the server, which can be provided in the `.env` file in the same directory:
 - CLIENT_ID :- Client ID for OAuth Authentication, needed for sending Emails.
 - CLIENT_SECRET :- Client Secret for OAuth Authentication, needed for sending Emails.
 - REFRESH_TOKEN :- Refresh Token for OAuth Authentication, needed for sending Emails.
 - RZRPAY_KEY_ID :- ID provided by RazorPay.
 - RZRPAY_KEY_SECRET :- Secret provided by RazorPay.

Development Environment can be setup using the commands :-
```bash
# Install required NodeJs modules
npm install

# Transpile
npm run build

# Start server
node dist/main.js
```

###  Smartphone Application
Located in the app folder of the project repository, the application is built using React Native.
To build [NodeJS](https://nodejs.org/en/) and optionally [yarn](https://yarnpkg.com/) is required.
To build an android application, [Android Studio](https://developer.android.com/studio) is required.
To build an iOS application, macOS with [xcode](https://developer.apple.com/xcode/) and [cocoapods](https://cocoapods.org/) is required.
To download the dependencies run yarn or npm install.
The application also requires a Google Maps API to run, follow [this](https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md) guide to complete the maps integration.
To run the application on an android emulator or a device, connect the device and turn on USB debugging and run yarn android or npm run android. This builds a debug apk, checks if a device is connected if not starts the emulator and then installs the application on the respective device.
To run the application on an iOS emulator or device, on macOS run pod install in the ios directory to install all the iOS related dependencies and then run yarn ios or npm run ios in the root directory of the application. This builds a debug ipa, checks if a device is connected if not starts the emulator and then installs the application on the respective device.

All the source code is under the src/ folder which consists of different screens. 
-  Login
-   Signup
-   Location
-   Payment

The Login/Signup screens are used according to their names and after successful login/signup the router is redirected to the Location screen. On this screen the user can select GPS coordinates according to the marker placed on the map whereafter, the data for the GPS coordinates is requested from the server and sent to the Payment screen. On this screen the land plot is highlighted on the map and after clicking on the button the user is redirected to the razorpay payment gateway. Then according to the payment gateway response a success or failure page is displayed and on success a request is made to the server to send the land record history report as email.

#### Android
To build Android APK, Android Studio is required with the following installed along with it:-

 - Android 10 (Q) SDK

- Android SDK Platform 29

- Android Virtual Device

- If not already using Hyper-V: Performance (Intel ® HAXM)

#### IOS
To build iOS IPA, version 10 or a newer version of Xcode is required, which can be installed from the Mac App Store, and after installation, Xcode Command Line Tools needs to installed from the Xcode Preferences tab. Along with Xcode, Cocoapods needs to installed, a dependency manager for Swift and Objective-C Cocoa projects. It can be installed using the following commands :-
```bash
# Install cocoapods
sudo gem install cocoapods

# Install required NodeJS modules
npm install

# Start Metro Bundler
npx react-native start

# Build and run Android debug apk
npx react-native run-android

# Build and run iOS debug apk
cd ios; pod install; cd ..; npx react-native run-ios

# Build Android release apk
cd android; ./gradlew assembleRelease
```

## Land Registration Department
### Records Server
Located in the blockchain/application-land-reg folder in the project repo.
This serves as a portal to enter land records to the blockchain.
This portal provides following functionalities :-
-   Enter land record
-   Enter land transaction
-   Split a land record to create two new land records
-   Query Ownership of a land
-   Query Land Records in a Village

During any write transaction to the blockchain, a digitally signed PDF is generated that acts as a certificate, to be used by the verification server, and is uploaded to the IPFS.

Records server requires the following environment variables :-
-   CERT :- Path to P12 certificate file used to sign the PDF documents
-   IPFS_CLUSTER :- Link to IPFS cluster node

Development Environment can be setup using the commands :-
```bash
# Install required NodeJs modules
npm install

# Transpile
npm run build

# Start server
CERT=<cert_path> IPFS_CLUSTER=<ipfs_cluster_link> node dist/app.js
```

###  Verification Server
Located in the verification folder in the project repo.
This serves as a portal to obtain PDF documents for each digitally signed by the Land Registration Department. These PDF documents act as certificates that contain information regarding the land records and the land transactions.
This portal provides a field to enter IPFS hash/CID of the certificate required by the user, the server then searches the blockchain to see whether that hash matches with the one in the blockchain, if yes, it then downloads the file from IPFS and signs it again.

Verification server requires the following environment variables :-
-   CERT :- Path to P12 certificate file used to sign the PDF documents

Development Environment can be setup using the commands :-
```bash
# Install required NodeJs modules
npm install

# Transpile
npm run build

# Start server
CERT=<cert_path> node dist/app.js
```
## Blockchain
Smart contract and applications that interact with blockchain run on the test net using the commercial paper [example](https://hyperledger-fabric.readthedocs.io/en/latest/tutorial/commercial_paper.html) replacing the smart contract and applications with our implementations.
One can follow the tutorial in the example linked and replace the smart contract with the implementation on the github repo for our project.
server run as organization 1(digibank) application.
verification, application-land-reg run as organization 2(magnetocorp) application.

## IPFS
A private IPFS network is set up. IPFS-Cluster is used to manage the cluster.

In local development environment, network can be started by using the command:-
`docker-compose up`

This requires two environment variables to be provided :-
-   SWARM_KEY :- Required for private ipfs network, can be generated by following point 2 in this [link](https://github.com/ahester57/ipfs-private-swarm)
-   CLUSTER_SECRET :- Required to manage the private IPFS cluster

These can be provided in a .env file in the same directory as the docker-compose.yml file.
Make sure that the init.sh file can be executed.
```bash
# Modify init.sh file permissions to allow execution
chmod 740 init.sh

# In local development environment, IPFS network can be started by using the command:-
docker-compose up
```


##  Payment System
Razorpay payment gateway is used.
With each order following details are send to payment gateway to store (as part of notes using Razorpay orders API):-
-   user_email :- Email id of the user
-   land_khasra :- Khasra No of the land for which record was accessed
-   land_village :- Village in which the land parcel is there
-   land_sub_district :- Sub-District in which the land parcel is there
-   land_district :- District in which the land parcel is there
-   land_state :- State in which the land parcel is there
