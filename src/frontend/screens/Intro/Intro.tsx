import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import IntroStyle from './IntroStyle';
import Components from '../../components';
import { Slide } from '../../components/SlideContent';
import Icons from '../../constants/svgPath';
import Colors from '../../constants/color';
import { moderateScale } from '../../constants/responsive';
import { getUserFromStorage } from '../../services/storageService';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';

// Screen width for calculating pagination/slide positions
const { width } = Dimensions.get('window');

// -----------------------------------------------------------------------------
// Slide data
// -----------------------------------------------------------------------------
const slides: Slide[] = [
  {
    id: 1,
    title: 'AI-Powered Healthcare',
    subtitle: 'Smart Diagnosis',
    description:
      'Experience the future of healthcare with advanced AI technology. Get instant, accurate health assessments powered by machine learning.',
    icon: (
      <Icons.RobotAI
        height={moderateScale(60)}
        width={moderateScale(60)}
        fill={Colors.white}
        stroke={Colors.white}
      />
    ),
    emoji: <Icons.Bolt height={moderateScale(20)} width={moderateScale(20)} />,
    gradient: [Colors.primary, Colors.primaryLight, Colors.accentLight],
    features: [
      {
        icon: (
          <Icons.Bolt height={moderateScale(20)} width={moderateScale(20)} />
        ),
        text: 'Lightning-Fast Analysis',
        color: Colors.white,
      },
      {
        icon: (
          <Icons.BullsEye
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        ),
        text: 'Precision Diagnostics',
        color: Colors.white,
      },
      {
        icon: (
          <Icons.Clock height={moderateScale(20)} width={moderateScale(20)} />
        ),
        text: 'Available 24/7',
        color: Colors.white,
      },
    ],
  },
  {
    id: 2,
    title: 'Expert Consultations',
    subtitle: 'Professional Care',
    description:
      'Connect with world-class medical professionals and AI specialists. Get personalized treatment plans tailored to your health.',
    icon: (
      <Icons.Doctor
        height={moderateScale(60)}
        width={moderateScale(60)}
        fill={Colors.white}
      />
    ),
    emoji: (
      <Icons.Trophy height={moderateScale(20)} width={moderateScale(20)} />
    ),
    gradient: [Colors.primary, Colors.primaryLight, Colors.accentLight],
    features: [
      {
        icon: (
          <Icons.Hospital
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        ),
        text: 'Certified Specialists',
        color: Colors.white,
      },
      {
        icon: (
          <Icons.Chat height={moderateScale(20)} width={moderateScale(20)} />
        ),
        text: 'Real-time Consultations',
        color: Colors.white,
      },
      {
        icon: (
          <Icons.ClipboardText
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        ),
        text: 'Custom Treatment Plans',
        color: Colors.white,
      },
    ],
  },
  {
    id: 3,
    title: 'Health Monitoring',
    subtitle: 'Track & Improve',
    description:
      'Transform your health journey with intelligent analytics and personalized insights. Track progress and achieve wellness goals.',
    icon: (
      <Icons.ChartBar
        height={moderateScale(60)}
        width={moderateScale(60)}
        // fill={Colors.white}
      />
    ),
    emoji: (
      <Icons.Rocket height={moderateScale(20)} width={moderateScale(20)} />
    ),
    gradient: [Colors.primary, Colors.primaryLight, Colors.accentLight],
    features: [
      {
        icon: (
          <Icons.ChartLine
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        ),
        text: 'Advanced Analytics',
        color: Colors.white,
      },
      {
        icon: (
          <Icons.Bell height={moderateScale(20)} width={moderateScale(20)} />
        ),
        text: 'Smart Notifications',
        color: Colors.white,
      },
      {
        icon: (
          <Icons.MobileAlt
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        ),
        text: 'Seamless Experience',
        color: Colors.white,
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// Intro Component
// -----------------------------------------------------------------------------
const Intro: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentSlide) {
      setCurrentSlide(index);
      animateSlideTransition();
    }
  };

  const animateSlideTransition = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToSlide = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentSlide(index);
  };

  const nextSlide = () =>
    currentSlide < slides.length - 1 && goToSlide(currentSlide + 1);
  const prevSlide = () => currentSlide > 0 && goToSlide(currentSlide - 1);

  const handleGetStarted = async () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      const user = await getUserFromStorage();
      if (user) {
        navigation.replace('MainStack');
      } else {
        navigation.replace('AuthStack');
      }
    });
  };

  const renderPaginationWithArrows = () => (
    <View style={IntroStyle.paginationContainer}>
      {/* Left Arrow */}
      {currentSlide > 0 ? (
        <TouchableOpacity style={IntroStyle.arrowButton} onPress={prevSlide}>
          <Icons.LeftArrow
            height={moderateScale(24)}
            width={moderateScale(24)}
            fill={Colors.white}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: moderateScale(40) }} />
      )}

      {/* Pagination Dots */}
      <View style={IntroStyle.paginationDots}>
        {slides.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
            <Animated.View
              style={[
                IntroStyle.paginationInner,
                {
                  backgroundColor:
                    index === currentSlide ? Colors.white : Colors.grayMedium,
                  width:
                    index === currentSlide
                      ? moderateScale(32)
                      : moderateScale(12),
                  height: moderateScale(8),
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Right Arrow */}
      {currentSlide < slides.length - 1 ? (
        <TouchableOpacity style={IntroStyle.arrowButton} onPress={nextSlide}>
          <Icons.LeftArrow
            height={moderateScale(24)}
            width={moderateScale(24)}
            fill={Colors.white}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: moderateScale(40) }} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={IntroStyle.container}>
      <LinearGradient
        colors={slides[currentSlide].gradient}
        style={IntroStyle.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Components.ParticleBackground />

        <Animated.View
          style={[
            IntroStyle.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {slides.map(item => (
              <View key={item.id} style={IntroStyle.slide}>
                <Components.AnimatedIcon
                  icon={item.icon}
                  emoji={item.emoji}
                  gradient={item.gradient}
                />
                <Components.SlideContent
                  item={item}
                  slideAnim={slideAnim}
                  fadeAnim={fadeAnim}
                />
              </View>
            ))}
          </ScrollView>

          {renderPaginationWithArrows()}

          <TouchableOpacity
            style={IntroStyle.skipButton}
            onPress={handleGetStarted}
          >
            <Text style={IntroStyle.skipButtonText}>
              {currentSlide === slides.length - 1
                ? '🚀 Get Started'
                : 'Skip Introduction'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Intro;
