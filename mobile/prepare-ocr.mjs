import { writeFileSync } from 'node:fs';
// expo-text-extractor still uses the Gradle hooks removed in Expo SDK 54.
// Use the current module plugin and ship the Android OCR model with the app.
writeFileSync(new URL('./node_modules/expo-text-extractor/android/build.gradle', import.meta.url), `plugins {
  id 'com.android.library'
  id 'expo-module-gradle-plugin'
}
group = 'expo.modules.textextractor'
version = '1.0'
android { namespace 'expo.modules.textextractor'; defaultConfig { versionCode 1; versionName '2.0.0' } }
dependencies { implementation 'com.google.mlkit:text-recognition:16.0.1' }
`);

