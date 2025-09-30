import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '../../constants/svgPath';
import Colors from '../../constants/color';
import { moderateScale } from '../../constants/responsive';
import { MainStackParamList } from '../../types/types';

type WebViewScreenProps = NativeStackScreenProps<MainStackParamList, 'WebView'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route, navigation }) => {
  const { url, title } = route.params || {
    url: 'https://www.birajtech.com/',
    title: 'Web View',
  };
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SafeAreaView edges={['top']} style={styles.headerContainer}>
          <TouchableOpacity
            onPress={navigation.goBack}
            style={styles.backButton}
          >
            <Icons.LeftArrow
              width={moderateScale(20)}
              height={moderateScale(20)}
              fill={Colors.black}
              stroke={Colors.black}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </SafeAreaView>
      ),
    });
  }, [navigation, title]);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary || '#007AFF'} />
        </View>
      )}
      <WebView
        source={{ uri: url }}
        style={styles.webView}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </SafeAreaView>
  );
};

// Define a proper type for your styles
interface Styles {
  container: ViewStyle;
  headerContainer: ViewStyle;
  backButton: ViewStyle;
  headerTitle: TextStyle;
  loadingOverlay: ViewStyle;
  webView: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary || 'red',
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: moderateScale(60),
  },
  backButton: {
    marginRight: moderateScale(10),
    padding: moderateScale(5),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 1,
  },
  webView: {
    height: SCREEN_HEIGHT * 0.8,
  },
});

export default WebViewScreen;
