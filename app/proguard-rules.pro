# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep the application entry points
-keep class com.investmentassistant.** { *; }

# Keep Kotlin metadata and coroutines
-keepattributes *Annotation*
-keepattributes RuntimeVisibleAnnotations
-keepattributes AnnotationDefault
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Kotlin serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

# AndroidX
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# Material Design Components
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

# Preserve stack trace information for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
