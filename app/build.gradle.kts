import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

// ---------------------------------------------------------------------------
// Signing configuration
//
// For LOCAL BUILDS place a file named "keystore.properties" in the project
// root (same directory as this build.gradle.kts).  See the committed file
// "keystore.properties.template" for the required format.  That file is
// listed in .gitignore so your passwords are never committed.
//
// For CI/CD (GitHub Actions) the workflow decodes the KEYSTORE_BASE64 secret
// to app/release.jks and passes the other four values as environment
// variables so the Properties block below falls through to the env-var
// fallback.
// ---------------------------------------------------------------------------
val keystorePropertiesFile = rootProject.file("keystore.properties")

val keystoreProperties = Properties().apply {
    if (keystorePropertiesFile.exists()) {
        load(keystorePropertiesFile.inputStream())
    }
}

fun prop(key: String): String =
    keystoreProperties.getProperty(key)
        ?: System.getenv(key)
        ?: ""

android {
    namespace = "com.example.investmentassistant"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.investmentassistant"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    // -----------------------------------------------------------------------
    // Release signing — credentials come from keystore.properties (local)
    // or environment variables (CI).  The keystore file is expected at
    // app/release.jks; in CI it is written there by the workflow step that
    // decodes the KEYSTORE_BASE64 secret.
    // -----------------------------------------------------------------------
    signingConfigs {
        create("release") {
            val sf = prop("storeFile")
            storeFile = if (sf.isNotEmpty()) rootProject.file(sf) else null
            storePassword = prop("storePassword")
            keyAlias = prop("keyAlias")
            keyPassword = prop("keyPassword")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Apply release signing only when all credentials are present
            val sf = prop("storeFile")
            val sp = prop("storePassword")
            val ka = prop("keyAlias")
            val kp = prop("keyPassword")
            if (sf.isNotEmpty() && sp.isNotEmpty() && ka.isNotEmpty() && kp.isNotEmpty()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}
