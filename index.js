// Polyfill AVANT TOUT
import { polyfillWebCrypto } from 'expo-standard-web-crypto';
polyfillWebCrypto();

// Maintenant charge l'app
import 'expo-router/entry';